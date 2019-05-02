const SERVER_CONFIG = {

  /*** SERVER, MONGODB, PYTHON ***/
  SERVER_PORT : 3000,
  MONGODB_URL : 'mongodb://localhost:27017/edomus',
  JWT_SECRET: 'long-live-the-pisense',
  TOKEN_EXPIRE_TIME: 1296000, // 86400 seconds equivalent to 24 hours
  MONGODB_OPTIONS: {
    socketTimeoutMS: 30000,
    keepAlive: true,
    reconnectTries: 30,
    useNewUrlParser: true,
    useCreateIndex: true
  },
  PYTHON_PATH : '/usr/bin/python',
  PYTHON_SCRIPTS_PATH : '/opt/python',
};

//'mongodb://admin:password@localhost:27017,localhost:27022/edomus'

module.exports = SERVER_CONFIG;
