// Packages/Functions Imports
const router = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const DB = require("../utils/databaseFunctions");
const db = new DB();
const HelperFun = require("../helpers/helperFun");
const hf = new HelperFun();
const { TABLE_PREFIX } = require("../config/config");

// POST Routes
router.post("/signin", async (req, res) => {
  try {
    const { USER_NAME, USER_PASS } = req.body;
    const encyptedPass = hf.encryptPass(USER_PASS);
    hf.sendOTPSMS();
    const sql = `SELECT * from ${TABLE_PREFIX}users WHERE USER_NAME = '${USER_NAME}' AND USER_PWD = '${encyptedPass}'`;
    const result = await db.get_one_record_row(sql);
    if (result.length > 0) {
      const myRes = JSON.parse(JSON.stringify(result));
      await updateUserTokenInDB(myRes[0].ID);
      delete myRes[0].USER_PWD;
      return res.json({
        status: "Success",
        message: "Login Successful!",
        userData: myRes[0],
      });
    } else {
      return res.json({
        status: "Failed",
        message: "Login Failed! Try with another password or username.",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      error: "Something went really wrong. Please try again later...",
    });
  }
});

// File Export
module.exports = router;
