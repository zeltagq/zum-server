// Module for registering apps with zum
const {App} = require('../db/models');

function registerApp(req,res) {
    let appName = req.body.appName;
    let ip = req.body.ip;
    let domain = req.body.domain;
    let https = req.body.https || false;

    let app = new App({
        appName : appName,
        ip : ip,
        domain : domain,
        https : https
    });

    app.save().then((app) => {
        res.status(200).send(`New app ${app.appName} registered successfully`);
        console.log(`New app ${app.appName} registered successfully`);
    }, (err) => {
        res.status(400).send(err);
    });
}

module.exports = {registerApp};