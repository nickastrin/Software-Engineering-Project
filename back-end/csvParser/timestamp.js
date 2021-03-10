const currentTimestamp = () => {
    const currDate = new Date();

    let month = currDate.getMonth() + 1;
    if(month < 10) month = "0" + month;

    let day = currDate.getDate();
    if(day < 10) day = "0" + day;

    const TimeStamp = currDate.getFullYear() + "-" + month + "-" + day + " " + currDate.getHours() + ":" + currDate.getMinutes() + ":" + currDate.getSeconds();

    return TimeStamp;
}

const twodeciPointsAcc = (num) => {
    let piv = Math.trunc(num * 100) / 100;
    if(num - piv >= 0.005) return piv + 0.01;
    else return piv;
}

module.exports = {currentTimestamp, twodeciPointsAcc};