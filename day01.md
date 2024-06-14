#### 什么是作用域，作用域有哪些?
答：作用域是一个抽象的概念，它是一套规定如何访问和存储变量的规则，可以理解为当前执行环境中变量和函数的执行范围。  
作用域分为全局作用域、局部作用域(也叫函数作用域)和ES6出的块级作用域，还存在一种特殊的作用域，叫模块作用域。

#### 预编译的过程有哪些？
答：预编译是在代码之前前的预处理，分为全局预编译和函数预编译。先进行全局预编译，再进行函数预编译。  
全局预编译会生成VO，将它赋值为undefined。  
函数预编译会生成AO，进入到函数中后寻找变量声明，比如name，将其作为AO的一个属性，将它赋值为undefined；再寻找函数的形参，也将其作为AO的一个属性，赋值为undeifned，紧接着去取实参替换掉undefined；接下来去寻找函数里面是否有函数声明，也将其作为AO的属性，属性值为函数本身；如果这个函数名和第一步的变量名冲突了，覆盖掉变量声明。


#### 下面几题的代码的执行结果分别是什么？
```js
var foo = 1;
function bar() {
    console.log(foo);  
    if (!foo) {
        var foo = 10;
    }
    console.log(foo); 
}

bar(); // undefined 10
```

```js
function fn () {
    func()
    var func = function () {
        console.log('表达式')
    }
    function func() {
        console.log('声明式')
    }
    func()
}
fn() // 声明式 表达式
```

```js
function test(d) {
    console.log(b);
    if (a) {
        b = 100;
    }
    console.log(b);
    c = 4;
    console.log(d);
    var d = 20;
    console.log(d);
}
var a = 10;
var b = 10;
test(3);
console.log(c); // 10 100 3 20 4
```

#### js的数据类型有哪些？
基本数据类型：boolean、null、undefined、string、number、Symbol、bigInt
引用数据类型：object、function、array、date，后三个可以看作特殊的object

#### 什么是深拷贝 深拷贝有哪些方式？
答：深拷贝是对于引用数据类型来说的，不管它嵌套多少层，都与它拷贝源独立，也就是说不仅变量被保存在一个新的地址了，它内部的属性方法都有属于自己的地址。  
实现深拷贝的方法主要有1. 用JS原生的JSON.parse(JSON.stringfy())，但是它对函数、正则、Symbol、Undefined是不起作用的；2. 用lodash这个工具库里的一个cloneDeep API。

#### 什么是闭包？
答：闭包是指一个函数它可以访问到其他(外部)函数作用域的变量，即使外部函数已经执行完毕了。这个函数加上它能引用的外部函数里的变量合起来称为闭包。

#### 下面几题的代码的执行结果分别是什么？
```js
var obj = { 
    a: 1, 
    foo() {
        console.log(this.a);
    } 
};
var a = 2;
var foo = obj.foo;
var obj2 = { a: 3, foo: obj.foo }

obj.foo();
foo();
obj2.foo(); // 1 2 3
```
```js
function Foo(){
    getName = function(){ console.log(1); };
    return this;
}
Foo.getName = function(){ console.log(2); };
Foo.prototype.getName = function(){ console.log(3); };
var getName = function(){ console.log(4); };
function getName(){ console.log(5) };

Foo.getName();         
getName();        
Foo().getName();
getName();        
new Foo.getName();
new Foo().getName();
new new Foo().getName(); // 2 5 2 5 3 3
```

#### 什么是EventLoop事件循环？
答：事件循环是一种机制，由于JS是单线程的语言，但是浏览器又支持多线程去工作，所以借用事件循环机制，当我们的代码遇到异步操作的时候，把异步任务推到任务队列里。任务队列包含微任务队列和宏任务队列。当调用栈里同步的代码执行完毕后，浏览器会去检查微任务队列，讲其中的任务压到调用栈去执行。微任务结束后，去检查宏任务队列，同样去清空它。但是由于微任务优先级高于宏任务，所以没完成一个宏任务，都要去检查微任务队列，如果有，优先清空微任务队列。如此循环，就叫做事件循环。

#### 什么是同源策略？图片资源是否存在跨域？
答：同源策略是一种浏览器安全机制，避免了不安全的访问，它规定同协议、同域名、同端口的才算是同源。  
图片资源不是跨域，一般从外部引入静态资源都不算跨域。一般跨域读取操作会有跨域问题。

#### 解决跨域的方式有哪些？
答：JSOP、CORS和代理服务器。  
JSOP利用了script标签能跨域的能力。  
CORS是服务器端设置了特定的响应头来允许跨域请求。  
代理服务器是借用一个同源的服务器去代理跨域放松请求，让代理服务器帮助转发。因为代理服务器与浏览器属于同源，又与目标服务器之间不存在同源策略的限制，所以可以实现这一目标。同源策略限制的是浏览器，所以代理服务器不受约束。
#### js设计模式有哪些？
答：工厂模式、观察者模式

#### 什么是原型，原型链？
答：每个函数都有一个prototype属性，它是一个对象，这个对象里有共享的属性和方法。我们可以通过fn.prototype访问到这个原型对象。  
当我们用一个构造函数创建一个实例person的时候，我们可以通过浏览器提供的__proto__去访问到构造函数的原型对象。当我们访问一个person不存在的属性和方法时，它会沿着__proto__去依次向上找，直到找到或找不到返回null。这条路径就是原型链。