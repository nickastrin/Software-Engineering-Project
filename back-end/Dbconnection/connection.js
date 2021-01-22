const mysql = require('mysql');

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

module.exports = conn;