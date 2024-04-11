const express = require("express");
const sessionRouter = express.Router();
const uniqid = require('uniqid');
//  Add New User 

sessionRouter.get("/new", async (req, res) => {
    try {
        let sessionid = uniqid('session-')
        res.json({ status: "success", sessionid:sessionid });
    } catch (error) {
        res.status(400).send({ msg: error.message });
    }
});


module.exports = {
    sessionRouter,
};