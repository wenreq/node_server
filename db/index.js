/*
 * @Descripttion:
 * @Author: wen
 * @Date: 2022-06-12 20:49:24
 * @LastEditors: voanit
 * @LastEditTime: 2022-06-12 21:16:10
 */
// 导入 mysql 模块
const mysql = require('mysql')

// 创建数据库连接对象
const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'admin123',
  database: 'wenv2_db',
})

// 向外共享 db 数据库连接对象
module.exports = db
