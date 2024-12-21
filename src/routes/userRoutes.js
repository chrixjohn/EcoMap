const express = require("express");
const userauth = require("../middlewares/userauth");
const app = express.Router();
const {addNewUser,loginuser,getUserDetails} = require("../controllers/user");

app.post("/register",addNewUser)
app.post("/login",loginuser)
app.get("/get-user",userauth,getUserDetails)



module.exports=app