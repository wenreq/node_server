/*
 * @Descripttion:  用户路由处理函数模块
 * @Author: wen
 * @Date: 2022-06-12 20:31:35
 * @LastEditors: wen
 * @LastEditTime: 2022-06-12 22:37:35
 */
/**
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */
// 导入数据库操作模块
const db = require('../db/index')
// 导入 bcryptjs 这个包 对密码进行加密
const bcrypt = require('bcryptjs')
// 用这个包来生成 Token 字符串
const jwt = require('jsonwebtoken')
// 导入配置文件
const config = require('../config')

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
      sql, {
        username: userInfo.username,
        password: userInfo.password
      },
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
  /**
   * 1. 检测表单数据是否合法
   * 2. 根据用户名查询用户的数据
   * 3. 判断用户输入的密码是否正确
   * 4. 生成 JWT 的 Token 字符串
   */
  // 2. 根据用户名查询用户的数据
  // 2.1 接收表单数据
  const userInfo = req.body
  // 2.2 定义 SQL 语句
  const sql = 'select * from users where username=?'
  // 2.3 执行 SQL 语句，查询当前用户的数据
  db.query(sql, userInfo.username, (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)
    // 执行 SQL 语句成功，但是查询到数据条数不等于 1
    if (results.length !== 1) return res.cc('登陆失败')
    // 3. 判断用户输入的登陆密码是否和数据库中的密码一致
    // 核心实现思路：调用 bcrypt.compareSync(用户提交的密码, 数据库中的密码) 方法比较密码是否一致。返回值是布尔值（true 一致、false 不一致）
    const compareResult = bcrypt.compareSync(userInfo.password, results[0].password)
    // 如果对比的结果等于 false，则证明用户输入的密码错误
    if (!compareResult) {
      return res.cc('登陆失败！')
    }
    // 4. 登陆成功，生成 JWT 的 Token 字符串
    // 核心注意点：在生成 Token 字符串的时候，一定要剔除密码和头像的值
    // 4.1 通过 ES6 的高级语法，快速剔除 密码 和 头像的值：
    const user = {
      ...results[0],
      password: '',
      user_pic: ''
    }
    // 4.2 安装生成 Token 字符串的包 npm i jsonwebtoken@8.5.1
    // 4.3 在 /router_handler/user.js 模块的头部区域，导入 jsonwebtoken 包
    // 4.4 创建 config.js 文件， 并向外共享 加密 和 还原 Token 的 jwtSecretKey 字符串
    // 4.5 将用户信息对象加密成 Token 字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: config.expiresIn
    })
    // 4.6 将生成的 Token 字符串响应给客户端
    res.send({
      status: 0,
      message: '登陆成功！',
      token: 'Bearer ' + tokenStr, // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
    })
  })
}