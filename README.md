# Javascript 面向对象

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
- 闭包要解决什么问题
    + 函数内部的函数中可以访问该函数变量
    + 但是我们需要在函数外部中访问函数内部变量 

- 闭包基本模式 
    + 在外部函数(foo)内部创建函数(inner) , 在这个函数内部中(inner)可以操作foo中的数据   (inner可以修改num)
    + 将外部函数中的返回值 设置为 内部函数 , (返回 inner)
    + 在外部调用 外部函数(foo) , 就可以接受到返回值 (inner)
    + 使用这个内部函数,就可以在外部 将 外部函数里的变量(num) 进行修改

- 缺点
    + 消耗更多的内存 

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
