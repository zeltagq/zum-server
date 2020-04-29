// Module for retrieving a user using username
const {User} = require('../db/models');

function getUsername(req,res) {
    User.find({username:req.params.username}).then((users) => {
        res.status(200).send(users[0]);
    },(err) => {
        res.status(400).send(err);
    });
}
module.exports = {getUsername};