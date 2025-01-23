const express = require("express");
const adminauth = require("../middlewares/adminauth");

const app = express.Router();
const {getExperts,getUsers} = require("../controllers/admin");

app.get("/experts",getExperts)
app.get("/users",getUsers)

module.exports=app;