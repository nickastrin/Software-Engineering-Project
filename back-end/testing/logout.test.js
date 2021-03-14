const request = require('supertest');
const app = require('../app'); 

test('not authorized logout test', async ()=>{
    const res = await request(app)
                    .post("/evcharge/api/logout");

    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual('token required');
});

test('valid logout test', async ()=>{
    const login_res = await request(app)
                .post("/evcharge/api/login")
                .send({
                    username: 'Stef',
                    password: process.env.STEF_PASS
                });

    const token = login_res.body.token;

    const res = await request(app)
                    .post("/evcharge/api/logout")
                    .set('X-OBSERVATORY-AUTH', token)

    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Token removed');
});

test('expired token logout test', async ()=>{
    const login_res = await request(app)
                .post("/evcharge/api/login")
                .send({
                    username: 'Stef',
                    password: process.env.STEF_PASS
                });

    const token = login_res.body.token;

    await request(app)
                    .post("/evcharge/api/logout")
                    .set('X-OBSERVATORY-AUTH', token)

    const res = await request(app)
                    .post("/evcharge/api/logout")
                    .set('X-OBSERVATORY-AUTH', token)

    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual('this token has expired');
});