const {User} = require('../db/models');

function delUser(req,res) {
    User.find({username:req.params.name}).then((user) => {
        if(user.length === 0) {
            res.status(404).send('User not found');
        }
        else {
            User.findOneAndRemove({username:req.params.name}).then((user) => {
                res.status(200).send(user);
            },(err) => {
                res.status(400).send(err);
            });
        }
    },(err) => {
        res.status(400).send(err);
    });
}
module.exports = {delUser};