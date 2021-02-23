const express = require('express');
const router = express.Router();
const conn = require('../Dbconnection/connection');

router.get('/:providerID/:yyyymmdd_from/:yyyymmdd_to', (req,res) =>{
    const providerID = req.params.providerID;
    const yyyymmdd_from = JSON.stringify(req.params.yyyymmdd_from);
    const from_date = yyyymmdd_from.slice(1, 5) + '-' + yyyymmdd_from.slice(5, 7) + '-' + yyyymmdd_from.slice(7, 9);
    // console.log(from_date);
    const yyyymmdd_to = JSON.stringify(req.params.yyyymmdd_to);
    const to_date = yyyymmdd_to.slice(1, 5) + '-' + yyyymmdd_to.slice(5, 7) + '-' + yyyymmdd_to.slice(7, 9);
    // console.log(to_date);

    getData(providerID, from_date, to_date, res);
});

function makeQuery(sql_query){
    return new Promise((resolve, reject) =>{
        conn.query(sql_query, (error, results) => {
            if (error) reject('query error');
            else resolve(results);
        });
    })
}

async function getData(providerId, from_date, to_date, res) {
    try{
        // console.log('getData start');
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

        let response = new Array();
        for (let i = 0; i < stations.length; i++) {
            sql = `SELECT * FROM charge_event WHERE station_id='${stations[i]}' AND start_time>='${from_date}' AND start_time<='${to_date}'`;

            let q_res = await makeQuery(sql);
            for (let j = 0; j < q_res.length; j++) {
                response.push(JSON.parse(JSON.stringify(q_res[j]))); //to convert RowDataPacket to plain object
            }
        }
        // console.log(response);
        // console.log('before returning');
        if(response.length > 0){
            res.json(response);
        }
        else{
            res.status(402).send('There are no sessions for that provider');
        }
    } catch (err){
        console.log('SessionsPerProvider/getdata error: ' + err);
        res.status(402).send('There are no sessions for that provider');
    }
}

module.exports = router;