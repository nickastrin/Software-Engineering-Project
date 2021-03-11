const express = require('express');
const router = express.Router();
require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const {checkToken, addToken, deleteToken, clearTokens} = require('../Authentication/tokens')
const makeQuery = require('../Dbconnection/promiseQuery');

router.post('/', async (req, res) => {
    try{
        const username = req.body.username;
        const password = req.body.password;

        let sql = `SELECT * FROM user WHERE username='${username}'`;

        let results = await makeQuery(sql);

        if(results.length > 0){
            let user = JSON.parse(JSON.stringify(results[0])); //to convert RowDataPacket to plain object

            // console.log(user);

            if(await bcrypt.compare(password, user.password)) {

                const accessToken = jwt.sign(user, process.env.ACCESS_TOCKEN_SECRET);
                addToken(accessToken);
                return res.json({ token: accessToken});

            } else {
                return res.status(400).send('invalid password');
            }
        }
        else{
            res.status(402).send('User not found');
        }
    }catch(e){
        console.log('login error: ' + e);
        res.status(400).send('error');
    }
});

module.exports = router;