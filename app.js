/*
 * @Descripttion: 项目入口文件
 * @Author: wenshaochang
 * @Date: 2022-06-12 20:18:33
 * @LastEditors: wenshaochang
 * @LastEditTime: 2022-06-12 22:31:56
 */
// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express()

// 导入 cors 中间件
const cors = require('cors')
// 将 cors 注册为全局中间件
app.use(cors())

// 配置解析表单数据的中间件，注意：这个中间件，只能解析 application/x-www-form-urlencoded 格式的表单数据
app.use(
  express.urlencoded({
    extends: false,
  })
)

// 一定要在路由之前，封装 res.cc 函数
// 响应数据的中间件
app.use((req, res, next) => {
  // status = 0 为成功；status  = 1 为失败；默认将 status 的值设置为 1，方便处理失败的情况
  res.cc = (err, status = 1) => {
    res.send({
      status, // 状态
      message: err instanceof Error ? err.message : err, // 状态描述，判断 err 是错误对象还是字符串
    })
  }
  next()
})

// 一定要在路由之前配置 解析 Token 的中间件
const expressJWT = require('express-jwt')
// 导入配置文件
const config = require('./config')
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({
  secret: config.jwtSecretKey
}).unless({
  path: [/^\/api/]
}))

// 导入并注册用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)

// 错误中间件
const joi = require('joi')
app.use((err, req, res, next) => {
  // 数据验证失败
  if (err instanceof joi.ValidationError) {
    return res.cc(err)
  }
  // 捕获身份认证失败的错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
  // 未知错误
  res.cc(err)
})
// write your code here...

// 调用 app.listen 方法，指定端口号并启动 web 服务器
app.listen(3007, function () {
  console.log('Express server running at http://127.0.0.1:3007')
})