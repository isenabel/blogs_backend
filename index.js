const express = require('express')
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

// Create HTTPS server
const server = https.createServer(options, app);

const dbOptions = {
}
mongoose.connect(process.env.ATLAS_URI, dbOptions)
.then(() => console.log("Database Connected!"))
.catch(err => console.log(err))

// const port = process.env.PORT
// app.listen(port, () => {
//   console.log(`Server is running on: http://localhost:${port}/`)
// })

const httpsPort = process.env.HTTPSPORT
server.listen(httpsPort, () => {
  console.log(`App listening on https://localhost:${httpsPort}`);
});