const {User} = require('../db/models');
const {disableMail} = require('./mailer');
const moment = require('moment');

function disableUser(req,res) {

    let username = req.body.username;
    let app = req.body.app;
    let duration = req.body.duration;
    let reason = req.body.reason;

    User.find({username:username}).then((result) => {
        let user = result[0];
        let end_date = moment().add(duration, 'days').format('DD-MM-YYYY');
        user.disabled.value = true;
        user.disabled.end_date = end_date;
        user.save().then((user) => {
            disableMail(app, user.email, duration, reason); //send mail to user
            res.sendStatus(200);
        }, (err) => {
            res.status(500).send(err);
        });
    }, (err) => {
        res.status(500).send(err);
    });

}

module.exports = {disableUser};