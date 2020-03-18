# 第十一章 Promises和异步函数
本章包括以下内容
-	异步编程的介绍
-	Promises
-	异步函数

本章内容可以在WROX.COM进行下载
请注意，本章中的所有代码示例均可以在本书网站www.wrox.com/go/projavascript4e的“代码下载”选项卡中下载获取。

在以ES6开始的ECMAScript版本中，对异步行为的支持和工具都已经复兴。ECMAScript6引入了一种正式的**Promise**引用类型，允许优雅地定义和组织异步行为。更高的版本还使用**async**和**await**关键字支持异步函数，对语言进行了扩展。

注意：整个章节中，示例广泛使用了异步的日志函数**setTimeout(console.log, 0, …params)**，用于演示执行顺序和其他异步行为特性。尽管日志输出显示为同步打印，实际上，日志输出是**异步打印**的。这样做是为了允许类似promise的值呈现其最终状态。

此外，浏览器控制台输出将会经常打印有关JavaScript运行时（如promise的状态）无法使用的对象的信息。在本章的示例中，大量使用了这个特性，以帮助读者理解。

## 1 异步编程的介绍
在计算机科学中，同步行为和异步行为之间的二元性是一个基本概念，尤其是在JavaScript这种**单线程事件循环**模型中。面对高延迟的操作，异步行为是出于对更高计算吞吐量进行优化的需要。如果在一个计算完成时仍然可以运行其他指令，并且仍然保持系统稳定，那么这样做是实用的。

重要的是，异步操作不一定是计算密集型操作或者高延迟操作。它可以在不需要阻塞执行线程以等待异步行为发生的任何地方使用。

### 1.1 同步JavaScript与异步JavaScript
**同步行为**类似于内存中的顺序处理器指令。每一条指令均严格按照其出现顺序去执行，并且每一条指令能够立即查询到系统（例如，在处理器寄存器或者系统内存中）中本地存储的信息。因此，很容易推断出代码中任意给定节点的程序状态（例如，变量的值）。

一个简单的示例就是执行一个简单的算术运算：

```JavaScript
let x = 3;
x = x + 4;
```

这段程序中的每一个步骤，都可能推断出程序的状态，因为直到前一条指令完成时执行才会继续。当最后一条指令完成，x的计算值立即可用。

这个JavaScript代码片段很容易推断，因为不难预料到这会编译为哪些低级指令（例如，从JavaScript到x86）。据推测，操作系统将会为位于栈内部的浮点数分配一些内存，对该值执行算术运算，然后将结果写入已分配的内存中。在单线程执行内部，所有的这些指令串行存在。在已编译的低级程序中的每个节点，都具备了断言能力来识别系统状态哪些是已知的、哪些是未知的。

相反，**异步行为**类似于中断，其中当前进程外部的实体能够触发代码执行。异步操作常常是需要的，因为为了一个操作的完成（同步操作就是这种情况）而强制进程执行、从而等待很长的时间是不可行的。由于代码在访问一个高延迟性的资源，例如向远程服务器发送一个请求，并等待响应返回，所以，这种长时间的等待是有可能发生的。
一个简单的JavaScript示例是，在超时函数中执行算术运算：

```JavaScript
let x = 3;
setTimeout(() => x = x + 4, 1000);
```

最终，这程序执行了与同步模式下的相同工作（将两个数加在一起），但是，这个执行线程无法确切知道x的值何时会更改，因为这取决于回调函数何时从消息队列中取出并执行。

这段代码并不那么容易推断。虽然在这个示例中使用的低级代码指令最终与之前示例中所做的工作相同，但是第二个指令块（加法运算和赋值）是由系统计时器触发的，这会生成一个进入队列执行的中断。确切地说，当这个中断触发时，对于JavaScript运行时来说是黑盒子，因此实际上无法确切知道中断会在什么时候发生（虽然可以保证在当前同步执行的线程完成后，因为回调函数尚未有机会从消息队列中取出并且执行）。因此，在回调函数被调度后，通常无法断言系统状态会在何时发生改变。

为了告知x的值已经更新并且是可以使用的，这个异步执行函数需要向剩余部分的程序发出信号，告知x的值已经更新了。然而，如果程序并不需要使用到这个值，那么可以自由地继续执行其他工作，而无须等待结果。

设计一个可以在何时知道x的值可以被读取的系统是非常棘手的。JavaScript内部这种系统的实现已经经历了多次迭代。

### 1.2 旧版异步编程模式
长期以来，异步行为一直是JavaScript重要但又丑陋的基石。在该语言的早期版本中，异步操作仅仅支持回调函数的定义，用于表明异步操作已经完成。串行化的异步行为是一个常见问题，通常通过充满嵌套回调函数的代码库来解决，这常常被称为“回调地狱”。

假定处理以下的异步函数，在1秒后该函数使用setTimeout来执行一些操作：

```JavaScript
function double(value) {
  setTimeout(() => setTimeout(console.log, 0, value * 2), 1000);
}
double(3); // 6 (大约1000ms后，6被打印输出)
```

这里发生的并没有神奇之处，但是，准确理解为什么这是一个异步函数是非常重要的。setTimeout允许回调函数的定义，该回调函数会在指定的时间后被调度执行。经过1000ms，JavaScript运行时通过把该回调函数放入JavaScript消息队列中从而进行调度执行。这个回调函数会采用对于JavaScript代码完全不可见的方式从消息队列中取出并执行。此外，在setTimeout调度操作完成后，double()函数将立即退出。

#### 1.2.1 返回异步值
假设setTimeout操作返回了一个值。将这个值传递到被需要的地方的最佳方式是什么呢？广泛接受的策略是给异步操作一个回调函数，其中该回调函数包含了需要访问已经计算好的值（作为参数提供出去）的代码。如下所示：

```JavaScript
function double(value, callback) {
  setTimeout(() => callback(value * 2), 1000);
}
double(3, (x) => console.log(`I was given: ${x}`));
// I was given: 6 (大约1000ms后，6被打印输出)
```

此处，经过1000ms后，setTimeout调用会将一个函数放入消息队列。该函数将会被运行时从消息队列中取出并异步执行。通过函数闭包，该回调函数以及它的参数在异步执行中仍然是可以使用的。

#### 1.2.2 处理失败
失败的可能性也需要纳入此回调模型中，因为通常采用成功和失败回调的形式：

```JavaScript
function double(value, success, failure) {
  setTimeout(() => {
    try {
      if (typeof value !== 'number') {
      throw 'Must provide number as first argument';
    }
    success(2 * value);
    } catch (e) {
      failure(e);
    }
  }, 1000);
}

const successCallback = (x) => console.log(`Success: ${x}`);
const failureCallback = (e) => console.log(`Failure: ${e}`);

double(3, successCallback, failureCallback);
double('b', successCallback, failureCallback);
// Success: 6 (大约1000ms后，6被打印输出)
// Failure: Must provide number as first argument (大约1000ms后被打印输出)
```

这种形式的不可取的，因为初始化异步操作时必须定义回调函数。从异步函数返回的值是瞬态的，因此只有已经准备好接受这瞬态值的函数才可以访问它。

#### 1.2.3 嵌套异步回调函数
当访问的异步值依赖于其他异步值，这种回调情况是非常复杂的。在回调函数的世界里，需要使用嵌套回调：

```JavaScript
function double(value, success, failure) {
  setTimeout(() => {
    try {
      if (typeof value !== 'number') {
        throw 'Must provide number as first argument';
      }
      success(2 * value);
    } catch (e) {
      failure(e);
    }
  }, 1000);
}

const successCallback = (x) => {
  double(x, (y) => console.log(`Success: ${y}`));
};

const failureCallback = (e) => console.log(`Failure: ${e}`);

double(3, successCallback, failureCallback);
// Success: 12 (printed after roughly 1000ms)
```

随着代码复杂度的增加，这种回调策略的扩展性变差也就不足为奇了。“回调地狱”的称谓是实至名归的，因为受到这种结构影响的JavaScript代码会变得几乎难以维护。
## 2 Promises
### 2.1 Promises/A+规范



### 2.2 Promise基础
#### 2.2.1 Promise状态机制

#### 2.2.2 决议值、拒绝原因以及Promise的实用性

#### 2.2.3 使用执行器控制Promise状态

#### 2.2.4 使用Promise.resolve()进行Promise转换

#### 2.2.5 使用Promise.reject()进行Promise拒绝

#### 2.2.6 同步/异步执行的二元性


### 2.3 Promise实例方法

#### 2.3.1 实现Thenable接口

#### 2.3.2 Promise.prototype.then()

#### 2.3.3 Promise.prototype.catch()

#### 2.3.4 Promise.prototype.finally()

#### 2.3.5 非可重入Promise方法

#### 2.3.6 执行的兄弟处理器顺序

#### 2.3.7 决议值和拒绝原因传递

#### 2.3.8 拒绝Promise和拒绝错误处理


### 2.4 Promise链和合成

#### 2.4.1 Promise链

#### 2.4.2 Promise图

#### 2.4.3 使用Promise.all()和Promise.race()的并行Promise合成

##### 2.4.3.1 Promise.all()

##### 2.4.3.2 Promise.race()

#### 2.4.4 串行Promise合成

### 2.5 Promise扩展

#### 2.5.1 Promise取消

#### 2.5.2 Promise进度通知





## 3 异步函数





































