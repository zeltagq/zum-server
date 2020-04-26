const {User} = require('../db/models');
const encryptor = require('./encryptor');
const {createToken} = require('./jwt');
const {jwtDecode} = require('./jwt-decoder');
const {rotateMK} = require('./rotate_mk');

function verify(req,res) {
    jwtDecode(req.body.token, req.body.priority, (err, data) => {
        if (err) {
            console.warn(`Potential malicious login attempt as ${data.username}`);
            res.sendStatus(400);
        }
        else {
            let uname = data.username;
            let pass = data.password;
            let response = {"verified" : false};

            User.find({username:uname}).then((result) => {
                if(result.length !== 0) {
                    let hash = result[0].password;
                    let scope = result[0].scope;
                    encryptor.decode(pass,hash,(r) => {
                        // Right password
                        if(r===true) {
                            createToken(uname, scope, (err, token) => {
                                if (err) {
                                    console.error('Jwt creation failed');
                                }
                                else {
                                    console.log(`Successful login : ${uname}`)
                                    response = {"verified" : true};
                                    res.cookie('zum:myapp', token, {
                                        domain : 'myapp.com',
                                        httpOnly : true,
                                        secure : false,
                                        expires : new Date().getTime() + (60*60*1000*24) // 24 hrs
                                    }).send(response);
                                    rotateMK(req.body.priority);
                                }
                            });
                        }
                        // Wrong password
                        else {
                            console.log(`Failed login : ${uname}`)
                            res.status(200).send(response);
                        }
                    });
                }
                else {
                    res.status(404).send('User not found');
                }
            },(err) => {
                res.status(400).send(err);
            });
        }
    });
}

module.exports = {verify};