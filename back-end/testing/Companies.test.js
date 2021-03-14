const request = require('supertest');
const app = require('../app'); 

test('not authorized companies test', async ()=>{
    let res;
    res = await request(app)
                    .get("/evcharge/api/Companies/Audi/20210106/20210110");

    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual('token required');

});

test('not privileged companies test', async ()=>{
    const login_res = await request(app)
                .post("/evcharge/api/login")
                .send({
                    username: 'Paleho',
                    password: process.env.PAL_PASS
                });

    const token = login_res.body.token;

    let res;
    res = await request(app)
                    .get("/evcharge/api/Companies/Audi/20210106/20210110")
                    .set('X-OBSERVATORY-AUTH', token)

    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual('Unauthorized for that section');

    res = await request(app)
                    .post("/evcharge/api/logout")
                    .set('X-OBSERVATORY-AUTH', token)

    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Token removed');
});

test('valid companies test', async ()=>{
    const login_res = await request(app)
                .post("/evcharge/api/login")
                .send({
                    username: 'Stef',
                    password: process.env.STEF_PASS
                });

    const token = login_res.body.token;

    let res;
    res = await request(app)
                    .get("/evcharge/api/Companies/Audi/20210106/20210110")
                    .set('X-OBSERVATORY-AUTH', token)

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(3);
    expect(res.body[0].Model).not.toBeNull();

    res = await request(app)
                    .post("/evcharge/api/logout")
                    .set('X-OBSERVATORY-AUTH', token)

    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Token removed');
});