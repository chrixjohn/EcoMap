const express = require("express");
const userauth = require("../middlewares/expertauth");
const app = express.Router();
const {addNewExpert,loginexpert,getExpertDetails} = require("../controllers/expert");
const expertauth = require("../middlewares/expertauth");

app.post("/register",addNewExpert)
app.post("/login",loginexpert)
app.get("/get-user",expertauth,getExpertDetails)



module.exports=app;