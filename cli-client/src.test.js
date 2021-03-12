const fs = require('fs');
const {createOptions } = require('./src/SessionsPerPoint_c.js')

//Create fake login for Unit tests
fake_token='{"token":"123456789"}'
fs.writeFileSync('./softeng20bAPI.token', fake_token);
// unit tests
//SessionsPerPoint_c
test('options for SessionsPerPoint GET request', ()=>{
    const pointid = '1-1'
    const from = '20211742'
    const to = '20214217'
    const format = 'json'
    const options = createOptions(pointid, from, to, format)
    expected_options = {
        hostname: 'localhost',
        port: 8765,
        path: "/evcharge/api/SessionsPerPoint/1-1/20211742/20214217?format=json",
        method: 'GET',
        rejectUnauthorized: false,
        headers: {
            'X-OBSERVATORY-AUTH': "123456789"
        }
    }
    expect(options).toEqual(expected_options)
})