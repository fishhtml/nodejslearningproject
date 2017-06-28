# 本项目笔记

[toc]

## 基本步骤

### 1. **指定主入口。** 

在package.json中的字段`"main": "firstsite.js"`,指定主js(入口)，默认是main.js，我修改为firstsite.js

### 2. **在主入口引入所需模块。** 

`firstsite.js`中使用`require()`引入模块并赋予给变量，包括自带的，第三方的，自己建立的。模块可以边写代码便引用，想到哪个模块就用哪个。
 - 引入了自己建立的模块：`require('./lib/fortune.js')`

### 3. **初始化express应用。**

 将`express`初始化为应用：`var app = express();`

### 4. **视图引擎的使用。视图引擎是*MVC*中的*V*。**

导入模块-->创建视图引擎并指定所用主模板-->使用`app.engine(ext,callback)`指定特有文件处理函数

#### a. 视图模块的安装

本项目使用`handlebars`，还可以使用更高级的`jade`。`npm install --save express-handlebars`来引入`handlebars`。`--save`将依赖关系写入`package.jsom`里面的`dependencies`字段，便于以后`npm install`时，载入次依赖模块。`npm install`会将`dependencies`中的所有需要的模块全部载入。

#### b. 导入试图模块与创建默认视图

`require(express-handlebars).create({defaultLayout:main.js});`创建的时候顺便指定了defaultLayout为main.js

#### c. 模板文件的处理

由于导入的是外部模板系统（也可以说engine），所以需要设置特定的方式处理该模板系统的文件（在handlebars中是.handlebar）。`app.engine(ext,callback)`, 这里的`ext`是模板文件（这里是.handlebar）,`callback`指处理`ext`的方法，这里是`handlebars.engine`

###  5. 静态资源中间件(static中间件)

`app.use(express.stactic(__dirname + '/public'));`指定静态资源起始目录。
比如：`<img src="img/logo.jpg" alt="Firstsite">`直接可以表示`/home/loo/文档/nodeExpressBook/nodeExpressProject01/public/img`

### 6. 开始设置路由(Router)

### 7. 监听端口 

## 注意事项

1. 提示推荐使用`''`，而不是`""`
