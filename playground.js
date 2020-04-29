const njwt = require('njwt');
const axios = require('axios');

// Testing registration (Server throwing User is not a constructor error)
axios.get('http://localhost:3000/mk/primary').then((res) => {
    let key = res.data;
    var claims = {
        "name" : "Suri Cat",
        "username" : "zaygo",
        "password" : "Suri@1234",
        "email" : "suri@email.com",
        "scope" : "admin",
        "country" : "Neverland"
    }

    let signingKey = Buffer.from(key, 'base64')
    let jwt = njwt.create(claims, signingKey);
    let token = jwt.compact();

    axios.post('http://localhost:3000/register', {
        priority : "primary",
        token : token
    }).then((res) => {
        console.log(res);
    }, (err) => {
        console.log(err);
    });
}, (err) => {
    console.log(err);
});