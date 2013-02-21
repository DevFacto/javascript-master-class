##Overview

###What is it?

- [Interpreted](http://en.wikipedia.org/wiki/Interpreted_language)
- Enables HTTP requests, DOM manipulation, user interaction in the browser
- The most popular programming language in the world (http://redmonk.com/sogrady/2012/09/12/language-rankings-9-12/) 
- Client and server (Node.js)

###Characteristics

- Prototype-based
  - No classes (for now; expected in the next major spec)
  - Can chain objects in an inheritance chain through 'prototypes's
- Weakly-typed, ad-hoc polymorphism &mdash; aka 'duck-typed'
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

###Quirks

JavaScript is famous for its quirks, made possible through its aggressive type coersion. [The WAT Video](http://www.youtube.com/watch?v=kXEgk1Hdze0) by Gary Bernhardt goes over a few.

Because of type casts, weird code can be written using only [()[]{}!+](http://patriciopalladino.com/blog/2012/08/09/non-alphanumeric-javascript.html) characters.

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

  var containO = a.filter(
            function(item){ 
              return item.indexOf('o') != -1; 
            }); // ['one', 'two', 'four'];

  var someHaveFiveLetters = a.some(
            function(item){ 
              return item.length > 4; 
            }); //true
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

###undefined, null, and truthy/falsy

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

`undefined` and `null` are two distinct types: `undefined` is a type itself (undefined) while `null` is an object.

If we want to test if a variable is `undefined` or `null`, use `a == undefined`.

```javascript
var a;
a == undefined //true
a = null;
a == undefined //true
a = '';
a == undefined //false
```

We may want to check if a variable exists. To do this, we use `typeof(a) === 'undefined'`. Unlike the last comparison, this won't cause an exception when the variable isn't present

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

Functions are just functions until invoked with the `new` keyword.

```javascript
function ClassA(a) {
  this.a = a;
}; 
var obj = new ClassA(3);
obj.a //3

```

__What is this doing under the hood you ask?__

1. It creates a new object. The type of this object is `object`; equivalent to `{}`
2. It sets this new object's internal, inaccessible, [[prototype]] property to be the constructor function's external, accessible, prototype object. 
3. It executes the constructor function, using the newly created object whenever this is mentioned.

###Closures

> In computer science, a closure is a first-class function with free variables that are bound in the lexical environment.

&mdash; Mark Thiessen, Computing Scientist, when he quoted [wikipedia](http://bit.ly/4Iou)

Basically, JavaScript allows functions to reference variables outside their own scope.

```javascript
var getPairFormatter= function(){
  var format= "{key} -> {value}";
  return function(obj){
    return format.replace('{key}', obj.key)
                 .replace('{value}', obj.value);
  };
}
var formatter = getPairFormatter();
console.log(formatter({key:'name',value:'bob'}));
```
[Code Available Here](http://jsfiddle.net/gC63h/)

Without the notion of closures, we would need to keep track of variables explicitly and pass them around as additional parameters:

```javascript
var format= "{key} -> {value}";
var getPairFormatter= function(){
  return function(obj, format){
    return format.replace('{key}', obj.key)
                 .replace('{value}', obj.value);
  };
}
var formatter = getPairFormatter();
console.log(formatter({key:'name',value:'bob'}, format));
```

Closures are sometimes hard to identify in code since binding is implicit; it would be roughly equivalent to using the `bind` function as shown below:

```javascript
var getPairFormatter= function(){
  var format= "{key} -> {value}";
  return (function(format, obj){
    return format.replace('{key}', obj.key)
                 .replace('{value}', obj.value);
  }).bind(null, format);
}
var formatter = getPairFormatter();
console.log(formatter({key:'name',value:'bob'}));
```

###Packaging JavaScript

For large projects, JavaScript can be painful to manage. There are many different strategies to mitigate this problem, but it depends on which (if any) frameworks you're using.

- __Angular JS__: Uses a module approach
  ```javascript
  var myModule = angular.module('myCompany.myModule', []);
   
  // register a new service
  myModule.value('appName', 'MyCoolApp');
   
  ...

  var otherModule = angular.module('myCompany.otherModule', ['myCompany.myModule'])

  ...
  ```
- __jQuery__: Plugin-style modules
  ```javascript
  jQuery.fn.myPlugin = function() {
    // Do your awesome plugin stuff here
  };
  ```
- __RequireJS__: Most flexible, powerful module spec
  ```javascript
  define(["./cart", "./inventory"], function(cart, inventory) {
        //return an object to define the "my/shirt" module.
        return {
            color: "blue",
            size: "large",
            addToCart: function() {
                inventory.decrement(this);
                cart.add(this);
            }
        }
    }
  );
  ```
- __NodeJS (CommonJS)__: You attach definitions to an exports object
  ```javascript
  exports.download = function(episode) {
    console.log('Downloading: ' + episode);
  }
  ```
- __Concatenation__: Let the build system concatenate files. Problematic because of potential namespace collisions, dependency ordering issues, no easy debug/production build, and potential for missing dependencies or sub-dependencies

##Frameworks

###jQuery

jQuery ($) is the most ubiquitous library known to all JavaScript-kind. jQuery is successful because it abstracts away complexity; the native DOM and XMLHttpRequest APIs are extremely tedious and prone to browser-specific differences. jQuery is also an extremely elegant framework: all jQuery objects are arrays of DOM elements at their core, and can be indexed and manipulated as such. Also, each jQuery operation on an object can be chained; the resulting code can be quite terse and powerful. A few must-knows:

- The library can be called either `jQuery` or `$` (or a custom name in no-conflict mode). The dollar sign is convention, and is a legal identifier in JavaScript.
- `$(function(){...})` is jQuery's shortcut for `$(document).ready`. When the browser has fully parsed the DOM, this function will be called. At this point its safe to start loading data and manipulating the DOM.
- Events are easy, too. Traditionally, browser events have differed across browsers, and handling them was tedious. jQuery standardizes the behaviour and simplifies calls to register handlers. Some events that you can subscribe to are:
  - mouse: `click`
  - input: `blur`
  - mouse: `hover`
  - input: `change`
- `Sizzle` is a fast and flexible library used for CSS Selection. When using jQuery with a string that isn't a html tag (`$('.somethingtoselect')`), you're using Sizzle. It [supports virtually all CSS selectors](https://github.com/jquery/sizzle/wiki/Sizzle-Documentation).
- When jQuery is called with a string tag name in angle brackets, it creates an element instead of selecting. This can be a handy way to create elements like `$('<div>')`. The result is equivalent to using `$(document.createElement('div'))`

A jQuery example that creates a div element, sets its text property, adds a click handler to it, and appends it to the page:

```javascript
$('body').append(
  $('<div>').text('A div footer').addClass('footer').click(function(event){
    alert('You clicked me!');
  });
);
```

Using native JavaScript methods would be far less terse, and requires creating a lot of intermediate variables without chaining: 

```javascript
var newDiv = document.createElement('div');
newDiv.innerText = 'A div footer';
newDiv.className = 'footer';
newDiv.onclick = function() {
  alert('You clicked me!');
};

document.body.appendChild(newDiv);
```

###Other Frameworks

There is a cornucopia of different MV* Frameworks. A few examples for the record:

####Ember.js

Uses traditional MVC structure. Templates, Models, Views, Controllers can all be defined and managed similar to Backbone or Knockout. Expect to see a lot of

```html
<script type="text/x-handlebars">
    {{view Ember.TextField valueBinding="App.radio1"}}
</script>
```

####No Library / Homebrewed

For smaller projects, it is common to use widgets piecemeal. As projects scale, this becomes a maintainability issue.

```javascript
//Using jQuery plugin
$('.thingy').typeahead();

//Custom widget
function widget(name) {
  return $('<div>').text(name)
}

$('body').append(widget('something'));
```
The major disadvantage to this style of development aside from its inherent inconsistency is that there is no binding. UI elements must be refreshed manually when changes are made to the model.

####Angular

Angular is a unique library because it uses the DOM instead of templates to define the app. It also makes heavy use of dependency injection which solves a lot of standard web development problems like passing around dependencies.

###Make-your-life-easier Libraries

####Underscore (lodash.js)

Underscore gives developers some handy functions that aren't available in JavaScript natively. Examples are:

- `clone`
- `merge`
- `contains`

Some of the methods will be supported natively in future versions of JS, or may be included in jQuery or Angular, but these libraries are useful polyfills nonetheless.

#### Bootstrap

Bootstrap is the single most popular scaffolding library known to the internet. It is a favourite because it is developed by some smart people at Twitter and because it does a good job at reducing boilerplate while staying extremely configurable. It should be a part of every new project.

##Tools

###Chrome Web Inspector

- better inspector, live update, undo, good debugger
- $0 

###jsFiddle

jsFiddle, jsBin, jsConsole, jsPerf. There are hundreds of sites dedicated to making your development easier.

###Node.js (command line)

If you are curious, there is an easy way to play around with JavaScript without the need for even a browser. Grab node.js from the [download site](http://nodejs.org/download/). It uses Chrome's V8 JavaScript engine, and has a Command Line Interface (CLI) you can run by typing `node`.

###Yeoman for scaffolding and mocking up

Yeoman is a scaffolding tool that allows developers to build the skeleton of an app effortlessly.

##Testing in JS

As the size of JavaScript projects has grown, there has been more need to use frameworks for testing. A few of the most popular:

- __Jasmine__: A visual testing framework for testing in a BDD style

- __PhantomJS__: A Headless WebKit browser that can run tests in the background.

__Does your Web App need unit tests?__ If there is a lot of business logic on client side, you may want to create a suite of tests. Their purpose is two-fold: ensuring consistent behaviour after changes are made, and documenting the important behaviour of the app.
Write tests for things that you or team could easily break or where mistakes could happen. When you find bugs, write tests to ensure they don't come back.

## General Advice

- After deciding which browsers to support, test, test, test on those platforms to squish any cross-platform issues.
- Start responsive, progressively enhance experience. In all design decisions, keep mobile users in mind.
- Avoid highly customized controls as they can have disastrous consequences in maintainability.
- Don't be afraid to customize libraries to your needs, but make sure your changes are future-proof by keeping your changes in source control.
- Know your tools; spend time in your IDE, on the command line, and in Web Inspector
- Try to keep the cycle between making changes and viewing the results as close as possible. Use tools like live-reload, run tests when files change, etc

### Other Resources

- __JavaScript, the Good Parts__, Douglas Crockford
- [MDN](https://developer.mozilla.org/en-US/)