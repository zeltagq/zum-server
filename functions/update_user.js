// Module to update user data
const {User} = require('../db/models');
const {jwtDecode} = require('./jwt-decoder');
const {rotateMK} = require('./rotate_mk');

function updateUser(req,res) {
    jwtDecode(req.body.token, req.body.priority, (err, data) => {
       if (err) {
           console.warn(`Potential malicious user update request received`);
       }
       else {
           User.find({username : req.params.username}).then((users) => {
               if(users.length === 0) {
                   res.status(404).send('User not found');
               }
               else {
                   let user = users[0];
                   if(data.hasOwnProperty('password')) {
                       user.password = data.password;
                   }
                   if(data.hasOwnProperty('name')) {
                       user.name = data.name;
                   }
                   if(data.hasOwnProperty('email')) {
                       user.email = data.email;
                   }
                   if(data.hasOwnProperty('phone')) {
                       user.phone = data.phone;
                   }
                   if(data.hasOwnProperty('address')) {
                       user.address = data.address;
                   }
                   if(data.hasOwnProperty('country')) {
                       user.country = data.country;
                   }
                   if(data.hasOwnProperty('scope')) {
                       user.scope = data.scope;
                   }
                   user.save().then((user) => {
                       res.sendStatus(200);
                       console.log(`User info updated [Username : ${user.username}]`);
                       rotateMK(req.body.priority);
                   },(err) => {
                       res.status(400).send(err);
                   });
               }
           },(err) => {
               res.status(400).send(err);
           });
       }
    });
}

module.exports = {updateUser};