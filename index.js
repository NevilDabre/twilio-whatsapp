// Require express and body-parser
const express = require("express")
const bodyParser = require("body-parser")
require('dotenv').config()

const { router } = require('./src/routes')
// Initialize express and define a port
const app = express()


// Tell express to use body-parser's JSON parsing
app.use(bodyParser.urlencoded({ extended: false }));

// Start express on the defined port
app.listen(process.env.PORT, () => console.log(`🚀 Server running on port ${process.env.PORT}`))

// app.post("/receive", (req, res) => {
//   console.log(req.body) // Call your action on the request here
//   res.status(200).end() // Responding is important
// })

app.use('/', router)