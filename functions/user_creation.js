// Signup Module
const {User} = require('../db/models');
const {jwtDecode} = require('./jwt-decoder');
const {rotateMK} = require('./rotate_mk');
const {registrationEmail} = require('./mailer');

function createUser(req,res) {
    jwtDecode(req.body.token, req.body.priority, (err, data) => {
        if (err) {
            console.warn(`Potential malicious registration request received`);
            res.sendStatus(400);
        }
        else {
            let username = data.username;
            let password = data.password;
            let name = data.name;
            let email = data.email;
            let country = data.country;
            let scope = data.scope;

            let user = new User({
                username : username,
                password : password,
                name : name,
                email : email,
                country : country,
                scope : scope
            });

            user.save().then((user) => {
                res.sendStatus(200);
                console.log(`New user registration : ${user.username}`);
                rotateMK(req.body.priority);
                registrationEmail('Zagan', email);
            }, (err) => {
                res.status(400).send(err);
            });
        }
    });
}

module.exports = {createUser};