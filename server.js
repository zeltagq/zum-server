const express = require('express');
const bodyparser = require('body-parser');

const {createUser} = require('./functions/user_creation');
const {getUser} = require('./functions/get_user');
const {verify} = require('./functions/login-verification');
const {delUser} = require('./functions/delete_user');
const {updateUser} = require('./functions/update_user');
const {getMK} = require('./functions/get_mk');
const {confirmVerification} = require('./functions/mailer');
const {disableUser, enableUser} = require('./functions/disable_user');
const {registerApp} = require('./functions/register_app');
const {verifyToken} = require('./functions/token-verification');
const {registerCount, loggedCount, disabledCount, cpuUtil, memUtil, diskUtil} = require('./functions/stats');
const {cron_userEnable} = require('./functions/cron_jobs');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

app.use(bodyparser.json());

// Background cron jobs
cron_userEnable();

app.get('/',(req,res) => {
   res.sendFile(`${__dirname}/public/home.html`)
});

app.post('/apps/register', (req,res) => {
    registerApp(req,res);
});

app.get('/mk/:priority', (req,res) => {
    getMK(req,res);
});

app.post('/register', (req,res) => {
    createUser(req,res);
});

app.get('/users/:input', (req,res) => {
    getUser(req,res);
});

app.post('/login', (req,res) => {
    verify(req,res);
});

app.get('/verify/:username/:token', (req,res) => {
    verifyToken(req,res);
});

app.delete('/users/:username', (req,res) => {
    delUser(req,res);
});

app.patch('/users/:username', (req,res) => {
    updateUser(req,res);
});

app.get('/email-verification/:code', (req,res) => {
    confirmVerification(req,res);
});

app.post('/users/disable', (req,res) => {
    disableUser(req,res);
});

app.get('/users/enable/:username', (req,res) => {
    enableUser(req,res);
});

// Endpoints for server stats
app.get('/stats/:option', (req,res) => {
    if(req.params.option === 'registered') {
        registerCount(res);
    }
    else if(req.params.option === 'logged') {
        loggedCount(res);
    }
    else if(req.params.option === 'disabled') {
        disabledCount(res);
    }
    else if(req.params.option === 'cpu-util') {
        cpuUtil(res);
    }
    else if(req.params.option === 'mem-util') {
        memUtil(res);
    }
    else if(req.params.option === 'disk-util') {
        diskUtil(res);
    }
    else {
        res.sendStatus(404);
    }
});

app.listen(port,() => {
    console.log(`Server started on port ${port}`);
});