## 克隆数组

javascript设计时，漏掉了数组的复制功能。在ES5中，开发者经常使用concat()方法来克隆。

```
var colors = ["red","green","blue"];
var cloneColors = colors.concat();
console.log(cloneColors); //["red","green","blue"];
```
在ES6中，可以使用对象数组结构来实现

```
let colors = ["red","green","blue"];
let [...cloneColors] = colors;
console.log(cloneColors); //["red","green","blue"];
```
