const mongoose = require('mongoose');

let connectWithRetry = () => {
    return new Promise(function (resolve, reject) {
        mongoose.connect('mongodb://newtonblog:' + process.env.DB_BLOG_PASSWORD +
            '@newtonblog.documents.azure.com:10255/admin/?ssl=true&replicaSet=globaldb',
            function (err) {
                if (err) {
                    console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
                    setTimeout(connectWithRetry, 5000);
                } else {
                    resolve();
                }
            });
    });
};

exports.connectWithRetry = connectWithRetry;