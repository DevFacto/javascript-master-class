#Intro to JavaScript (ECMAScript, JScript, etc)

##Overview

###What is it?

- An interpreted programming language
- Enables HTTP requests, DOM manipulation, user interaction in the browser
- Grew to be most popular programming language* 
- Is now used on client and server (Node.js)

<sub>*redmonk.com</sub>

###Characteristics

- Prototype-based
  - No classes (for now)
  - Can chain objects in an inheritance chain through 'prototypes's
- Weakly-typed, ad-hoc polymorphism aka 'duck-typed'
- First-class functions
  - Functions are objects
  - Can be arguments to other functions, returned from functions, assigned to variables

```javascript
function a() {
	...
}

function b(parameter) {
	return parameter;
}

var c = b(a);
```

###Qurks

JavaScript is famous for its quirks, made possible through its aggressive type coersion. [The WAT Video](http://www.youtube.com/watch?v=kXEgk1Hdze0) by Gary Bernhardt goes over a few.

Code can be written using only [()[]{}!+](http://patriciopalladino.com/blog/2012/08/09/non-alphanumeric-javascript.html) characters.

```javascript
+!''+[] //'1'
```

Others gotchas include:

- Variable Hoisting
  ```javascript
  var a = b; //undefined, but no error
  var b = 3;
  a = b; //3
  ```
- 'this' variable means different things in different situations
  ```javascript
  function a() {
    console.log(this);
  }

  a(); //this=undefined

  var o = '{name: 'Root Object', a: a}';
  o.a(); //this=o

  a.call('Something Else') //this='Something Else'

  ```
- aggressive type coersion (see above)
- implicity global variable scope
  ```javascript
  !function(){ 
    a = 3; //no 'var' 
  }()
  console.log(a); //3
  ```
- no classic OO inheritance model
- many 'deprecated' language features: with, eval, String.prototype.blink, etc
- implementation differences across platforms
- `for...in` vs `for()`

###The Reinvention of JS

####ES5
- Array extras
  ```javascript
  var a = ['one', 'two', 'three', 'four', 'five']

  var containO = a.filter(function(item){ return item.indexOf('o') != -1; }); // ['one', 'two', 'four'];

  var someHaveFiveLetters = a.some(function(item){ return item.length > 4; }); //true
  ```
- Object.create
  ```javascript
  function Animal() {
     ...
  }
  
  //Tedious way of doing inheritance
  function Cat(name) {
    this.name = name;
  }

  //Copy each attribute on Animal Function to Cat Function
  //Equivalent to 'static' variables
  Object.keys(Animal).forEach(function(attribute) {
    Cat[attribute] = Animal[attribute];
  });

  //Do the prototype chain shuffle
  function ctor() { this.constructor = Cat; }
  ctor.prototype = new Animal();

  Cat.prototype = new ctor();

  //Improved way of doing inheritance
  function Cat(name) {
    var cat = Object.create(new Animal());
    cat.name = name;
    return cat;
  }

  //As an added benefit, if we forget the `new` keyword
  //to the second version, we don't get `undefined`

  ```
- GeoLocation
- Iterators
- Object.getPrototypeOf

####ES6
- Default Parameters
- Template Strings
- New Variable modifiers (let, const)
- Destructuring Assignment

##Dirty Details

###undefined, null and checking for values

In JavaScript, `undefined` means a variable has been declared but has not yet been assigned a value. This variable can be anywhere in the current function (scope) since it will be 'hoisted'.

```javascript
var TestVar;
alert(TestVar); //shows undefined
alert(typeof TestVar); //shows undefined
```

`null` is an assignment value, and can be assigned to a variable as a representation of no value.

```javascript
var TestVar = null;
alert(TestVar); //shows null
alert(typeof TestVar); //shows object
```

`undefined` and `null` are two distinct types: undefined is a type itself (undefined) while null is an object.

Use `a == undefined`

```javascript
var a;
a == undefined //true
a = null;
a == undefined //true
a = '';
a == undefined //false
```

We may want to check if a variable exists. To do this, we use `typeof(a) === 'undefined'` which doesn't cause an exception when the variable isn't present

```javascript
var a, b = null, c=0, d='';

console.log("a: " + !!a); //false
console.log("typeof(a) ==='undefined': " + (typeof(a) === 'undefined')); //true
console.log('a == null: ' + (a == null)); //true
console.log('a == undefined: ' + (a == undefined)); //true
console.log('a === null: ' + (a === null)); //false
console.log('a === undefined: ' + (a === undefined)); //true

console.log("b: " + !!b); //false
console.log("typeof(b) ==='undefined': " + (typeof(b) === 'undefined')); //false
console.log('b == null: ' + (b == null)); //true
console.log('b == undefined: ' + (b == undefined)); //true
console.log('b === null: ' + (b === null)); //true
console.log('b === undefined: ' + (b === undefined)); //false

console.log("c: " + !!c); //false

console.log("d: " + !!d); //false

console.log("typeof(e) ==='undefined': " + (typeof(e) === 'undefined')); //true
```

###Equality Comparisons

To quote Douglas Crockford's excellent JavaScript: The Good Parts,

> JavaScript has two sets of equality operators: === and !==, and their evil twins == and !=. The good ones work the way you would expect. If the two operands are of the same type and have the same value, then === produces true and !== produces false. The evil twins do the right thing when the operands are of the same type, but if they are of different types, they attempt to coerce the values. the rules by which they do that are complicated and unmemorable. These are some of the interesting cases:

  ```javascript
  '' == '0'           // false
  0 == ''             // true
  0 == '0'            // true

  false == 'false'    // false
  false == '0'        // true

  false == undefined  // false
  false == null       // false
  null == undefined   // true

  ' \t\r\n ' == 0     // true
  ```

> The lack of transitivity is alarming. My advice is to never use the evil twins. Instead, always use ===and !==. All of the comparisons just shown produce false with the === operator.

###Creating Objects