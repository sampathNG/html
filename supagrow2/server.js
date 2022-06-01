require('dotenv').config()
const express = require('express')
const app = express()
const cors = require("cors")
const path = require('path')
app.use(cors({
    origin: "*"
  }))
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(__dirname + "/uploads"))
// app.use(express.static(__dirname + "../dist-assets"));
// require("../dist-assets/css/themes")
app.use(express.static("../dist-assets"));


app. set ('view engine', 'ejs');
app. set ('views', path.join(__dirname, "../html/sessions"));
// app. set ('views', path.join(__dirname, "../html/layout1"));



// app.use(express.static(__dirname + "/signup.html"))
// app.use(express.static(__dirname + "/signin.html"))
// /home/sampath/html/html/sessions/signin.html

// require("../html/sessions")

const port = process.env.PORT
const api = require("./routes")
app.use("/",api)
app.get("/",(req,res)=>{
    res.send("server connecting")
})


app.listen(port,console.log(`running on port ${port}`))
