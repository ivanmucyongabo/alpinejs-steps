const fs = require("fs");
const http = require("http");
const path = require("path");

const docs = path.join(__dirname, "docs");
const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer(function (req, res) {
  let file = path.join(docs, req.url === "/" ? "index.html" : req.url);

  fs.readFile(file, function (err, data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }

    res.writeHead(200);
    res.end(data);
  });
});

server.listen(port, hostname, () => {
  console.log(docs);
  console.log(`Server running at http://${hostname}:${port}/`);
});
