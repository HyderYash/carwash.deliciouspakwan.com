// Packages/Functions Imports
const router = require("express").Router();
const DB = require("../utils/databaseFunctions");
const db = new DB();
const HelperFun = require("../helpers/helperFun");
const hf = new HelperFun();
const { TABLE_PREFIX } = require("../config/config");

// POST Routes
router.post("/signin", async (req, res) => {
  try {
  } catch (error) {
    return res.json({
      error: error,
    });
  }
});

// File Export
module.exports = router;
