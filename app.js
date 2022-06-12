// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express()

// 导入 cors 中间件
const cors = require('cors')
// 将 cors 注册为全局中间件
app.use(cors())

// 配置解析表单数据的中间件，注意：这个中间件，只能解析 application/x-www-form-urlencoded 格式的表单数据
app.use(express.urlencoded({
  extends: false
}))

// 导入并注册用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)

// write your code here...

// 调用 app.listen 方法，指定端口号并启动 web 服务器
app.listen(3007, function () {
  console.log('Express server running at http://127.0.0.1:3007')
})