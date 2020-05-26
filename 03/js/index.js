// Chapter 3: Digging to the Roots of JS

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

// Iterables
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

// Consoling only kets
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

// ********Closure

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
