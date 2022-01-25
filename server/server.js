const express = require("express");
require("dotenv").config();
var cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const config = require("./config/config");

// Routes
app.use(config.API_PREFIX, require("./routes/serverRequest"));

app.listen(PORT, (err) => {
  console.log(`Server is listening on port ${PORT}`);
  if (err) {
    throw new Error("Something went wrong...");
  }
});
