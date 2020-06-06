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

// *********** Shadowing
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
// same named variable is declared as a BLUE marble , the parameter in the printStudent(..) function
// definition.

// So the question is, what color marble is being referenced in the studentName =
// studentName.toUpperCase() statement, and indeed the next statement, console.log(studentName) ?

// All 3 studentName references here will be BLUE. Why?
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

// **** Global Unshadowing Trick
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

// ******* WARNING:
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

// ****** Copying Is Not Accessing
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

// ****** Function Name Scope
// As you're probably aware, a function declaration looks like this:

function askQuestion() {
  // ..
}

// And as discussed in Chapter 1 and 2, such a function declaration will create a variable in the enclosing scope
// (in this case, the global scope) named askQuestion .
// What about this program?

var askQuestion = function () {
  // ..
};

// The same thing is true with respect to the variable askQuestion being created. But since we have a function
// expression -- a function definition used as value instead of as a declaration -- this function definition will not "hoist"
// (covered later in this chapter).

// But hoisting is only one difference between function declarations and function expressions. The other major
// difference is what happens to the name identifier on the function.

// Consider the assignment of a named function expression:
var askQuestion = function ofTheTeacher() {
  // ..
};

// We know askQuestion ends up in the outer scope. But what about the ofTheTeacher identifier? For
// function declarations, the name identifier ends up in the outer/enclosing scope, so it would seem reasonable to
// assume that's the case here. But it's not.
// ofTheTeacher is declared as a variable inside the function itself:

var askQuestion = function ofTheTeacher() {
  console.log(ofTheTeacher);
};
askQuestion();
// function ofTheTeacher()...
// console.log(ofTheTeacher);
// ReferenceError: 'ofTheTeacher' is not defined

// Not only is ofTheTeacher declared inside the function rather than outside, but it's also created as read-only:

var askQuestion = function ofTheTeacher() {
  "use strict";
  // ofTheTeacher = 42; // this assignment fails
  //..
};
askQuestion();
// TypeError

// Because we used strict mode, the assignment failure is reported as a Type Error; in non-strict mode, such an
// assignment fails silently with no exception.
// What about when a function expression has no name identifier?

var askQuestion = function () {
  // ..
};

// A function expression with a name identifier is referred to as a "named function expression", and one without a
// name identifier is referred to as an "anonymous function expression". Anonymous function expressions have no
// name identifier, and so have no effect on either the outer/enclosing scope or their own.

// NOTE:
// We'll discuss named vs. anonymous function expressions in much more detail, including what factors affect
// the decision to use one or the other, in Appendix A.

// ******* Arrow Functions
// ES6 added an additional function expression form, called "arrow functions":
var askQuestion = () => {
  // ..
};
// The => arrow function doesn't require the word function to define it. Also, the ( .. ) around the parameter
// list is optional in some simple cases. Likewise, the { .. } around the function body is optional in some simple
// cases. And when the { .. } are omitted, a return value is computed without using a return keyword.

// NOTE:
// The attractiveness of => arrow functions is often sold as "shorter syntax", and that's claimed to equate to
// objectively more readable functions. This claim is dubious at best, and outright misguided in general. We'll dig
// into the "readability" of function forms in Appendix A.
// Arrow functions are lexically anonymous, meaning they have no directly related identifier that references the
// function. The assignment to askQuestion creates an inferred name of "askQuestion", but that's not the same
// thing as being non-anonymous:
var askQuestion = () => {
  // ..
};
console.log(askQuestion.name); // askQuestion

// Arrow functions achieve their syntactic brevity at the expense of having to mentally juggle a bunch of variations for
// different forms/conditions. Just a few for example:

(id) => id.toUpperCase();

const arrf2 = (id, name) => ({ id, name });

const arrf3 = (...args) => {
  return args[args.length - 1];
};

// See page 99... here prettier is changing the form of the above functions

// The real reason I bring up arrow functions is because of the common but incorrect claim that arrow functions
// somehow behave differently with respect to lexical scope from standard function functions.
// This is incorrect.

// Other than being anonymous (and having no declarative form), arrow functions have the same rules with respect to
// lexical scope as function functions do. An arrow function, with or without { .. } around its body, still creates
// a separate, inner nested bucket of scope. Variable declarations inside this nested scope bucket behave the same
// as in function functions.

// ***** Why Global Scope?
// We've referenced the "global scope" a number of times already, but we should dig into that topic in more detail.
// We'll start by exploring whether the global scope is (still) useful and relevant to writing JS programs, and then look
// at differences in how the global scope is found in different JS environments.

// It's likely no surprise to readers that most applications are composed of multiple (sometimes many!) individual JS
// files. So how exactly do all those separate files get stitched together in a single run-time context by the JS engine?
// With respect to browser-executed applications, there are 3 main ways:

// 1. If you're exclusively using ES modules (not transpiling those into some other module-bundle format), then
// these files are loaded individually by the JS environment. Each module then import s references to
// whichever other modules it needs to access. The separate module files cooperate with each other
// exclusively through these shared imports, without needing any scopes.

// 2. If you're using a bundler in your build process, all the files are typically concatenated together before delivery
// to the browser and JS engine, which then only processes one big file. Even with all the pieces of the
// application being co-located in a single file, some mechanism is necessary for each piece to register a name
// to be referred to by other pieces, as well as some facility for that access to be made.

// In some approaches, the entire contents of the file are wrapped in a single enclosing scope (such as a
// wrapper function, UMD-like module, etc), so each piece can register itself for access by other pieces by way
// of local variables in that shared scope.

// For example:
(function outerScope() {
  var moduleOne = (function one() {
    // ..
  })();
  var moduleTwo = (function two() {
    // ..
    function callModuleOne() {
      moduleOne.someMethod();
    }
    // ..
  })();
})();

// As shown, the moduleOne and moduleTwo local variables inside the outerScope() function scope are
// declared so that these modules can access each other for their cooperation.

// While the scope of outerScope() is a function and not the full environment global scope, it does act as a
// sort of "application-wide scope", a bucket where all the top-level identifiers can be stored, even if not in the
// real global scope. So it's kind of like a stand-in for the global scope in that respect.

// 3. Whether a bundler is used for an application, or whether the (non-ES module) files are simply loaded in the
// browser individually (via <script> tags or other dynamic JS loading), if there is no single surrounding
// scope encompassing all these pieces, the global scope is the only way for them to cooperate with each
// other.

// A bundled file of this sort often looks something like this:

var moduleOne = (function one() {
  // ..
})();
var moduleTwo = (function two() {
  // ..
  function callModuleOne() {
    moduleOne.someMethod();
  }
  // ..
})();
// Here, since there is no surrounding function scope, these moduleOne and moduleTwo declarations are
// simply processed in the global scope. This is effectively the same as if the file hadn't been concatenated:

// module1.js:
var moduleOne = (function one() {
  // ..
})();

// module2.js:
var moduleTwo = (function two() {
  // ..
  function callModuleOne() {
    moduleOne.someMethod();
  }
  // ..
})();

// Again, if these files are loaded as normal standalone .js files in a browser environment, each top-level
// variable declaration will end up as a global variable, since the global scope is the only shared resource
// between these two separate files (programs, from the perspective of the JS engine).

// In addition to (potentially) accounting for where an application's code resides during run-time, and how each piece
// is able to access the other pieces to cooperate, the global scope is also where:

// *JS exposes its built-ins:
// primitives: undefined , null , Infinity , NaN
// natives: Date() , Object() , String() , etc
// global functions: eval() , parseInt() , etc
// namespaces: Math , Atomics , JSON
// friends of JS: Intl , WebAssembly

// *The environment that is hosting JS exposes its built-ins:
// console (and its methods)
// the DOM ( window , document , etc)
// timers ( setTimeout(..) , etc)
// web platform APIs: navigator , history , geolocation, WebRTC, etc

// *NOTE:
// Node also exposes several elements "globally", but they're technically not in its global scope:
// require() , __dirname , module , URL , etc.

// Most developers agree that the global scope shouldn't just be a dumping ground for every variable in your
// application. That's a mess of bugs just waiting to happen. But it's also undeniable that the global scope is an
// important glue for virtually every JS application.

// ****** Where Exactly Is This Global Scope?

// It might seem obvious that the global scope is located in the outermost portion of a file; that is, not inside any
// function or other block. But it's not quite as simple as that.
// Different JS environments handle the scopes of your programs, in particular the global scope, differently. It's
// extremely common for JS developers to have misconceptions in this regard.

// **** Browser "Window"
// With resepct to treatment of the global scope, the most pure (not completely!) environment JS can be run in is as a
// standalone .js file loaded in a web page environment in a browser. I don't mean "pure" as in nothing automatically
// added -- lots may be added! -- but rather in terms of minimal intrusion on the code or interference with its behavior.
// Consider this simple .js file:

var studentName = "Kyle";
function hello() {
  console.log(`Hello, ${studentName}!`);
}
hello();
// Hello, Kyle!

// This code may be loaded in a webpage environment using an inline <script> tag, a <script src=..> script
// tag in the markup, or even a dynamically created <script> DOM element. In all three cases, the studentName
// and hello identifiers are declared in the global scope.

// That means if you access the global object (commonly, window in the browser), you'll find properties of those
// same names there:

var studentName = "Kyle";
function hello() {
  console.log(`Hello, ${window.studentName}!`);
}

window.hello();
// Hello, Kyle!

// That's the default behavior one would expect from a reading of the JS specification. That's what I mean by pure.
// That won't always be true of other JS environments, and that's often surprising to JS developers.

// **** Shadowing Revisited
// Recall the discussion of shadowing from earlier? An unusual consequence of the difference between a global
// variable and a global property of the same name is that a global object property can be shadowed by a global
// variable:

window.something4 = 42;
let something4 = "Kyle";
console.log(something4);
// Kyle

// The let declaration adds a something global variable, which shadows the something global object property.
// While it's possible to shadow in this manner, it's almost certainly a bad idea to do so. Don't create a divergence
// between the global object and the global scope.

// ***** What's In A Name?
// I asserted that this browser-hosted JS environment has the most pure global scope behavior we'll see. Things are
// not entirely pure, however.

// Consider:
var name = 42;
console.log(typeof name, name);
// string 42

// window.name is a pre-defined "global" in a browser context; it's a property on the global object, so it seems like a
// normal global variable (though it's anything but "normal"). We used var for the declaration, which doesn't shadow
// the pre-defined name global property. That means, effectively, the var declaration is ignored, since there's
// already a global scope object property of that name. As we discussed in the previous section, had we use let
// name , we would have shadowed window.name with a separate global name variable.

// But the truly weird behavior is that even though we assigned the number 42 to name , when we then retrieve its
// value, it's a string "42" ! In this case, the weirdness is because window.name is actually a getter/setter on the
// global object, which insists on a string value. Wow!

// With the exception some rare corner cases like window.name , JS running as a standalone file in a browser page
// has some of the most pure global scope behavior we're likely to encounter.

// ***** Web Workers
// Web Workers are a web platform extension for typical browser-JS behavior, which allows a JS file to run in a
// completely separate thread (operating system wise) from the thread that's running the main browser-hosted JS.

// Since these web worker programs run on a separate thread, they're restricted in their communications with the
// main application thread, to avoid/control race conditions and other complications. Web worker code does not have
// access to the DOM, for example. Some web APIs are however made available to the worker, such as navigator .

// Since a web worker is treated as a wholly separate program, it does not share the global scope with the main JS
// program. However, the browser's JS engine is still running the code, so we can expect similar purity of its global
// scope behavior. But there is no DOM access, so the window alias for the global scope doesn't exist.

// In a web worker, a global object reference is typically made with self :

var studentName = "Kyle";
let studentID = 42;

function hello() {
  console.log(`Hello, ${self.studentName}!`);
}
self.hello();
// Hello, Kyle!
self.studentID;
// undefined

// Just as with main JS programs, var and function declarations create mirrored properties on the global object
// (aka, self ), where other declarations ( let , etc) do not.
// So again, the global scope behavior we're seeing here is about as pure as it gets for running JS programs.

// **** Developer Tools Console/REPL
// Recall from "Get Started" Chapter 1 that Developer Tools don't create a completely authentic JS environment. They
// do process JS code, but they also bend the UX of the interaction in favor of being friendly to developers (aka,
// "Developer Experience", DX).
// In many cases, favoring DX when entering short JS snippets over the normal strict steps expected for processing a
// full JS program produces observable differences in behavior of code. For example, certain error conditions
// applicable to a JS program may be relaxed and not displayed when the code is entered into a developer tool.
// With respect to our discussions here about scope, such observable differences in behavior may include the
// behavior of the global scope, hoisting (discussed later in this chapter), and block-scoping declarators ( let /
// const , see Chapter 4) when used in the outermost scope.

// Even though while using the console/REPL it seems like statements entered in the outermost scope are being
// processed in the real global scope, that's not strictly accurate. The tool emulates that to an extent, but it's
// emulation, not strict adherence. These tool environments prioritize developer convenience, which means that at
// times (such as with our current discussions regarding scope), observed behavior may deviate from the JS
// specification.

// The take-away is that Developer Tools, while being very convenient and useful for a variety of developer activities,
// are not suitable environments to determine or verify some of the explicit and nuanced behaviors of an actual JS
// program context.
