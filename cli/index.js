#!/usr/bin/env node

const https = require('https');
const login = require('./src/login');
const logout = require('./src/logout');
const SessionsPerPoint = require('./src/SessionsPerPoint');
const SessionsPerStation = require('./src/SessionsPerStation_c');
const arg = require('arg');

require = require('esm')(module /*, options */);
//require('./src/cli').cli(process.argv);

const options = {
    hostname: 'localhost',
    port: 8765,
    path: '/',
    method: 'GET'
}

//process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

SessionsPerStation.sessionsPerStation('1','20210101','20210110', 'json');
//login.login(process.argv[2],process.argv[3]);