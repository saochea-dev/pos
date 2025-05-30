const db = require("../config/db");

class Invoice {
  constructor(payment_id, amount, reamin) {
    this.payment_id = payment_id;
    this.amount = amount;
    this.reamin = reamin;
  }

  save() {
    const sql =
      "INSERT INTO tblinvoice(payment_id,amount,money_change) VALUES(?,?,?)";
    return db.execute(sql, [this.payment_id, this.amount, this.reamin]);
  }

  static generateInvoiceNumber(invoice_id) {
    const sql =
      "UPDATE tblinvoice SET invoice_number = CONCAT('PSS',CONCAT(year(now()),MONTH(now()),day(now())),0,invoice_id) WHERE invoice_id = ?";
    return db.query(sql, [invoice_id]);
  }

  static saleInvoice(id) {
    const sql = "CALL SaleInvoice_sp(?)";
    return db.execute(sql, [id]);
  }

  static updateInvoice(id, payment_id, amount, money_change) {
    const sql =
      "UPDATE tblinvoice SET payment_id=?,amount=?,money_change=? WHERE invoice_id = ?";

    return db.query(sql, [payment_id, amount, money_change, id]);
  }
}

module.exports = Invoice;
