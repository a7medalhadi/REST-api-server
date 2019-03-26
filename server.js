const http = require('http');
const port = process.env.port||3308 ;
const app = require('./app')

const server = http.createServer(app);

server.listen(port);
console.log('server running on port ' + port  )