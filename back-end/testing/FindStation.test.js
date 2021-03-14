const request = require('supertest');
const app = require('../app'); 

test('Basic FindStation test', async ()=>{
    const res = await request(app)
                    .get("/evcharge/api/FindStation/Portland");

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].StationID).toEqual(1);
    expect(res.body[0].Operator).toEqual('Mira Spears');
});

test('2-stations FindStation test', async ()=>{
    const res = await request(app)
                    .get("/evcharge/api/FindStation/Colorado-Springs");

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
    expect(res.body[0].StationID).toEqual(30);
    expect(res.body[1].StationID).toEqual(31);
    expect(res.body[0].Operator).toEqual('Rana Pugh');
    expect(res.body[1].Operator).toEqual('Rana Pugh');
    expect(res.body[1].Street).toMatch(/Pontu/);
});

test('no-stations FindStation test', async ()=>{
    const res = await request(app)
                    .get("/evcharge/api/FindStation/Athens");

    expect(res.statusCode).toEqual(402);
    expect(res.text).toEqual('No stations found in Athens');
    expect(res.body).toEqual({});
});