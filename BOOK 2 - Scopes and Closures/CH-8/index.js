// ******* Singeleton Module Pattern

var Student = (function defineStudent() {
  var records = [
    { id: 14, name: "Kyle", grade: 86 },
    { id: 73, name: "Suzy", grade: 87 },
    { id: 112, name: "Frank", grade: 75 },
    { id: 6, name: "Sarah", grade: 91 },
  ];

  return getName;

  // ************************

  function getName(studentID) {
    var student = records.find((student) => student.id == studentID);
    return student.name;
  }
})();

// We can only make one single centeral instance at each time
console.log(Student(73)); // Single centeral instance
console.log(Student(14)); // Single centeral instance

// We can't do it like this
// const newF = Student();

// What do you expect these results will be ?

// console.log(newF(73)); // Suzy ? ... NO! TYPE ERROR
// console.log(newF(14)); // Kyle ? ... NO! TYPE ERROR

// * Singeleton:
// The use of an IIFE implies that our program only ever needs a single central instance of the module, commonly referred to as a "singleton." Indeed, this specific example is simple enough that there's no obvious reason we'd need anything more than just one instance of the `Student` module.

// ******* Module Factory With Multiple Instances

// But if we did want to define a module that supported multiple instances in our program, we can slightly tweak the code:
// factory function, not singleton IIFE

function defineStudent() {
  var records = [
    { id: 14, name: "Kyle", grade: 86 },
    { id: 73, name: "Suzy", grade: 87 },
    { id: 112, name: "Frank", grade: 75 },
    { id: 6, name: "Sarah", grade: 91 },
  ];

  return getName;

  // ************************

  function getName(studentID) {
    var student = records.find((student) => student.id == studentID);
    return student.name;
  }
}

const fullTime = defineStudent();
fullTime(73); // Suzy
fullTime(14); // Kyle

// Rather than specifying `defineStudent()` as an IIFE, we just define it as a normal standalone function, which is commonly referred to in this context as a "module factory" function.

// We then call the module factory, producing an instance of the module that we label `fullTime`. This module instance implies a new instance of the inner scope, and thus a new closure that `getName(..)` holds over `records`. `fullTime.getName(..)` now invokes the method on that specific instance.

// CommonJS modules behave as singleton instances, similar to the IIFE module definition style presented before. No matter how many times you `require(..)` the same module, you just get additional references to the single shared module instance.

// A little Rememberance:

// Shallow Copy Using Object.assign() which links to main reference of the object in memory
const time = { name: "time" };
const newTime = Object.assign(time); // Shallow Copying
console.log(newTime.name); // time
newTime.name = "new-time"; // Changing
console.log(newTime.name); // new-time
console.log(time.name); // new-time

// Shallow Copy using assignment which still links to main reference of the object in memory
const time1 = { name: "time1" };
const sometime = time1; // Shallow Copying
console.log(sometime.name); // time1
sometime.name = "changed-time"; // Changing
console.log(sometime.name); // changed-time
console.log(time1.name); // changed-time

// Deep Copy Using Spread Operator which creates a new reference of previous object in memory
const time2 = { name: "time2" };
const anotherTime = { ...time2 }; // Deep Copying
console.log(anotherTime.name); // time2
anotherTime.name = "another-time"; // Changing
console.log(anotherTime.name); // anothertime
console.log(time2.name); // time2
