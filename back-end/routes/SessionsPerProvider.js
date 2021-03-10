const express = require('express');
const router = express.Router();
const {authRole, authenticateToken} = require('../Authentication/basicAuth');
const makeQuery = require('../Dbconnection/promiseQuery');
const sendCsv = require('../csvParser/csvResponse');

const csvFields = [
    {
        label: 'ProviderID',
        value: 'ProviderID'
    },
    {
        label: 'ProviderName',
        value: 'ProviderName'
    },
    {
        label: 'Sessions',
        value: 'Sessions'
    }
];

router.get('/:providerID/:yyyymmdd_from/:yyyymmdd_to', authenticateToken, (req,res) =>{
    const providerID = req.params.providerID;
    const yyyymmdd_from = JSON.stringify(req.params.yyyymmdd_from);
    const from_date = yyyymmdd_from.slice(1, 5) + '-' + yyyymmdd_from.slice(5, 7) + '-' + yyyymmdd_from.slice(7, 9);
    // console.log(from_date);
    const yyyymmdd_to = JSON.stringify(req.params.yyyymmdd_to);
    const to_date = yyyymmdd_to.slice(1, 5) + '-' + yyyymmdd_to.slice(5, 7) + '-' + yyyymmdd_to.slice(7, 9);
    // console.log(to_date);

    getData(providerID, from_date, to_date, req, res);
});

async function getData(providerId, from_date, to_date, req, res) {
    try{
        let provider_query = `SELECT name FROM elec_supplier WHERE supplier_id = ${providerId}`;

        let prov_resp = await makeQuery(provider_query);
        let provider_name = JSON.parse(JSON.stringify(prov_resp))[0].name;

        let sql = `SELECT * FROM station WHERE supplier_id='${providerId}'`;
        let stations = await makeQuery(sql);
        if(stations.length == 0){
            res.status(402).send('No such provider found');
            return;
        }
        for (let i = 0; i < stations.length; i++) {
            stations[i] = JSON.parse(JSON.stringify(stations[i])).station_id; //to convert RowDataPacket to plain object
        }
        // console.log('stations: ' + stations);

        let objList = [];
        for (let i = 0; i < stations.length; i++) {
            sql = `SELECT * FROM charge_event WHERE station_id='${stations[i]}' AND start_time>='${from_date}' AND start_time<='${to_date}'`;

            let q_res = await makeQuery(sql);
            for (let j = 0; j < q_res.length; j++) {
                objList.push(JSON.parse(JSON.stringify(q_res[j]))); //to convert RowDataPacket to plain object
            }
        }
        // console.log(objList);
        // console.log('before returning');

        if(objList.length == 0){
            return res.status(402).send('There are no sessions for that provider');
        }

        let sessionList = [];
        for (let i = 0; i < objList.length; i++) {
            const element = objList[i];
            let kwh = element.kwh_transferred;

            sessionList.push({
                StationID: element.station_id,
                SessionID: element.event_id,
                VehicleID: element.license_plate,
                StartedOn: element.start_time,
                FinishedOn: element.finish_time,
                ΕnergyDelivered: kwh,
                PricePolicyRef: "unknown",
                CostPerKWh: element.price / kwh,
                TotalCost: element.price
            });
        }

        let resp = {
            ProviderID: providerId,
            ProviderName: provider_name,
            Sessions: sessionList
        };

        if(req.query && req.query.format == 'csv'){
            //csv format was requested
            return sendCsv(res, 'SessionsPerProvider.csv', csvFields, resp);
        }
        
        return res.json(resp);
    } catch (err){
        console.log('SessionsPerProvider/getdata error: ' + err);
        res.status(400).send('error');
    }
}

module.exports = router;