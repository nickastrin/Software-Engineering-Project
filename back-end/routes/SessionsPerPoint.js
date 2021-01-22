const express = require('express');
const router = express.Router();
const conn = require('../Dbconnection/connection');

/* FIX ME */
/* fix connection on other routers */
router.get('/:pointID/:yyyymmdd_from/:yyyymmdd_to', (req,res) =>{
    const pointID = req.params.pointID;
    const yyyymmdd_from = JSON.stringify(req.params.yyyymmdd_from);
    const from_date = yyyymmdd_from.slice(1, 5) + '-' + yyyymmdd_from.slice(5, 7) + '-' + yyyymmdd_from.slice(7, 9);
    console.log(from_date);
    const yyyymmdd_to = JSON.stringify(req.params.yyyymmdd_to);
    const to_date = yyyymmdd_to.slice(1, 5) + '-' + yyyymmdd_to.slice(5, 7) + '-' + yyyymmdd_to.slice(7, 9);
    console.log(to_date);

    // res.send(`requested to fetch data for point: ${pointID} ,from: ${yyyymmdd_from} until: ${yyyymmdd_to}`);
    let sql = `SELECT * FROM charge_event WHERE point_id='${pointID}' AND start_time>='${from_date}' AND start_time<='${to_date}'`;

    conn.query(sql, (error, results) => {
        if (error) throw error;
        if(results.length > 0){
            console.log(results.length + ' sessions found');
            console.log('Check time based sorting');
            res.json(results);
        }
        else{
            res.status(402).send('There are no sessions for that point');
        }
    });
});

module.exports = router;