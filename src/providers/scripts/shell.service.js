var shell = require('shelljs');

const compileAndUploadToBoard = function (thingId, thingModel, boardModelId, boardPin, callback) {
  let err, scriptString;
  //scriptString = 'bash sleep_example.sh';
  scriptString = `./sketchgenerator ${thingModel} ${boardPin} ${thingId} ${boardModelId}`;
  _execAsync(scriptString, function(data) {
    if (data === 'Completed') {
      console.log('execution of bash sleep_example.sh ended');
      callback(err);
    } else if (data === 'Error') {
      err = 'FAILURE compileAndUploadToBoard';
    }
  }, function(error) {
    console.log('Failed execution of bash sleep_example.sh');
    if (error === 'Error') {
      err = 'FAILURE compileAndUploadToBoard';
    }
    callback(err);
  });
}

function _execAsync(command, dataCallback, errorCallback) {
  const child = shell.exec(command, {async:true});
  child.stdout.on('data', function(data) {
    dataCallback(data.replace(/(\r\n|\n|\r)/gm,""));
  });
  child.stderr.on('data', function(error) {
    errorCallback(error.replace(/(\r\n|\n|\r)/gm,""));
  });
}

const shellScriptService = {
  compileAndUploadToBoard,
};

module.exports = shellScriptService;