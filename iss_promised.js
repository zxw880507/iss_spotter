const request = require('request-promise-native');
const fetchMyIP = () => request(`https://api6.ipify.org?format=json`);
const fetchCoordsByIP = (body) => {
  const ip = JSON.parse(body).ip;
  return request(`https://ipvigilante.com/${ip}`);
};
const fetchISSFlyOverTimes = (body) => {
  const data = JSON.parse(body).data;
  const [lat, lon] = [data.latitude, data.longitude];
  return request(`http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${lon}`);
};
const printPassingTime = (body) => {
  const data = JSON.parse(body).response;
  for (const pass of data) {
    const date = new Date(pass.risetime * 1000);
    console.log(`Next pass at ${date} for ${pass.duration} seconds!`);
  }
};
const nextISSTimesForMyLocation = () => {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then(body => {
      printPassingTime(body);
    })
    .catch(error => {
      console.log("It didn't work: ", error.message);
    });
};

module.exports = { nextISSTimesForMyLocation };