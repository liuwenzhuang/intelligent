[dva]: https://github.com/dvajs/dva
[antd]: https://ant.design/index-cn

## 项目结构

此项目使用[dva][dva] + [antd][antd]框架构建，项目结构如下：

<pre>
|-- mock 用于本地http调试
|-- public 其中可存放不变的资源文件，build时会拷贝至dist目录，不会被webpack处理
|-- src
  |-- assets/ 其中存放资源文件
  |-- components/ 通用组件
  |-- models/ 为页面定义state、reducers、effects、subscriptions
  |-- routes/ 页面
    |-- Exception 全局404页面
  |-- services/ http请求方法
  |-- themes/ 重写antd样式
  |-- utils/ 辅助方法
  |-- config.js 基础配置、url配置
  |-- index.ejs HtmlWebpackPlugin配置文件
  |-- index.js 入口文件
  |-- router.js 路由配置文件
|-- .webpackrc.js 相当于webpack配置文件
|-- theme.config.js 重写antd样式
</pre>

## 添加页面

添加页面分为如下几个步骤：

1. 在`src/routes`文件夹内添加页面组件
2. 在`src/models`文件夹内为此页面添加对应model
3. 在`src/router.js`中的`routes数组`中添加页面和对应的model

## effects中获取state

```javascript
effects: {
  *sendMessage({ payload }, { select }) {
    const phone = yield select(state => state[NAMESPACE]);
  }
}
```

 > 可以通过`redux-saga`中提供的`select`方法获取到state。

## subscriptions订阅方法

`subscriptions`用于订阅数据源，如websocket连接，键盘输入，路由变化等，在其中可定义多个方法用于订阅不同数据源，其中每个方法的结构如下：

```javascript
subscriptions: {
  [EVENTNAME01]({ dispatch, history }) {
    // bala...
  },
  [EVENTNAME02]({ dispatch, history }) {
    // bala...
  }
}
```

以拦截键盘事件为例：

```javascript
// model.js
import key from 'keymaster';

subscriptions: {
  keyEvent({ dispatch, history }) {
    key('ctrl + r', () => {
      alert('you gonna reload this page');
      // bala...
    });
  }
}
```

## 使用本地antd图标

默认情况下antd使用的是远程阿里云图标，如果想要使用本地图标，可按照下面的步骤：

1.到[https://ant.design/docs/spec/download-cn](https://ant.design/docs/spec/download-cn)页面下载Web Font，下载完成为一zip包，可以将其中内容解压至`src/assets/antd`文件夹中（其他路径也可）。

2.在[src/themes/default.less`](./src/themes/default.less)添加一行：

```less
@icon-url: '../../../../../src/assets/antd/iconfont'; // 从node_modules/antd/es/style/core/路径开始
```

## 添加Redux中间件(Middlewares)

以添加`redux-logger`中间件为例：

```javascript
// src/index.js
import createLogger from 'redux-logger';
const app = dva({
  onAction: createLogger(),
});
```

 > 添加多个中间件时，只需要为`onAction`属性指定数组即可。

## 查阅

 - [dva概念](https://github.com/dvajs/dva/blob/master/docs/Concepts_zh-CN.md)
 - [dva API](https://github.com/dvajs/dva/blob/master/docs/API_zh-CN.md)
 - [dva配置方式](https://github.com/sorrycc/roadhog/blob/master/README_zh-cn.md#%E9%85%8D%E7%BD%AE)
