const { nextISSTimesForMyLocation } = require('./iss');

const printISSPassingTime = (passes) => {
  for (const pass of passes) {
    const date = new Date(pass.risetime * 1000);
    console.log(`Next pass at ${date} for ${pass.duration} seconds!`);
  }
};
nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  printISSPassingTime(passTimes);
});