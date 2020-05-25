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
