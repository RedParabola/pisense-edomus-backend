const app = require('./src/app.js');
      SERVER_CONFIG = require('./config/server.config.js');

// Start server
app.listen(SERVER_CONFIG.SERVER_PORT, function() {
  console.log('Node server listening on http://localhost:' + SERVER_CONFIG.SERVER_PORT);
});