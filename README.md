# Javascript 面向对象

## 数据类型

简单数据类型: `string` `number` `boolean` `undefined`

复杂数据类型:`Object` `Array` `Date` `RegExp` `function` `string` `Number` `Boolean` `Math` `Null`


## 变量预解析

js代码在执行之前 会在相应的执行环境中 预先把 一些东西解析到内存

js解析器在运行js代码的时候 分为两步：

- 第一步 把所有的 ``变量、函数、参数`` 提前到当前作用域的顶部。
    + 只提前变量,不提前值
    + 方法是整体的提升
- 第二步 逐行解读代码 从左到右、从上至下。

```javascript
console.log(a); // undefined
var a = 111;

// 前面这段代码等于
var a;
console.log(a); // undefined
a = 111;
```
```javascript
//方法整体提升
// 1.先运行fun();
// 2.提前变量,var num;
// 3.console.log(num);  undefined
// 4.num=20
// 5.var num=10 最外面
var num = 10;
fun();  // undefined
function fn(){
    console.log(num);
    var num = 20;
}
```

```javascript

// 1.函数提前
// 2.var a=9; b=9; c=9 只有a是局部变量,其他都是全局变量
// 3.外面执行不了函数里面的局部变量 a , 报错
f2();
console.log(c); // 9
console.log(b); // 9
console.log(a); // 报错

function f2(){
    var a=b=c=9;
    console.log(a); //9
    console.log(b); //9
    console.log(c); //9
}
```

## 闭包

**闭包的概念**

>各种专业文献上的"闭包"（closure）定义非常抽象，很难看懂。我的理解是，闭包就是能够读取其他函数内部变量的函数。由于在Javascript语言中，只有函数内部的子函数才能读取局部变量，因此可以把闭包简单理解成"定义在一个函数内部的函数"。所以，在本质上，闭包就是将函数内部和函数外部连接起来的一座桥梁。[阮一峰](http://www.ruanyifeng.com/blog/2009/08/learning_javascript_closures.html)


- 闭包原理:上级作用域无法访问下级作用域 , 而下级作用域可以访问上级作用域
```Javascript
function f1(){
    var num = 1;
    function f2(){
        console.log(num);
    };
    // 在局部作用域找f2 , 能够找到
    f2();
}
// 如果直接在外部调用 , 就是在全局作用域找 f2 , 报错
// f2();    // error
f1();   
```
- 闭包要解决什么问题
    + 函数内部的函数中可以访问该函数变量
    + 但是我们需要在函数外部中访问函数内部变量 
```javascript
// 1.说明每次function 返回的值都是新值
function foo(){
    var obj = {
        name:'Bin',
        age:'21'
    }
    return obj;
}
var obj1 = foo();
var obj2 = foo();
// 因为new一个Obj 就是在内存中新创建一个对象 .. 实际上创建了两个对象
console.log(obj1 == obj2);  // false

// 2.说明每次function 返回的值都是新值
    function foo(){
        var num = 123;
        return num;
    }
    var x = foo();
    var num = x+x;
    console.log(num);

    var y = foo();
    // 还是获得 123
    console.log(y);

// 3.但是我们需要在函数外部中访问函数内部变量   
    function foo(){
        var num = 234;
        function inner(a){
            num = a;
            console.log(num);
        }
        //1. 如果我们要改变num , 可以在内部改变
            // inner(1);
            // inner(2);

        // 2.如果要在外部改变里面的值 , 怎么办?
        return inner;
    }
    // 3.返回的是 inner();
    var innerFun = foo();
    // 4.此时就可以在外部访问内部的函数并赋值
    innerFun(10);
```

- 闭包基本模式 
    + 在外部函数(foo)内部创建函数(inner) , 在这个函数内部中(inner)可以操作foo中的数据   (inner可以修改num)
    + 将外部函数中的返回值 设置为 内部函数 , (返回 inner)
    + 在外部调用 外部函数(foo) , 就可以接受到返回值 (inner)
    + 使用这个内部函数,就可以在外部 将 外部函数里的变量(num) 进行修改

- 缺点
    + 消耗更多的内存 

```javascript
function f1(){

　　　　var n=999;

　　　　nAdd=function(){n+=1}

　　　　function f2(){
　　　　　　alert(n);
　　　　}

　　　　return f2;

}

var result=f1();

result(); // 999

nAdd();

result(); // 1000
```
> 在这段代码中，result实际上就是闭包f2函数。它一共运行了两次，第一次的值是999，第二次的值是1000。这证明了，函数f1中的局部变量n一直保存在内存中，并没有在f1调用后被自动清除。

> 为什么会这样呢？原因就在于f1是f2的父函数，而f2被赋给了一个全局变量，这导致f2始终在内存中，而f2的存在依赖于f1，因此f1也始终在内存中，不会在调用结束后，被垃圾回收机制（garbage collection）回收。

> 这段代码中另一个值得注意的地方，就是"nAdd=function(){n+=1}"这一行，首先在nAdd前面没有使用var关键字，因此nAdd是一个全局变量，而不是局部变量。其次，nAdd的值是一个匿名函数（anonymous function），而这个匿名函数本身也是一个闭包，所以nAdd相当于是一个setter，可以在函数外部对函数内部的局部变量进行操作。

>[阮一峰](http://www.ruanyifeng.com/blog/2009/08/learning_javascript_closures.html)
## 错误处理

**错误一定会发生**

当 JavaScript 引擎执行 JavaScript 代码时，会发生各种错误：
可能是语法错误，通常是程序员造成的编码错误或错别字。
可能是拼写错误或语言中缺少的功能（可能由于浏览器差异）。
可能是由于来自服务器或用户的错误输出而导致的错误。
当然，也可能是由于许多其他不可预知的因素。

**JavaScript 抛出错误**

当错误发生时，当事情出问题时，JavaScript 引擎通常会停止，并生成一个错误消息。

描述这种情况的技术术语是：JavaScript 将抛出一个错误。

**JavaScript 测试和捕捉**

try 语句允许我们定义在执行时进行错误测试的代码块。

catch 语句允许我们定义当 try 代码块发生错误时，所执行的代码块。

JavaScript 语句 try 和 catch 是成对出现的。

**错误对象**

- SyntaxError:语法错误
- ReferenceError:引用错误,要的变量没找到
- TypeError:类型错误 , 把变量当方法使用, 把方法当变量使用
    + 错误的使用了类型
    + 错误的调用了类型的方法
- RangeError:范围错误 , 参数超范围

## 重载


> 所谓重载，简单说，就是函数或者方法有相同的名称，但是参数列表不相同的情形，这样的同名不同参数的函数或者方法之间，互相称之为重载函数或者方法。所以说，重载主要需要两点：第一，同样的函数名。第二，不同的函数参数。

javascript**不支持重载**,但是可以**模仿**函数的重载



**arguments**

- 每个函数自带 arguments
- 传入的参数值是 类数组对象 , 是对象
- 类数组 与 数组相同点 :
    + 都有下标
    + .length
- 类数组 与 数组不同点
    + arguments是对象类型
    + 数组是Array
    + 不能互用API

**arguments的属性**

- arguments.length 获取传参的长度
- arguments.callee 指向函数本身

```javascript
    function test(x,y){
        if(arguments.length !== 2);{
            throw new Error('传参过多')
        }
        // 自己调用自己 称为递归
        test();
    }
    test('1','2','3');

    // 但是匿名函数如何调用自己呢?
    (function(){
        console.log('调用自己');
        // 不能在严格模式下进行
        arguments.callee();
    })()
```

## 匿名函数

匿名函数特征

- 不指定函数名
- 用匿名函数节约资源,用完就销毁

概念:定义函数的方式

- 函数的声明
- 函数表达式

如下代码就是函数声明的代码结构：
```javascript
function sum(x,y){  
    console.log(x+y);  
}  
sum(1,2); //3 
```

函数表达式

```javascript
var ss = function(x,y){  
    alert(x+y);  
};  
ss(1,2);  
```


## 面向对象 OOP

首先，先理解一下对象，很多事物都是对象，简单到一整数，复杂到一架飞机，对象是一个整体，对外提供一些操作；那么面向对象就是说，使用对象的时候，你可以**直接使用它所提供的功能而忽略其内部组成情况**。面对对象不一定只有在编程界里才有，我们生活中无处不在；我的理解是这样的：比如说，你家里的电视机，你使用了遥控，就能操作电视机，**但是你实际上不知道这台电视机里面是什么零件组成的，你只要知道，我拿到遥控就可以操作电视机就好了**。这就是一种面向对象的思想。

**特点**

- 抽象
    + 抓住核心问题
- 封装
    + 不用考虑内部实现过程，只要考虑功能的使用
- 继承
    + 从已有对象，继承出新的对象
- 便于维护
    + 先将事物的属性和方法封装在一个对象,再反复使用对象这个功能

**三种方式创建对象**

1. 直接量
    * 在创建对象时,就知道所有成员,用直接量创建
```javascript
// 何时使用这种创建方式?
// 在创建对象时,就知道所有成员,用直接量创建
var lilei = {
    name:'李雷',
    age:11,
    intr:function(){
        // `${变量}`  ES6语法
        console.log(`我是${this.name},我${this.age}岁了`);
    }
}
console.log(lilei);
lilei.intr();
```
2. 用 new 创建 
    * JS即使对象创建完成 , 依然可以添加新的成员
```javascript
// 何时使用这种创建方式?
// 在创建对象时,不知道所有成员,用 new Object
// JS即使对象创建完成 , 依然可以添加新的成员
var lilei = new Object();
lilei.name = '李雷';
lilei.age = 11;
lilei.intr=function(){
    console.log(`我是${this.name},我${this.age}岁了`);
}
// JS一切都是关联数组
// obj.name == obj["name"]
// 对象存储结构和关联数组完全一样
console.log(lilei["name"]);
console.dir(lilei);
```
3. 构造函数
    + 描述一类对象统一结构的函数
    + 反复创建多个相同类型的结构的对象时使用
    + 构造函数首字母大写
    + 如何使用构造函数 
    + 优点: 解决了代码重用
    + 缺点: 无法节约内存
```javascript
function student(name,age){
    this.name = name;
    this.age = age;
    this.intr = function(){
        console.log(`我是${this.name},我${this.age}岁了`);
    }
}
var lilei = new student('李雷',11);
var hmm = new student('韩梅梅',12);
lilei.intr();
hmm.intr();
console.log(lilei.intr == hmm.intr); //false

// 可以看出：

// 1.构造函数内部会创建一个实例，调用普通函数时则不会创建新的对象。

// 2.构造函数内部的this指向是新创建的person实例，而普通函数内部的this指向调用函数的对象（如果没有对象调用，默认为window）
```

## 继承

**为什么要继承?**

- 因为需要复用
- 节约内存

**该如何复用？**

通过复用我们可以实现共享。

从对象的角度来说，我们不想重复写同一段逻辑，所以逻辑需要复用；但是我们不希望一个对象掌管的变量被其它对象修改。所以变量不能共享。也就是要共享函数，不共享属性。

**继承特点**

- 父对象的成员,子对象无须创建就可以直接使用
- 只要多个子对象,拥有相同的属性和功能时,就要用到继承
- 只要在父对象定义一次所有子对象共用
- Js继承都是继承原型对象
    + prototype 原型
    + 原型对象是:集中存储一类子对象相同属性和功能的父对象
    + 子对象有共同属性和功能都要定义在原型对象中
    + 每创建一个构造函数,都会自动创建一个原型对象
    + 用new创建子对象时,会自动设置子对象的 __proto__继承构造函数的prototype
```javascript
// 构造函数只写属性
function student(name,age){
    this.name = name;
    this.age = age;
}
// 相同方法写在原型对象中
student.prototype.intr = function(){
    console.log(`我是${this.name},我${this.age}岁了`);
}
// 相同固定属性写在原型对象中
student.prototype.className = '初一二班';
var lilei = new student('李雷',11);
var hmm = new student('韩梅梅',12);
lilei.intr();
hmm.intr(); 
console.log(lilei.intr == hmm.intr); //true 
console.log(lilei.className);
```
- 自有属性和共有属性
    * 自由属性:直接保存在对象本地属性
    * 共有属性:保存在原型对象中 , 所有子对象共有共享的
    * 获取值时:对象.属性
    * 赋值
        - 自有属性:对象.属性=值;
        - 共有属性:构造函数.prototype.属性=值;
```javascript
function student(name,age){
    this.name = name;
    this.age = age;
}
// 相同方法写在原型对象中
student.prototype.intr = function(){
    console.log(`我是${this.name},我${this.age}岁了`);
}
// 相同固定属性写在原型对象中
student.prototype.className = '初一二班';
var lilei = new student('李雷',11);
var hmm = new student('韩梅梅',12);
lilei.intr();
hmm.intr(); 
// 李雷修改了原型对象共有属性
lilei.className = '初三二班';
// 这样修改原型属性是错误
console.log(lilei.className); // 修改了自有属性
console.log(hmm.className);   // 原型共有属性不变
// 要想修改共有属性:
student.prototype.className = '初三二班';
console.log(lilei.className);
console.log(hmm.className); 
```
    * 用来判断是否自有属性API obj.hasOwnProperty('属性名')
```javascript
function student(name,age){
    this.name = name;
    this.age = age;
}
// 相同方法写在原型对象中
student.prototype.intr = function(){
    console.log(`我是${this.name},我${this.age}岁了`);
}
// 相同固定属性写在原型对象中
student.prototype.className = '初一二班';
var lilei = new student('李雷',11);
var hmm = new student('韩梅梅',12);

// 检查属性
function checkPropo(obj,name){
    // 返回布尔值
    if(obj.hasOwnProperty(name)){
        console.log('自有属性');
    }else if(obj[name] !== undefined){
        console.log('共有属性');
    }else if(obj[name] == undefined){
        console.log('没有属性');
    }
}
checkPropo(lilei,'name');   // 自有
checkPropo(hmm,'className');// 共有
checkPropo(hmm,'abc');      // 没有   
```
    * in 判断属性是否在对象中 , 只要自己或者父对象包含 属性名 , 就返回 true
```javascript
function student(name,age){
    this.name = name;
    this.age = age;
}
// 相同方法写在原型对象中
student.prototype.intr = function(){
    console.log(`我是${this.name},我${this.age}岁了`);
}
// 相同固定属性写在原型对象中
student.prototype.className = '初一二班';
var lilei = new student('李雷',11);
var hmm = new student('韩梅梅',12);

// 检查属性
function checkPropo(obj,name){
    // 返回布尔值
    if(obj.hasOwnProperty(name)){
        console.log('自有属性');
        // 如果 属性 有 在对象里面
    }else if(name in obj){
        console.log('共有属性');
    }else if(obj[name] == undefined){
        console.log('没有属性');
    }
}
checkPropo(lilei,'name');   // 自有
checkPropo(hmm,'className');// 共有
checkPropo(hmm,'abc');      // 没有   
```

### 内置对象的继承关系

JavaScript有3大对象，分别是`本地对象`、`内置对象`和`宿主对象`。

- 本地对象
    + 与宿主无关，独立于宿主环境的ECMAScript实现提供的对象。
    + 简单来说，本地对象就是 ECMA-262 定义的类（引用类型）。
    + 这些引用类型在运行过程中需要通过new来创建所需的实例对象。
    + 包含：`Object`、`Array`、`Date`、`RegExp`、`Function`、`Boolean`、`Number`、`String`等。
- 内置对象
    + 与宿主无关，独立于宿主环境的ECMAScript实现提供的对象。
    + 在 ECMAScript 程序开始执行前就存在，本身就是实例化内置对象，开发者无需再去实例化。
    + 内置对象是本地对象的子集。
    + 包含：Global和Math。
    + ECMAScript5中增添了JSON这个存在于全局的内置对象。
- 宿主对象
    + 由 ECMAScript 实现的宿主环境提供的对象，包含两大类，一个是宿主提供，一个是自定义类对象。
    + 所有非本地对象都属于宿主对象。
    + 对于嵌入到网页中的JS来说，其宿主对象就是浏览器提供的对象，浏览器对象有很多，如Window和Document等。
    + 所有的`DOM`和`BOM`对象都属于宿主对象。

> 关于专业名词：本地对象也经常被叫做原生对象或内部对象，包含Global和Math在内的内置对象在《JavaScript高级程序设计》里也被叫做单体内置对象，很多时候，干脆也会直接把本地对象和内置对象统称为“内置对象”，也就是说除了宿主对象，剩下的都是ECMAScript的内部的“内置”对象。

```JavaScript
// 就是你打开浏览器时 , js 自动创建的构造函数
// arr就是继承关系 继承了 Array()的原型对象
// Array()原型对象放了 sort() push() slice() .. 等等方法 , 所以可以直接调用

var arr = new Array();
var date = new Date();
// __proto__ 指向了原型对象,里面内置了很多API
console.log(arr);
var arr2 = new Array();
console.log(arr == arr2);   // fase
// 证明都指向相同的原型对象
console.log(arr.__proto__ == arr2.__proto__);   // true 
```

**解决浏览器兼容问题需要用到内置对象**

```JavaScript
// 如果一个API新的浏览器支持 , 旧浏览器不支持怎么办?
// 新的API 数组 的 indexOf

var arr = [1,2,3,2,1];
// 浏览器兼容 IE8
if(typeof(Array.prototype.indexOf) != 'function'){
    Array.prototype.indexOf = function(val,fromi){

        // 如果fromi 用户没有给, 默认为0
        fromi = fromi || 0;
        // i从fromi遍历当前数组 -> this
        // this 将来调用API的 . 前的对象 , 现在这个对象值arr,因为 arr调用他
        for(var i = fromi;i<this.length;i++){
            // 如果当前数组的当前元素值为 val
            if(this[i] === val){
                // 返回i
                return i;
            }
        }
        遍历结束都没有 返回-1
        return -1;

    }
}
console.log(arr.indexOf(2));    // 有值返回 1
console.log(arr.indexOf(2,2));  // 有值返回 3
console.log(arr.indexOf(2,4));  // 没值返回 -1  
```

### 原型链

- 原型链由多级父元素逐级继承形成的链式结构
- __proto__ 只能继承父级的 Prototype 
- 原型链保存着所有对象成员和方法   
- 作用域链保存着所有变量 , 控制变量使用顺序,优先使用AO局部变量,
    没有才向作用域链父级作用域查找 , 作用域链顶端 window 
- 原型链控制着对象成员的使用顺序,优先使用自己的方法,没有才顺着原型链向父级查找
- 原型链顶端一定是 Object.prototype
- 概括
    * 所有不需要"对象."访问的变量都保存在作用域链
    * 所有必须要"对象."访问的成员都保存在原型链

**__proto__ 与 prototype**

- 每个对象都具有一个名为__proto__的属性；
- 每个构造函数（构造函数标准为大写开头，如Function()，Object()等等JS中自带的构造函数，以及自己创建的）都具有一个名为prototype的方法（注意：既然是方法，那么就是一个对象（JS中函数同样是对象），所以prototype同样带有__proto__属性）；
- 每个对象的__proto__属性指向自身构造函数的prototype；

__proto__ 与 prototype
![__proto__ 与 prototype](https://raw.githubusercontent.com/CourteousBin/OO/master/images/4prototype.png)

原型链图解:
![原型链](https://raw.githubusercontent.com/CourteousBin/OO/master/images/5%E5%8E%9F%E5%9E%8B%E9%93%BE.png)

逻辑清晰版本原型链图解:

![原型链](https://raw.githubusercontent.com/CourteousBin/OO/master/images/12%E6%AF%94%E8%BE%83%E5%AE%8C%E5%96%84%E7%9A%84%E5%8E%9F%E5%9E%8B%E9%93%BE2.png)


## 判断一个对象是不是数组?有几种方法

1. typeof
    * 结论:typeOf 只能识别原始类型 , function 和 object
    * 无法识别 Object 中不同的对象类型
```JavaScript
var n=1,s="str",b=true,nu=null,un=undefined;
function fn(){};
var obj1={};
var arr=[];

// 结论:typeOf 只能识别原始类型 , function 和 object
// 无法识别 Object 中不同的对象类型
console.log(
typeof(n),
typeof(s),
typeof(b),
typeof(nu), // null = object 
typeof(un),
typeof(fn),
typeof(obj1),
typeof(arr) // arr = object
);  
```
2. 验证原型对象
    * 验证是否数组对象: Object.getPrototypeOf(对象) == Array.prototype
    * var bool = father.prototype.isPrototypeOf(child)
```JavaScript
var n=1,s="str",b=true,nu=null,un=undefined;
function fn(){};
var obj1={};
var arr=[];
// 1.检查原型对象
    console.log(
        // 获得Obj1的原型对象 与 数组对象的原型对象做比较
        Object.getPrototypeOf(obj1) == Array.prototype,
        // 获得arr的原型对象 与 数组对象的原型对象做比较
        Object.getPrototypeOf(arr) == Array.prototype
    );
// 2 var bool = father.prototype.isPrototypeOf(child)
    console.log(
        Array.prototype.isPrototypeOf(obj1),
        Array.prototype.isPrototypeOf(arr),
    );  
```
3. 验证构造函数
    * 构造函数自动生成 原型对象 prototype
    * 子对象称呼 父级原型对象 __proto__
    * 那原型对象称呼构造函数为: constructor (构造器)
    * 验证API
        - obj1.constructor == Array
        - var bool = obj instanceof Array (判断Obj是否由构造函数Array创建出来)
```JavaScript
var n=1,s="str",b=true,nu=null,un=undefined;
function fn(){};
var obj1={};
var arr=[];
    // - 构造函数自动生成 原型对象 prototype
    // - 子对象称呼 父级原型对象 __proto__
    // - 那原型对象称呼构造函数为: constructor (构造器)
    console.log(
        // 判断构造函数是否等于 数组对象
        obj1.constructor == Array,
        arr.constructor == Array,
    );  

    console.log(
        // 判断构造函数是否等于 数组对象
        // instanceof 生来就是验证与判断
        // 判断Obj是否由构造函数Array创建出来
        // var bool = obj instanceof Array
        obj1 instanceof Array,
        arr instanceof Array,
    );  

    // instance 翻译:实例 , 一个类型中具体的一个对象
    // 学生是一个类 , 李雷是一个实例对象
    // 实例化就是用New创建一个对象
    // obj instanceof Array
    // obj 是不是Array类型的 一个实例
    // 从原型判断
        // 翻译: arr的原型是指向数组原型吗
        var result = Array.prototype.isPrototypeOf(arr);
        console.log(result);
        // 翻译:arr的原型是等于数组原型吗
        console.log(Object.getPrototypeOf(arr) == Array.prototype);
    // 从构造函数判断
        // constructor 构造函数
        // 翻译: arr的构造函数 是不是 Array
        console.log(arr.constructor == Array);
        // arr是不是Array这个构造函数的实例化
        var bool = arr instanceof Array;
        console.log(bool);  
```
4. 判断内部属性Class
    * 验证原型 与 验证构造函数 还是有一定缺点的
    * 验证不够严谨 ,即使创建时不是数组对象只要原型链上有数组类型,也认为是数组类型对象此时,就算obj可以调用到数组API也是无意义的
```JavaScript
var n=1,s="str",b=true,nu=null,un=undefined;
function fn(){};
var obj1={};
var arr=[];
var obj3 = {};
// obj3的原型对象指定 arr , 那么 这关系就变成了
// obj3.__proto__ -> arr.__proto__ -> Array.prototype
// 也就是obj3 可以用 数组API
obj3.__proto__ = arr;
console.log(
    // 判断构造函数
    obj3 instanceof Array,  // true
    // 判断原型对象
    Array.prototype.isPrototypeOf(obj3) // true
    // 总结:验证不够严谨 ,即使创建时不是数组对象
    //      只要原型链上有数组类型,也认为是数组类型对象
);
```
5.  检查内部属性class
    * class是每个对象中记录对象创建时使用的类型属性 
    * 一旦对象被创建,class属性就无法被修改

6. Array.isArray(obj);
    * 专用判断是否数组API ES5 新增的函数
```javascript
var n=1,s="str",b=true,nu=null,un=undefined;
function fn(){};
var obj1={};
var arr=[];
var obj3 = {};
obj3.__proto__ = arr;
console.log(
    // ES5 新增 , 实际上就是用了 Object.prototype.toString.call()
    Array.isArray(arr),
    Array.isArray(obj1),

);  
```

**什么是内部属性?**

- 内部属性是不可轻易访问 
- 只能通过 `Object.toString()` 这个原型对象获取
- 只有 `var obj = {}` , 最纯正的对象可以获取到 , 其余都不行
- 用 `var arr = [1,2]` , `arr.toString()`; 访问到的是数组装的内容
    + 为什么出现这种状况?
    + 按原型链 , `Object.prototype` 是最顶层 , 无论 `Array` , `Date` , `RegExp` 都会继承到toString()
    + 因为 `Array.prototype` 改写了`toString()`方法,改写成适合自己的方法
    + 在数组中,用户会迫切想知道数组里面装的是什么内容 , 而并不关心 array的对象类型
    + 所以 array 为了迎合用户 , toString()变成了输出内容
    + 以上内容 , 就叫多态 , Js 面向对象第三大特征

```Javascript
// 此时,就算obj3可以调用到数组API也是无意义的
// 检查内部属性 class , class是每个对象中记录对象创建时使用的类型属性
// 一旦对象被创建,class属性就无法被修改 
// 内部属性无法轻易获得
// 唯一办法调用 Object.prototype中的 toString();
console.log(obj1.toString());
// 输出结果 [object Object] 
    // 第一个小写object 表示引用类型对象
    // 第二个大写Object 表示Class内部属性

console.log(arr.toString());    // 空字符串
console.log(obj3.toString());   // 空字符串
// arr.toString() 为什么会出现空字符串?
    // 因为 Array.prototype 改写了 toString() 这个方法
    // 当你获得一个数组的时候,最想知道的是数组里面装了什么内容
    // 并不是最想知道这个 对象 是什么类型
    // 所以, toString() 经过 Array 的改造 , 变成了输出内容
    // 以上内容就叫做 多态 , 面向对象第三大特点
```

### 多态

- 同一个事物,在不同的情况下表现出不同的状态
- 重写 overRide
- 如果子对象觉得父对象的成员不好用,可以在子对象本地定义同名成员来覆盖父对象成员
- 只要觉得父对象成员不好用,那么就可以在本地重写父对象的成员
- 重写,就是直接定义同名方法


```JavaScript
function student(name,age){
    this.name = name;
    this.age = age;
}
// 相同方法写在原型对象中
student.prototype.intr = function(){
    console.log(`我是${this.name},我${this.age}岁了`);
}
var lilei = new student('李雷',11);
// 李雷调用 toString()会得到什么?
console.log(lilei.toString());
    // [object Object] 
    // 因为李雷的prototype并没有定义toString()
    // 顺着原型链找到了 obecjt.prototype 的 toString()方法

// 这样等于重写父对象toString()方法
student.prototype.toString = function(){
    console.log(`重写OverRide,我叫${this.name}`);
}   
lilei.toString();
```

- 几乎所有内置对象的原型都重写了 `Obeject `的
`toString()`方法,导致所有内置对象的子对象,都无法调用到 `Object`的`toString()`
    * 解决办法 call()

**call()**

使用方法:父对象.prototype.调用方法名.call(调用对象)

```javascript
var n=1,s="str",b=true,nu=null,un=undefined;
function fn(){};
var obj1={};
var arr=[];
var obj3 = {};
obj3.__proto__ = arr;
console.log(
    arr.toString(), // 空,被Array拦截
    obj3.toString(),// 空,被Array拦截
);
// call 格式: 父对象.prototype.调用方法名.call(调用对象)
console.log(
    Object.prototype.toString.call(arr), // [object Array]
    Object.prototype.toString.call(obj3),// [object Object]
);
// 判断
console.log(
    Object.prototype.toString.call(arr) == "[object Array]", // true
    Object.prototype.toString.call(obj1) == "[object Array]", // false
    Object.prototype.toString.call(obj3) == "[object Array]", // false
);
```

## 自定义继承

仅设置两个对象之间的继承关系
    
- child.__proto__ = father;
- 问题是 proto 也是内置的属性 , 内部属性可能被浏览器禁用
- 解决:Object.setPrototypeOf(child,father)  设置child 继承 father
```javascript
var lilei = {
    name:'李雷',
    age:11,
    intr:function(){
        console.log(`我是${this.name},我是${this.age}岁`);
    }
}
lilei.intr();
// lilei.__proto__ -> Object.prototype
var father = {
    bal:1000000000,
    car:'bwm'
}
// 自定义继承
Object.setPrototypeOf(lilei,father);
console.log(lilei);
```

批量设置子对象继承关系

- 只要修改构造函数的prototype对象即可

```javascript
var father = {
    bal:100000000,
    car:'bwm'
}
function student(name,age){
    this.name = name;
    this.age = age;
}
// 先修改继承
student.prototype = father;
// 再添加方法
student.prototype.intr = function(){
    console.log(`我是${this.name},我${this.age}岁了`);
}
// 最后实例化对象
var lilei = new student('李雷',11);
var hmm = new student('hmm',12);
console.log(lilei);
```

**两种类型间的继承**

*如果发现多个类型有相同的属性和相同的方法时,纪要抽象出一个父类型*

- 定义父类型
    + 构造函数:集中定义相同的属性结构
    + 原型对象:集中定义相同的方法
- 让子类型原型对象基础父类型原型对象
    + 保证子对象可调用父类型原型中的方法
- 让子类型构造函数中借用父类型构造函数
    + 请父类型构造函数 构建 共有的属性 
    + 问题:直接调用父类型构造函数 , 那么 this 指向谁
    + this 默认 指向 windwo
    + 解决   
        * call(); 只要this不是想要的,就用call随便替换
        * 父类型构造.call(this,参数) 替换this
```javascript
// 父类型
function Flyer(name,speed){
    this.name = name;
    this.speed = speed;
}
// 父类型原型对象方法
Flyer.prototype.fly = function(){
    console.log(`${this.name}以时速${this.speed}飞行`);
}
// 子类型
function plane(name,speed,score){
    // 问题出在 this 上
    // this 获得的是 . 前面的对象
    // 没有 . 那么会自动获得创建的新对象
    // 那么没有用. 调用 也没有用 new 调用 , 那么 this指向window
    // 问题:直接调用父类型构造函数 , 那么 this 默认 指向 windwo
    // 解决 call(); 只要this不是想要的,就用call随便替换
    Flyer.call(this,name,speed);    // 借用父类型构造
    // 自己理解:
        // 构造函数在没有 New 或者没有 "." 的情况下 , This是指向window
        // 当你new一个构造函数时 , 创建一个新的对象,  this是指向新对象
        // 在plane 调用Flyer的时候 并没有 New 或者 "." , 所以指向window
        // 用call(),把新对象(plane)的this 替换 Flyer 里面的 this . 就等于指向了新对象
    this.score = score;
}
plane.prototype.getScore = function(){
    console.log(`${this.name}以时速${this.speed}飞行,击落我获得${this.score}分`);
}
// 子类型继承父类型 原型对象
Object.setPrototypeOf(plane.prototype,Flyer.prototype);
var j10 = new plane('j10',100,50);
console.log(j10);   
j10.getScore();
j10.fly();
```

图解:
![两种类型之间的继承](https://raw.githubusercontent.com/CourteousBin/OO/master/images/7%E4%B8%A4%E7%A7%8D%E7%B1%BB%E5%9E%8B%E9%97%B4%E7%9A%84%E7%BB%A7%E6%89%BF.png)

## this

关键字 this ,引用正在调用函数的对象的关键词

自己理解 : 

> - 自动引用正在调用当前的 . 前的对象
> - 不加 this的变量,默认在作用域链中找,不会去对象中找
> - 只要对象的方法想使用自己的属性时 , 必须加this
> - obj.fun() , this 指向obj
> - new Fun() , this 指向正在创建的新对象
> - fun() 和 匿名函数自调, this 指向window
> - 当一个构造函数 , 没有 new 没有 . 那么 this指向window
> - 如果this 不是你想要的时候 , fun.call(this,参数) 替换

new Object() , new 干了几件事?

- 创建空对象
- 让新对象继承构造函数的原型对象 设置新对象 __proto__ 指向构造函数prototype
- 调用构造函数
- 返回新对象的地址

### call() 与 apply()

- apply(this,arguments)
- apply 和 call 都是强行借用一个本来无法调用的函数 , 并临时替换函数中的this为指定对象
- call 必须是单独传参数 , 逗号分隔
- apply 可自动打散数组类型参数

默认环境下 , this指向全局

```javascript
var name = 'Bin';
function sayHello(){
    // 默认环境下 , this指向全局
    console.log(this.name);
}
sayHello(); //Bin

var obj = {
    name:'BigBinBin'
}
// 改变了 this , 指向对象
sayHello.apply(obj);    // Bigbinbin
```

修改this , 指向obj
```javascript
var name = 'Bin';
// 带参数
function sayHello(a,b){
    // 默认环境下 , this指向全局
    console.log(this.name+'吃了'+(a*b)+'个馒头');
}
sayHello(1,2);

var obj = {
    name:'BigBinBin'
}
// 利用apply带参数
sayHello.apply(obj,[1,5]);
// 利用call带参数
sayHello.call(obj,1,5);         
```

apply 与 arguments
```javascript
// 正常数组使用join
var arr = [1,2,3,4,6,8,9,5];
console.log(arr.join('-'));

function foo(){
    // arguments 是一个伪数组
    console.log(arguments);

    // 伪数组没有 join 这个方法
    // arguments.join('-');

    // 借用 数组的 join 方法 , 因为apply 第二个参数要一个数组 
    var str = Array.prototype.join.apply(arguments,['-']);
    return str;
}
var str = foo('1','1','1','1','1');
console.log(str);              
```
对象this 替换 全局 this
```javascript
function foo(){
    // 指向全局
    console.log(this);
}
foo();
var obj = {
    name:'bin',
    sayThis:function(){
        console.log(this.name);
    }
};
obj.sayThis();  // -> obj

// 替换this , 同对象的this 替换 全局 this
foo.call(obj);  // -> obj   
```

全局this 替换 对象this
```javascript
var name = 'globalName';
function foo(){
    // 指向全局
    console.log(this);
}
foo();
var obj = {
    name:'bin',
    sayThis:function(){
        console.log(this.name);
    }
};
// null是window(全局) , 把null 替换到 obj.name
// 变成 window.name , 打印出 globalName
obj.sayThis.call(null);     
```

替换构造函数 this

```javascript
function Person(){
    this.name = 'bin',
    this.age = 21;
}
function Student(){
    // 借用父构造函数 , 把 Student 的this 替换了原来的 Person 的this
    // 继承了person 的属性
    Person.apply(this);
}
var stu = new Student();
console.log(stu); 
```

两种类型继承 apply
```javascript
function Flyer(name,speed){
    this.name = name;
    this.speed = speed;
}

Flyer.prototype.fly = function(){
    console.log(`${this.name}以时速${this.speed}飞行`);
}

function Bee(name,speed,award){
    // apply 和 call 都是强行借用一个本来无法调用的函数 , 并临时替换函数中的this为指定对象
    // call 必须是单独传参数 , 逗号分隔
    // Flyer.call(this,name,speed);
    // apply 可自动打散数组类型参数
    Flyer.apply(this,arguments);
    this.award = award
}
Bee.prototype.getAward = function(){
    console.log(`${this.name}以时速${this.speed}飞行,击落获得${this.award}`);
}
Object.setPrototypeOf(Bee.prototype,Flyer.prototype);

var be1 = new Bee('be1',50,'一条命');              
be1.fly();
be1.getAward();
```

## ES5

### 保护对象

- Js对象中的属性,随时可以被修改,删除,替换,添加.
- 命名属性 : 可用.访问到的属性
- 数据属性:直接存储属性值的属性
- 每个属性都有四大特征
    + value:实际存储属性值
    + writable:是否可以修改,默认为true
    + enumerable:是否可以被for in 遍历到 , 无法控制 . 访问
    + configurable:是否可修改其他特性 控制 writable , enumerable 以及 是否可删除属性
        * 如果关闭了configurable , 属性将不可删除

**获取四大特性**

var attrs = Object.getOwnPropertyDescriptor(对象,属性名)

**设置四大特效**

Object.defineProperty(bin,'id',{

    writable:false, // 设置只读

    configurable:false // 双保险,禁止再修改 , 不可逆 , 还禁止删除

})

```javascript
"use strict";
var bin = {
    id:1001,
    name:'Bin',
    salary:10000
};
// 获得四大特性
var attrs = Object.getOwnPropertyDescriptor(bin,'id');
console.log(attrs);
// 修改Id属性为只读 , define定义 , property属性
Object.defineProperty(bin,'id',{
    writable:false, // 设置只读
    configurable:false // 双保险,禁止再修改 , 不可逆 , 还禁止删除
})
// 禁止遍历 , 但是不能控制 . 访问
Object.defineProperty(bin,'salary',{
    enumerable:false,
    configurable:false
})

// 设置为禁止修改 , 修改时候并不报错 , 除非开严格模式
// bin.id++;
// 删除属性
// delete bin.id;   // 设置了 config:flase 报错
console.log(bin);
```

**同时修改多个属性值的四大特性**

Object.defineProperties(obj,{

    属性名:{特性:值},

    属性名:{特性:值}

})

如果要修改的属性不存在会报错吗?

- 会自动创建新的属性
- 通过 Object.defineProperty 自动创建的属性 , 四大特性都默认为 false
- 通过 对象直接添加的新属性, 四大特性为 true

```javascript
var bin = {
    id:1001,
    name:'Bin'
};
// 同时修改多个属性的四大特性
Object.defineProperties(bin,{
    id:{writable:false,configurable:false},
    name:{configurable:false},
    // salary:{enumerable:false,configurable:false}
    // 通过这个方法添加新属性 , 四大特性默认为 False , 除非手动打开
    salary:{value:1000,writable:true,configurable:true}
})
// delete bin.name;
// bin.id++;
var attrs = Object.getOwnPropertyDescriptor(bin,'salary');
// 通过这个方法添加新属性 , 四大特性默认为 False
console.log(attrs);
console.log(bin);
```

**自定义保护**

- 数据属性四大属性只能做到基本保护 , 不能做到自定义保护
- 访问器属性:不直接存储属性,专门对其他属性提供保护的特殊属性

```javascript
var bin = {
    id:1001,
    name:'Bin'
};
(function(){
    // 实际存储数据的变量
    var _age;
    // 保护器属性 age 保护的变量是 _age;
    // 为什么要闭包?
        // 因为外部无法访问 _age , 能访问到的只有 get,set
    Object.defineProperty(bin,'age',{

        get:function(){
            return _age;
        },

        set:function(val){
            console.log(`值${val}接受检查`);
            if(val>=18&&val<=65){
                _age = val;
            }else {
                throw new RangeError("年龄必须介于18~65之间");
            }
            
        }
    })
})();
bin.age=17; 
bin._age=0; 
console.log(bin.age);   
console.log(bin._age);              

// 问题受保护的数据不能保存在普通的数据属性中,因为数据属性可以随便被修改,访问
// 解决: 闭包
```

在构造函数中使用保护
```javascript
// 在构造函数中使用四大特性保护
function Emp(id,name,salary,age){

this.id = id;
this.name = name;
this.salary = salary;
var _age;   //实际存储数据的变量
// id只读
// Name禁止删除
// salary禁止遍历,删除
// age要在18-65之间
// this是值正在创建新对象
Object.defineProperties(this,{
    id:{writable:false,configurable:false},
    name:{configurable:false},
    salary:{
        enumerable:false,configurable:false
    },
    // age是访问器属性保护_age
    age:{
        get(){
            return _age;
        },
        set(val){
            if(val>=18 && val<=64){
                _age = val;
            }else {
                throw new Error('年龄少于18或者大于65');
            }
        },
        // age是后天添加的属性全部属性都是false
        enumerable:true
    }
})

this.age = age;
}
// 在实例化对象的时候自带数据保护
var lilei = new Emp(2,'lilei',1000,10);    
```

### 保护整个对象

三个级别

- 防拓展:禁止添加新属性
    + Object.preventExtensions(obj);
- 密封:及防扩展又禁止删除任何属性
    + Object.seal(obj)  
```javascript
function Emp(id,name,salary,age){
    this.id = id;
    this.name = name;
    this.salary = salary;
    var _age;   //实际存储数据的变量
    Object.defineProperties(this,{
        // 使用了密封 , configurable可以省略
        id:{writable:false},
        salary:{
            enumerable:false
        },
        // age是访问器属性保护_age
        age:{
            get(){
                return _age;
            },
            set(val){
                if(val>=18 && val<=64){
                    _age = val;
                }else {
                    throw new Error('年龄少于18或者大于65');
                }
            },
            // age是后天添加的属性全部属性都是false
            enumerable:true
        }
    })

    this.age = age;

    // 在属性定义完以后,防扩展
        // 防止扩展新属性
    // Object.preventExtensions(this);
    // 密封:及防扩展又禁止删除任何属性
    Object.seal(this); 
 }
 // 在实例化对象的时候自带数据保护
 var lilei = new Emp(2,'lilei',1000,20);

 // Cannot add property abc, object is not extensible
 // lilei.abc = 'abc';  

 // lelie is not defined
 // delete lelie.age;
```

- 冻结
    + 防止扩展 禁止删除 同时禁止修改一切属性值     
    + Object.freeze(this);
```javascript
var config= {
    host:'localhost',
    port:'3302',
    db:'test',
    uname:'root',
    upwd:'abc'
}
Object.freeze(config);
```

兼容 IE

经典继承写法 ES5

```javascript
var o = {
    name:'Bin',
    age:'21'
};
// 返回一个新对象 , 继承来自参数中的obj
var obj = Object.create(o);
console.log(obj);

```

IE 8 没有这种写法 , 兼容 IE8 

```javascript
// 兼容IE8
// 为什么有些方法是在原型链 , 有些方法是在构造函数里面?
// 只有某一类才能使用的方法就定义在 这个类型的 原型对象中
    // arr.indexOf();
    // date.indexOf();
    // reg.indexOf();
    // 只要一个方法,只希望本类型的子对象才能调用,就保存在原型对象中
// 不限制类型的方法 , 都写在构造函数中 
// 重要希望所有对象都可以使用的方法
    // Array.isArray(obj);
    // Object.create(father);
if(typeof Object.create!=="function"){
Object.create = function(father,props){
    // 创建新对象
    function F(){};
    F.protptype = father;
    var onj = new F();
    // F函数的作用就是 为了和 father 建立关系 , 然后没用就销毁
    F=null;
    // 继承father
    // Object.setPrototypeOf(obj,father); 
    // 如果有第二个参数,就将第二个参数中的属性舔到新对象中
    if(props){
        // 四大特性是 es5 特有的
        // Object.defineProperties(obj,props);
        // 遍历Props中的每个属性 , 为Obj添加新属性
        for(var key in props){
            obj[key] = props[key.value];
        }
    }
    // 返回新对象


}
}

var father = {
bal:100000000,
car:'bmw'
}
var hmm = Object.create(father,{
// 等于直接调用了 defineProperties
phone:{
    value:'iphoneX',
    writable:true,
    enumerable:true,
    configurable:true
},
bar:{
    value:'C',
    writable:true,
    enumerable:true,
    configurable:true
}
})
console.log(hmm);
```

## bind()

- 基于一个现有函数,创建一个新的函数,永久绑定this
- 希望一个对象永久绑定在一个this上
- 会造成函数中的this将永久无法被其他对象替换
- 除了永久绑定this ,还可以绑定部分参数 
```javascript
function calc(base,bonus){
    console.log(this.name + '的总工资是'+(base+bonus));
}
var lilei = {
    name:'liLei'
};
var hmm = {
    name:'韩梅梅'
};
// 李雷临时借用calc计算器
    // call有替换this的功能
calc.call(lilei,1000,400);
calc.call(hmm,200,400);
// liLei买了一个和calc一样的计算器,新计算器永久属于李雷
var lilei_calc = calc.bind(lilei);
lilei_calc(10000,400);
lilei_calc(20000,400);
lilei_calc(30000,400);
// 尝试用call抢
lilei_calc.call(hmm,1,2);   // 失败

// 绑定部分参数
var lilei_calc10000 = calc.bind(lilei,10000);
lilei_calc10000(1); // 10001
```

**call apply bind区别**

- call 和 apply 临时借用一个函数,并把this 替换成指定对象
- call 和 aooly 立刻执行
- bind 基于现有函数,创建一个新的函数,并永久绑定this为指定对象
- bind只创建函数 , 并不执行;
- 如果立刻执行函数使用 call apply
- 如果只创建一个新的函数就用Bind 

## 其他

**语言精粹提出继承的方法**

```javascript
// 语言精粹提出的继承方式
function Jc(obj){
    var o = {};
    // o的原型对象继承obj , obj同时也继承了 Object
    o.__proto__ = obj;
    return o;
}
var o = Jc({name:'Bin'});
console.log(o);
```

**new Function() **

- Function 这个构造函数 可以用来创建函数对象
- 语法
    + 一个参数都不传的情况 创建一个空函数
        * var x = new Function();
    + 只传一个参数的情况 这个参数是函数体
        * var x = new Function('函数体');
    + 传多个参数的情况下 , 最后一个为函数体 , 前面都是形参
        * var x = new Function(x,y,z,'函数体');

**eval()**

-  eval可以将字符串转换成 js 代码
```javascript
// 不在严格模式下 , 可以正常转换
var str = 'var a = 10;';

eval(str);

console.log(a);
```

- 转换Json
    + 直接转换eval(jsonStr)会出现错误 , 原因是将 {} 转义成代码块而不是对象
- 解决
    + 在json字符串前面拼接 var o = 
    + 把json格式的字符串用()括起来 , 不会讲{}转义成代码块 , 而是表达式
    ```javascript
    // JSON
    var jsonStr = '{"name":"Bin","age":"21"}';
    // var jsonObj = eval(jsonStr);
    // console.log(jsonObj);    // SyntaxError 语法错误

    // 用eval来解析json字符串的时候,会将{}解析为代码块 , 而不是对象
    // 解决办法
        // 1.在json字符串前面拼接 var o = 
    eval('var jsonObj ='+jsonStr);
    console.log(jsonObj);       // 正常

        // 2.把json格式的字符串用()括起来 , 不会讲{}转义成代码块 , 而是表达式
            // 什么是表达式 , 就是运算
    var jsonStr2 = '({"name":"Bin","age":"21"})';   
    var o = eval(jsonStr2);
    console.log(o); 
    ```

**块级作用域**

- Javascript没有块级作用域
- Javascript中唯一能产生作用域就是 函数
- 词法作用域 
    + 写好代码那一刻 , 变量的作用域就已经确定了
    + 和词法作用域相对叫做动态作用域 , 但是Js是词法作用域 并不是 动态作用域
- 词法作用域规则
    + 函数允许访问函数外的数据
    + 整个代码结构中只有函数可以限定作用域
    + 作用域规则首先使用提升规则
    + 如果当前作用域有变量, 就不再向外寻找   
```javascript
    // 写好代码那一刻 , 变量的作用域就已经确定了
    var a = 123;
    function f1(){
        console.log(a);
    }

    function f2(){
        var a = 435;
        // 如果此时是在执行环境调用 a , 那么就是动态作用域 , 而他 直接调用最外层a
        // 所以称为词法作用域
        f1();   // 123
    }
    f1();   // 123
    f2();   // 123  
```

**js执行顺序**

- 线程
    + 一个线程只能处理一件事情 , 多个线程就能同时处理多个事情
    + Js 是单线程
```javascript
// Alert 时候程序不能继续执行 , 突出Js 是单线程
alert('卡主了,下面代码不能执行');
// 因为alert 不能继续执行
console.log('执行代码');
```

js执行流程

- 渲染任务
    + 执行html标签 css
- Js代码执行任务
    + 平时我们写的代码
- 事件处理任务
    + 回调

**回调往往是执行完主程序 再执行回调函数**

`setTimeout` 异步函数

```javascript
function foo(){
    for(var i = 0;i<10;i++){
        setTimeout(function(){
            // 输出 10 个 10 , 为什么不输出 0 - 9?
            // 因为这是异步代码 . 执行完for循环 再执行 setTimeout
            console.log(i);
        },0);
    }
}
foo();

console.log('我比setTimeout先执行');
console.log('我也是 , 虽然 设计定时器0秒钟 , 可是他在事件处理 任务中');
console.log('而平时写的代码都在 执行任务环境 中');
console.log('先执行 任务环境中的js代码 , 再去执行 事件处理环境 中的回调');   
```
图解:
![异步代码最后执行](https://raw.githubusercontent.com/CourteousBin/OO/master/images/13JS%E6%89%A7%E8%A1%8C%E9%A1%BA%E5%BA%8F.png)

```javascript
for(var i = 0 ;i<10;i++){
    function foo(j){
        var value = j;
        return function(){
            console.log(value);
        }
    }
  
    var f = foo(i);

    // f(); 这样就是直接执行闭包了;
    
    setTimeout(f,0);

    // setTimeout(f(),0);

    // 这里为什么要用 f , 而不是 f() ?
        // settimeout(function(){},time); 这个是最原始执行 定时器的格式
        // 第一个是参数function(){} , 就是要放一段函数在这里被 setTimeOut 执行
        // foo 返回的是一段函数 , 刚刚好 , 和 setTimeOut 格式一致 .

    
}

// 还是先会执行 主程序代码 , 再执行 setTimeOut 回调
console.log('测试执行顺序');
console.log('测试执行顺序');
console.log('测试执行顺序');
console.log('测试执行顺序');
```

图解闭包 + setTimeout
![图解闭包+ setTimeout](https://raw.githubusercontent.com/CourteousBin/OO/master/images/14%E9%97%AD%E5%8C%85%2BsetTimeout.png)

```javascript
// 假设有10个div
// <div>我的第1个div</div>
// ...

window.onload = function(){
var divs = document.getElementsByTagName('div');

for(var i = 0;i<divs.length;i++){
    var div = divs[i];

    // 变成回调任务 , 等执行完主程序再执行回调 , 这样的话 i就变成10
    // 永远都是 第10个
    // div.onclick = function(){
    //  alert('我的第'+test+'个Div');
    // }

    function foo(i){
        return function(){
            alert('我的第'+(i+1)+'个div');
        }
    }

    var f = foo(i);
    div.onclick = f;
}
}
```
