// Module for retrieving a user using username or email
const {User} = require('../db/models');
const emailValidator = require('email-validator');

function getUser(req,res) {
    // Check if its an email or username
    let result = emailValidator.validate(req.params.input);
    if (result === true) {
        User.find({email:req.params.input}).then((users) => {
            if(users.length === 0) {
                return res.status(207).send('nofo');
            }
            res.status(200).send(users[0]);
        },(err) => {
            res.status(500).send(err);
        });
    }
    else {
        User.find({username:req.params.input}).then((users) => {
            if(users.length === 0) {
                return res.status(207).send('nofo');
            }
            res.status(200).send(users[0]);
        },(err) => {
            res.status(500).send(err);
        });
    }
}

module.exports = {getUser};