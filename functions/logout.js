// Logout the user and delete SK record
const {SigningKey} = require('../db/models');

function logout(req,res) {
    SigningKey.findOneAndRemove({user:req.params.username}).then((user) => {
        res.sendStatus(200);
    }, (err) => {
        res.sendStatus(400);
    });
}

module.exports = {logout};