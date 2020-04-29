const {db} = require('./dbconf');
const encryptor = require('../functions/encryptor');

// Schema for users
let UserSchema = new db.Schema({
    username : {
        type : String,
        required : true,
        trim : true,
        min : 1,
        unique: true
    },
    password : {
        type : String,
        required : true,
        trim : true,
        min : 8
    },
    name : {
        type : String,
        required : true,
        trim : true,
        min : 1
    },
    email : {
        type : String,
        required : true,
        trim : true,
        min : 1,
        unique : true
    },
    country : {
        type : String,
        required : true,
        trim : true,
        min : 1
    },
    // Scope defines user access level, set and updated by the client app
    scope : {
        type : String,
        required : true,
        trim : true,
        min : 1,
    }
});

// Schema for signing keys used to sign jwt tokens by the server
let KeySchema = new db.Schema({
    user : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        min : 1
    },
    key : {
        type : String,
        required : true,
        trim : true,
        min : 1
    }
});

// Schema for master signing key used to sign jwt tokens by the client
let MasterKeySchema = new db.Schema({
    // This field is for maintaining multiple master keys to prevent bottlenecks
    priority : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        min : 1
    },
    // This key will be rotated by the server after each successful signup/update/login
    key : {
        type : String,
        required : true,
        trim : true,
        min : 1
    }
});

UserSchema.pre('save',function(next) {
    let user = this;
    if(user.isModified('password')) {
        encryptor.encrypt(user.password,(err,hash) => {
            if(!err) {
                user.password = hash;
            }
            next();
        });
    } else {
        next();
    }
});

let User = db.model('User', UserSchema); // Model for storing users
let SigningKey = db.model('sk', KeySchema); // Model for storing signing keys
let MK = db.model('mk', MasterKeySchema); // Model for storing master keys

module.exports = {User, SigningKey, MK};