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

keeps[0](); // 3 -- WHY!?
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
