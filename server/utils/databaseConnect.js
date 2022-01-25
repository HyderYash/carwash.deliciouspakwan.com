// Packages/Functions Import
const mysql = require("mysql");
const axios = require("axios");
const crypto = require("crypto");
const config = require("../config/config");

// Functions
const getDBCredentials = async () => {
  try {
    const response = await axios.get(
      "http://local.deliciouspakwan.com/api/activityTracerConnection/returnConnectionElements.php"
    );
    return response.data.records;
  } catch (err) {
    console.log(err);
  }
};

const connectDB = async () => {
  const res = await getDBCredentials();
  const { HOST, USER, PASSWORD, DATABASE } = res[0];
  const connection = mysql.createConnection({
    host: decrypt(config.encrypt_iv, HOST, config.encrypt_password),
    user: decrypt(config.encrypt_iv, USER, config.encrypt_password),
    password: decrypt(config.encrypt_iv, PASSWORD, config.encrypt_password),
    database: decrypt(config.encrypt_iv, DATABASE, config.encrypt_password),
    multipleStatements: true,
  });
  connection.connect(function (err) {
    if (err) throw err;
    console.log(
      "CONNECTED WITH: " +
        connection.config.host +
        ", USER IS: " +
        connection.config.user
    );
  });
  return connection;
};

function decrypt(iv, text, password) {
  var decipher = crypto.createDecipheriv("aes-256-cbc", password, iv);
  var dec = decipher.update(text, "hex", "utf8");
  dec += decipher.final("utf8");
  return dec;
}

// File Export
module.exports = { connectDB };
