const express = require('express');
const router = express.Router();
const mysql = require('mysql');
require('dotenv').config()
const jwt = require('jsonwebtoken')
const {checkToken, addToken, deleteToken, clearTokens} = require('../Authentication/tokens')
const {authRole, authenticateToken} = require('../Authentication/basicAuth')

router.post('/', authenticateToken, (req, res) => {
    deleteToken(req.token);
    res.send('Token removed');
});

module.exports = router;