// Chapter 3: Digging to the Roots of JS

// **********Iteration, Iterable, Iterator******** ==================================================================================

// for..of Loop iterator
const it = [1, 2, 3, 4, 5, 6];
for (let value of it) {
  console.log(`This is ${value}`);
}

// Another mechanism that's often used for consuming iterators is the ... operator. This operator actually has two
// symmetrical forms: spread and rest (or gather, as I prefer). The spread form is an iterator-consumer.
// To spread an iterator, you have to have something to spread it into. There are two possibilities in JS: an array or an
// argument list for a function call.
// An array spread:

var vals = [...it];
// spread an iterator into an array,
// with each iterated value occupying
// an array element position.

function doSomethingUseful(arr) {
  console.log(arr);
}

doSomethingUseful(...it); // or doSomethingUseful([...it]) ?!
// spread an iterator into a function,
// call with each iterated value
// occupying an argument position.

// ***** Iterables
// The iterator-consumption protocol is technically defined for consuming iterables; an iterable is a value that can be
// iterated over.
// The protocol automatically creates an iterator instance from an iterable, and consumes just that iterator instance to
// its completion. This means a single iterable could be consumed more than once; each time, a new iterator instance
// would be created and used.
// So where do we find iterables?
// ES6 defined the basic data structure/collection types in JS as iterables. This includes strings, arrays, maps, sets,
// and others.
// Consider:

// an array is an iterable
var arr = [10, 20, 30];
for (let val of arr) {
  console.log(`Array value: ${val}`);
}
// Array value: 10
// Array value: 20
// Array value: 30

// Since arrays are iterables, we can shallow-copy an array using iterator consumption via the ... spread operator:
var arrCopy = [...arr];

// We can also iterate the characters in a string one at a time:
var greeting = "Hello world!";
var chars = [...greeting];
console.log(chars);
// [ "H", "e", "l", "l", "o", " ",
// "w", "o", "r", "l", "d", "!" ]

// A Map data structure uses objects as keys, associating a value (of any type) with that object. Maps have a
// different default iteration than seen here, in that the iteration is not just over the map's values but instead its
// entries. An entry is a tuple (2-element array) including both a key and a value.
// Consider:
// given two DOM elements, `btn1` and `btn2`
var buttonNames = new Map();
const btn1 = document.querySelector(".btn1"),
  btn2 = document.querySelector(".btn2");
buttonNames.set(btn1, "Button 1");
buttonNames.set(btn2, "Button 2");
console.log(buttonNames);

for (let [btn, btnName] of buttonNames) {
  console.log(btn);
  btn.addEventListener("click", function onClick() {
    console.log(`Clicked ${btnName}`);
  });
}

// In the for..of loop over the default map iteration, we use the [btn,btnName] syntax (called "array
// destructuring") to break down each consumed tuple into the respective key/value pairs ( btn1 / "Button 1"
// and btn2 / "Button 2" ).
// Each of the built-in iterables in JS expose a default iteration, one which likely matches your intuition. But you can
// also choose a more specific iteration if necessary. For example, if we want to consume only the values of the above
// buttonNames map, we can call values() to get a values-only iterator:
for (let btnName of buttonNames.values()) {
  console.log(btnName);
}
// Button 1
// Button 2

var arr = [10, 20, 30];
// Consoling [key, value] pairs
for (let [idx, val] of arr.entries()) {
  console.log(`[${idx}]: ${val}`);
}
// [0]: 10
// [1]: 20
// [2]: 30

// Consoling only keys
for (let key of arr.keys()) {
  console.log(key);
}
// Consoling only values
for (let value of arr.values()) {
  console.log(value);
}

// Consoling [Key, Value] pairs using forEach()
arr.forEach(function (value, key) {
  console.log(key, value);
});

// For the most part, all built-in iterables in JS have three iterator forms available: keys-only ( keys() ), values-only
// ( values() ), and entries ( entries() ).

// Beyond just using built-in iterables, you can also ensure your own data structures adhere to the iteration protocol;
// doing so means you opt into the ability to consume your data with for..of loops and the ... operator.
// "Standardizing" on this protocol means code that is overall more readily recognizable and readable.

// ********Closure ******** =============================================================================================================

// Perhaps without realizing it, almost every JS developer has made use of closure. In fact, closure is one of the most
// pervasive programming functionalities across a majority of languages. It might even be as important to understand
// as variables or loops; that's how fundamental it is.
// Yet it feels kind of hidden, almost magical. And it's often talked about in either very abstract or very informal terms,
// which does little to help us nail down exactly what it is.
// We need to be able to recognize where closure is used in programs, as the presence or lack of closure is
// sometimes the cause of bugs (or even the cause of performance issues).
// So let's define closure in a pragmatic and concrete way:
// Closure is when a function remembers and continues to access variables from outside its scope, even when
// the function is executed in a different scope.
// We see two definitional characteristics here. First, closure is part of the nature of a function. Objects don't get
// closures, functions do. Second, to observe a closure, you must execute a function in a different scope than where
// that function was originally defined.

function greetings(msg) {
  return function who(name) {
    console.log(`${msg} ${name}`);
  };
}

const hello = greetings("Hello");
const hi = greetings("Hi");

hello("Max");
hi("Jonas");

// First, the greeting(..) outer function is executed, creating an instance of the inner function who(..) ; that
// function closes over the variable msg , which is the parameter from the outer scope of greeting(..) . When
// that inner function is returned, its reference is assigned to the hello variable in the outer scope. Then we call
// greeting(..) a second time, creating a new inner function instance, with a new closure over a new msg , and
// return that reference to be assigned to howdy .

// When the greeting(..) function finishes running, normally we would expect all of its variables to be garbage
// collected (removed from memory). We'd expect each msg to go away, but they don't. The reason is closure. Since
// the inner function instances are still alive (assigned to hello and howdy , respectively), their closures are still
// preserving the msg variables.

// These closures are not a snapshot of the msg variable's value; they are a direct link and preservation of the
// variable itself. That means closure can actually observe (or make!) updates to these variables over time.

function counter(step = 1) {
  var count = 0;
  return function increaseByCount() {
    return (count = count + step);
  };
}

const incByDefault = counter();
console.log(incByDefault()); // 1

const incBy1 = counter(1);
console.log(incBy1()); // 1

const incBy5 = counter(5);
console.log(incBy5()); // 5
console.log(incBy5()); // 10
console.log(incBy5()); // 15

// Each instance of the inner increaseCount() function is closed over both the count and step variables from
// its outer counter(..) function's scope. step remains the same over time, but count is updated on each
// invocation of that inner function. Since closure is over the variables and not just snapshots of the values, these
// updates are preserved.
// Closure is most common when working with asynchronous code, such as with callbacks. Consider:

// function getSomeData(url) {
//   ajax(url, function onResponse(resp) {
//     console.log(`Response (from ${url}): ${resp}`);
//   });
// }
// getSomeData("https://some.url/wherever");
// Response (from https://some.url/wherever): ...

// The inner function onResponse(..) is closed over url , and thus preserves and remembers it until the Ajax call
// returns and executes onResponse(..) . Even though getSomeData(..) finishes right away, the url
// parameter variable is kept alive in the closure for as long as needed.

// It's not necessary that the outer scope be a function—it usually is, but not always—just that there be at least one
// variable in an outer scope accessed from an inner function:
const buttons = [btn1, btn2];

for (let [idx, btn] of buttons.entries()) {
  btn.addEventListener("click", function onClick() {
    console.log(`Clicked on button (${idx})!`);
  });
}

// Because this loop is using let declarations, each iteration gets new block-scoped (aka, local) idx and btn
// variables; the loop also creates a new inner onClick(..) function each time. That inner function closes over
// idx , preserving it for as long as the click handler is set on the btn . So when each button is clicked, its handler
// can print its associated index value, because the handler remembers its respective idx variable.
// Remember: this closure is not over the value (like 1 or 3 ), but over the variable idx itself because we are using only idx on inner function.

// Closure is one of the most prevalent and important programming patterns in any language. But that's especially
// true of JS; it's hard to imagine doing anything useful without leveraging closure in one way or another.
// If you're still feeling unclear or shaky about closure, the majority of Book 2, Scope & Closures is focused on the
// topic.

// ********* this Keyword ********** ================================================================================================

// One of JS's most powerful mechanisms is also one of its most misunderstood: the this keyword. One common
// misconception is that a function's this refers to the function itself. Because of how this works in other
// languages, another misconception is that this points the instance that a method belongs to. Both are incorrect.
// As discussed previously, when a function is defined, it is attached to its enclosing scope via closure. Scope is the
// set of rules that controls how references to variables are resolved.

// But functions also have another characteristic besides their scope that influences what they can access. This
// characteristic is best described as an execution context, and it's exposed to the function via its this keyword.
// Scope is static and contains a fixed set of variables available at the moment and location you define a function, but
// a function's execution context is dynamic, entirely dependent on how it is called (regardless of where it is defined
// or even called from).

// this is not a fixed characteristic of a function based on the function's definition, but rather a dynamic
// characteristic that's determined each time the function is called.
// One way to think about the execution context is that it's a tangible object whose properties are made available to a
// function while it executes. Compare that to scope, which can also be thought of as an object; except, the scope
// object is hidden inside the JS engine, it's always the same for that function, and its properties take the form of
// identifier variables available inside the function.

function classroom(teacher) {
  return function study() {
    console.log(`${teacher} says to study ${this.topic}`);
  };
}
var assignment = classroom("Max");

// The outer classroom(..) function makes no reference to a this keyword, so it's just like any other function
// we've seen so far. But the inner study() function does reference this , which makes it a this -aware
// function. In other words, it's a function that is dependent on its execution context.
// NOTE:
// study() is also closed over the teacher variable from its outer scope.
// The inner study() function returned by classroom("Kyle") is assigned to a variable called assignment .
// So how can assignment() (aka study() ) be called?
assignment();
// Kyle says to study undefined -- Oops :(

// In this snippet, we call assignment() as a plain, normal function, without providing it any execution context.
// Since this program is not in strict mode (see Chapter 1, "Strictly Speaking"), context-aware functions that are called
// without any context specified default the context to the global object ( window in the browser). As there is no
// global variable named topic (and thus no such property on the global object), this.topic resolves to
// undefined .
// Now consider:

var homework = {
  topic: "JavaScript",
  assignment,
};

homework.assignment();

// A copy of the assignment function reference is set as a property on the homework object, and then it's called
// as homework.assignment() . That means the this for that function call will be the homework object.
// Hence, this.topic resolves to "JS" .

var otherHomework = {
  topic: "Node.js",
};

assignment.call(otherHomework);
// Kyle says to study Node.js

// The same context-aware function invoked three different ways, gives different answers each time for what object
// this will reference.

// ***** Prototypes ***** ===============================================================================================================

// Where this is a characteristic of function execution, a prototype is a characteristic of an object, and specifically
// resolution of a property access.
// Think about a prototype as a linkage between two objects; the linkage is hidden behind the scenes, though there are
// ways to expose and observe it. This prototype linkage occurs when an object is created; it's linked to another object
// that already exists.
// A series of objects linked together via prototypes is called the "prototype chain."
// The purpose of this prototype linkage (i.e., from an object B to another object A) is so that accesses against B for
// properties/methods that B does not have, are delegated to A to handle. Delegation of property/method access
// allows two (or more!) objects to cooperate with each other to perform a task.
// Consider defining an object as a normal literal:

var game = {
  name: "Company Of Heroes 2",
};

// The game object only has a single property on it: name . However, its default prototype linkage connects to
// the Object.prototype object, which has common built-in methods on it like toString() and valueOf() ,
// among others.
// We can observe this prototype linkage delegation from game to Object.prototype :
console.log(game.toString()); // [object Object]
// game.toString() works even though game doesn't have a toString() method defined; the
// delegation invokes Object.prototype.toString() instead.

// ***** Object Linkage
// To define an object prototype linkage, you can create the object using the Object.create(..) utility:

var mathHomework = {
  topic: "JS",
};
var anotherHomework = Object.create(mathHomework);
console.log(anotherHomework);
console.log(anotherHomework.topic); // JS

// The first argument to Object.create(..) specifies an object to link the newly created object to, and then
// returns the newly created (and linked!) object.

// Delegation through the prototype chain only applies for accesses to lookup the value in a property. If you assign to
// a property of an object, that will apply directly to the object regardless of where that object is prototype linked to.
// TIP:
Object.create(null);
// creates an object that is not prototype linked anywhere, so it's purely just a standalone
// object; in some circumstances, that may be preferable.
// Consider:

console.log(mathHomework.topic); // JS
console.log(anotherHomework.topic); // JS
anotherHomework.topic = "Node.js"; // Changing the anotheHomework.topic
console.log(anotherHomework.topic); // Node.js
console.log(mathHomework.topic); // JS not Node.js !

// The assignment to topic creates a property of that name directly on otherHomework ; there's no effect on the
// topic property on homework . The next statement then accesses otherHomework.topic , and we see the
// non-delegated answer from that new property: "Math" .

// ** Lets not confuse the Object.create() with short hands of it like below
const newGame = game;
// The above will grab the game Object from same reference identity so if we change anything in new game means it will change in game itself too
// The reason is because we are not re-creating the newGame object from game but we are referencing to the same identity
console.log(newGame.name); // Company Of Heroes
newGame.name = "PUBG";
console.log(game.name); // PUBG

// The name on newGame is "shadowing" the property of the same name on the game object in the
// chain.

// NOTE:
// Another frankly more convoluted but perhaps still more common way of creating an object with a prototype
// linkage is using the "prototypal class" pattern, from before class (see Chapter 2, "Classes") was added in ES6.
// We'll cover this topic in more detail in Appendix A, "Prototypal 'Classes'".
