const SERVER_CONFIG = {

  /*** SERVER, MONGODB, PYTHON ***/
  SERVER_PORT : 3000,
  MONGODB_URL : 'mongodb://edomusAdmin:edomuspassword@localhost:27017/edomus?replicaSet=rs0',
  MONGODB_OPTIONS: {
    socketTimeoutMS: 30000,
    keepAlive: true,
    reconnectTries: 30
  },
  PYTHON_PATH : '/usr/bin/python',
  PYTHON_SCRIPTS_PATH : '/opt/python',
};

//'mongodb://admin:password@localhost:27017,localhost:27022/edomus'

module.exports = SERVER_CONFIG;