const express = require('express');
const Joi = require('joi');
const router = express.Router();
const mysql = require('mysql');
require('dotenv').config();
const bcrypt = require('bcrypt');
const {authRole, authenticateToken} = require('../Authentication/basicAuth');
const {conn_settings, conn} = require('../Dbconnection/connection');
const makeQuery = require('../Dbconnection/promiseQuery');

function verifyBody(body){
    const schema = Joi.object({
        email: Joi.string().min(3).required(),
        name: Joi.string().min(3).required(),
        password: Joi.string().min(8).required(),
        country: Joi.string().min(3).required(),
        city: Joi.string().min(3).required(),
        street_name: Joi.string().min(3).required(),
        street_number: Joi.number().integer().required(),
        postal_code: Joi.string().min(5).required(),
        phone_number: Joi.string().min(8).max(12).required(),
        date_of_birth: Joi.date().greater('1-1-1950').required(),
        points: Joi.number().integer().required(),
        sex: Joi.number().integer().min(0).max(2).required(),
        is_admin: Joi.number().integer().min(0).max(1).required(),
        username: Joi.string().min(3).required(),
    });

    const res = schema.validate(body);
    if(res.error) return false;
    else return true;
}

router.post('/usermod/:username/:password', authenticateToken, authRole(1), async (req, res) => {
    try{
        const username = req.params.username;
        const password = req.params.password;
        //check if username appears in the database
        //add or update user accordingly

        let sql = `SELECT * FROM user WHERE username='${username}'`;

        conn.query(sql, async (error, results) => {
            if (error) throw error;
            // console.log('The result is: ', results);
            if(results.length > 0){
                //update user
                const hashedPassword = await bcrypt.hash(password, 10);
                let update_query = `UPDATE user SET password = '${hashedPassword}' WHERE username='${username}'`;
                conn.query(update_query, (err, qres) => {
                    if (err) throw err;
                    // console.log('The result is: ', qres);
                });
                res.send('Updated');
            }
            else{
                //create user
                if(!verifyBody(req.body)){
                    res.status(400).send('give all required fields');
                    return;
                }
                if(req.body.username !== username || req.body.password !== password){
                    res.status(400).send('args in url and body do not match');
                    return;
                }

                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                // console.log(hashedPassword);
            
                const user = {
                    email: req.body.email,
                    name: req.body.name, 
                    password: hashedPassword,
                    country: req.body.country, 
                    city: req.body.city, 
                    street_name: req.body.street_name, 
                    street_number: req.body.street_number, 
                    postal_code: req.body.postal_code, 
                    phone_number: req.body.phone_number, 
                    date_of_birth: req.body.date_of_birth,
                    points: req.body.points, 
                    sex: req.body.sex, 
                    is_admin: req.body.is_admin, 
                    username: req.body.username
                };

                let create_query = 'INSERT INTO user SET ?';
                conn.query(create_query, user, (err, qres) => {
                    if (err) throw err;
                    // console.log('The result is: ', qres);
                });
                res.send('Created');
            }
        });
    } catch(e){
        console.log('admin error: ' + e);
        res.status(400).send('error');
    }
});

router.get('/users/:username', authenticateToken, authRole(1), (req,res) =>{
    const username = req.params.username;
    //check if username appears in the database
    let sql = `SELECT * FROM user WHERE username='${username}'`;

    conn.query(sql, (error, results) => {
        if (error) throw error;
        if(results.length > 0){
            let thisUser = results[0];
            res.json(thisUser);
        }
        else{
            res.status(402).send('User not found');
        }
    });

});

router.post('/system/sessionsupd', authenticateToken, authRole(1), (req,res) =>{
    if(req.files && req.files.file){
        let file = req.files.file;
        let csvData = file.data.toString('utf8');
        let lines = csvData.split("\r\n")
        //remove first (categories) and last (empty) line 
        lines.shift();
        lines.splice(-1,1);

        let sql = `INSERT INTO charge_event (user_id, station_id, point_id, license_plate, start_time, finish_time, kwh_transferred, price, payment_method, protocol) VALUES `;

        //format sql string
        for (let i = 0; i < lines.length; i++) {
            let value = '(' + lines[i] + '),';
            sql += value;
        }
        sql = sql.slice(0, -1);
        // console.log(sql);

        conn.query(sql, (err, q_res) => {
            if (err) {
                console.log('error in csv upload: ' + err);
                res.status(400).send('error in csv upload');
            }
            else{
                //respond
                // console.log(q_res);
                let count_sql = `SELECT COUNT(*) FROM charge_event`;
                conn.query(count_sql, (err, c_res) => {
                    if (err) {
                        console.log('error in csv upload - cound query: ' + err);
                        res.status(400).send('error in csv upload');
                    }
                    else{
                        const ret_obj = JSON.parse(JSON.stringify(c_res[0])); //convert RowDataPacket to plain object
                        // console.log(ret_obj);
                        let count = 0;
                        for (var prop in ret_obj) {
                            count = ret_obj[prop];
                            break;
                        }
                        // console.log(count);
                        res.json({
                            SessionsInUploadedFile: lines.length,
                            SessionsImported: q_res.affectedRows,
                            TotalSessionsInDatabase: count
                        });
                    }
                })
            }
        });
    }
    else{
        console.log('no file');
        res.send('Please provide a file in the field name "file"');
    }
});

router.get('/healthcheck', (req,res) =>{
    const health_conn =  mysql.createConnection(conn_settings);
    health_conn.connect((err) =>{
        if(err){
            console.log('healthCheck error ' + err);
            res.status(402).json({status: "failed"});
            return;
        }
        console.log('MySql connected');
        res.json({status: "OK"});
    });
});

router.post('/resetsessions', async (req,res) =>{
    try{
        let delete_query = `DELETE FROM charge_event`;

        let delete_res = makeQuery(delete_query);
        
        delete_res
        .then( d_res =>{
            // console.log('delete_res: ');
            // console.log(d_res);
        })
        .catch(err => {
            console.log('delete_res error: ');
            console.log(err);
            res.status(400).json({"status":"failed"});
            return;
        });

        let sql = `SELECT * FROM user WHERE username='admin'`;
        const password = 'petrol4ever';
        const hashedPassword = await bcrypt.hash(password, 10);

        let admin_res = await makeQuery(sql);
        if(admin_res.length > 0){
            //update default user
            
            let update_query = `UPDATE user SET password = '${hashedPassword}' WHERE username='admin'`;
            let upd_res = await makeQuery(update_query);
            
            // console.log(upd_res);
        }
        else{
            //create default user

            const user = {
                email: 'admin@admin.com',
                name: 'Administrator', 
                password: hashedPassword,
                country: 'Greece', 
                city: 'Athens', 
                street_name: 'Heroon Polytechniou', 
                street_number: 9, 
                postal_code: '15780', 
                phone_number: '210-772-1000', 
                date_of_birth: '1950-01-01',
                points: 0, 
                sex: 2, 
                is_admin: 1, 
                username: 'admin'
            };
            let create_query = 'INSERT INTO user SET ?';
            conn.query(create_query, user, (err, qres) => {
                if (err) {
                    console.log('create_query error: ');
                    console.log(err);
                    res.status(400).json({"status":"failed"});
                    return;
                }
                // console.log('The result is: ');
                // console.log(qres);
            });
        }

        res.json({"status":"OK"});
    } catch(e){
        console.log('resetsessions error: ' + e);
        res.status(400).json({"status":"failed"});
    }
});

module.exports = router;