const request = require('supertest');
const app = require('../app'); 

test('not authorized admin test', async ()=>{
    let res;
    res = await request(app)
                    .post("/evcharge/api/admin/usermod/Stef/yolaria123");

    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual('token required');

    res = await request(app)
                    .get("/evcharge/api/admin/users/Lapouta");

    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual('token required');

    res = await request(app)
                    .post("/evcharge/api/admin/system/sessionsupd");

    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual('token required');
});

test('not elevated user admin test', async ()=>{
    const login_res = await request(app)
                .post("/evcharge/api/login")
                .send({
                    username: 'Paleho',
                    password: process.env.PAL_PASS
                });

    const token = login_res.body.token;
    let res;
    res = await request(app)
                    .post("/evcharge/api/admin/usermod/Stef/yolaria123")
                    .set('X-OBSERVATORY-AUTH', token)

    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual('Unauthorized for that section');

    res = await request(app)
                    .get("/evcharge/api/admin/users/Lapouta")
                    .set('X-OBSERVATORY-AUTH', token)

    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual('Unauthorized for that section');
    
    res = await request(app)
                    .post("/evcharge/api/admin/system/sessionsupd")
                    .set('X-OBSERVATORY-AUTH', token)

    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual('Unauthorized for that section');

    res = await request(app)
                    .post("/evcharge/api/logout")
                    .set('X-OBSERVATORY-AUTH', token)

    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Token removed');
});

test('valid admin test', async ()=>{
    const login_res = await request(app)
                .post("/evcharge/api/login")
                .send({
                    username: 'Stef',
                    password: process.env.STEF_PASS
                });

    const token = login_res.body.token;
    let res;
    res = await request(app)
                    .post("/evcharge/api/admin/usermod/Stef/yolaria123")
                    .set('X-OBSERVATORY-AUTH', token)
                    .send({
                        email: "stef@poutas.com",
                        name: "Stefanos", 
                        password: "yolaria123",
                        country: "Greece", 
                        city: "Athens", 
                        street_name: "Salamalenkoum", 
                        street_number: 13, 
                        postal_code: "11234", 
                        phone_number: "6973552567", 
                        date_of_birth: "1999-06-17",
                        points: 0, 
                        sex: 1, 
                        is_admin: 1, 
                        username: "Stef"
                    })

    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Updated');

    res = await request(app)
                    .get("/evcharge/api/admin/users/Lapouta")
                    .set('X-OBSERVATORY-AUTH', token)

    expect(res.statusCode).toEqual(200);
    expect(res.body.name).not.toBeNull();
    expect(res.body.password).not.toBeNull();
    expect(res.body.sex).not.toBeNull();

    res = await request(app)
                    .post("/evcharge/api/logout")
                    .set('X-OBSERVATORY-AUTH', token)

    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Token removed');
});

test('not matching passwords on usermod@admin test', async ()=>{
    const login_res = await request(app)
                .post("/evcharge/api/login")
                .send({
                    username: 'Stef',
                    password: process.env.STEF_PASS
                });

    const token = login_res.body.token;
    let res;
    res = await request(app)
                    .post("/evcharge/api/admin/usermod/NewUser/yolaria123")
                    .set('X-OBSERVATORY-AUTH', token)
                    .send({
                        email: "stef@poutas.com",
                        name: "Stefanos", 
                        password: "yolaria123456",
                        country: "Greece", 
                        city: "Athens", 
                        street_name: "Salamalenkoum", 
                        street_number: 13, 
                        postal_code: "11234", 
                        phone_number: "6973552567", 
                        date_of_birth: "1999-06-17",
                        points: 0, 
                        sex: 1, 
                        is_admin: 0, 
                        username: "NewUser"
                    })

    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('args in url and body do not match');
});