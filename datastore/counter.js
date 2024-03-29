const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;
const Promise = require('bluebird');


// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};
const readCounterAsync = Promise.promisify(readCounter);

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};
const writeCounterAsync = Promise.promisify(writeCounter);

// Public API - Fix this function //////////////////////////////////////////////
// console.log("readCounterAsync:", readCounterAsync);

exports.getNextUniqueId = (callback) => { // callback is called onece the rest of the function has been run
  readCounterAsync()
    .then((data) => {
      var counter = data + 1;
      writeCounterAsync(counter)
        .then((id) => {
          callback(null, id);
        });
    })
    .catch((err) => {
      console.log('err', err);
      callback(err, null);
    });
};

// exports.getNextUniqueId = (callback) => { // callback is called onece the rest of the function has been run
//   readCounter((err, fileData) => { // readCounter accepts a callback (error-first)
//     var counter = fileData + 1;
//     writeCounter(counter, (err, counterString) => {
//       if (err) {
//         callback(err, null);
//       } else {
//         callback(null, counterString);
//       }
//     });
//   });
// };


// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');