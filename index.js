var path = require('path');
var express = require ('express');

const server = global.server = express();
const port = process.env.PORT || 3000;
server.set('port', port);

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
server.use(express.static(path.join(__dirname, 'web/frontend')));

//
// Launch the server
// -----------------------------------------------------------------------------
server.listen(port, function() {
  console.log('The server is running at http://localhost:' + port);
});
