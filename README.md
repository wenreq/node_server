# node_server

Node + Express + MySQL 服务端开发

## 第三方包

- `@escook/express-joi` 中间件，来实现自动对表单数据进行验证的功能
- `joi` 包，为表单中携带的每个数据项，定义验证规则
- `bcryptjs` 对密码进行加密
- `cors` 解决跨域
- `express` 快速、无约束、极简的 web 框架
- `jsonwentoken` 安装生成 Token 字符串的包
- `express-jwt` 解析 Token 的中间件
- `mysql` 一个 mysql 的 node.js 驱动程序。它是用 JavaScript 编写的，不需要编译，并且是 100% MIT 许可的。

## 项目结构说明

```tree
node_server
├── db  --------------- mysql 数据库配置
│   └── index.js
├── router  ----------- 路由模块
│   └── user.js
├── router_handler  --- 路由处理函数模块
│   └── user.js
├── schema  ----------- 验证字段模块
│   └── user.js
├── README.md --------- 项目说明文件
├── app.js  ----------- 项目根实例
└── package.json  ----- 包依赖管理
```
