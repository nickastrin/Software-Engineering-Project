const express = require('express');
const SessionsPerEVRouter = express.Router();
const {authRole, authenticateToken} = require('../Authentication/basicAuth');
const makeQuery = require('../Dbconnection/promiseQuery');
const sendCsv = require('../csvParser/csvResponse');
const {currentTimestamp, twodeciPointsAcc} = require('../csvParser/timestamp');

const csvFields = [
    {
        label: 'VehicleID',
        value: 'VehicleID'
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
        label: 'TotalEnergyConsumed',
        value: 'TotalEnergyConsumed'
    },
    {
        label: 'NumberOfVisitedPoints',
        value: 'NumberOfVisitedPoints'
    },
    {
        label: 'NumberOfVehicleChargingSessions',
        value: 'NumberOfVehicleChargingSessions'
    },
    {
        label: 'VehicleChargingSessionsList',
        value: 'VehicleChargingSessionsList'
    },
];

//vehicle id is passed as license plate
SessionsPerEVRouter.get('/:vehicleID/:yyyymmdd_from/:yyyymmdd_to', authenticateToken, (req,res) =>{
    const reqTimeStamp = currentTimestamp();

    const licensePlate = req.params.vehicleID;
    const yyyymmdd_from = JSON.stringify(req.params.yyyymmdd_from);
    const from_date = yyyymmdd_from.slice(1, 5) + '-' + yyyymmdd_from.slice(5, 7) + '-' + yyyymmdd_from.slice(7, 9);
    // console.log(from_date);
    const yyyymmdd_to = JSON.stringify(req.params.yyyymmdd_to);
    const to_date = yyyymmdd_to.slice(1, 5) + '-' + yyyymmdd_to.slice(5, 7) + '-' + yyyymmdd_to.slice(7, 9);
    // console.log(to_date);

    getData(licensePlate, reqTimeStamp, from_date, to_date, req, res);
});


async function getData(licensePlate, reqTimeStamp, from_date, to_date, req, res){
    try{
        let sql = `SELECT * FROM charge_event WHERE license_plate='${licensePlate}' AND start_time>='${from_date}' AND start_time<='${to_date}'`;

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

        //Format objList into sessionList and count total Energy and number of points
        let { totalEnergy, sessionList, points, station_ids} = sessionListFormatter(objList);
        //find provider names
        for (let i = 0; i < station_ids.length; i++) {
            const element = station_ids[i];
            
            let provider_query = `SELECT name FROM station INNER JOIN elec_supplier ON station.supplier_id = elec_supplier.supplier_id WHERE station_id = ${element}`;

            let prov_resp = await makeQuery(provider_query);
            let provider_name = JSON.parse(JSON.stringify(prov_resp))[0].name;

            sessionList[i].EnergyProvider = provider_name;
        }

        let resp = {
            VehicleID: licensePlate,
            RequestTimestamp: reqTimeStamp,
            PeriodFrom: from_date,
            PeriodTo: to_date,
            TotalEnergyConsumed: totalEnergy,
            NumberOfVisitedPoints: points.length,
            NumberOfVehicleChargingSessions: sessionList.length,
            VehicleChargingSessionsList: sessionList
        };

        if(req.query && req.query.format == 'csv'){
            //csv format was requested
            return sendCsv(res, 'SessionsPerEV.csv', csvFields, resp);
        }
        
        return res.json(resp);
    }catch(e){
        console.log('SessionsPerEv error: ' + e);
        return res.status(400).send('error');
    }
}

function sessionListFormatter(objList){
    let totalEnergy = 0;
    let sessionList = [];
    let points = [];
    let station_ids = [];

    for (let i = 0; i < objList.length; i++) {
        const element = objList[i];
        let kwh = element.kwh_transferred;
        totalEnergy += kwh;

        station_ids.push(element.station_id);

        sessionList.push({
            SessionIndex: i+1,
            SessionID: element.event_id,
            EnergyProvider: "unknown",
            StartedOn: element.start_time,
            FinishedOn: element.finish_time,
            ΕnergyDelivered: kwh,
            PricePolicyRef: "unknown",
            CostPerKWh: element.price / kwh,
            SessionCost: element.price
        });

        let curr_point = {
            stationID: element.station_id,
            pointID: element.point_id
        };

        let found = false;
        points.forEach(p_elem => {
            if (p_elem.stationID == curr_point.stationID && p_elem.pointID == curr_point.pointID) {
                found = true;
            }
        });
        if (!found) {
            points.push(curr_point);
        }
    }

    //Keep two decimal place accuracy
    totalEnergy = twodeciPointsAcc(totalEnergy);

    return {
        totalEnergy: totalEnergy,
        sessionList: sessionList,
        points: points,
        station_ids: station_ids
    };

}

module.exports = {SessionsPerEVRouter, sessionListFormatter};