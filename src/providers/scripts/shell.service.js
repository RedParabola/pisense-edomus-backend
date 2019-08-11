var shell = require('shelljs');

const compileAndUploadToBoard = function (thingId, thingModel, boardModelId, boardPin, callback) {
  let scriptString;
  //scriptString = 'bash sleep_example.sh';
  scriptString = `./sketchgenerator ${thingModel} ${boardPin} ${thingId} ${boardModelId}`;
  _execAsync(scriptString, function(data) {
    if (data === 'Completed') {
      console.log('Success execution of sketchgenerator ended');
      callback();
    } else if (data.indexOf('Error') !== -1) {
      callback(data);
    }
  }, function(error) {
    console.log('Failed execution of sketchgenerator ended');
    callback(error);
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