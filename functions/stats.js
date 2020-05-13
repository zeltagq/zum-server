// Module for exposing server stats
const {User} = require('../db/models');
const {SigningKey} = require('../db/models');
const nos = require('node-os-utils');

// Number of registered users
function registerCount(res) {
    User.find().then((users) => {
        let count = (users.length).toString();
        res.send(count);
    }, (err) => {
        res.status(500).send(err);
    });
}

// Number of logged in users
function loggedCount(res) {
    SigningKey.find().then((users) => {
        let count = (users.length).toString();
        res.send(count);
    }, (err) => {
        res.status(500).send(err);
    });
}

// Number of disabled accounts
function disabledCount(res) {
    User.find({'disabled.value':true}).then((users) => {
        let count = (users.length).toString();
        res.send(count);
    }, (err) => {
        res.status(500).send(err);
    });
}

// CPU Utilization
function cpuUtil(res) {
    nos.cpu.usage().then((cpuPercentage) => {
        let result = (Math.round(cpuPercentage*10)/10).toString();
        res.send(result);
    }, (err) => {
        res.status(500).send(err);
    });
}

// Memory Utilization
function memUtil(res) {
    nos.mem.info().then(info => {
        let result = (Math.round((100 - info.freeMemPercentage)*10)/10).toString();
        res.send(result);
    }, (err) => {
        res.status(500).send(err);
    });
}

// Disk Utilization
function diskUtil(res) {
    nos.drive.info().then(info => {
        let result = (Math.round(info.usedPercentage)).toString();
        res.send(result);
    }, (err) => {
        res.status(500).send(err);
    });
}

module.exports = {
    registerCount,
    loggedCount,
    disabledCount,
    cpuUtil,
    memUtil,
    diskUtil
}