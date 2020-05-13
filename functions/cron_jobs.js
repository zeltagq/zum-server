const {User} = require('../db/models');
const moment = require('moment');

// Check is disabled users have completed their ban duration and re-enable them every 6 hrs
function cron_userEnable() {
    setInterval(() => {
        User.find({'disabled.value':true}).then((users) => {
            if(users.length === 0) {
                console.log('Cron Job : Enable/Disable Users : No action taken');
            }
            else {
                users.forEach(user => {
                    let today = moment().format('DD-MM-YYYY');
                    let end_date = user.disabled.end_date;
                    if(moment(end_date).isBefore(today) || moment(end_date).isSame(today)) {
                        user.disabled.value = false;
                        user.disabled.end_date = null;
                        user.save().then((user) => {
                            console.log(`Cron Job : Enable/Disable Users : ${user.username} enabled`);
                        }, (err) => {
                            console.warn('Cron Job Error : Enable/Disable Users');
                        });
                    }
                });
            }
        });
    }, 60000 * 60 * 6);
}

module.exports = {cron_userEnable};