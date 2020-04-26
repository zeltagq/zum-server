//These functions are used to encrypt & validate user passwords

const bcrypt = require('bcryptjs');
const saltRounds = 10;

function encrypt(password,callback) {
    bcrypt.hash(password,saltRounds,(err,hash) => {
        if (callback)
            callback(err?err : null, err?null : hash);
    });
}
module.exports.encrypt = encrypt;

function decode(password,hash,callback) {
    bcrypt.compare(password,hash,(err,res) => {
        if (!err && res === true) {
            if(callback)
                callback(true)
        }
        else {
            if(callback)
                callback(false)
        }
    });
}
module.exports.decode = decode;