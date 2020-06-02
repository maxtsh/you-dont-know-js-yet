// ****** Chapter 3: Working With Scope ========================================================================================
// NOTE:
// Work in progress
// Through Chapters 1 and 2, we defined lexical scope as the set of rules (determined at compile time) for how the
// identifiers/variables in a program are organized into units of scope (functions, blocks), as well as how lookups of
// these identifiers works during run-time.

// For conceptual understanding, lexical scope was illustrated with several metaphors: marbles & buckets (bubbles!),
// conversations, and a tall office building.

// Now it's time to sift through a bunch of nuts and bolts of working with lexical scope in our programs. There's a lot
// more to scope than you probably think. This is one of those chapters that really hammers home just how much we
// all don't know about scope.

// TIP:
// This chapter is very long and detailed. Make sure to take your time working through it, and practice the
// concepts and code frequently. Don't rush!
// Nested Scopes, Revisited
// Again, recall our running example program:
var students = [
  { id: 14, name: "Kyle" },
  { id: 73, name: "Suzy" },
  { id: 112, name: "Frank" },
  { id: 6, name: "Sarah" },
];
function getStudentName(studentID) {
  for (let student of students) {
    if (student.id == studentID) {
      return student.name;
    }
  }
}
var nextStudent = getStudentName(73);
console.log(nextStudent);
// Suzy

// What color is the students variable reference in the for -loop?
// In Chapter 2, we described the run-time access of a variable as a "lookup", where the Engine has to start by asking
// the current scope's Scope Manager if it knows about an identifier/variable, and proceeding upward/outward back
// through the chain of nested scopes (toward the global scope) until found, if ever. The lookup stops as soon as the
// first matching named declaration in a scope bucket is found.

// The lookup process thus determines that students is a RED marble. And studentID in the if -statement is
// determined to be a BLUE marble.

// "Lookup" Is (Mostly) Conceptual
// This description of the run-time lookup process works for conceptual understanding, but it's not generally how
// things work in practice.

// The color of a marble (what bucket it comes from) -- the meta information of what scope a variable originates from
// -- is usually known during the initial compilation processing. Because of how lexical scope works, a marble's color
// will not change based on anything that can happen during run-time.

// Since the marble's color is known from compilation, and it's immutable, this information will likely be stored with (or
// at least accessible from) each variable's entry in the AST; that information is then used in generating the executable
// instructions that constitute the program's run-time. In other words, Engine (from Chapter 2) doesn't need to lookup
// and figure out which scope bucket a variable comes from. That information is already known!

// Avoiding the need for a run-time lookup is a key optimization benefit for lexical scope. Scope is fixed at authortime/
// compile-time, and unaffected by run-time conditions, so no run-time lookup is necessary. Run-time is operates
// more performantly without spending time on these lookups.

// But I said "...usually known..." just now with respect to a marble's color determination during compilation. In what
// case would it not be known during compilation?

// Consider a reference to a variable that isn't declared in any lexically available scopes in the current file -- see Get
// Started, Chapter 1, which asserts that each file is its own separate program from the perspective of JS compilation.
// If no declaration is found, that's not necessarily an error. Another file (program) in the run-time may indeed declare
// that variable in the shared global scope. So the ultimate determination of whether the variable was ever
// appropriately declared in some available bucket may need to be deferred to the run-time.

// The take-away? Any reference to a variable in our program that's initially undeclared is left as an uncolored marble
// during that file's compilation; this color cannot be determined until other relevant file(s) have been compiled and the
// application run-time begins.

// In that respect, some sort of run-time "lookup" for the variable would need to resolve the color of this uncolored
// marble. If the variable was eventually discovered in the global scope bucket, the color of the global scope thus
// applies. But this run-time deferred lookup would only be needed once at most, since nothing else during run-time
// could later change that marble's color.

// NOTE:
// Chapter 2 "Lookup Failures" covers what happens if a marble remains uncolored as its reference is executed.
// Shadowing
// Our running example for these chapters uses different variable names across the scope boundaries. Since they all
// have unique names, in a way it wouldn't matter if all of them were just in one bucket (like RED).
// Where having different lexical scope buckets starts to matter more is when you have two or more variables, each in
// different scopes, with the same lexical names. In such a case, it's very relevant how the different scope buckets are
// laid out.
// Consider:

var studentName = "Suzy";
function printStudent(studentName) {
  studentName = studentName.toUpperCase();
  console.log(studentName);
}
printStudent("Frank");
// FRANK
printStudent(studentName);
// SUZY
console.log(studentName);
// Suzy

// TIP:
// Before you move on, take some time to analyze this code using the various techniques/metaphors we've
// covered in the book. In particular, make sure to identify the marble/bubble colors in this snippet. It's good
// practice!

// The studentName variable on line 1 (the var studentName = .. statement) creates a RED marble. The
// same named variable is declared as a BLUE marble on line 3, the parameter in the printStudent(..) function
// definition.

// So the question is, what color marble is being referenced in the studentName =
// studentName.toUpperCase() statement, and indeed the next statement, console.log(studentName) ? All
// 3 studentName references here will be BLUE. Why?
// With the conceptual notion of the "lookup", we asserted that it starts with the current scope and works its way
// outward/upward, stopping as soon as a matching variable is found. The BLUE studentName is found right away.
// The RED studentName is never even considered.
// This is a key component of lexical scope behavior, called shadowing. The BLUE studentName variable
// (parameter) shadows the RED studentName . So, the parameter shadows (or is shadowing) the shadowed global
// variable. Repeat that sentence to yourself a few times to make sure you have the terminology straight!
// That's why the re-assignment of studentName affects only the inner (parameter) variable, the BLUE
// studentName , not the global RED studentName .

// When you choose to shadow a variable from an outer scope, one direct impact is that from that scope
// inward/downward (through any nested scopes), it's now impossible for any marble to be colored as the shadowed
// variable (RED, in this case). In other words, any studentName identifier reference will mean that parameter
// variable, never the global studentName variable. It's lexically impossible to reference the global studentName
// anywhere inside of the printStudent(..) function (or any inner scopes it may contain).

// Global Unshadowing Trick
// It is still possible to access a global variable, but not through a typical lexical identifier reference.
// In the global scope (RED), var declarations and function -declarations also expose themselves as properties
// (of the same name as the identifier) on the global object -- essentially an object representation of the global scope.
// If you've done JS coding in a browser environment, you probably identify the global object as window . That's not
// entirely accurate, but it's good enough for us to use in discussion for now. In a bit, we'll explore the global
// scope/object topic more.

// Consider this program, specifically executed as a standalone .js file in a browser environment:
var studentName = "Suzy";
function printStudent(studentName) {
  console.log(studentName);
  console.log(window.studentName);
}
printStudent("Frank");
// "Frank"
// "Suzy"

// Notice the window.studentName reference? This expression is accessing the global variable studentName as
// a property on window (which we're pretending for now is synonymous with the global object). That's the only way
// to access a shadowed variable from inside the scope where the shadowing variable is present.

// ***** WARNING:
// Leveraging this technique is not very good practice, as it's limited in utility, confusing for readers of your code,
// and likely to invite bugs to your program. Don't shadow a global variable that you need to access, and
// conversely, don't access a global variable that you've shadowed.

// The window.studentName is a mirror of the global studentName variable, not a snapshot copy. Changes to
// one are reflected in the other, in either direction. Think of window.studentName as a getter/setter that accesses
// the actual studentName variable. As a matter of fact, you can even add a variable to the global scope by
// creating/setting a property on the global object ( window ).

// This little "trick" only works for accessing a global scope variable (that was declared with var or function ).
// Other forms of global scope variable declarations do not create mirrored global object properties:

var one = 1;
let notOne = 2;
const notTwo = 3;
class notThree {}
console.log(window.one); // 1
console.log(window.notOne); // undefined
console.log(window.notTwo); // undefined
console.log(window.notThree); // undefined

// Variables (no matter how they're declared!) that exist in any other scope than the global scope are completely
// inaccessible from an inner scope where they've been shadowed.

var special = 42;
function lookingFor(special) {
  // `special` in this scope is inaccessible from
  // inside keepLooking()
  function keepLooking() {
    var special = 3.141592;
    console.log(special);
    console.log(window.special);
  }
  keepLooking();
}
lookingFor(112358132134);
// 3.141592
// 42

// The global RED special is shadowed by the BLUE special (parameter), and the BLUE special is itself
// shadowed by the GREEN special inside keepLooking() . We can still access RED special indirectly as
// window.special .

// Copying Is Not Accessing
// I've been asked the following "But what about...?" question dozens of times, so I'm just going to address it before
// you even ask!

var special = 42;
function lookingFor(special) {
  var another = {
    special: special,
  };
  function keepLooking() {
    var special = 3.141592;
    console.log(special);
    console.log(another.special); // Ooo, tricky!
    console.log(window.special);
  }
  keepLooking();
}
lookingFor(112358132134);
// 3.141592
// 112358132134
// 42

// Oh! So does this another technique prove me wrong in my above claim of the special parameter being
// "completely inaccessible" from inside keepLooking() ? No, it does not.
// special: special is copying the value of the special parameter variable into another container (a property
// of the same name). Of course if you put a value in another container, shadowing no longer applies (unless
// another was shadowed, too!). But that doesn't mean we're accessing the parameter special , it means we're
// accessing the value it had at that moment, but by way of another container (object property). We cannot, for
// example, reassign that BLUE special to another value from inside keepLooking() .

// Another "But...!?" you may be about to raise: what if I'd used objects or arrays as the values instead of the numbers
// ( 112358132134 , etc)? Would us having references to objects instead of copies of primitive values "fix" the
// inaccessibility? No. Mutating the contents of the object value via such a reference copy is not the same thing as
// lexically accessing the variable itself. We still couldn't reassign the BLUE special .

// ***** Illegal Shadowing
// Not all combinations of declaration shadowing are allowed. One case to be aware of is that let can shadow
// var , but var cannot shadow let .
// Consider:
function something() {
  var special = "JavaScript";
  {
    let special = 42; // totally fine shadowing
    // ..
  }
}
function another() {
  // ..
  {
    let special = "JavaScript";
    {
      // var special = "JavaScript"; // Syntax Error
      // ..
    }
  }
}

// The boundary crossing effectively stops at each function boundary, so this variant raises no exception:
function another() {
  // ..
  {
    let special = "JavaScript";
    whatever(function callback() {
      var special = "JavaScript"; // totally fine shadowing
      // ..
    });
  }
}
// Just remember: let can shadow var , but not the other way around
