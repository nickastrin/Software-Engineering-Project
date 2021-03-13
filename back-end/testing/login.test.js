const request = require('supertest');
const app = require('../app'); 

test('valid login test', async ()=>{
    const res = await request(app)
                    .post("/evcharge/api/login")
                    .send({
                        username: 'Stef',
                        password: 'yolaria123'
                    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.token.length).toBeGreaterThan(1);
});

test('invalid password@login test', async ()=>{
    const res = await request(app)
                    .post("/evcharge/api/login")
                    .send({
                        username: 'Stef',
                        password: 'pass'
                    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.token).toBeUndefined();
    expect(res.text).toEqual('invalid password');
});

test('invalid username@login test', async ()=>{
    const res = await request(app)
                    .post("/evcharge/api/login")
                    .send({
                        username: 'AngelStais',
                        password: 'pass'
                    });

    expect(res.statusCode).toEqual(402);
    expect(res.body.token).toBeUndefined();
    expect(res.text).toEqual('User not found');
});