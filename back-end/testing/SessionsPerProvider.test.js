const request = require('supertest');
const app = require('../app'); 
const { conn } = require('../Dbconnection/connection');
/*
afterAll(()=>{
    conn.end()
})
*/

test('not authorized SessionsPerProvider test', async ()=>{
    const res = await request(app)
                    .get("/evcharge/api/SessionsPerProvider/1/20210104/20210106");

    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual('token required');
});

test('valid SessionsPerProvider test', async ()=>{
    const login_res = await request(app)
                .post("/evcharge/api/login")
                .send({
                    username: 'Stef',
                    password: 'yolaria123'
                });

    const token = login_res.body.token;
    const res = await request(app)
                    .get("/evcharge/api/SessionsPerProvider/1/20210104/20210106")
                    .set('X-OBSERVATORY-AUTH', token)

    

    expect(res.statusCode).toEqual(200);
    expect(res.body.ProviderID).toEqual('1');
    expect(res.body.Sessions.length).toEqual(3);
    expect(res.body.Sessions[0].SessionID).toEqual(269);
    expect(res.body.Sessions[1].SessionID).toEqual(348);
    expect(res.body.Sessions[2].SessionID).toEqual(387);
});
/*
{
    "ProviderID": "1",
    "ProviderName": "Supplier-1",
    "Sessions": [
        {
            "StationID": 12,
            "SessionID": 269,
            "VehicleID": "MYR-1958",
            "StartedOn": "2021-01-04 21:52:55",
            "FinishedOn": "2021-01-04 22:18:46",
            "ΕnergyDelivered": 8.18,
            "PricePolicyRef": "unknown",
            "CostPerKWh": 0.22004889975550124,
            "TotalCost": 1.8
        },
        {
            "StationID": 30,
            "SessionID": 348,
            "VehicleID": "TQU-5957",
            "StartedOn": "2021-01-04 11:40:12",
            "FinishedOn": "2021-01-04 11:56:15",
            "ΕnergyDelivered": 0.47,
            "PricePolicyRef": "unknown",
            "CostPerKWh": 0.23404255319148937,
            "TotalCost": 0.11
        },
        {
            "StationID": 30,
            "SessionID": 387,
            "VehicleID": "MOA-3023",
            "StartedOn": "2021-01-05 02:07:20",
            "FinishedOn": "2021-01-05 02:09:38",
            "ΕnergyDelivered": 1.32,
            "PricePolicyRef": "unknown",
            "CostPerKWh": 0.22727272727272727,
            "TotalCost": 0.3
*/