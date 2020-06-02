// Module to disable and enable user accounts
const {User} = require('../db/models');
const {disableMail} = require('./mailer');
const {enableMail} = require('./mailer');
const moment = require('moment');

function disableUser(req,res) {

    let username = req.body.username;
    let duration = req.body.duration;
    let reason = req.body.reason;

    User.find({username:username}).then((result) => {
        let user = result[0];
        if(user.scope === 'admin') {
            return res.status(400).send('Admin account cannot be disabled');
        }
        let end_date = moment().add(duration, 'days').format('DD-MM-YYYY');
        user.disabled.value = true;
        user.disabled.end_date = end_date;
        user.save().then((user) => {
            if(user.email !== null) {
                disableMail(user.app, user.email, duration, reason); //send mail to user
            }
            res.sendStatus(200);
        }, (err) => {
            res.status(500).send(err);
        });
    }, (err) => {
        res.status(500).send(err);
    });

}

function enableUser(req,res) {
    let username = req.params.username;
    User.find({username:username}).then((users) => {
        let user = users[0];
        user.disabled.value = false;
        user.disabled.end_date = null;
        user.save().then((user) => {
            if(user.email !== null) {
                enableMail(user.app, user.email); //send mail to user
            }
            res.sendStatus(200);
        }, (err) => {
            res.status(500).send(err);
        });
    }, (err) => {
        res.status(500).send(err);
    });
}

module.exports = {disableUser, enableUser};