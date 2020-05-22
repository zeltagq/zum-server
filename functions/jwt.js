// Module for jwt token creation and storage of signing key to verify requests
const {SigningKey} = require('../db/models');
let njwt = require('njwt');
let randomCrypto = require('secure-random');

function createToken(username, scope, aud, callback) {
    let signingKey = randomCrypto(256, {type:'Buffer'});

    var claims = {
        iss: "ZUM",
        aud: aud,
        sub: username,
        scope: scope // scope is used to differentiate access levels (standard/premium/blocked)
    }

    let jwt = njwt.create(claims, signingKey);
    jwt.setExpiration(new Date().getTime() + (60*60*1000*24)); // 24 hrs
    let token = jwt.compact(); //send to client

    let base64SigningKey = signingKey.toString('base64'); // db only supports string
    SigningKey.find({user:username}).then((result) => {
        if(result.length === 0) {
            // First time for a user
            let keygen = new SigningKey({
                user : username,
                key : base64SigningKey
            });
            keygen.save().then((keygen) => {
                if(callback)
                    callback(null, token)
            }, (err) => {
                if(callback)
                    callback(err, null)
            } );
        }
        else {
            // Updating signing key
            let signingKey = result[0];
            signingKey.key = base64SigningKey;
            signingKey.save().then((keygen) => {
                if(callback)
                    callback(null, token)
            }, (err) => {
                if(callback)
                    callback(err, null)
            });
        }
    });
}

module.exports = {createToken};