const express = require('express');
const bodyParser = require('body-parser');
const upload = require('express-fileupload');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload());

//configure cors
const corsOptions = {
    origin: 'https://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

app.use(cors(corsOptions));

//Import routers
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const {adminRouter} = require('./routes/admin');
const {SessionsPerEVRouter} = require('./routes/SessionsPerEV');
const SessionsPerPointRouter = require('./routes/SessionsPerPoint');
const {SessionsPerStationRouter} = require('./routes/SessionsPerStation');
const SessionsPerProviderRouter = require('./routes/SessionsPerProvider');
const FindStationRouter = require('./routes/FindStation');
const CompaniesRouter = require('./routes/Companies');

//Set up routers middleware
app.use('/evcharge/api/login', loginRouter);
app.use('/evcharge/api/logout', logoutRouter);
app.use('/evcharge/api/admin', adminRouter);
app.use('/evcharge/api/SessionsPerEV', SessionsPerEVRouter);
app.use('/evcharge/api/SessionsPerPoint', SessionsPerPointRouter);
app.use('/evcharge/api/SessionsPerStation', SessionsPerStationRouter);
app.use('/evcharge/api/SessionsPerProvider', SessionsPerProviderRouter);
app.use('/evcharge/api/FindStation', FindStationRouter);
app.use('/evcharge/api/Companies', CompaniesRouter);


app.get('/', (req, res) =>{
    res.send('hello people!\n Go to /evcharge/api/ to access the api');
});

module.exports = app;