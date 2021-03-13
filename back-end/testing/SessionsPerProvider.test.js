const request = require('supertest');
const app = require('../app'); 

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