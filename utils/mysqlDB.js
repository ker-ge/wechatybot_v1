const mysql = require('mysql');

module.exports = {
  connection: null,
  host: null,
  user: null,
  password: null,
  database: null,

  async connect({ host, user, password, database }) {
    // 相同数据库服务器不再重复连接
    if (this.connection && this.host === host && this.user === user && this.password === password) {
      // console.log('相同数据库服务器不再重复连接');
      return this;
    }
    this.connection = await new Promise((resolve, reject) => {
      const conn = mysql.createConnection({ host, user, password, database });
      conn.connect(err => {
        if (err) {
          console.log(`数据库连接失败: ` + err.message);
          return reject();
        }
        [this.host, this.user, this.password, this.database] = [host, user, password, database];
        return resolve(conn);
      })
    })
    return this;
  },

  end() {
    if (this.connection) {
      this.connection.end();
      this.connection = null;
      this.host = null;
      this.user = null;
      this.password = null;
      this.database = null;
    }
  },

  query(sql) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, (error, results, fields) => {
        if (error) return reject(error);
        return resolve(JSON.parse(JSON.stringify(results)));
      })
    })
  },

  insert(sql, params) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, params, (error, results, fields) => {
        if (error) return reject(error);
        return resolve(JSON.parse(JSON.stringify(results)));
      })
    })
  },

  beginTransaction() {
    return new Promise((resolve, reject) => {
      this.connection.beginTransaction(error => {
        if (error) return reject(error);
        return resolve(true);
      })
    })
  },

  commit() {
    return new Promise((resolve, reject) => {
      this.connection.commit(error => {
        if (error) return reject(error);
        return resolve(true);
      })
    })
  },

  rollback() {
    return new Promise((resolve, reject) => {
      this.connection.rollback(error => {
        if (error) return reject(error);
        return resolve(true);
      })
    })
  },

}

// // 使用案例
// const mysqlDB = require("./mysqlDB"); //引入数据库封装模块
// const connection = await mysqlDB.connect({host, user, password}); // 开启连接
// try {
//   let sql = '';
//   await connection.query(sql);
// } catch (error) {
//   console.log(error);
// } finally {
//   connection.end(); // 关闭连接
// }