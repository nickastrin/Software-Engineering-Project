const request = require('supertest');
const app = require('../app'); 
const { conn } = require('../Dbconnection/connection');


test('not authorized SessionsPerPoint test', async ()=>{
    const res = await request(app)
                    .get("/evcharge/api/SessionsPerPoint/1-1/20210104/20210112?format=json");

    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual('token required');
});

test('valid SessionsPerPoint test', async ()=>{
    const login_res = await request(app)
                .post("/evcharge/api/login")
                .send({
                    username: 'Stef',
                    password: 'yolaria123'
                });

    const token = login_res.body.token;
    const res = await request(app)
                    .get("/evcharge/api/SessionsPerPoint/1-1/20210104/20210112?format=json")
                    .set('X-OBSERVATORY-AUTH', token)

    

    expect(res.statusCode).toEqual(200);
    expect(res.body.PointOperator).toEqual('Mira Spears');
    expect(res.body.ChargingSessionsList.length).toEqual(4);
    expect(res.body.ChargingSessionsList[0].SessionID).toEqual(45);
    expect(res.body.ChargingSessionsList[1].SessionID).toEqual(197);
    expect(res.body.ChargingSessionsList[2].SessionID).toEqual(421);
    expect(res.body.ChargingSessionsList[3].SessionID).toEqual(422);
            
    //logout
    const logout_res = await request(app)
    .post("/evcharge/api/logout")
    .set('X-OBSERVATORY-AUTH', token)

    expect(logout_res.statusCode).toEqual(200);
    expect(logout_res.text).toEqual('Token removed');
});
/*
{
    "Point": "1-1",
    "PointOperator": "Mira Spears",
    "RequestTimestamp": "2021-03-13 14:23:33",
    "PeriodFrom": "2021-01-04",
    "PeriodTo": "2021-01-12",
    "NumberOfChargingSessions": 4,
    "ChargingSessionsList": [
        {
            "SessionIndex": 1,
            "SessionID": 45,
            "StartedOn": "2021-01-04 21:11:26",
            "FinishedOn": "2021-01-04 21:44:53",
            "Protocol": "OpenADR",
            "EnergyDelivered": 13.32,
            "Payment": 1,
            "VehicleType": "BMW BMW X5"
        },
        {
            "SessionIndex": 2,
            "SessionID": 197,
            "StartedOn": "2021-01-10 03:03:16",
            "FinishedOn": "2021-01-10 03:37:59",
            "Protocol": "OCPP",
            "EnergyDelivered": 60.84,
            "Payment": 1,
            "VehicleType": "Audi e-tron 50"
        },
        {
            "SessionIndex": 3,
            "SessionID": 421,
            "StartedOn": "2021-01-08 21:41:04",
            "FinishedOn": "2021-01-08 22:39:11",
            "Protocol": "OCPI",
            "EnergyDelivered": 5.09,
            "Payment": 3,
            "VehicleType": "Citroen C-Zero"
        },
        {
            "SessionIndex": 4,
            "SessionID": 422,
            "StartedOn": "2021-01-09 21:41:04",
            "FinishedOn": "2021-01-09 22:39:11",
            "Protocol": "OCPI",
            "EnergyDelivered": 5.09,
            "Payment": 3,
            "VehicleType": "Citroen C-Zero"
        }
    ]
}
*/