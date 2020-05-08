// Module for generating automated emails
const mustache = require('mustache');
const fs = require('fs');
const mail = require('@sendgrid/mail');
const {EVC} = require('../db/models');
const {User} = require('../db/models');
const uniqid = require('uniqid');

// Sendgrid api key
mail.setApiKey(process.env.SG);

// Email verification after registration
function registrationEmail(appname, email) {
    let data = fs.readFileSync('../mail/register.html');
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

module.exports = {registrationEmail, confirmVerification};