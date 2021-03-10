const {conn} = require('../Dbconnection/connection');

const makeQuery = (sql_query) => {
    return new Promise((resolve, reject) =>{
        conn.query(sql_query, (error, results) => {
            if (error) reject('query error' + error);
            else resolve(results);
        });
    })
}

module.exports = makeQuery