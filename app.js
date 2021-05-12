const CronJob = require('cron').CronJob;
const express = require('express');
const paperStar = require('./paperStar');
require('dotenv').config();

const app = express();

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

//set up a cron job to randomly generate one of the three star types and post it to Facebook
var job = new CronJob('0 0 */2 * * *', function() {
    var date = new Date();

    console.log('\nBeginning task at ' + date.toISOString());

    var pickStar = Math.ceil(Math.random() * 100);
    if (pickStar < 26) {
        paperStar.curveStar();
    }
    if (pickStar > 25 && pickStar < 51) {
        paperStar.lineStar();
    }
    if (pickStar > 50) {
        paperStar.awareStar();
    }
    paperStar.post(process.env.ID, process.env.TOKEN, process.env.IMAGE_URL);
}, null);

job.start();

app.get('/', (req, res) => res.send('All is well.'));
app.get('/star', (req, res) => res.sendFile(__dirname + '/public' + '/star.png'));

app.listen(port, () => console.log(`App listening on port ${port}!`));
