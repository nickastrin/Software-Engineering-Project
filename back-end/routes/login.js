const express = require('express');
const router = express.Router();
const mysql = require('mysql');
require('dotenv').config()
const jwt = require('jsonwebtoken')

const conn = mysql.createConnection({
    host: 'localhost', 
    user:'back-end', 
    password: 'back-end1234',
    port: 3306,
    connectionLimit: 5,
    database: 'softeng'
});
conn.connect((err) =>{
    if(err){
        throw err;
    }
    console.log('MySql connected');
});

router.post('/', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    let sql = `SELECT * FROM user WHERE username='${username}'`;

    conn.query(sql, (error, results) => {
        if (error) throw error;
        if(results.length > 0){
            let user = JSON.parse(JSON.stringify(results[0])); //to convert RowDataPacket to plain object

            if(user.password !== password) return res.send('invalid password');
            const accessToken = jwt.sign(user, process.env.ACCESS_TOCKEN_SECRET);
            res.json({ token: accessToken});
        }
        else{
            res.status(402).send('User not found');
        }
    });
});

module.exports = router;