const mysql = require('mysql');

const conn_settings = {
    host: 'localhost', 
    user:'back-end', 
    password: 'back-end1234',
    port: 3306,
    connectionLimit: 5,
    database: 'softeng',
    dateStrings : true
}

const conn = mysql.createConnection(conn_settings);

conn.connect((err) =>{
    if(err){
        console.log('Connection error ' + err);
        return;
    }
    console.log('MySql connected');
});

module.exports = {conn_settings, conn};