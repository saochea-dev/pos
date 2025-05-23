const db = require('../config/db');

class Chart {
  static daysChartData() {
    const sql = 'SELECT *FROM v_chartdayreports';
    return db.execute(sql);
  }
}

module.exports = Chart;
