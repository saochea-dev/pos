const db = require('../config/db');

class Product {
  constructor(
    category_id,
    brand_id,
    sub_id,
    unit_id,
    product_code,
    product_name,
    qty,
    unit_price,
    price,
    exp_date,
    product_image,
    desc,
    status,
    reorder_number
  ) {
    this.category_id = category_id;
    this.brand_id = brand_id;
    this.sub_id = sub_id;
    this.unit_id = unit_id;
    this.product_code = product_code;
    this.product_name = product_name;
    this.qty = qty;
    this.unit_price = unit_price;
    this.price = price;
    this.exp_date = exp_date;
    this.product_image = product_image;
    this.desc = desc;
    this.status = status;
    this.reorder_number = reorder_number;
  }

  save() {
    const sql =
      'INSERT INTO tblproducts(`category_id`,`brand_id`,`sub_id`,`unit_id`,`product_code`,`product_name`,qty,unit_price,price,exp_date,product_image,`desc`,`status`,reorder_number) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

    return db.execute(sql, [
      this.category_id,
      this.brand_id,
      this.sub_id,
      this.unit_id,
      this.product_code,
      this.product_name,
      this.qty,
      this.unit_price,
      this.price,
      this.exp_date,
      this.product_image,
      this.desc,
      this.status,
      this.reorder_number,
    ]);
  }

  static updateProductById(
    category_id,
    brand_id,
    unit_id,
    sub_id,
    product_code,
    product_name,
    qty,
    unit_price,
    price,
    exp_date,
    product_image,
    desc,
    status,
    reorder_number,
    product_id
  ) {
    const sql =
      'UPDATE tblproducts SET category_id=?,brand_id=?,unit_id=?,sub_id=?,product_code=?,product_name=?,qty=?,unit_price=?,price=?,exp_date=?,product_image=?,`desc`=?,`status`=?,reorder_number=? WHERE product_id=?';
    return db.query(sql, [
      category_id,
      brand_id,
      unit_id,
      sub_id,
      product_code,
      product_name,
      qty,
      unit_price,
      price,
      exp_date,
      product_image,
      desc,
      status,
      reorder_number,
      product_id,
    ]);
  }

  static findImageById(id) {
    const sql = 'SELECT product_image FROM tblproducts WHERE product_id=?';
    return db.execute(sql, [id]);
  }

  static findProductByName(product_name) {
    const sql = 'SELECT product_name FROM tblproducts WHERE product_name = ?';
    return db.execute(sql, [product_name]);
  }

  static findProductCode(product_code) {
    const sql = 'SELECT product_code FROM tblproducts WHERE product_code = ?';
    return db.execute(sql, [product_code]);
  }

  static findAllProduct() {
    const v_sql = `SELECT *FROM getallproducts`;
    return db.execute(v_sql);
  }

  static findDuplicateByName(id, product_name) {
    const sql =
      'SELECT *FROM tblproducts WHERE NOT product_id=? AND product_name=?';
    return db.execute(sql, [id, product_name]);
  }

  static findDuplicateByProductCode(id, product_code) {
    const sql =
      'SELECT *FROM tblproducts WHERE NOT product_id=? AND product_code=?';
    return db.execute(sql, [id, product_code]);
  }

  static deleteById(id) {
    const sql = 'DELETE FROM tblproducts WHERE product_id = ?';
    return db.execute(sql, [id]);
  }

  static deleteImageById(id) {
    const sql = "UPDATE tblproducts SET product_image='images/default.png' WHERE product_id=?";
    return db.execute(sql, [id]);
  }

  static findProductById(id) {
    const sql = 'SELECT *FROM tblproducts WHERE product_id=?';
    return db.execute(sql, [id]);
  }

  static productCard() {
    const sql =
      'SELECT product_id,product_name,price,product_image,qty,product_code,category_id FROM tblproducts WHERE `status` = 1 AND qty>0';
    return db.execute(sql);
  }

  static findProductCardByNameAndCode(search) {
    const sql = `call SP_ProductCard(?)`;
    return db.execute(sql, [search]);
  }

  static findByProcode(procode) {
    const sql =
      'SELECT product_id,product_name,price,product_image,qty,product_code FROM tblproducts WHERE `status` = 1 AND product_code=?';
    return db.execute(sql, [procode]);
  }

  // static productReports() {
  //   const sql = "SELECT *FROM V_ProductReports";
  //   return db.execute(sql);
  // }

  static productReports(limits, page, search) {
    const sql = 'call SP_ProductReports(?,?,?)';
    return db.execute(sql, [limits, page, search]);
  }

  static findProductRportByCategory(limits, page, cat_id, search) {
    const sql = 'CALL SP_ProductReportCategory(?,?,?,?)';
    return db.execute(sql, [limits, page, cat_id, search]);
  }

  static searchProduct(search, limit, page) {
    const sql = 'call SP_SearchProduct(?,?,?)';
    return db.execute(sql, [search, limit, page]);
  }

  static pagination(search) {
    const sql = 'call SP_ProductPagination(?)';
    return db.execute(sql, [search]);
  }

  static RowsProductReports(search) {
    const sql = 'CALL SP_RowsProReports(?)';
    return db.execute(sql, [search]);
  }

  static ReorderMsg() {
    const sql =
      'SELECT * FROM `getallproducts` WHERE (getallproducts.qty<=getallproducts.reorder_number) AND (getallproducts.qty>0)';
    return db.execute(sql);
  }

  static OutOfStockMsg() {
    const sql = 'SELECT * FROM `getallproducts` WHERE getallproducts.qty=0';
    return db.execute(sql);
  }

  static CountItems() {
    const sql = 'CALL SP_ItemCounts()';
    return db.execute(sql);
  }

  static ViewProductById(id) {
    const sql = 'CALL view_product_by_id(?)';
    return db.execute(sql, [id]);
  }

  // stock model
  static stockReport(limit, qty, keyword, page) {
    const sql = 'CALL StockReports(?,?,?,?)';
    return db.execute(sql, [limit, qty, keyword, page]);
  }
  // row stock report
  static rowStockReports(qty, keyword) {
    const sql = 'CALL RowStockReport(?,?)';
    return db.execute(sql, [qty, keyword]);
  }

  static updateImage(path,id){
    const sql = "UPDATE tblproducts SET product_image=? WHERE product_id=?";
    return db.execute(sql,[path,id])
  }

}

module.exports = Product;
