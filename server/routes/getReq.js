// Packages/Functions Imports
const router = require("express").Router();
const { connectDB } = require("../utils/databaseConnect");

// GET Routes
router.get("/getCategoriesForAdmin", async (req, res) => {
  try {
    const connection = await connectDB();
    const sql = "SELECT * from daily_categories";
    connection.query(sql, function (err, result) {
      if (err) throw err;
      if (result.length > 0) {
        return res.json({
          status: "Success",
          records: result,
        });
      } else {
        return res.json({
          status: "Success",
          records: [],
        });
      }
    });
  } catch (error) {
    return res.json({
      status: "Failed",
      error: "Something went really wrong. Please try again later...",
    });
  }
});

// File Exports
module.exports = router;
