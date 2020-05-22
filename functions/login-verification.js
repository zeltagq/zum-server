const {User} = require('../db/models');
const {App} = require('../db/models');
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
            let app = data.app;
            let response = {"verified" : false};

            User.find({username:uname}).then((result) => {
                if(result.length !== 0) {
                    if(app === result[0].app) {
                        let hash = result[0].password;
                        let scope = result[0].scope;
                        // check if user email is verified
                        if (result[0].verified === false) {
                            return res.status(403).send(response);
                        }
                        // check if user is disabled
                        if (result[0].disabled.value === true) {
                            return res.status(403).send(response);
                        }
                        encryptor.decode(pass,hash,(r) => {
                            // Right password
                            if(r===true) {
                                // Fetching app details
                                App.find({appName:app}).then((result) => {
                                    let domain = `.${result[0].domain}`;
                                    let secure_flag = result[0].https;
                                    createToken(uname, scope, domain, (err, token) => {
                                        if (err) {
                                            console.error('Jwt creation failed');
                                            res.status(500).send(err);
                                        }
                                        else {
                                            console.log(`Successful login : ${uname}`)
                                            response = {"verified" : true};
                                            res.cookie(`zum:${app}`, token, {
                                                domain : domain,
                                                httpOnly : true,
                                                secure : secure_flag,
                                                expires : new Date(new Date().getTime() + (60*60*1000*24)) // 24 hrs
                                            }).send(response);
                                            rotateMK(req.body.priority);
                                        }
                                    });
                                }, (err) => {
                                    res.status(500).send(err);
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
                        res.status(404).send(`User ${uname} is not registered with the app ${result[0].app}`);
                    }
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