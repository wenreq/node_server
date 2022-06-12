/*
 * @Descripttion:
 * @Author: wen
 * @Date: 2022-06-12 20:31:35
 * @LastEditors: voanit
 * @LastEditTime: 2022-06-12 22:37:35
 */
/**
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */
// 导入数据库操作模块
const db = require('../db/index')
// 导入 bcryptjs 这个包 对密码进行加密
const bcrypt = require('bcryptjs')

// 注册用户的处理函数
exports.register = (req, res) => {
  /**
   * 1. 检测表单数据是否合法
   * 2. 检测用户名是否被占用
   * 3. 对密码进行加密处理
   * 4. 插入新用户
   */
  //  1. 检测表单数据是否合法
  // 接收表单数据
  const userInfo = req.body
  // 判断数据是否合法
  // if (!userInfo.username || !userInfo.password) {
  //   return res.send({ status: 1, message: '用户名或者密码不能为空！' })
  // }
  // 2. 检测用户名是否被占用
  const sql = 'select * from users where username=?'
  db.query(sql, [userInfo.username], (err, results) => {
    // 执行 SQL 语句失败
    if (err) {
      // return res.send({ status: 1, message: err.message })
      return res.cc(err)
    }
    // 用户名被占用
    if (results.length > 0) {
      // return res.send({ status: 1,message: '用户名被占用，请更换其他用户名！', })
      return res.cc('用户名被占用，请更换其他用户名！')
    }
    // 3. 对密码进行加密处理
    // 调用 bcrypt.hashSync() 对密码进行加密
    userInfo.password = bcrypt.hashSync(userInfo.password, 10)
    // 4. 插入新用户
    // 4.1 定义插入新用户的 SQL 语句
    const sql = 'insert into users set ?'
    // 4.2 调用 db.query() 执行 SQL 语句
    db.query(
      sql,
      { username: userInfo.username, password: userInfo.password },
      (err, results) => {
        // 判断 SQL 语句是否执行成功
        // if (err) return res.send({ status: 1, message: err.message })
        if (err) return res.cc(err)
        // 判断影响行数是否为 1
        // if (results.affectedRows !== 1) return res.send({ status: 1, message: '注册用户失败，请稍后再试！' })
        if (results.affectedRows !== 1)
          return res.cc('注册用户失败，请稍后再试！')
        // 注册用户成功
        // res.send({ status: 0, message: '用户注册成功！' })
        res.cc('用户注册成功！', 0)
      }
    )
  })
}

// 登录的处理函数
exports.login = (req, res) => {
  res.send('login OK')
}
