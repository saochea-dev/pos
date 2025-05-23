const db = require('../config/db');

class Category {
  constructor(categoryName, desc, photo) {
    this.categoryName = categoryName;
    this.desc = desc;
  }

  save() {
    const sql = 'INSERT INTO tblcategories(`categoryName`,`desc`) VALUES(?,?)';
    return db.execute(sql, [this.categoryName, this.desc]);
  }

  static updateById(categoryName, desc, id) {
    const sql =
      'UPDATE tblcategories SET `categoryName`=?,`desc`=? WHERE `id` = ?';
    return db.query(sql, [categoryName, desc, id]);
  }

  static deleteById(id) {
    const sql = 'DELETE FROM tblcategories WHERE id = ?';
    return db.execute(sql, [id]);
  }

  static findById(id) {
    const sql = 'SELECT *FROM tblcategories WHERE id=?';
    return db.execute(sql, [id]);
  }

  static findByName(catName) {
    const sql = 'SELECT *FROM tblcategories WHERE categoryName=?';
    return db.execute(sql, [catName]);
  }

  static updateDuplicate(id, catName) {
    const sql = 'SELECT *FROM tblcategories WHERE NOT id=? AND categoryName=?';
    return db.execute(sql, [id, catName]);
  }

  static findAll(limit, page, keyword) {
    const sql = 'CALL SP_Category(?,?,?)';
    return db.execute(sql, [limit, page, keyword]);
  }

  static getRows(search) {
    const sql = 'CALL SP_GetRowsCategory(?)';
    return db.execute(sql, [search]);
  }

  static CategoryProducts(id) {
    const sql = 'CALL CategoryProducts(?)';
    return db.execute(sql, [id]);
  }

  static getAllCategories() {
    const sql = 'SELECT * FROM tblcategories';
    return db.execute(sql);
  }
}

module.exports = Category;
