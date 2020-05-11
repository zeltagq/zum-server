const express = require('express');
const bodyparser = require('body-parser');

const {createUser} = require('./functions/user_creation');
const {getUser} = require('./functions/get_user');
const {verify} = require('./functions/login-verification');
const {delUser} = require('./functions/delete_user');
const {updateUser} = require('./functions/update_user');
const {getMK} = require('./functions/get_mk');
const {confirmVerification} = require('./functions/mailer');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

app.use(bodyparser.json());

app.get('/',(req,res) => {
   res.sendFile(`${__dirname}/public/home.html`)
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

app.delete('/users/:username', (req,res) => {
    delUser(req,res);
});

app.patch('/users/:username', (req,res) => {
    updateUser(req,res);
});

app.get('/email-verification/:code', (req,res) => {
    confirmVerification(req,res);
});

app.listen(port,() => {
    console.log(`Server started on port ${port}`);
});