### 跨域问题产生的原因
浏览器的**同源策略**影响，同源策略是一种安全机制，它限制了一个网页中的脚本只能访问同源的资源。

### JSONP解决同源限制问题
原理：利用script标签的src属性可以跨域加载资源的特性，通过动态创建script标签来实现跨域请求。

跨源网络访问的三种方式：跨域写操作，跨域资源嵌入，跨域读操作

### CORS（跨域资源共享）
原理：需要服务器实现CORS接口，在服务器端设置响应头，允许指定的域名访问资源。
```js
res.header('Access-Control-Allow-Origin', '*') //允许所有的请求源
res.header('Access-Control-Allow-Headers', '*') //允许所有的请求源 X-Token
res.header('Access-Control-Allow-Methods', '*') //允许所有的请求源 get post put delete
```

### 代理服务器
原理：在同源策略下，通过在同一域名下设置代理服务器，将跨域请求转发到目标服务器上。