const express = require('express');
const router = express.Router();
const conn = require('../Dbconnection/connection');
const {authRole, authenticateToken} = require('../Authentication/basicAuth');
const sendCsv = require('../csvParser/csvResponse');
const {currentTimestamp, twodeciPointsAcc} = require('../csvParser/timestamp');

const csvFields = [
    {
        label: 'StationID',
        value: 'StationID'
    },
    {
        label: 'Operator',
        value: 'Operator'
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
        label: 'TotalEnergyDelivered',
        value: 'TotalEnergyDelivered'
    },
    {
        label: 'NumberOfChargingSessions',
        value: 'NumberOfChargingSessions'
    },
    {
        label: 'NumberOfActivePoints',
        value: 'NumberOfActivePoints'
    },
    {
        label: 'SessionsSummaryList',
        value: 'SessionsSummaryList'
    },
];

router.get('/:stationID/:yyyymmdd_from/:yyyymmdd_to', authenticateToken, (req,res) =>{
    const reqTimeStamp = currentTimestamp();
    const stationID = req.params.stationID;
    const yyyymmdd_from = JSON.stringify(req.params.yyyymmdd_from);
    const from_date = yyyymmdd_from.slice(1, 5) + '-' + yyyymmdd_from.slice(5, 7) + '-' + yyyymmdd_from.slice(7, 9);
    // console.log(from_date);
    const yyyymmdd_to = JSON.stringify(req.params.yyyymmdd_to);
    const to_date = yyyymmdd_to.slice(1, 5) + '-' + yyyymmdd_to.slice(5, 7) + '-' + yyyymmdd_to.slice(7, 9);
    // console.log(to_date);

    let sql = `SELECT * FROM charge_event WHERE station_id='${stationID}' AND start_time>='${from_date}' AND start_time<='${to_date}'`;

    conn.query(sql, (error, results) => {
        if (error) {
            console.log('SessionsPerStation error: '+ error);
            res.status(400).send('error');
            return;
        }
        if(results.length > 0){

            //convert list of RowDataPacket to list of plain objects
            let objList = [];
            results.forEach(element => {
                objList.push(JSON.parse(JSON.stringify(element)));
            });
            // console.log(objList);

            //Format objList into sessionList and count total Energy
            let totalEnergy = 0;
            let sessionList = [];
            objList.forEach(element => {
                let kwh = element.kwh_transferred;
                totalEnergy += kwh;
                if(!sessionList){
                    sessionList.push({
                        PointID: element.point_id,
                        PointSessions: 1,
                        EnergyDelivered: kwh,
                        Events: [element.event_id]
                    });
                }
                else{
                    let found_point = false;
                    sessionList.forEach(ses_elem => {
                        if(ses_elem.PointID == element.point_id){
                            found_point = true;
                            ses_elem.PointSessions++;
                            ses_elem.EnergyDelivered += kwh;
                            ses_elem.Events.push(element.event_id);
                        }
                    });

                    if(!found_point){
                        sessionList.push({
                            PointID: element.point_id,
                            PointSessions: 1,
                            EnergyDelivered: kwh,
                            Events: [element.event_id]
                        });
                    }
                }
            });

            //Keep two decimal place accuracy
            totalEnergy = twodeciPointsAcc(totalEnergy);
            sessionList.forEach(element => {
                element.EnergyDelivered = twodeciPointsAcc(element.EnergyDelivered);
            });

            let numbefOfPoints = sessionList.length;

            let resp = {
                StationID: stationID,
                Operator: "unknown",
                RequestTimestamp: reqTimeStamp,
                PeriodFrom: from_date,
                PeriodTo: to_date,
                TotalEnergyDelivered: totalEnergy,
                NumberOfChargingSessions: results.length,
                NumberOfActivePoints: numbefOfPoints,
                SessionsSummaryList: sessionList
            };

            //Fetch the Operator's name
            let operator_query = `SELECT name FROM station INNER JOIN user ON station.user_id = user.user_id WHERE station_id = ${stationID}`;

            conn.query(operator_query, (error2, results2) => {
                if(error2) {
                    console.log('SessionsPerStation error: '+ error);
                    res.status(400).send('error');
                    return;
                }
                let name = JSON.parse(JSON.stringify(results2))[0].name;
                
                resp.Operator = name;
                if(req.query && req.query.format == 'csv'){
                    //csv format was requested
                    return sendCsv(res, 'SessionsPerStation.csv', csvFields, resp);
                }
                
                res.json(resp);
            });
        }
        else{
            res.status(402).send('There are no sessions for that station');
        }
    });
});

module.exports = router;