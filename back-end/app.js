const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

//Import routers
const usersRouter = require('./routes/users');

//Set up routers middleware
app.use('/users', usersRouter);

app.get('/', (req, res) =>{
    res.send('hello people!');
});

const port = 3000;

app.listen(port, () => {
    console.log(`server listening on port ${port}`);
});
