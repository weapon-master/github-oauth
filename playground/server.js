const http = require('http');

const server = http.createServer((req, res) => {
  //   res.setHeader('Content-Type', 'application/json');
  //   res.write('<h1>Got~~');
  //   res.end('OK!!!!</h1>');
  res.writeHead(404, {
    'Content-Type': 'application/json',
  });
  res.end(
    JSON.stringify({
      success: false,
    }),
  );
});
const PORT = 8002;
server.listen(PORT, () => {
  console.log(`running on ${PORT}`);
});
