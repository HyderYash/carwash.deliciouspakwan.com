//? API CALL PREFIX START ?//
const API_PREFIX = "/api";

//* ----------- AUTHENTICATION URIS START ----------- *//
const AUTH_API = "/auth";
const SIGIN_API = `${AUTH_API}/signin`;
const CHECKUSERNAMEINDBANDSENDOTP_API = `${AUTH_API}/checkusernameandsendotp`;
const VERIFYOTP_API = `${AUTH_API}/verifyotp`;
const CHANGEPASSWORD_API = `${AUTH_API}/changepassword`;
const CHECKUSERWITHPASS_API = `${AUTH_API}/checkuserwithpass`;
//* ----------- AUTHENTICATION URIS END ----------- *//

//* ----------- SUPERADMIN URIS START -----------
const SUPERADMIN_API = "/superadmin";
const GETSHOPKEEPERS_API = `${SUPERADMIN_API}/getshopkeepers`;
const ADDSHOPKEEPER_API = `${SUPERADMIN_API}/addshopkeeper`;
const EDITSHOPKEEPER_API = `${SUPERADMIN_API}/editshopkeeper`;
//* ----------- SUPERADMIN URIS END ----------- *//

//? API CALL PREFIX END ?//

//? MYSQL TABLE LIST ?//
const TABLE_PREFIX = "car_";
const USER = `${TABLE_PREFIX}users`;
const SHOPKEEPERS = `${TABLE_PREFIX}shopkeepers`;
//? MYSQL TABLE LIST ?//

//? USER TYPES START ?//
const USER_TYPE_SUPERADMIN = "SA";
//? USER TYPES END ?//

//! ----------- EXPORTING VARIABLES ----------- !//
module.exports = {
  SENDER_EMAIL: process.env.SENDER_EMAIL,
  SENDER_PASS: process.env.SENDER_PASS,
  encrypt_password: process.env.ENCRYPT_PASSWORD,
  encrypt_iv: process.env.ENCRYPT_IV,
  API_PREFIX,
  AUTH_API,
  SIGIN_API,
  CHECKUSERNAMEINDBANDSENDOTP_API,
  VERIFYOTP_API,
  CHANGEPASSWORD_API,
  CHECKUSERWITHPASS_API,
  SUPERADMIN_API,
  GETSHOPKEEPERS_API,
  ADDSHOPKEEPER_API,
  EDITSHOPKEEPER_API,
  USER,
  SHOPKEEPERS,
  USER_TYPE_SUPERADMIN,
};
//! ----------- EXPORTING VARIABLES ----------- !//
