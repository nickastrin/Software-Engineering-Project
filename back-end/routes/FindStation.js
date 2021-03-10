const express = require('express');
const router = express.Router();
const makeQuery = require('../Dbconnection/promiseQuery');

router.get('/:city', async (req,res) => {
    try{    
        const city = req.params.city.split("-").join(" ");
        // console.log(city);

        let sql = `SELECT * FROM station WHERE city='${city}'`;

        let stations_res = await makeQuery(sql);

        if(stations_res.length == 0){
            res.status(402).send(`No stations found in ${city}`);
            return;
        }

        //convert list of RowDataPacket to list of plain objects
        let objList = [];
        stations_res.forEach(element => {
            objList.push(JSON.parse(JSON.stringify(element)));
        });

        let stations = [];

        for (let i = 0; i < objList.length; i++) {
            const element = objList[i];

            stations.push({
                StationID: element.station_id,
                StationName: element.station_name,
                ChargeRate: element.charge_rate,
                Operator: "unknown",
                Country: element.Country,
                City: element.city,
                Street: element.street_name + " " + element.street_number,
                PostalCode: element.postal_code
            });

            let operator_sql = `SELECT name FROM station INNER JOIN user ON station.user_id = user.user_id WHERE station_id = ${element.station_id}`;

            let operator_query_results = await makeQuery(operator_sql);
            let name = JSON.parse(JSON.stringify(operator_query_results))[0].name;
                    
            stations[i].Operator = name;
        }

        res.json(stations);
    }
    catch(e){
        console.log('FindStation error: ' + e);
        return res.status(400).send('error');
    }

});

module.exports = router;