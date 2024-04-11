require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path")

//  Imports 
const { connection } = require("./db");
// const { userRouter } = require("./Routes/user.routes");
// const { sessionRouter } = require("./Routes/session.routes");

//  Middlewares 
app.use(cors());
app.use(express.json());
 
//  Routers 
// app.use("/users", userRouter);
// app.use("/session",sessionRouter)
app.use("/api/v1",require("./Routes/routes"))

//  Default EndPoint 
// app.get("/", (req, res) =>
//   res.send(
//     `<h1 style="text-align:center; color:RGB(37 99 235); padding-top:40">Welcome to the Backend of StockTutor</h1>`
//   )
// );

app.use(express.static(path.join(__dirname, 'public')));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


//  Server Running 
app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected To Database");
    console.log(`Server is UP & Running on ${process.env.port}`);
  } catch (error) {
    console.log("Error", error.message);
  }
});