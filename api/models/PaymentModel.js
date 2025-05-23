const db = require("../config/db");

class Payments {
  static findAllPaymentType() {
    const sql = "SELECT *FROM tblpayments";
    return db.execute(sql);
  }
}

module.exports = Payments;
