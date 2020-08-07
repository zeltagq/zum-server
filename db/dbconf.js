const db = require('mongoose');

db.Promise = global.Promise;

// Production
db.connect('dburl', { useNewUrlParser: true, useUnifiedTopology: true }).then(
    () => { console.log('Connection to database established') }
).catch((err) => {
    console.log(err);
});

// Development
// db.connect(process.env.MONGODB_URI || 'mongodb://localhost/Zum').then(
//     () => {console.log('Connection to database established')}
// ).catch((err) => {
//     console.log(err);
// });

module.exports = {db};