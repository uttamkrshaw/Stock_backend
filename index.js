require('dotenv').config()
const express = require("express")
const path = require('path');
const connection = require("./db/connection")
var cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
app.use("/api/v1",require("./routes/api"))

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log(`Server is Up & Running At Port ${process.env.port}`);
    } catch (error) {
        console.log(error)
    }
})