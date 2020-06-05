// Endpoint for registered apps to verify request tokens
const {SigningKey} = require('../db/models');
const njwt = require('njwt');

function verifyToken(req,res) {
    let response = {"verified" : false, "reason" : "unauthorized", "permit" : null};
    SigningKey.find({user:req.params.username}).then((result) => {
        if(result.length === 0) {
            res.status(401).send(response); // not logged in
        }
        else {
            let key = result[0].key;
            let sk = Buffer.from(key, 'base64');
            let token = req.params.token;
            njwt.verify(token, sk, (err, verifiedJwt) => {
                if (err) {
                    response = {"verified" : false, "reason" : "invalid_token", "permit" : null};
                    res.status(403).send(response);
                }
                else {
                    response = {"verified" : true, "reason" : "valid_token", "permit" : req.params.username};
                    res.status(200).send(response);
                }
            });
        }
    }, (err) => {
        res.status(500).send(err);
    });
}

module.exports = {verifyToken};