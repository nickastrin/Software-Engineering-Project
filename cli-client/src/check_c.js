const fs = require('fs');

function datecheck (date) {
    regex = new RegExp("^([0-9]{8})$");
    return regex.text(date);
}

function pointcheck (pointid) {
    const point = new RegExp("^([0-9]+-[0-9]+)$");
    return point.test(pointid);
}

function providercheck (providerid) {
    const provider = new RegExp("^([0-9]+)$");
    provider.test(providerid);
}

function stationcheck (stationid) {
    const station = new RegExp("^([0-9]+)$");
    return station.test(stationid);
}

function evcheck (evid) {
    const ev = new RegExp("^([A-Z]{3}-[0-9]{4})$");
    return ev.test(evid);
}

function logincheck () {
    return fs.existsSync("./softeng20bAPI.token");
}

exports.stationcheck = stationcheck;
exports.pointcheck = pointcheck;
exports.providercheck = providercheck;
exports.evcheck = evcheck;
exports.logincheck = logincheck;