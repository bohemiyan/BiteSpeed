const express = require('express');
const bodyParser = require('body-parser');
const identifyRouter = require('./src/routes/identity');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
//cors
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
}));

app.use('/identify', identifyRouter);

// Serve static files and SPA
const clientPath = path.join(__dirname,'client', 'build');
app.use(express.static(clientPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

app.listen( process.env.PORT || 3000, () => console.log(`Server running on port ${process.env.PORT || 3000}`));
