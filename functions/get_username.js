// Module for retrieving a user using username
const {User} = require('../db/models');

function getUsername(req,res) {
    User.find({username:req.params.name}).then((users) => {
        res.status(200).send(users);
    },(err) => {
        res.status(400).send(err);
    });
}
module.exports = {getUsername};