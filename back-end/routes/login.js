const express = require('express');
const router = express.Router();
const mysql = require('mysql');
require('dotenv').config()
const jwt = require('jsonwebtoken')
const {checkToken, addToken, deleteToken, clearTokens} = require('../Authentication/tokens')
const conn = require('../Dbconnection/connection');

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
            addToken(accessToken);
            res.json({ token: accessToken});
        }
        else{
            res.status(402).send('User not found');
        }
    });
});

module.exports = router;