const {db} = require('./dbconf');
const encryptor = require('../functions/encryptor');

// Schema for apps registered with the server
let AppSchema = new db.Schema({
    appName : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        min : 1
    },
    ip : {
        type : Array,
        required : true
    },
    // value will be without http or www
    domain : {
        type : String,
        required : true,
        trim : true,
        min : 1
    },
    https : {
        type : Boolean,
        default : false
    }
});

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
    app : {
        type : String,
        required : true,
        trim : true,
        min : 1
    },
    // Scope defines user access level, set and updated by the client app
    scope : {
        type : String,
        trim : true,
        min : 1,
        default : 'basic'
    },
    // Denotes if email is verified
    verified : {
        type : Boolean,
        default : false
    },
    // Denotes if user is disabled
    disabled : {
        value : {
            type : Boolean,
            default : false
        },
        end_date : {
            type : String,
            default : null
        }
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
    },
    // will self destroy in 24 hrs
    expireAt: {
        type: Date,
        default: Date.now,
        index: { expires: '1440m' },
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

// Schema for temporary storage of email verification link codes
let EvcSchema = new db.Schema({
    email : {
        type : String,
        required : true,
        trim : true,
        min : 1,
        unique : true
    },
    code : {
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

let App = db.model('App', AppSchema); // Model for storing apps
let User = db.model('User', UserSchema); // Model for storing users
let SigningKey = db.model('sk', KeySchema); // Model for storing signing keys
let MK = db.model('mk', MasterKeySchema); // Model for storing master keys
let EVC = db.model('evc', EvcSchema); // Model for storing email verification codes

module.exports = {App, User, SigningKey, MK, EVC};