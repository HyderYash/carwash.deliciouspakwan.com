// Packages/Functions Import
const { connectDB } = require("./databaseConnect");

class DB {
  get_multiple_tables_records = (sql) => {
    return new Promise(async (resolve, reject) => {
      const res = await this.get_sql_exec(sql);
      resolve(res);
    });
  };

  get_one_record_row = (sql) => {
    return new Promise(async (resolve, reject) => {
      const res = await this.get_sql_exec(sql);
      resolve(res);
    });
  };

  set_multiple_fields = (table_name, newfieldvaluepair, where = "") => {
    return new Promise(async (resolve, reject) => {
      console.log(newfieldvaluepair);
      let condition;
      if (where) {
        condition = `WHERE ${where} `;
      } else {
        condition = "";
      }
      let setStr = "";
      newfieldvaluepair.forEach((item, index) => {
        setStr += `${Object.keys(item)} = '${item[Object.keys(item)]}', `;
      });
      let resolveSetStr = setStr.replace(/,(?=\s*$)/, "");
      const sql = `UPDATE ${table_name} SET ${resolveSetStr} ${condition}`;
      const res = await this.get_sql_exec(sql);
      resolve(res);
    });
  };
  insert_records_with_array = (table_name, fieldvaluearray) => {
    return new Promise(async (resolve, reject) => {
      let setStr = "";
      fieldvaluearray.forEach((item, index) => {
        setStr += `${Object.keys(item)} = '${item[Object.keys(item)]}', `;
      });
      const sql = `INSERT INTO ${table_name} SET ${setStr} `;
      let resolveSql = sql.replace(/,(?=\s*$)/, "");
      const res = await this.get_sql_exec(resolveSql);
      resolve(res);
    });
  };

  get_sql_exec = (sql_query) => {
    return new Promise(async (resolve, reject) => {
      const connection = await connectDB();
      connection.query(sql_query, async function (err, result) {
        if (err) reject(err + " SQL QUERY: " + sql_query);
        resolve(result);
      });
    });
  };
}

// File Export
module.exports = DB;
