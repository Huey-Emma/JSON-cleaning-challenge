var https = require('https');

var options = {
  host: 'coderbyte.com',
  path: '/api/challenges/json/json-cleaning',
};

let callback = function (response) {
  var body = [];

  response.on('data', function (chunk) {
    body.push(chunk);
  });

  response.on('end', function () {
    let data = Buffer.concat(body).toString();
    console.log(data);
  });
};

https.get(options, callback).end();
