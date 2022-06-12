const express = require('express')
// 创建路由对象
const router = express.Router()

// 注册新用户
router.post('/register', (req, res) => {
  res.send('register OK')
})

// 登陆
router.post('/login', (req, res) => {
  res.send('login OK')
})

// 将路由对象共享出去
module.exports = router