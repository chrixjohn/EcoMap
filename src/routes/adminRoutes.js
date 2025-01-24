const express = require("express");
const adminauth = require("../middlewares/adminauth");

const app = express.Router();
const {getExperts,getUsers} = require("../controllers/admin");

app.get("/experts",adminauth,getExperts)
app.get("/users",adminauth,getUsers)

module.exports=app;