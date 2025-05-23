const db = require("../config/db");
class Status {
  static findAll() {
    const sql = "SELECT *FROM tblstatus";
    return db.execute(sql);
  }
}

module.exports = Status;
