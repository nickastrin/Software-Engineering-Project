const {SessionsPerStationFormatter} = require('../../routes/SessionsPerStation');

test('valid SessionsPerStationFormatter test', ()=>{
    const objList = [
        {
          event_id: 188,
          user_id: 42,
          station_id: 4,
          point_id: 3,
          license_plate: 'HOS-9576',
          start_time: '2021-01-04 17:34:00',
          finish_time: '2021-01-04 17:53:35',
          kwh_transferred: 13.5,
          price: 3.51,
          payment_method: 3,
          protocol: 'OCPI'
        },
        {
          event_id: 299,
          user_id: 42,
          station_id: 16,
          point_id: 2,
          license_plate: 'HOS-9576',
          start_time: '2021-01-05 00:45:20',
          finish_time: '2021-01-05 01:19:22',
          kwh_transferred: 12.02,
          price: 3.01,
          payment_method: 3,
          protocol: 'OCPI'
        },
        {
          event_id: 421,
          user_id: 42,
          station_id: 1,
          point_id: 1,
          license_plate: 'HOS-9576',
          start_time: '2021-01-08 21:41:04',
          finish_time: '2021-01-08 22:39:11',
          kwh_transferred: 5.09,
          price: 1.43,
          payment_method: 3,
          protocol: 'OCPI'
        },
        {
          event_id: 425,
          user_id: 42,
          station_id: 1,
          point_id: 1,
          license_plate: 'HOS-9576',
          start_time: '2021-01-08 21:41:04',
          finish_time: '2021-01-08 22:39:11',
          kwh_transferred: 5.09,
          price: 1.43,
          payment_method: 3,
          protocol: 'OCPI'
        }
    ]

    const {totalEnergy, sessionList} = SessionsPerStationFormatter(objList);

    expect(totalEnergy).toEqual(35.7);
    expect(sessionList.length).toEqual(3);
});

test('single point sessionListFormatter test', ()=>{
    const objList = [
        {
          event_id: 188,
          user_id: 42,
          station_id: 4,
          point_id: 3,
          license_plate: 'HOS-9576',
          start_time: '2021-01-04 17:34:00',
          finish_time: '2021-01-04 17:53:35',
          kwh_transferred: 13.5,
          price: 3.51,
          payment_method: 3,
          protocol: 'OCPI'
        },
        {
          event_id: 299,
          user_id: 42,
          station_id: 4,
          point_id: 3,
          license_plate: 'HOS-9576',
          start_time: '2021-01-05 00:45:20',
          finish_time: '2021-01-05 01:19:22',
          kwh_transferred: 12.02,
          price: 3.01,
          payment_method: 3,
          protocol: 'OCPI'
        },
        {
          event_id: 421,
          user_id: 42,
          station_id: 4,
          point_id: 3,
          license_plate: 'HOS-9576',
          start_time: '2021-01-08 21:41:04',
          finish_time: '2021-01-08 22:39:11',
          kwh_transferred: 5.09,
          price: 1.43,
          payment_method: 3,
          protocol: 'OCPI'
        },
        {
          event_id: 425,
          user_id: 42,
          station_id: 5,
          point_id: 3,
          license_plate: 'HOS-9576',
          start_time: '2021-01-08 21:41:04',
          finish_time: '2021-01-08 22:39:11',
          kwh_transferred: 5.09,
          price: 1.43,
          payment_method: 3,
          protocol: 'OCPI'
        }
    ]

    const {totalEnergy, sessionList} = SessionsPerStationFormatter(objList);

    expect(totalEnergy).toEqual(35.7);
    expect(sessionList.length).toEqual(1);
    expect(sessionList[0].EnergyDelivered).toEqual(35.7);
});

test('empty list SessionsPerStationFormatter test', ()=>{
    const objList = []

    const {totalEnergy, sessionList} = SessionsPerStationFormatter(objList);

    expect(totalEnergy).toEqual(0);
    expect(sessionList.length).toEqual(objList.length);
});