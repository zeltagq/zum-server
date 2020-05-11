const {User} = require('../db/models');
const {terminationMail} = require('./mailer');

function delUser(req,res) {
    let appname = req.body.app;
    let reason = req.body.reason;
    User.find({username:req.params.username}).then((user) => {
        if(user.length === 0) {
            res.status(404).send('User not found');
        }
        else {
            User.findOneAndRemove({username:req.params.username}).then((user) => {
                res.sendStatus(200);
                terminationMail(appname, user.email, reason);
            },(err) => {
                res.status(400).send(err);
            });
        }
    },(err) => {
        res.status(400).send(err);
    });
}
module.exports = {delUser};