// Module for retreiving signing keys
const {SigningKey} = require('../db/models');

function getSK(req,res) {
    SigningKey.find({user:req.params.user}).then((keys) => {
        res.status(200).send(keys[0].key);
    }, (err) => {
        res.status(400).send(err);
    });
}

module.exports = {getSK};