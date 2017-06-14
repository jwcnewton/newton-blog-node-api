const opbeat = require('opbeat').start();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(opbeat.middleware.express())

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// JSON parser middleware
app.use(function (req, res, next) {
  if (req.headers['content-type'] !== 'application/json') {
    return next()
  }

  var trace = opbeat.buildTrace()

  // start the trace to measure the time it takes to parse
  // the JSON
  if (trace) trace.start('parse json')

  try {
    req.json = JSON.parse(req.body)
  } catch (e) {}

  // when we've processed the json, stop the custom trace
  if (trace) trace.end()

  next()
});

const blogs = require('./controllers/postController')(app);

const server = app.listen(process.env.PORT || 8080, function () {
    let port = server.address().port;
    console.log("Listening on " + port);
});



