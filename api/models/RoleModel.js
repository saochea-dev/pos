const db = require("../config/db");

class UserRole {
  static findAllRole() {
    const sql = "SELECT *FROM tblroles";
    return db.execute(sql);
  }
}

module.exports = UserRole;
