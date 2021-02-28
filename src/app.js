const express = require('express');
const app = express();

require('./api/routes')(app);

const server = app.listen(80, () => {
    console.log(`SQS Engagements Tracker listening at ${server.address().port}`);
});