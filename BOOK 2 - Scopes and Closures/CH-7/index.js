// ******** Chapter 7: Closures

// outer/global scope: RED(1)
function lookupStudent(studentID) {
  // function scope: BLUE(2)

  var students = [
    { id: 14, name: "Kyle" },
    { id: 73, name: "Suzy" },
    { id: 112, name: "Frank" },
    { id: 6, name: "Sarah" },
  ];

  return function greetStudent(greeting) {
    // function scope: GREEN(3)

    var student = students.find((student) => student.id == studentID);

    return `${greeting}, ${student.name}!`;
  };
}

var chosenStudents = [lookupStudent(6), lookupStudent(112)];

// accessing the function's name:
chosenStudents[0].name;
// greetStudent

console.log(chosenStudents[0]("Hello"));
// Hello, Sarah!

console.log(chosenStudents[1]("Howdy"));
// Howdy, Frank!

function makeCounter() {
  var count = 0;

  return function getCurrent() {
    count = count + 1;

    return count;
  };
}

var next = makeCounter();

console.log(next()); // 1
console.log(next()); // 2
console.log(next()); // 3
console.log(next()); // 4
console.log(next()); // 5

var keeps = [];

for (var i = 0; i < 3; i++) {
  keeps[i] = function keepI() {
    // closure over `i`
    return i;
  };
}

console.log(keeps[0]()); // 3 -- WHY!?
keeps[1](); // 3
keeps[2](); // 3

var keeps = [];

for (var i = 0; i < 3; i++) {
  // new `j` created each iteration, which gets
  // a copy of the value of `i` at this moment
  let j = i;

  // the `i` here isn't being closed over, so
  // it's fine to immediately use its current
  // value in each loop iteration
  keeps[i] = function keepEachJ() {
    // close over `j`, not `i`!
    return j;
  };
}
console.log(keeps[0]()); // 0
console.log(keeps[1]()); // 1
console.log(keeps[2]()); // 2

var keeps = [];

for (let i = 0; i < 3; i++) {
  // the `let i` gives us a new `i` for
  // each iteration, automatically!
  keeps[i] = function keepEachI() {
    return i;
  };
}
console.log(keeps[0]()); // 0
console.log(keeps[1]()); // 1
console.log(keeps[2]()); // 2

// *********** SUPER IMPORTANT => Closure's Exact Definition

// Closure is observed when a function uses variable(s) from outer scope(s) even while running in a scope where those variable(s) wouldn't be accessible.

// The key parts of this definition are:

// - Must be a function involved

// - Must reference at least one variable from an outer scope

// - Must be invoked in a different branch of the scope chain from the variable(s)

// These examples are NOT closure:

// [1#]
function lookupStudent(studentID) {
  return function nobody() {
    var msg = "Nobody's here yet.";
    console.log(msg);
  };
}

var student = lookupStudent(112);

student(); // Nobody's here yet.

// Reason: The studentId is not used in the inner scoped function so no closure happens

// [2#]
var students = [
  { id: 14, name: "Kyle" },
  { id: 73, name: "Suzy" },
  { id: 112, name: "Frank" },
  { id: 6, name: "Sarah" },
];

function getFirstStudent() {
  return function firstStudent() {
    return students[0].name;
  };
}

var student = getFirstStudent();

student(); // Kyle

// Reason: The students variable is used inside firstStudent() function from inner scope of getFirstStudent() function
// But student() invokation of that inner function happens in the same scope of var students = [...] so this invokation has
// access to the variable easily without closure's need.

// [3#]
function say(myName) {
  var greeting = "Hello";
  output();

  function output() {
    console.log(`${greeting}, ${myName}!`);
  }
}

say("Kyle");
// Hello, Kyle!

// Reason: The inner output() function uses myName and greeting variables which can be closure but the invokation of that output() function is inside the same scope where myName and greeting variables are declared so there is no need to use closure over those variables.

// ******** Cleaning Closures!
// Example:
const btn1 = document.getElementById("btn1");
const btn2 = document.getElementById("btn2");

function manageEventHandlers(btn) {
  let clickHandlers = [];

  return function listener(callback) {
    if (callback) {
      let clickHandler = function onClick(e) {
        callback(e);
      };

      clickHandlers.push(clickHandler);
      btn.addEventListener("click", clickHandler);
    } else {
      for (let handler of clickHandlers) {
        btn.removeEventListener("click", handler);
      }
      clickHandlers = [];
    }
  };
}

const onClicking = manageEventHandlers(btn1);

onClicking(function (e) {
  console.log(e.target);
});

onClicking();

// In this program, the inner `onClick(..)` function holds a closure over the passed in `cb` (the provided event callback). That means the `checkout()` and `trackAction()` function expression references are held via closure (and cannot be GC'd) for as long as these event handlers are subscribed.

// When we call `onSubmit()` with no input on the last line, all event handlers are unsubscribed, and the `clickHandlers` array is emptied. Once all click handler function references are discarded, the closures of `cb` references to `checkout()` and `trackAction()` are discarded.

// When considering the overall health and efficiency of the program, unsubscribing an event handler when it's no longer needed can be even more important than the initial subscription!
