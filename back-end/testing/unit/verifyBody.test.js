const {verifyBody} = require('../../routes/admin');

test('valid body test', ()=>{
    const body = {
        email: 'poutasok@gmail.com',
        name: 'Sokratis',
        password: 'TaRESTaMu',
        country: 'Greece',
        city: 'ElassonaCity',
        street_name: 'Antwnopoulou',
        street_number: 8,
        postal_code: '40200',
        phone_number: '6969696969',
        date_of_birth: '1-1-2020',
        points: 0,
        sex: 0,
        is_admin: 0,
        username: 'Paleho'
    }

    expect(verifyBody(body)).toBeTruthy();
});

test('invalid body @sex test', ()=>{
    const body = {
        email: 'poutasok@gmail.com',
        name: 'Sokratis',
        password: 'TaRESTaMu',
        country: 'Greece',
        city: 'ElassonaCity',
        street_name: 'Antwnopoulou',
        street_number: 8,
        postal_code: '40200',
        phone_number: '6969696969',
        date_of_birth: '1-1-2020',
        points: 0,
        sex: 3,
        is_admin: 0,
        username: 'Paleho'
    }

    expect(verifyBody(body)).toBeFalsy();
});

test('invalid body @phone test', ()=>{
    const body = {
        email: 'poutasok@gmail.com',
        name: 'Sokratis',
        password: 'TaRESTaMu',
        country: 'Greece',
        city: 'ElassonaCity',
        street_name: 'Antwnopoulou',
        street_number: 8,
        postal_code: '40200',
        phone_number: '6969696',
        date_of_birth: '1-1-2020',
        points: 0,
        sex: 0,
        is_admin: 0,
        username: 'Paleho'
    }

    expect(verifyBody(body)).toBeFalsy();
});

test('invalid body @date test', ()=>{
    const body = {
        email: 'poutasok@gmail.com',
        name: 'Sokratis',
        password: 'TaRESTaMu',
        country: 'Greece',
        city: 'ElassonaCity',
        street_name: 'Antwnopoulou',
        street_number: 8,
        postal_code: '40200',
        phone_number: '6969696969',
        date_of_birth: '1-1-1949',
        points: 0,
        sex: 0,
        is_admin: 0,
        username: 'Paleho'
    }

    expect(verifyBody(body)).toBeFalsy();
});