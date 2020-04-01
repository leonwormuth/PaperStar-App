const http = require('http');
const paperStar = require('./paperStar.js');

const hostname = '127.0.0.1';
const port = 8000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/plain');
    res.end('Allo');
});

server.listen(port, hostname, () => {
    paperStar.curveStar();
    paperStar.post();
    console.log('Server started on port ' + port);
});
