const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const {userRoutes,expertRoutes} = require('./routes');
const { logger } = require("./middlewares");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;



app.use(logger);
app.use(express.json());
app.use(cors());  // Middleware to parse JSON request body

app.use('/user', userRoutes);
app.use('/expert', expertRoutes);  // Use user routes under the '/api' path

app.get("/status", (req, res) => {
  res.json({ alive: true });
});

mongoose.connect(mongoURI
  //,{useNewUrlParser: true,
  //useUnifiedTopology: true,}
)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
