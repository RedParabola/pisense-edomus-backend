var shell = require('shelljs');

const composeBoardScripts = function (boardInfo, callback) {
  let err, scriptPathRef;
  _execAsync('bash sleep_example.sh', function(data) {
    if (data === 'Completed') {
      console.log('execution of bash sleep_example.sh ended');
      scriptPathRef = 'script.path.ref';
      callback(err, scriptPathRef);
    } else if (data === 'Error') {
      err = 'FAILURE composeBoardScripts';
      callback(err);
    }
  }, function(error) {
    console.log('Failed execution of bash sleep_example.sh');
    if (error === 'Error') {
      err = 'FAILURE composeBoardScripts';
      callback(err);
    }
  });
}

// Call to flash the scripts into the usb-connected board
const flashBoardScripts = function (scriptRef, callback) {
  let err;
  if (false) {
    err = 'Mock flashBoardScripts FAILURE';
  }
  const success = true;
  callback(err, success);
};

function _execAsync(command, dataCallback, errorCallback) {
  const child = shell.exec(command, {async:true});
  child.stdout.on('data', function(data) {
    dataCallback(data.replace(/(\r\n|\n|\r)/gm,""));
  });
  child.stderr.on('data', function(error) {
    errorCallback(error.replace(/(\r\n|\n|\r)/gm,""));
  });
}

const scriptService = {
  composeBoardScripts,
  flashBoardScripts,
};

module.exports = scriptService;