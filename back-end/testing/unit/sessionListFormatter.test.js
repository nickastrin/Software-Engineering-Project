const {sessionListFormatter} = require('../../routes/SessionsPerEV');

test('valid sessionListFormatter test', ()=>{
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

    const {totalEnergy, sessionList, points, station_ids} = sessionListFormatter(objList);

    expect(totalEnergy).toEqual(35.7);
    expect(sessionList.length).toEqual(objList.length);
    expect(points).toContainEqual({
        pointID: 1,
        stationID: 1
    });
    expect(points).toContainEqual({
        pointID: 3,
        stationID: 4
    });
    expect(points).toContainEqual({
        pointID: 2,
        stationID: 16
    });
    expect(station_ids).toHaveLength(objList.length);
    expect(station_ids).toContain(1);
    expect(station_ids).toContain(4);
    expect(station_ids).toContain(16);
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
          station_id: 4,
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

    const {totalEnergy, sessionList, points, station_ids} = sessionListFormatter(objList);

    expect(totalEnergy).toEqual(35.7);
    expect(sessionList.length).toEqual(objList.length);
    expect(points).toContainEqual({
        pointID: 3,
        stationID: 4
    });
    expect(points).toHaveLength(1);
    expect(station_ids).toHaveLength(objList.length);
    expect(station_ids).toContain(4);
});

test('empty list sessionListFormatter test', ()=>{
    const objList = []

    const {totalEnergy, sessionList, points, station_ids} = sessionListFormatter(objList);

    expect(totalEnergy).toEqual(0);
    expect(sessionList.length).toEqual(objList.length);
    expect(points).toHaveLength(0);
    expect(station_ids).toHaveLength(0);
});