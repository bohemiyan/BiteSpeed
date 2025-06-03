const express = require('express');
const bodyParser = require('body-parser');
const identifyRouter = require('./src/routes/identity');

const app = express();
app.use(bodyParser.json());

app.use('/identify', identifyRouter);

app.listen(3000, () => console.log('Server running on port 3000'));
