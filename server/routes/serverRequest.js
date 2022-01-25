//? Packages/Functions Imports START ?//
const router = require("express").Router();
const { connectDB } = require("../utils/databaseConnect");
const DB = require("../utils/databaseFunctions");
const db = new DB();
const HelperFun = require("../helpers/helperFun");
const hf = new HelperFun();
const { v4: uuidv4 } = require("uuid");
const config = require("../config/config");
//? Packages/Functions Imports END ?//

//! AUTHENTICATION APIS START !//
router.post(config.SIGIN_API, async (req, res) => {
  try {
    const { USER_NAME, USER_PASS } = req.body;
    const encyptedPass = hf.encryptPass(USER_PASS);
    // Check User is SuperAdmin
    let sql;
    const isUserSuperAdmin = await hf.checkUserIsSuperAdmin(USER_NAME);
    if (isUserSuperAdmin) {
      sql = `SELECT * from ${config.USER} WHERE USER_NAME = '${USER_NAME}' AND USER_PWD = '${encyptedPass}'`;
    } else {
      sql = `SELECT * from ${config.SHOPKEEPERS} WHERE SK_USER_NAME = '${USER_NAME}' AND SK_PWD = '${encyptedPass}'`;
    }
    const result = await db.get_one_record_row(sql);
    console.log(result);
    if (result.length > 0) {
      const myRes = JSON.parse(JSON.stringify(result));
      if (myRes[0].USER_STATUS === "Y") {
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
          message: "Login Failed! Your account is inactive...",
        });
      }
    } else {
      return res.json({
        status: "Failed",
        message: "Login Failed! Try with another password or username.",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      error: error,
    });
  }
});
router.post(config.CHECKUSERNAMEINDBANDSENDOTP_API, async (req, res) => {
  const { USER_NAME } = req.body;
  let sql;
  let tableName;
  const isUserSuperAdmin = await hf.checkUserIsSuperAdmin(USER_NAME);
  if (isUserSuperAdmin) {
    sql = `SELECT * from ${config.USER} WHERE USER_NAME = '${USER_NAME}'`;
    tableName = config.USER;
  } else {
    sql = `SELECT * from ${config.SHOPKEEPERS} WHERE SK_USER_NAME = '${USER_NAME}'`;
    tableName = config.SHOPKEEPERS;
  }
  const result = await db.get_one_record_row(sql);
  if (result.length > 0) {
    const myRes = JSON.parse(JSON.stringify(result));
    const randOTP = hf.generateRand6DigitNum();
    if (isUserSuperAdmin) {
      hf.sendOTPToUser(myRes[0].USER_EMAIL, randOTP);
    } else {
      hf.sendOTPToUser(myRes[0].SK_EMAIL, randOTP);
    }
    var add10Min = new Date();
    add10Min.setMinutes(add10Min.getMinutes() + 10);
    const fieldValPair = [
      {
        USER_OTP: randOTP,
      },
      { USER_OTP_EXPIRE: hf.convertJSDatetimeToMYSQLDatetime(add10Min) },
    ];
    await db.set_multiple_fields(
      tableName,
      fieldValPair,
      `ID = ${myRes[0].ID}`
    );
    return res.json({
      status: "Success",
      message: "User exists in our Database",
      userID: myRes[0].ID,
    });
  } else {
    return res.json({
      status: "Failed",
      message:
        "User does not exist in our Database. Try again with another username...",
    });
  }
});
router.post(config.VERIFYOTP_API, async (req, res) => {
  const { USER_ID, USER_OTP, USER_NAME } = req.body;
  let sql;
  const isUserSuperAdmin = await hf.checkUserIsSuperAdmin(USER_NAME);
  if (isUserSuperAdmin) {
    sql = `SELECT * from ${config.USER} WHERE ID = ${USER_ID}`;
  } else {
    sql = `SELECT * from ${config.SHOPKEEPERS} WHERE ID = ${USER_ID}`;
  }
  const result = await db.get_one_record_row(sql);
  const myRes = JSON.parse(JSON.stringify(result));
  if (parseInt(myRes[0].USER_OTP) === parseInt(USER_OTP)) {
    if (hf.dateInPast(new Date(myRes[0].USER_OTP_EXPIRE))) {
      return res.json({
        status: "Success",
        message: "You can change your password now!",
      });
    } else {
      return res.json({
        status: "Failed",
        message: "The OTP you have entered is expired...",
      });
    }
  } else {
    return res.json({
      status: "Failed",
      message: "The OTP you have entered is not valid...",
    });
  }
});
router.post(config.CHANGEPASSWORD_API, async (req, res) => {
  const { USER_ID, USER_PASS, USER_NAME } = req.body;
  const encryptedPass = hf.encryptPass(USER_PASS);
  const isUserSuperAdmin = await hf.checkUserIsSuperAdmin(USER_NAME);
  let tableName;
  let fieldValPair;
  if (isUserSuperAdmin) {
    fieldValPair = [{ USER_PWD: encryptedPass }];
    tableName = config.USER;
  } else {
    fieldValPair = [{ SK_PWD: encryptedPass }];
    tableName = config.SHOPKEEPERS;
  }
  console.log(fieldValPair);
  console.log(tableName);
  console.log(`ID = ${USER_ID}`);
  console.log(isUserSuperAdmin);
  const result = await db.set_multiple_fields(
    tableName,
    fieldValPair,
    `ID = ${USER_ID}`
  );
  if (result) {
    return res.json({
      status: "Success",
      message: "Your password has been changed successfuly...",
    });
  } else {
    return res.json({
      status: "Failed",
      message: "Failed to change your password...",
    });
  }
});
router.post(config.CHECKUSERWITHPASS_API, async (req, res) => {
  try {
    const { PREV_PASS, USER_NAME } = req.body;
    const encyptedPass = hf.encryptPass(PREV_PASS);
    let sql;
    const isUserSuperAdmin = await hf.checkUserIsSuperAdmin(USER_NAME);
    if (isUserSuperAdmin) {
      sql = `SELECT * from ${config.USER} WHERE USER_NAME = '${USER_NAME}' AND USER_PWD = '${encyptedPass}'`;
    } else {
      sql = `SELECT * from ${config.SHOPKEEPERS} WHERE SK_USER_NAME = '${USER_NAME}' AND SK_PWD = '${encyptedPass}'`;
    }
    console.log(sql);
    const result = await db.get_one_record_row(sql);
    const myRes = JSON.parse(JSON.stringify(result));
    console.log(myRes);
    if (result.length > 0) {
      return res.json({
        status: "Success",
        message: "Go Ahead!",
        userId: myRes[0].ID,
      });
    } else {
      return res.json({
        status: "Failed",
        message:
          "Your account does not use this password. Try again with another password...",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      error: "Something went really wrong. Please try again later...",
      msg: error,
    });
  }
});
//! AUTHENTICATION APIS END !//

//! SUPER ADMIN APIS START !//
router.post(config.GETSHOPKEEPERS_API, async (req, res) => {
  try {
    const { USER_TYPE } = req.body;
    if (USER_TYPE !== config.USER_TYPE_SUPERADMIN) {
      return res.json({
        status: "Failed",
        message: "You are not authorized to perform this action!",
      });
    } else {
      const sql = `SELECT ID, SK_USER_NAME, SK_DISPLAY_NAME, SK_EMAIL, SK_PHONE, USER_STATUS, SK_ADDRESS, SK_CITY, SK_STATE, SK_COUNTRY, SK_PINCODE from ${config.SHOPKEEPERS} ORDER BY SK_CREATED DESC`;
      const result = await db.get_multiple_tables_records(sql);

      if (result.length > 0) {
        return res.json({
          status: "Success",
          message: "Shopkeepers fetched successfully!",
          records: result,
        });
      } else {
        return res.json({
          status: "Success",
          message: "No shopkeepers found!",
          records: [],
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      status: "Failed",
      error: error,
    });
  }
});
router.post(config.ADDSHOPKEEPER_API, async (req, res) => {
  try {
    const {
      SK_USER_NAME,
      SK_DISPLAY_NAME,
      SK_EMAIL,
      SK_PHONE,
      SK_ADDRESS,
      SK_CITY,
      SK_STATE,
      SK_COUNTRY,
      SK_PINCODE,
      USER_STATUS,
    } = req.body;
    const genPass = hf.generatePassword(8);
    const SK_PWD = hf.encryptPass(genPass);
    const fieldValPair = [
      { SK_USER_NAME },
      { SK_DISPLAY_NAME },
      { SK_PWD },
      { SK_EMAIL },
      { SK_PHONE },
      { USER_TOKEN: uuidv4() },
      { USER_OTP: "0" },
      { USER_OTP_EXPIRE: "" },
      { USER_LAST_LOGGED: hf.convertJSDatetimeToMYSQLDatetime(new Date()) },
      { USER_STATUS },
      { SK_ADDRESS },
      { SK_CITY },
      { SK_STATE },
      { SK_COUNTRY },
      { SK_PINCODE },
      { SK_CREATED: hf.convertJSDatetimeToMYSQLDatetime(new Date()) },
      { USER_TYPE: "A" },
    ];
    const result = await db.insert_records_with_array(
      "car_shopkeepers",
      fieldValPair
    );
    if (result) {
      const shopkeeper = {
        SK_USER_NAME,
        SK_DISPLAY_NAME,
        SK_EMAIL,
        SK_PHONE,
        SK_PWD: genPass,
      };
      await hf.sendShopKeeperRegistrationMail(shopkeeper);
      return res.json({
        status: "Success",
        message: "Shopkeeper added successfully!",
        shopkeeper,
      });
    } else {
      return res.json({
        status: "Failed",
        message: "Failed to add shopkeeper...",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      error: error,
    });
  }
});
router.post(config.EDITSHOPKEEPER_API, async (req, res) => {
  try {
    const {
      ID,
      SK_USER_NAME,
      SK_DISPLAY_NAME,
      SK_EMAIL,
      SK_PHONE,
      SK_ADDRESS,
      SK_CITY,
      SK_STATE,
      SK_COUNTRY,
      SK_PINCODE,
      USER_STATUS,
    } = req.body;
    const fieldValPair = [
      { SK_USER_NAME },
      { SK_DISPLAY_NAME },
      { SK_EMAIL },
      { SK_PHONE },
      { USER_STATUS },
      { SK_ADDRESS },
      { SK_CITY },
      { SK_STATE },
      { SK_COUNTRY },
      { SK_PINCODE },
    ];
    const result = await db.set_multiple_fields(
      "car_shopkeepers",
      fieldValPair,
      `ID = ${ID}`
    );
    if (result) {
      return res.json({
        status: "Success",
        message: "Shopkeeper edited successfully!",
      });
    } else {
      return res.json({
        status: "Failed",
        message: "Failed to edit shopkeeper...",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      error: error,
    });
  }
});
//! SUPER ADMIN APIS END !//

router.post("/getcredentialsandsendtemppass", async (req, res) => {
  const connection = await connectDB();
  const { USER_NAME, USER_EMAIL, DISPLAY_NAME } = req.body;
  const tempUserPass = hf.generateRandomString(8);
  const encyptedPass = hf.encryptPass(tempUserPass);
  var sql = `SELECT COUNT(ID) AS cnt from daily_users WHERE USER_NAME = '${USER_NAME}'`;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    const myRes = JSON.parse(JSON.stringify(result));
    if (myRes[0].cnt > 0) {
      return res.json({
        status: "Failed",
        message: "User already exists... Try with another username",
      });
    } else {
      sendTemporaryPassToUser(USER_EMAIL, tempUserPass);
      const uData = {
        USER_NAME: USER_NAME,
        USER_EMAIL: USER_EMAIL,
        USER_PWD: encyptedPass,
        USER_DISPLAY_NAME: DISPLAY_NAME,
      };
      return res.json({
        status: "Success",
        message:
          "A temporary password has been sent to your email. Please use the temporary password to complete the procedure.",
        userData: uData,
      });
    }
  });
});

router.post("/checkusernameandsendotp", async (req, res) => {
  const connection = await connectDB();
  const { USER_NAME } = req.body;
  var sql = `SELECT * from daily_users WHERE USER_NAME = '${USER_NAME}'`;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    if (result.length > 0) {
      const myRes = JSON.parse(JSON.stringify(result));
      const randOTP = hf.generateRand6DigitNum();
      sendOTPToUser(myRes[0].USER_EMAIL, randOTP);
      var add10Min = new Date();
      add10Min.setMinutes(add10Min.getMinutes() + 10);
      var sql = `UPDATE daily_users SET USER_OTP = ${randOTP}, USER_OTP_EXPIRE = ${connection.escape(
        add10Min
      )} WHERE ID = ${myRes[0].ID}`;
      connection.query(sql, function (err, response) {
        if (err) throw err;
        return res.json({
          status: "Success",
          message: "User exists in our Database",
          userID: myRes[0].ID,
        });
      });
    } else {
      return res.json({
        status: "Failed",
        message:
          "User does not exist in our Database. Try again with another username...",
      });
    }
  });
});

router.post("/checkpasswordofuser", async (req, res) => {
  try {
    const connection = await connectDB();
    const { USER_FE_PASS, USER_NAME, USER_EMAIL, USER_PWD, USER_DISPLAY_NAME } =
      req.body;
    const encyptedFEPass = hf.encryptPass(USER_FE_PASS);
    if (USER_PWD !== encyptedFEPass) {
      return res.json({
        status: "Failed",
        message:
          "The password sent to your email does not match. Please try again...",
      });
    } else {
      const sql = `INSERT INTO daily_users (USER_NAME, DISPLAY_NAME, USER_EMAIL, USER_PWD, USER_TOKEN, USER_OTP, USER_OTP_EXPIRE, USER_LAST_LOGGED, USER_TYPE, USER_STATUS) VALUES ('${USER_NAME}', '${USER_DISPLAY_NAME}', '${USER_EMAIL}', '${encyptedFEPass}', '${uuidv4()}', 0, '', ${connection.escape(
        new Date()
      )}, 'U', 'Y')`;
      connection.query(sql, async function (err, result) {
        if (err) throw err;
        return res.json({
          status: "Success",
          message:
            "User created successfully. Please login with your username and password.",
        });
      });
    }
  } catch (error) {
    return res.json({
      error: "Something went really wrong. Please try again later...",
    });
  }
});

router.post("/checkuserwiththispass", async (req, res) => {
  try {
    const connection = await connectDB();
    const { PREV_PASS, USER_NAME } = req.body;
    const encyptedPass = hf.encryptPass(PREV_PASS);
    var sql = `SELECT * from daily_users WHERE USER_NAME = '${USER_NAME}' AND USER_PWD = '${encyptedPass}'`;
    connection.query(sql, async function (err, result) {
      if (err) throw err;
      const myRes = JSON.parse(JSON.stringify(result));
      if (result.length > 0) {
        return res.json({
          status: "Success",
          message: "Go Ahead!",
          userId: myRes[0].ID,
        });
      } else {
        return res.json({
          status: "Failed",
          message:
            "Your account does not use this password. Try again with another password...",
        });
      }
    });
  } catch (error) {
    return res.json({
      error: "Something went really wrong. Please try again later...",
      msg: error,
    });
  }
});

router.post("/getUserData", async (req, res) => {
  const connection = await connectDB();
  const { USER_ID } = req.body;
  const sql = `SELECT * from at_users WHERE ID = '${USER_ID}'`;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    if (result.length > 0) {
      return res.json({
        status: "Success",
        records: result,
      });
    } else {
      return res.json({
        status: "Failed",
        records: [],
      });
    }
  });
});

router.post("/addCategory", async (req, res) => {
  try {
    const connection = await connectDB();
    const { CAT_NAME, CAT_DESC, CAT_STATUS } = req.body;
    const sql = `INSERT INTO daily_categories (CAT_NAME, CAT_DESC, CAT_STATUS) VALUES ('${CAT_NAME}', '${CAT_DESC}', '${CAT_STATUS}')`;
    connection.query(sql, async function (err, result) {
      if (err) throw err;
      return res.json({
        status: "Success",
        message: "Category added successfully...",
      });
    });
  } catch (error) {
    return res.json({
      error: "Something went really wrong. Please try again later...",
    });
  }
});

router.post("/editCategory", async (req, res) => {
  const connection = await connectDB();
  const { CAT_NAME, CAT_DESC, CAT_STATUS, ID } = req.body;
  const sql = `UPDATE daily_categories SET CAT_NAME = '${CAT_NAME}', CAT_DESC = '${CAT_DESC}',CAT_STATUS = '${CAT_STATUS}' WHERE ID = ${ID}`;
  console.log(sql);
  connection.query(sql, function (err, result) {
    if (result) {
      return res.json({
        status: "Success",
        message: "Category updated successfully...",
      });
    } else {
      return res.json({
        status: "Failed",
        message: "Failed to update cateogry...",
      });
    }
  });
});
router.post("/deleteCategory", async (req, res) => {
  const connection = await connectDB();
  const { ID } = req.body;
  const sql = `DELETE FROM daily_categories WHERE ID = ${ID}`;
  console.log(sql);
  connection.query(sql, function (err, result) {
    if (result) {
      return res.json({
        status: "Success",
        message: "Category deleted successfully...",
      });
    } else {
      return res.json({
        status: "Failed",
        message: "Failed to deleted Category...",
      });
    }
  });
});

router.post("/getSubCategoriesForAdmin", async (req, res) => {
  const connection = await connectDB();
  const { CAT_ID } = req.body;
  const sql = `
    SELECT ds.* FROM daily_subcategories as ds, daily_categories as c 
    WHERE ds.CAT_ID = c.ID AND c.ID = ${CAT_ID}
    ORDER BY ds.ID
  `;
  connection.query(sql, async function (err, result) {
    if (result) {
      getCategoryName(CAT_ID).then((catName) => {
        if (result.length > 0) {
          return res.json({
            status: "Success",
            records: result,
            CAT_NAME: catName,
          });
        } else {
          return res.json({
            status: "Success",
            records: [],
            CAT_NAME: catName,
          });
        }
      });
    } else {
      return res.json({
        status: "Failed",
        message: "Something went wrong...",
      });
    }
  });
});

router.post("/addSubCategory", async (req, res) => {
  try {
    const connection = await connectDB();
    const { SUB_CAT_NAME, SUB_CAT_DESC, SUB_CAT_STATUS, CAT_ID } = req.body;
    const sql = `INSERT INTO daily_subcategories (CAT_ID, SUB_CAT_NAME, SUB_CAT_DESC, SUB_CAT_STATUS) VALUES (${CAT_ID},'${SUB_CAT_NAME}', '${SUB_CAT_DESC}', '${SUB_CAT_STATUS}')`;
    connection.query(sql, async function (err, result) {
      if (err) throw err;
      return res.json({
        status: "Success",
        message: "Sub Category added successfully...",
      });
    });
  } catch (error) {
    return res.json({
      error: "Something went really wrong. Please try again later...",
    });
  }
});

router.post("/editSubCategory", async (req, res) => {
  const connection = await connectDB();
  const { SUB_CAT_NAME, SUB_CAT_DESC, SUB_CAT_STATUS, ID } = req.body;
  const sql = `UPDATE daily_subcategories SET SUB_CAT_NAME = '${SUB_CAT_NAME}', SUB_CAT_DESC = '${SUB_CAT_DESC}',SUB_CAT_STATUS = '${SUB_CAT_STATUS}' WHERE ID = ${ID}`;
  console.log(sql);
  connection.query(sql, function (err, result) {
    if (result) {
      return res.json({
        status: "Success",
        message: "Sub Category updated successfully...",
      });
    } else {
      return res.json({
        status: "Failed",
        message: "Failed to update sub cateogry...",
      });
    }
  });
});

router.post("/deleteSubCategory", async (req, res) => {
  const connection = await connectDB();
  const { ID } = req.body;
  const sql = `DELETE FROM daily_subcategories WHERE ID = ${ID}`;
  console.log(sql);
  connection.query(sql, function (err, result) {
    if (result) {
      return res.json({
        status: "Success",
        message: "Sub Category deleted successfully...",
      });
    } else {
      return res.json({
        status: "Failed",
        message: "Failed to deleted Sub Category...",
      });
    }
  });
});

router.post("/verifyotp", async (req, res) => {
  const connection = await connectDB();
  const { USER_ID, USER_OTP } = req.body;
  const sql = `SELECT * from daily_users WHERE ID = '${USER_ID}'`;
  connection.query(sql, function (err, result) {
    const myRes = JSON.parse(JSON.stringify(result));
    if (err) throw err;
    if (myRes[0].USER_OTP === parseInt(USER_OTP)) {
      if (dateInPast(new Date(myRes[0].USER_OTP_EXPIRE))) {
        return res.json({
          status: "Success",
          message: "You can change your password now!",
        });
      } else {
        return res.json({
          status: "Failed",
          message: "The OTP you have entered is expired...",
        });
      }
    } else {
      return res.json({
        status: "Failed",
        message: "The OTP you have entered is not valid...",
      });
    }
  });
});

router.post("/changepassword", async (req, res) => {
  const connection = await connectDB();
  const { USER_ID, USER_PASS } = req.body;
  const encryptedPass = hf.encryptPass(USER_PASS);
  const sql = `UPDATE daily_users SET USER_PWD = '${encryptedPass}' WHERE ID = ${USER_ID}`;
  connection.query(sql, function (err, result) {
    if (result) {
      return res.json({
        status: "Success",
        message: "Your password has been changed successfuly...",
      });
    } else {
      return res.json({
        status: "Failed",
        message: "Failed to change your password...",
      });
    }
  });
});

router.post("/getCategoriesSubscription", async (req, res) => {
  const connection = await connectDB();
  const { USER_ID } = req.body;
  const sql = `SELECT c.CAT_NAME, dc.* FROM daily_categories as c, daily_categories_user_subscribe as dc WHERE c.ID = dc.CAT_ID AND dc.USER_ID = ${USER_ID} AND c.CAT_STATUS = 'Y' AND dc.SUBS_STATUS = 'Y'`;
  connection.query(sql, function (err, result) {
    console.log(result);
    if (result) {
      return res.json({
        status: "Success",
        records: result,
      });
    } else {
      return res.json({
        status: "Failed",
        records: [],
      });
    }
  });
});

router.post("/getAvailableSubscriptions", async (req, res) => {
  const connection = await connectDB();
  const { USER_ID } = req.body;
  const sql = `SELECT ID, CAT_NAME, CAT_DESC FROM daily_categories WHERE ID NOT IN (
		SELECT CAT_ID 
				 FROM daily_categories_user_subscribe 
				 WHERE USER_ID = ${USER_ID} 
				 AND SUBS_STATUS = 'Y' 
		) AND CAT_STATUS = 'Y'`;
  connection.query(sql, function (err, result) {
    if (result) {
      return res.json({
        status: "Success",
        records: result,
      });
    } else {
      return res.json({
        status: "Failed",
        records: [],
      });
    }
  });
});

router.post("/getCatHourStatsOfUser", async (req, res) => {
  try {
    const connection = await connectDB();
    const { USER_ID } = req.body;
    const sql = `SELECT SUM(CAT_HOURS) as SUMED_CAT_HOURS, CAT_ID FROM daily_categories_user_subscribe WHERE USER_ID = ${USER_ID} AND SUBS_STATUS = 'Y'`;
    connection.query(sql, async function (err, result) {
      const myRes = JSON.parse(JSON.stringify(result));
      if (err) throw err;
      return res.json({
        status: "Success",
        totalCatHours: myRes[0].SUMED_CAT_HOURS,
      });
    });
  } catch (error) {
    return res.json({
      error: "Something went really wrong. Please try again later...",
    });
  }
});

router.post("/subscribeUserToCategory", async (req, res) => {
  try {
    const connection = await connectDB();
    const { USER_ID, CAT_ID, CAT_HOURS } = req.body;
    const sql = `INSERT INTO daily_categories_user_subscribe (CAT_ID, CAT_HOURS, USER_ID, SUBS_STATUS, SUBS_DATE) VALUES (${CAT_ID}, ${CAT_HOURS}, ${USER_ID}, 'Y', ${connection.escape(
      new Date()
    )})`;
    console.log(sql);
    connection.query(sql, async function (err, result) {
      if (err) throw err;
      return res.json({
        status: "Success",
        message: "Subscribed to category successfully...",
      });
    });
  } catch (error) {
    return res.json({
      error: "Something went really wrong. Please try again later...",
    });
  }
});

//* Helper Functions with DB Interactions START *//
const getCategoryName = async (catId) => {
  const connection = await connectDB();
  return new Promise((resolve, reject) => {
    const sql = `SELECT CAT_NAME from daily_categories WHERE ID = ${catId}`;
    connection.query(sql, function (err, result) {
      const myRes = JSON.parse(JSON.stringify(result));
      if (err) reject(err);
      resolve(myRes[0].CAT_NAME);
    });
  });
};

const updateUserTokenInDB = async (USER_ID) => {
  try {
    const fieldValuePair = [{ USER_TOKEN: uuidv4() }];
    const result = await db.set_multiple_fields(
      config.USER,
      fieldValuePair,
      `ID = ${USER_ID}`
    );
    if (result) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};

//* Helper Functions with DB Interactions END *//

// File Export
module.exports = router;
