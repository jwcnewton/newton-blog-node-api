const mongoose = require('mongoose');
const opbeat = require('opbeat')

const mongoConn = 'mongodb://newtonblog:' + process.env.DB_BLOG_PASSWORD +
    '@newtonblog.documents.azure.com:10255/admin/?ssl=true&replicaSet=globaldb'

const options = {
    server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
};

mongoose.Promise = Promise;

mongoose.connect(mongoConn, options);

// If the connection throws an error
mongoose.connection.on('error', function (err) {
    opbeat.captureError(err);
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        process.exit(0);
    });
}); 

module.exports = mongoose;


