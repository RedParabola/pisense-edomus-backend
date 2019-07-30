const composeBoardScripts = function (boardInfo, callback) {
  // TODO
  let err;
  if (false) {
    err = 'Mock composeBoardScripts FAILURE';
  }
  const scriptPathRef = 'script.path.ref';
  callback(err, scriptPathRef);
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

const scriptService = {
  composeBoardScripts,
  flashBoardScripts,
};

module.exports = scriptService;