const CronJob = require('cron').CronJob;
const express = require('express');
const paperStar = require('./paperStar');

const app = express();

let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}

var job = new CronJob('0 0 */2 * * *', function() {
    var date = new Date();

    console.log('\nBeginning task at ' + date.toISOString());

    if (Math.random() < 0.6) {
        paperStar.curveStar();
    }
    else {
        paperStar.lineStar();
    }
    paperStar.post();
}, null);

job.start();

app.get('/', (req, res) => res.send('All is well.'));
app.get('/star', (req, res) => res.sendFile(__dirname + '/public' + '/star.png'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
