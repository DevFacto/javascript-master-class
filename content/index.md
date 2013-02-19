#Intro to JavaScript (ECMAScript, JScript, etc)

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