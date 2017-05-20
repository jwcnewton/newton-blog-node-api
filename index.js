const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongo = require('./database/mongoAdapter');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

mongo.connectWithRetry().then(function () {
    const blogs = require('./controllers/postController')(app);

    const server = app.listen(process.env.PORT || 8080, function () {
        console.log("Listening on 3000");
    });
});

