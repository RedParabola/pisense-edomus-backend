const PythonShell = require('python-shell'),
      SERVER_CONFIG = require('../../../config/server.config.js'),
      PY_SCRIPTS = require('../../constants/python.constants.js');

let options = {
  mode: 'text',
  pythonPath: SERVER_CONFIG.PYTHON_PATH,
  pythonOptions: undefined,//['-u']
  scriptPath: SERVER_CONFIG.PYTHON_SCRIPTS_PATH,
  args: undefined//['value1', 'value2', 'value3']
};

exports.getLiveMeasures = function(callback) {
  PythonShell.run(PY_SCRIPTS.GETLIVEMEASURES, options, callback);
};

exports.setHumidifier = function(power, callback) {
  //COMO ENVÍO EL ENCENDIDO O APAGADO?
  PythonShell.run(PY_SCRIPTS.SETHUMIDIFIER, options, callback);
};