const express = require('express')
const http = require('http');
const https = require("https");
const fs = require("fs");
const path = require("path");
const cors = require('cors')
const bodyParser = require('body-parser')
const router = require('./routes/router.js')
const mongoose = require('mongoose')
require('dotenv').config({ path: "./.env" })

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use('/', router)

// Read SSL certificate and key files
const options = {
  key: fs.readFileSync(path.join(__dirname, "localhost-key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "localhost.pem")),
};

var httpServer = http.createServer(app);

// Create HTTPS server
const server = https.createServer(options, app);

const dbOptions = {
}
mongoose.connect(process.env.ATLAS_URI, dbOptions)
.then(() => console.log("Database Connected!"))
.catch(err => console.log(err))

const port = process.env.PORT
const httpPort = 8080;
httpServer.listen(httpPort, () => {
  console.log(`HTTP server is running on: http://localhost:${httpPort}/`)
})

server.listen(port, () => {
  console.log(`HTTPS server listening on https://localhost:${port}`);
});