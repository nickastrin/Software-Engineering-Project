const express = require('express');
const router = express.Router();
const makeQuery = require('../Dbconnection/promiseQuery');
const {authRole, authenticateToken} = require('../Authentication/basicAuth');

router.get('/:manufacturer/:yyyymmdd_from/:yyyymmdd_to', authenticateToken, authRole(1), async (req,res) => {
    try{
        const manufacturer = req.params.manufacturer;    
        const yyyymmdd_from = JSON.stringify(req.params.yyyymmdd_from);
        const from_date = yyyymmdd_from.slice(1, 5) + '-' + yyyymmdd_from.slice(5, 7) + '-' + yyyymmdd_from.slice(7, 9);
        // console.log(from_date);
        const yyyymmdd_to = JSON.stringify(req.params.yyyymmdd_to);
        const to_date = yyyymmdd_to.slice(1, 5) + '-' + yyyymmdd_to.slice(5, 7) + '-' + yyyymmdd_to.slice(7, 9);
        // console.log(to_date);

        let models_query = `SELECT * FROM car_model WHERE manufacturer='${manufacturer}'`;
        let models_query_res = await makeQuery(models_query);
        if(models_query_res.length == 0){
            res.status(402).send(`Manufacturer ${manufacturer} not found`);
            return;
        }

        let models = [];
        let model_ids = [];

        for (let i = 0; i < models_query_res.length; i++) {
            const element = models_query_res[i];
            
            // console.log(element.model_id, element.model_name);

            let totalCars_query = `SELECT * FROM car WHERE model_id=${element.model_id}`;
            let totalCars_query_res = await makeQuery(totalCars_query);

            models.push({
                Model: element.model_name,
                TotalCars: totalCars_query_res.length,
                TotalEnergyConsumed: undefined,
                AverageEnergyPerSession: undefined,
                TotalSessions: undefined
            });

            model_ids.push(element.model_id);
        }
        // console.log(model_ids);

        for (let i = 0; i < model_ids.length; i++) {
            const element = model_ids[i];

            let query = `SELECT * FROM car INNER JOIN charge_event ON car.license_plate = charge_event.license_plate WHERE model_id = ${element} AND start_time>='${from_date}' AND start_time<='${to_date}'`;

            let query_res = await makeQuery(query);
            if(query_res.length == 0){
                models[i].TotalEnergyConsumed = 0;
                models[i].AverageEnergyPerSession = 0;
                models[i].TotalSessions = 0;
            }
            else{
                let totalEnergy = 0;
                query_res.forEach(event => {
                    totalEnergy += event.kwh_transferred
                });
                models[i].TotalEnergyConsumed = totalEnergy;
                models[i].AverageEnergyPerSession = totalEnergy / query_res.length;
                models[i].TotalSessions = query_res.length;

            }
        }

        // console.log(models);
        res.json(models);
    }
    catch(e){
        console.log('Companies error: ' + e);
        return res.status(400).send('error');
    }

});

module.exports = router;