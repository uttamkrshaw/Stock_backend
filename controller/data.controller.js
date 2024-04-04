const Router = require("express").Router()


Router
    .route("/data")
    .get(async (req, res) => {
        const data1 = [];
        const data2 = [];
        for (let index = 0; index < 10; index++) {
            let x = Math.floor(Math.random()*100)+20;
            let y = Math.floor(Math.random()*100)+20;
            data1.push(x)
            data2.push(y)
        }
        //console.log("Data1",data1);
        //console.log("Data2",data2);
        return res.json({ status: "success", msg: "Routes Are Working Successfully!",data1,data2 })
    })

module.exports = Router