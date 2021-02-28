const express = require('express');
const router = express.Router();
const conn = require('../Dbconnection/connection');
const {authRole, authenticateToken} = require('../Authentication/basicAuth');
const makeQuery = require('../Dbconnection/promiseQuery');
const sendCsv = require('../csvParser/csvResponse');
const {currentTimestamp} = require('../csvParser/timestamp');

const csvFields = [
    {
        label: 'Point',
        value: 'Point'
    },
    {
        label: 'PointOperator',
        value: 'PointOperator'
    },
    {
        label: 'RequestTimestamp',
        value: 'RequestTimestamp'
    },
    {
        label: 'PeriodFrom',
        value: 'PeriodFrom'
    },
    {
        label: 'PeriodTo',
        value: 'PeriodTo'
    },
    {
        label: 'NumberOfChargingSessions',
        value: 'NumberOfChargingSessions'
    },
    {
        label: 'ChargingSessionsList',
        value: 'ChargingSessionsList'
    }
];

//pointID is the 3 last digits of the id given in the url and stationID is the rest
router.get('/:pointID/:yyyymmdd_from/:yyyymmdd_to', authenticateToken, (req,res) =>{
    const reqTimeStamp = currentTimestamp();
    const pointID_string = req.params.pointID;
    const pointID = pointID_string.split("-")[1];
    const stationID = pointID_string.split("-")[0];
    const yyyymmdd_from = JSON.stringify(req.params.yyyymmdd_from);
    const from_date = yyyymmdd_from.slice(1, 5) + '-' + yyyymmdd_from.slice(5, 7) + '-' + yyyymmdd_from.slice(7, 9);
    // console.log(from_date);
    const yyyymmdd_to = JSON.stringify(req.params.yyyymmdd_to);
    const to_date = yyyymmdd_to.slice(1, 5) + '-' + yyyymmdd_to.slice(5, 7) + '-' + yyyymmdd_to.slice(7, 9);
    // console.log(to_date);

    // console.log('Looking up station: ' + stationID + ', point: '+ pointID);
    // res.send('OK');
    getData(pointID, stationID, from_date, to_date, reqTimeStamp, req, res);
});

async function getData(pointID, stationID, from_date, to_date, reqTimeStamp, req, res) {
    try{
        let sql = `SELECT * FROM charge_event WHERE point_id='${pointID}' AND station_id='${stationID}' AND start_time>='${from_date}' AND start_time<='${to_date}'`;

        let events = await makeQuery(sql);
        if(events.length == 0){
            res.status(402).send('No charge events found');
            return;
        }

        //convert list of RowDataPacket to list of plain objects
        let objList = [];
        events.forEach(element => {
            objList.push(JSON.parse(JSON.stringify(element)));
        });

        //Format objList into sessionList
        let sessionList = [];
        for (let i = 0; i < objList.length; i++) {
            const element = objList[i];
            
            sessionList.push({
                SessionIndex: i+1,
                SessionID: element.event_id,
                StartedOn: element.start_time,
                FinishedOn: element.finish_time,
                Protocol: element.protocol,
                EnergyDelivered: element.kwh_transferred,
                Payment: element.payment_method,
                VehicleType: "?"
            });
        }

        let operator_query = `SELECT name FROM station INNER JOIN user ON station.user_id = user.user_id WHERE station_id = ${stationID}`;

        let oper_resp = await makeQuery(operator_query);
        let operator_name = JSON.parse(JSON.stringify(oper_resp))[0].name;

        let resp = {
            Point: stationID + "-" + pointID,
            PointOperator: operator_name,
            RequestTimestamp: reqTimeStamp,
            PeriodFrom: from_date,
            PeriodTo: to_date,
            NumberOfChargingSessions: sessionList.length,
            ChargingSessionsList: sessionList
        };

        if(req.query && req.query.format == 'csv'){
            //csv format was requested
            return sendCsv(res, 'SessionsPerProvider.csv', csvFields, resp);
        }
        
        return res.json(resp);
    } catch (err){
        console.log('SessionsPerPoint/getdata error: ' + err);
        res.status(400).send('error');
    }
}

module.exports = router;