// Module for generating automated emails
const mustache = require('mustache');
const fs = require('fs');
const mail = require('@sendgrid/mail');
const {EVC} = require('../db/models');
const {User} = require('../db/models');
const uniqid = require('uniqid');
const path = require('path');
const moment = require('moment');

// Sendgrid api key
mail.setApiKey(process.env.SG);

// Email verification after registration
function registrationEmail(appname, email) {
    let data = fs.readFileSync(path.join(__dirname, '..', 'mail', 'register.html'));
    let content = data.toString('utf8');

    let code = uniqid('zum-');

    let view = {
        app : appname,
        code : code
    }

    // Store the generated code with the email in the database
    let evc = new EVC({
        email : email,
        code : code
    });
    evc.save().then(() => {
        console.log('New evc record created');
    }, (err) => {
        console.error('Unable to create new evc record');
    });

    let html = mustache.render(content, view);

    const msg = {
        to: email,
        from: 'noreply@zumapi.gq',
        subject: 'Verify Email',
        html: html
    };

    mail.send(msg).then(() => {
        console.log(`Verification mail sent to ${email}`);
    }, (err) => {
        console.error(err);
    });
}

// Confirm email verification
function confirmVerification(req, res) {
    let code = req.params.code;
    let response = {"verified" : false};
    EVC.find({code : code}).then((results) => {
        if(results.length === 0) {
            res.status(200).send(response);
        }
        else {
            let userEmail = results[0].email;
            User.find({email : userEmail}).then((users) => {
                if(users.length === 0) {
                    res.status(200).send(response);
                }
                else {
                    let user = users[0];
                    user.verified = true;
                    user.save().then(() => {
                        response = {"verified" : true};
                        res.status(200).send(response);
                        // removing temporary evc record
                        EVC.findOneAndRemove({email:userEmail}).then(() => {
                            console.log(`EVC record cleared for ${userEmail}`);
                        }, (err) => {
                            console.warn(err);
                        });
                    }, (err) => {
                        res.status(500).send('Database Error');
                        console.warn(err);
                    });
                }
            });
        }
    });
}

// Email for password reset
function passwordResetEmail(appname, email) {
    let data = fs.readFileSync(path.join(__dirname, '..', 'mail', 'password-reset.html'));
    let content = data.toString('utf8');

    let code = uniqid('zum-');

    let view = {
        app : appname,
        code : code
    }

    // Store the generated code with the email in the database
    let evc = new EVC({
        email : email,
        code : code
    });
    evc.save().then(() => {
        console.log(`New evc record created for ${email}`);
    }, (err) => {
        console.error('Unable to create new evc record');
    });

    let html = mustache.render(content, view);

    const msg = {
        to: email,
        from: 'noreply@zumapi.gq',
        subject: 'Password Reset',
        html: html
    };

    mail.send(msg).then(() => {
        console.log(`Password reset mail sent to ${email}`);
    }, (err) => {
        console.error(err);
    });
}

// Confirm password reset
function confirmPassReset(req, res) {
    let code = req.params.code;
    let response = {"verified" : false};
    EVC.find({code : code}).then((results) => {
        if(results.length === 0) {
            res.status(200).send(response);
        }
        else {
            let userEmail = results[0].email;
            User.find({email : userEmail}).then((users) => {
                if(users.length === 0) {
                    res.status(200).send(response);
                }
                else {
                    response = {"verified" : true};
                    res.status(200).send(response);
                    // removing temporary evc record
                    EVC.findOneAndRemove({email:userEmail}).then(() => {
                        console.log(`EVC record cleared for ${userEmail}`);
                    }, (err) => {
                        console.warn(err);
                    });
                }
            });
        }
    });
}

// Account termination mail
function terminationMail(appname, email, reason) {
    let data = fs.readFileSync(path.join(__dirname, '..', 'mail', 'account-termination.html'));
    let content = data.toString('utf8');

    let view = {
        app : appname,
        reason : reason
    }

    let html = mustache.render(content, view);

    const msg = {
        to: email,
        from: 'noreply@zumapi.gq',
        subject: 'Account Terminated',
        html: html
    };

    mail.send(msg).then(() => {
        console.log(`Account termination mail sent to ${email}`);
    }, (err) => {
        console.error(err);
    });
}

// Account disable mail
function disableMail(appname, email, duration, reason) {
    let data = fs.readFileSync(path.join(__dirname, '..', 'mail', 'account-disable.html'));
    let content = data.toString('utf8');

    let view = {
        app : appname,
        reason : reason,
        duration : duration,
        end_date : moment().add(duration, 'days').format('dddd (DD MMMM YYYY)')
    }

    let html = mustache.render(content, view);

    const msg = {
        to: email,
        from: 'noreply@zumapi.gq',
        subject: 'Account Disabled',
        html: html
    };

    mail.send(msg).then(() => {
        console.log(`Account disable mail sent to ${email}`);
    }, (err) => {
        console.error(err);
    });
}

// Account enable mail
function enableMail(appname, email) {
    let data = fs.readFileSync(path.join(__dirname, '..', 'mail', 'account-enable.html'));
    let content = data.toString('utf8');

    let view = {
        app: appname,
    }

    let html = mustache.render(content, view);

    const msg = {
        to: email,
        from: 'noreply@zumapi.gq',
        subject: 'Account Enabled',
        html: html
    };

    mail.send(msg).then(() => {
        console.log(`Account enable mail sent to ${email}`);
    }, (err) => {
        console.error(err);
    });
}

module.exports = {
    registrationEmail,
    confirmVerification,
    passwordResetEmail,
    confirmPassReset,
    terminationMail,
    disableMail,
    enableMail
};