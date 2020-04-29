// Module for retrieving master keys
const {MK} = require('../db/models');

function getMK(req, res) {
    MK.find({priority:req.params.priority}).then((mk) => {
        res.status(200).send(mk[0].key);
    },(err) => {
        res.status(400).send(err);
    });
}

module.exports = {getMK};