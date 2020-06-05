// Signup Module
const {User} = require('../db/models');
const {App} = require('../db/models');
const {jwtDecode} = require('./jwt-decoder');
const {rotateMK} = require('./rotate_mk');
const {registrationEmail} = require('./mailer');

function createUser(req,res) {
    jwtDecode(req.body.token, req.body.priority, (err, data) => {
        if (err) {
            console.warn(`Potential malicious registration request received`);
            res.status(400).send(err);
        }
        else {
            let username = data.username;
            let password = data.password;
            let name = data.name || null;
            let email = data.email || null;
            let phone = data.phone || null;
            let address = data.address || null;
            let country = data.country || null;
            let scope = data.scope || 'user:basic';
            let app = data.app;

            let user = new User({
                username : username,
                password : password,
                name : name,
                email : email,
                phone : phone,
                address : address,
                country : country,
                scope : scope,
                app : app
            });

            //Checking if the defined app is registered with zum
            App.find({appName:app}).then((result) => {
                if(result.length !== 0) {
                    user.save().then((user) => {
                        res.sendStatus(200);
                        console.log(`New user registration : ${user.username}`);
                        rotateMK(req.body.priority);
                        if(user.email !== null) {
                            registrationEmail(app, email);
                        }
                        else {
                            //no email verification
                            user.verified = true;
                            user.save().then(() => {
                                // Do nothing
                            }, (err) => {
                                res.send(err);
                            });
                        }
                    }, (err) => {
                        res.send(err);
                    });
                }
                else {
                    res.status(400).send(`App named ${app} is not registered with Zum`);
                }
            }, (err) => {
                res.status(500).send(err);
            });
        }
    });
}

module.exports = {createUser};