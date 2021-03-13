const request = require('supertest');
const app = require('../app'); 
const { conn } = require('../Dbconnection/connection');


test('not authorized SessionsPerStation test', async ()=>{
    const res = await request(app)
                    .get("/evcharge/api/SessionsPerStation/1/20210104/20210112?format=json");

    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual('token required');
});

test('valid SessionsPerStation test', async ()=>{
    const login_res = await request(app)
                .post("/evcharge/api/login")
                .send({
                    username: 'Stef',
                    password: 'yolaria123'
                });

    const token = login_res.body.token;
    const res = await request(app)
                    .get("/evcharge/api/SessionsPerStation/1/20210104/20210112?format=json")
                    .set('X-OBSERVATORY-AUTH', token)

    

    expect(res.statusCode).toEqual(200);
    expect(res.body.Operator).toEqual('Mira Spears');
    expect(res.body.SessionsSummaryList.length).toEqual(4);
    expect(res.body.SessionsSummaryList[0].PointID).toEqual(3);
    expect(res.body.SessionsSummaryList[1].PointID).toEqual(1);
    expect(res.body.SessionsSummaryList[2].PointID).toEqual(2);
    expect(res.body.SessionsSummaryList[3].PointID).toEqual(4);

    //logout
    const logout_res = await request(app)
    .post("/evcharge/api/logout")
    .set('X-OBSERVATORY-AUTH', token)

    expect(logout_res.statusCode).toEqual(200);
    expect(logout_res.text).toEqual('Token removed');
});
/*
{
    "StationID": "1",
    "Operator": "Mira Spears",
    "RequestTimestamp": "2021-03-13 14:28:23",
    "PeriodFrom": "2021-01-04",
    "PeriodTo": "2021-01-12",
    "TotalEnergyDelivered": 294.11,
    "NumberOfChargingSessions": 11,
    "NumberOfActivePoints": 4,
    "SessionsSummaryList": [
        {
            "PointID": 3,
            "PointSessions": 2,
            "EnergyDelivered": 89.88
        },
        {
            "PointID": 1,
            "PointSessions": 4,
            "EnergyDelivered": 84.34
        },
        {
            "PointID": 2,
            "PointSessions": 4,
            "EnergyDelivered": 85.25
        },
        {
            "PointID": 4,
            "PointSessions": 1,
            "EnergyDelivered": 34.64
        }
    ]
}
*/