const request = require(`request`);

const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request(`https://api6.ipify.org?format=json`, (error, response, body) => {
    if (error) {
      return callback(error, null);
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      return callback(Error(msg), null);

    } else {
      return callback(null, JSON.parse(body)['ip']);
    }
  });

};

const fetchCoordsByIP = (ip, callback) => {
  request(`https://ipvigilante.com/${ip}`, (error, response, body) => {
    if (error) {
      return callback(error, null);
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
      return callback(Error(msg), null);
    } else {
      const data = JSON.parse(body)['data'];
      const latitude = data['latitude'];
      const longitude = data['longitude'];
      return callback(null, { latitude, longitude });
    }
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  // ...
  const lat = coords['latitude'];
  const lon = coords['longitude'];
  request(`http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${lon}`, (error, response, body) => {
    if (error) {
      return callback(error, null);
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS pass times: ${body}`;
      return callback(Error(msg), null);
    } else {
      const data = JSON.parse(body)['response'];
      return callback(null, data);
    }
  });
};

const nextISSTimesForMyLocation = function(callback) {
  // empty for now
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        return callback(error, null);
      }
      fetchISSFlyOverTimes(coords, (error, data) => {
        if (error) {
          return callback(error, null);
        }
        return callback(null, data);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };