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
