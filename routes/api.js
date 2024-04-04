const Route = require("express").Router()

Route.use("/list",require("../controller/data.controller.js"))

module.exports = Route