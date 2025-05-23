const db = require('../config/db');

class Supplier {
  constructor(supName, companyName, email, phone, address) {
    this.supName = supName;
    this.companyName = companyName;
    this.email = email;
    this.phone = phone;
    this.address = address;
  }

  save() {
    const sql =
      'INSERT INTO tblsupplies(`supName`,`companyName`,`email`,`phone`,`address`) VALUES(?,?,?,?,?)';
    return db.execute(sql, [
      this.supName,
      this.companyName,
      this.email,
      this.phone,
      this.address,
    ]);
  }

  static findAll(limit, page, search) {
    const sql = 'CALL SP_Supplier(?,?,?)';
    return db.execute(sql, [limit, page, search]);
  }

  static findAllRows(search) {
    const sql = 'CALL SP_GetRowSupplier(?)';
    return db.execute(sql, [search]);
  }

  static updateById(supName, companyName, email, phone, address, id) {
    const sql =
      'UPDATE tblsupplies SET `supName`=?,`companyName`=?,`email`=?,`phone`=?,`address`=? WHERE `id` = ?';
    return db.query(sql, [supName, companyName, email, phone, address, id]);
  }

  static deleteById(id) {
    const sql = 'DELETE FROM tblsupplies WHERE id = ?';
    return db.execute(sql, [id]);
  }

  static findByName(supName) {
    const sql = 'SELECT *FROM tblsupplies WHERE supName=?';
    return db.execute(sql, [supName]);
  }

  static updateDuplicate(id, phone) {
    const sql = 'SELECT *FROM tblsupplies WHERE NOT id=? AND phone=?';
    return db.execute(sql, [id, phone]);
  }

  static findById(id) {
    const sql = 'SELECT *FROM tblsupplies WHERE id=?';
    return db.execute(sql, [id]);
  }

  static findByPhoneNumber(phone) {
    const sql = 'SELECT *FROM tblsupplies WHERE phone = ?';
    return db.execute(sql, [phone]);
  }

  static getAllSuppliers() {
    const sql = 'SELECT * FROM tblsupplies';
    return db.execute(sql);
  }
}

module.exports = Supplier;
