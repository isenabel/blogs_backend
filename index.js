const express = require('express')
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

const dbOptions = {
}
mongoose.connect(process.env.ATLAS_URI, dbOptions)
.then(() => console.log("Database Connected!"))
.catch(err => console.log(err))

const port = process.env.PORT
app.listen(port, () => {
  console.log(`Server is running on: http://localhost:${port}/`)
})