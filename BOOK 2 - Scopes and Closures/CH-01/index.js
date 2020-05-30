// ******* Chapter 1: How is Scope Determined? ===========================================================================

// NOTE:
// Work in progress

// Once you've written at least a few lines of code, you're already a programmer! So by this point, I bet you have a
// decent sense of how to create variables and store values in them. But how closely have you considered the
// mechanisms used by the engine to organize and manage these variables?
// I don't mean how the memory is allocated on the computer, but rather: how does JS know which variables are
// accessible by any given statement, and what happens if it finds two variables of the same name?
// The answers to questions like these take the form of a set of well-defined rules called scope. We'll expound these
// rules in great detail throughout the book.
// Our first step is to study how the JS engine processes (compiles) our program before it executes it.

// ***** About This Book
// Welcome to book 2 in the You Don't Know JS Yet series! If you already finished Get Started (the first book), you're in
// the right spot! If not, before you proceed I encourage you to start there for the best foundation.
// Our focus here is the first of three pillars in the JS language: the scope system and its function closures, and how
// these mechanisms enable the module design pattern.
// JS is typically classified as an interpreted scripting language, so it's assumed by most that JS programs are
// processed in a single, top-down pass. But JS is in fact parsed/compiled in a separate phase before execution
// begins. The code author's decisions on where to place variables, functions, and blocks with respect to each other
// are analyzed according to the rules of scope, during the initial parsing/compilation phase. The resulting scope is
// unaffected by run-time conditions.

// JS functions are themselves values, meaning they can be assigned and passed around just like numbers or strings.
// But since these functions hold and access variables, they maintain their original scope no matter where in the
// program the functions are eventually executed. This is called closure.
// Modules are a pattern for code organization characterized by a collection of public methods that have access (via
// closure) to variables and functions that are hidden inside the internal scope of the module.

// **** Compiled vs. Interpreted
// You may have heard of code compilation before, but perhaps it seems like a mysterious black box where source
// code goes in one end and programs come out the other.
// It's not mysterious or magical, though. Code compilation is a set of steps that process the text of your code and
// turn it into a list of instructions the computer can understand. Typically, the whole source code is transformed at
// once, and those resulting instructions are saved as output (usually in a file) that can later be executed.
// You also may have heard that code can be interpreted, but how is that different from being compiled?
// Interpretation performs a similar task to compilation, in that it transforms your program into machineunderstandable
// instructions. But the processing model is fairly different. Unlike a program being compiled all at
// once, with interpretation the source code is typically transformed line-by-line; each line or statement is immediately
// executed before proceeding to processing the next line of the source code.
// Figure 1 illustrates compilation and interpretation of a program:
// Fig. 1: Compiled vs Interpreted Code
// Are these two processing models mutually exclusive? Generally yes. However, the topic is more nuanced, because
// interpretation can actually take other forms than just operating line-by-line on source code text. Modern JS engines
// employ variations of both compilation and interpretation in the handling of JS programs.
// Recall that this topic is discussed in detail in the section "What's in an Interpretation?" of Chapter 1 of the Get
// Started book. Our conclusion there is that JS is most accurately portrayed as a compiled language. For the benefit
// of readers here, the following sections will revist and expand on that debate.

// ***** Compiling Code
// Why does it even matter whether JS is compiled or not?
// JS's scope is entirely determined during compilation, so you cannot effectively understand scope without exploring
// JS's compilation.

// In classic compiler theory, a program is processed by a compiler in three basic stages:
// 1. Tokenizing/Lexing: breaking up a string of characters into meaningful (to the language) chunks, called
// tokens. For instance, consider the program: var a = 2; . This program would likely be broken up into the
// following tokens: var , a , = , 2 , and ; . Whitespace may or may not be persisted as a token, depending
// on whether it's meaningful or not.
// (The difference between tokenizing and lexing is subtle and academic, but it centers on whether or not these
// tokens are identified in a stateless or stateful way. Put simply, if the tokenizer were to invoke stateful parsing
// rules to figure out whether a should be considered a distinct token or just part of another token, that would
// be lexing.)

// 2. Parsing: taking a stream (array) of tokens and turning it into a tree of nested elements, which collectively
// represent the grammatical structure of the program. This tree is called an "AST" (Abstract Syntax Tree).
// For example, the tree for var a = 2; might start with a top-level node called VariableDeclaration ,
// with a child node called Identifier (whose value is a ), and another child called
// AssignmentExpression which itself has a child called NumericLiteral (whose value is 2 ).
// 3. Code Generation: taking an AST and turning it into executable code. This part varies greatly depending on
// the language, the platform it's targeting, etc.
// The JS engine takes our above described AST for var a = 2; and turns it into a set of machine
// instructions to actually create a variable called a (including reserving memory, etc.), and then store a value
// into a .

// NOTE:
// The implementation details of a JS engine (utilizing system memory resources, etc) is much deeper than we
// will dig here. We'll keep our focus on the observable behavior of our programs and let the JS engine manage
// those system-level abstractions.
// The JS engine is vastly more complex than just those three stages. In the process of parsing and code-generation,
// there are steps to optimize the performance of the execution, including collapsing redundant elements, etc. In fact,
// code can even be re-compiled and re-optimized during the progression of execution.
// So, I'm painting only with broad strokes here. But you'll see shortly why these details we do cover, even at a high
// level, are relevant.
// JS engines don't have the luxury of plenty of time to optimize, because JS compilation doesn't happen in a build
// step ahead of time, as with other languages. It usually must happen in mere microseconds (or less!) right before
// the code is executed. To ensure the fastest performance under these constraints, JS engines use all kinds of tricks
// (like JITs, which lazy compile and even hot re-compile, etc.) which are well beyond the "scope" of our discussion
// here.

// ***** Required: Two Phases
// To state it as simply as possible, the most important observation we can make about processing of JS programs is
// that it occurs in (at least) two phases: parsing/compilation first, then execution.
// The breakdown of a parsing/compilation phase separate from the subsequent execution phase is observable fact,
// not theory or opinion. While the JS specification does not require "compilation" explicitly, it requires behavior which
// is essentially only practical in a compile-then-execute cadence.
// There are three program characteristics you can observe to prove this to yourself: syntax errors, early errors, and
// hoisting (covered in Chapter 3).
// Syntax Errors From The Start

// Consider this program:
var greeting = "Hello";
console.log(greeting);
// greeting = ."Hi";
// SyntaxError: unexpected token .

// This program produces no output ( "Hello" is not printed), but instead throws a SyntaxError about the
// unexpected . token right before the "Hi" string. Since the syntax error happens after the well-formed
// console.log(..) statement, if JS was executing top-down line by line, one would expect the "Hello"
// message being printed before the syntax error being thrown. That doesn't happen. In fact, the only way the JS
// engine could know about the syntax error on the third line, before executing the first and second lines, is by the JS
// engine first parsing the entire program before any of it is executed.
// Early Errors
// Next, consider:

console.log("Howdy");
saySomething("Hello", "Hi");
// Uncaught SyntaxError: Duplicate parameter name not allowed in this context

function saySomething(greeting, greeting) {
  //   "use strict";
  console.log(greeting);
}

// The "Howdy" message is not printed, despite being a well-formed statement.
// Instead, just like the snippet in the previous section, the SyntaxError here is thrown before the program is
// executed. In this case, it's because strict-mode (opted in for only the saySomething(..) function here) forbids,
// among many other things, functions to have duplicate parameter names; this has always been allowed in non-strict
// mode. The error thrown is not a syntax error in the sense of being a malformed string of tokens (like ."Hi" prior),
// but is nonetheless required by the specification to be thrown as an "early error" (for strict-mode code) before any
// execution begins.

// But how does the JS engine know that the greeting parameter has been duplicated? How does it know that the
// saySomething(..) function is even in strict-mode while processing the parameter list (the "use strict"
// pragma appears only later, in the function body)?
// Again, the only reasonable answer to these questions is that the code must first be fully parsed before any
// execution occurs.

// ***** Hoisting
// Finally, consider:

function saySomething() {
  var greeting = "Hello";
  {
    // greeting = "Howdy"; // <-- the error is here
    // this error means that the greeting variable in this block-scope must already been hoisted (declared and be on the top of block-scope in the parsing stage)
    // but it is not so there is a reference error for it.
    let greeting = "Hi";
    console.log(greeting);
  }
}
saySomething();

// ReferenceError: Cannot access 'greeting' before initialization

// The noted ReferenceError occurs from the line with the statement greeting = "Howdy" . What's happening
// is that the greeting variable for that statement comes from the declaration on the next line, let greeting =
// "Hi" , rather than from the previous var greeting = "Hello" statement.

// The only way the JS engine could know, at the line where the error is thrown, that the next statement would declare
// a block-scoped variable of the same name ( greeting ) is if the JS engine had already processed this code in an
// earlier pass, and already set up all the scopes and their variable associations. This processing of scopes and
// declarations can only accurately be done by parsing the program before execution, and it's called "hoisting" (see
// Chapter 3).

// The ReferenceError here technically comes from greeting = "Howdy" accessing the greeting variable
// too early, a conflict referred to as the Temporal Dead Zone (TDZ). Chapter 3 will cover this in more detail.

// WARNING:

// It's often asserted that let and const declarations are not hoisted, as an explanation of the TDZ behavior just
// illustrated. But this is not accurate. If let and const declarations were not hoisted, then the greeting =
// "Howdy" assignment would simply be referring to declaration from the var greeting statement in the outer
// (function) scope, and would not need to throw an error. In other words, the block-scoped greeting wouldn't
// exist yet. However, the presence of the TDZ error proves that the block-scoped greeting must indeed already
// exist, and thus must have been hoisted to the top of that block scope! Don't worry if that's still confusing right
// now. We'll come back to it in Chapter 3.

// Hopefully you're now convinced that JS programs are parsed before any execution begins. But does it prove they
// are compiled?
// This is an interesting question to ponder. Could JS parse a program, but then execute that program by interpreting
// operations represented in the AST without first compiling the program? Yes, that is possible. But it's extremely
// unlikely, mostly because it would be highly inefficient performance wise.

// It's hard to imagine a scenario where a production-quality JS engine would go to all the trouble of parsing a
// program into an AST, but not then convert (aka, "compile") that AST into the most efficient (binary) representation
// for the engine to then execute.

// Many have endeavored to split hairs with this terminology, as there's plenty of nuance and "well, actually..."
// interjections. But in spirit and in practice, what the engine is doing in processing JS programs is much more alike
// compilation than not.

// Classifying JS as a compiled language is not about a distribution model for its binary (or byte-code) executable
// representations, but about keeping a clear distinction in our minds about the phase where JS code is processed
// and analyzed, which observably and indisputedly happens before the code starts to be executed. We need proper
// mental models of how the JS engine treats our code if we want to understand JS and scope effectively.

// ******* Compiler Speak
// Since we now have a solid understanding of the two-phase processing of a JS program (compile, then execute),
// let's turn our attention to how the JS engine identifies variables and determines the scopes of a program as it is
// compiled.

// First, let's define a simple JS program to use for analysis over the next several chapters:

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

// Other than declarations, all occurrences of variables/identifiers in a program serve in one of two "roles": either
// they're the target of an assignment or they're the source of a value.

// (When I first learned compiler theory in my Computer Science degree, we were taught the terms "LHS" (aka, target)
// and "RHS" (aka, source) for these roles, respectively. As you might guess from the "L" and the "R", the acronyms
// mean "Left-Hand Side" and "Right-Hand Side", as in left and right sides of an = assignment operator. However,
// assignment targets and sources don't always literally appear on the left or right of an = , so it's probably clearer to
// think in terms of target / source instead of left / right.)

// How do you know if a variable is a target? Check if there is a value that is being assigned to it; if so, it's a target. If
// not, then the variable is a source.

// For the JS engine to handle a program, it must first label each occurrence of a variable as target or source. We'll dig
// in now to how each role is determined.

// ***** Targets
// What makes a variable a target? Consider:

students = [
  /* .. */
];

// This statement is clearly an assignment operation; remember, the var students part is handled entirely as a
// declaration at compile time, and is thus irrelevant during execution. Same with the nextStudent =
// getStudentName(73) statement.

// There are three other target assignment operations in the code that are perhaps less obvious.

// for (let student of students) {

// That statement assigns a value to student for each iteration of the loop. Another target reference:
// getStudentName(73)
// But how is that an assignment to a target? Look closely: the argument 73 is assigned to the parameter
// studentID .
// And there's one last (subtle) target reference in our program. Can you spot it?

// Did you identify this one?

// function getStudentName(studentID) {

// A function declaration is a special case of a target reference. You could think of it like var getStudentName
// = function(studentID) , but that's not exactly accurate. An identifier getStudentName is declared (at
// compile-time), but the = function(studentID) part is also handled at compilation; the association between
// getStudentName and the function is automatically set up at the beginning of the scope rather than waiting for
// an = assignment statement to be executed.

// NOTE:
// This immediate automatic function assignment from function declarations is referred to as "function hoisting",
// and will be covered in Chapter 3.

// ******** Sources
// So we've identified all five target references in the program. The other variable references must then be source
// references (because that's the only other option!).

// In for (let student of students) , we said that student is a target, but students is the source
// reference. In the statement if (student.id == studentID) , both student and studentID are source
// references. student is also a source reference in return student.name .

// In getStudentName(73) , getStudentName is a source reference (which we hope resolves to a function
// reference value). In console.log(nextStudent) , console is a source reference, as is nextStudent .

// NOTE:
// In case you were wondering, id, name, and log are all properties, not variable references.
// What's the importance of understanding targets vs. sources? In Chapter 2, we'll revisit this topic and cover how a
// variable's role impacts its lookup (specifically, if the lookup fails).

// Cheating: Run-Time Scope Modifications
// It should be clear by now that scope is determined as the program is compiled, and should not be affected by any
// run-time conditions. However, in non-strict mode, there are technically still two ways to cheat this rule, and modify
// the scopes during the run-time.

// Neither of these techniques should be used -- they're both very bad ideas, and you should be using strict mode
// anyway -- but it's important to be aware of them in case you run across code that does.
// The eval(..) function receives a string of code to compile and execute on the fly during the program run-time. If
// that string of code has a var or function declaration in it, those declarations will modify the scope that the
// eval(..) is currently executing in:

function badIdea() {
  eval("var oops = 'Ugh!';");
  console.log(oops);
}
badIdea();
// Ugh!

// If the eval(..) had not been present, the oops variable in console.log(oops) would not exist, and would
// throw a Reference Error. But eval(..) modifies the scope of the badIdea() function at run-time. This is a bad
// idea for many reasons, including the performance hit of modifying the already compiled and optimized scope, every
// time badIdea() runs. Don't do it!

// The second cheat is the with keyword, which essentially dynamically turns an object into a local scope -- its
// properties are treated as identifiers in that scope's block:

var badIdea2 = {
  oops: "Ugh!",
};
with (badIdea2) {
  console.log(oops);
  // Ugh!
}
// The global scope was not modified here, but badIdea was turned into a scope at run-time rather than compiletime.
// Again, this is a terrible idea, for performance and readability reasons. Don't!
// At all costs, avoid eval(..) (at least, eval(..) creating declarations) and with . As mentioned, neither of
// these cheats is available in strict mode, so if you just use strict mode -- you should! -- then the temptation is
// removed.

// ******** Lexical Scope
// We've demonstrated that JS's scope is determined at compile time. The term for that form of scope is "lexical
// scope". This word "lexical" is related to the "lexing" stage of compilation, as discussed earlier in this chapter.
// To draw this chapter down to a useful conclusion, the key idea of "lexical scope" is that it's controlled entirely by the
// placement of functions, blocks, and variable declarations, in relation to each other.

// If you place a variable declaration inside a function, the compiler handles this declaration as it's parsing the
// function, and associates that declaration with the function's scope. If a variable is block-scope declared ( let /
// const ), then it's associated with the nearest enclosing { .. } block, rather than its enclosing function (as with
// var ).

// Furthermore, a reference (target or source role) for a variable must be resolved as coming from one of the scopes
// that are lexically available to it; otherwise the variable is said to be "undeclared" (which usually results in an error!).
// If the variable is not declared in the current scope, the next outer/enclosing scope will be consulted. This process
// of stepping out one level of scope nesting continues until either a matching variable declaration can be found, or
// the global scope is reached and there's nowhere else to go.

// It's important to note that compilation doesn't actually do anything in terms of reserving memory for scopes and
// variables. None of the program has been executed just because it's been compiled.

// Instead, compilation creates a map of all the lexical scopes that the program will need while it executes. You can
// think of this plan/map as inserted code that will define all the scopes (aka, "lexical environments") and register all
// the identifiers (variables) for each scope.

// Scopes are planned out during compilation -- that's why we refer to "lexical scope" as a compile-time decision -- but
// they aren't actually created until run-time. Each scope is instantiated in memory each time it needs to run.

// In the next chapter, we'll dig into the conceptual foundations of lexical scope.

// ***** Chapter 2: Understanding Lexical Scope

// In Chapter 1, we explored how scope is determined at code compilation, a model called "lexical scope".
// Before we get to the nuts and bolts of how using lexical scope in our programs, we should make sure we have a
// good conceptual foundation for how scope works. This chapter will illustrate scope with several metaphors. The
// goal here is to think about how your program is handled by the JS engine in ways that more closely match how the
// JS engine actually works.

// Marbles, and Buckets, and Bubbles... Oh My!
// One metaphor I've found effective in understanding scope is sorting colored marbles into buckets of their matching
// color.

// Imagine you come across a pile of marbles, and notice that all the marbles are colored red, blue, or green. To sort
// all the marbles, let's drop the red ones into a red bucket, green into a green bucket, and blue into a blue bucket.
// After sorting, when you later need a green marble, you already know the green bucket is where to go to get it.
// In this metaphor, the marbles are the variables in our program. The buckets are scopes (functions and blocks),
// which we just conceptually assign individual colors for our discussion purposes. The color of each marble is thus
// determined by which color scope we find the marble originally created in.
// Let's annotate the program example from Chapter 1 with scope color labels:

// outer/global scope: RED
var students = [
  { id: 14, name: "Kyle" },
  { id: 73, name: "Suzy" },
  { id: 112, name: "Frank" },
  { id: 6, name: "Sarah" },
];

function getStudentName(studentID) {
  // function scope: BLUE
  for (let student of students) {
    // loop scope: GREEN
    if (student.id == studentID) {
      return student.name;
    }
  }
}

var nextStudent = getStudentName(73);
console.log(nextStudent);
// Suzy

// We've designated 3 scope colors with code comments: RED (outermost global scope), BLUE (scope of function
// getStudentName(..) ), and GREEN (scope of/inside the for loop). But it still may be difficult to recognize the
// boundaries of these scope buckets when looking at a code listing.

// Figure 2 tries to make the scope boundaries easier to visualize by drawing colored bubbles around each scope:
// Fig. 2: Nested Scope Bubbles
// 1. Bubble 1 (RED) encompasses the global scope, which has three identifiers/variables: students (line 1),
// getStudentName (line 8), and nextStudent (line 16).

// 2. Bubble 2 (BLUE) encompasses the scope of the function getStudentName(..) (line 8), which has just
// one identifier/variable: the parameter studentID (line 8).

// 3. Bubble 3 (GREEN) encompasses the scope of the for -loop (line 9), which has just one identifier/variable:
// student (line 9).

// Scope bubbles are determined during compilation based on where the functions / blocks of scope are written, the
// nesting inside each other, etc. Each scope bubble is entirely contained within its parent scope bubble -- a scope is
// never partially in two different outer scopes.

// Important * look for page 83 to see the figure

// Each marble (variable/identifier) is colored based on which bubble (bucket) it's declared in, not the color of the
// scope it may be accessed from (e.g., students on line 9 and studentID on line 10).

// NOTE:
// Remember we asserted in Chapter 1 that id, name, and log are all properties, not variables; in other words,
// they're not marbles in buckets, so they don't get colored based on any the rules we're discussing in this book.
// To understand how such property accesses are handled, see Book 3 Objects & Classes.

// As the JS engine processes a program (during compilation), and finds a declaration for a variable, it essentially
// asks, "which color scope (bubble, bucket) am I currently in?" The variable is designated as that same color, meaning
// it belongs to that bucket/bubble.

// The GREEN(3) bucket is wholly nested inside of the BLUE(2) bucket, and similarly the BLUE(2) bucket is wholly
// nested inside the RED(1) bucket. Scopes can nest inside each other as shown, to any depth of nesting as your
// program needs.

// References (non-declarations) to variables/identifiers can be made if their declarations are either in the current
// scope, or any scope above/outside the current scope, but never for declarations from lower/nested scopes. So an
// expression in the RED(1) bucket only has access to RED(1) marbles, not BLUE(2) or GREEN(3). An expression in the
// BLUE(2) bucket can reference either BLUE(2) or RED(1) marbles, not GREEN(3). And an expression in the GREEN(3)
// bucket has access to RED(1), BLUE(2), and GREEN(3) marbles.

// We can conceptualize the process of determining these non-declaration marble colors during runtime as a lookup.
// Since the students variable reference in the for -loop statement on line 9 is not a declaration, it has no color.
// So we ask the current BLUE(2) scope bucket if it has a marble matching that name. Since it doesn't, the lookup
// continues with the next outer/containing scope: RED(1). The RED(1) bucket has a marble of the name students ,
// so the loop-statement's students variable is determined to be a RED(1) marble.

// The if (student.id == studentID) on line 10 is similarly determined to reference a GREEN(3) marble
// named student and a BLUE(2) marble studentID .

// NOTE:
// The JS engine doesn't generally determine these marble colors during run-time; the "lookup" here is a rhetorical
// device to help you understand the concepts. During compilation, most or all variable references will be from
// already-known scope buckets, so their color is determined at that, and stored with each marble reference to
// avoid unnecessary lookups as the program runs. More on this in the next chapter.

// The key take-aways from marbles & buckets (and bubbles!):
// Variables are declared in certain scopes, which can be thought of as colored marbles in matching-color
// buckets.

// Any reference to a variable of that same name in that scope, or any deeper nested scope, will be a marble of
// that same color -- unless an intervening scope "shadows" the variable declaration; see Chapter 3 "Shadowing.
// The determination of colored buckets, and the marbles they contain, happens during compilation. This
// information is used for variable (marble color) "lookups" during code execution.

// A Conversation Among Friends
// Another useful metaphor for the process of analyzing variables and the scopes they come from is to imagine
// various conversations that go on inside the engine as code is processed and then executed. We can "listen in" on
// these conversations to get a better conceptual foundation for how scopes work.

// Let's now meet the members of the JS engine that will have conversations as they process that program:
// 1. Engine: responsible for start-to-finish compilation and execution of our JavaScript program.
// 2. Compiler: one of Engine's friends; handles all the dirty work of parsing and code-generation (see previous
// section).
// 3. Scope Manager: another friend of Engine; collects and maintains a look-up list of all the declared
// variables/identifiers, and enforces a set of rules as to how these are accessible to currently executing code.
// For you to fully understand how JavaScript works, you need to begin to think like Engine (and friends) think, ask the
// questions they ask, and answer their questions likewise.
// To explore these conversations, recall again our running program example:
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

// Let's examine how JS is going to process that program, specifically starting with the first statement. The array and
// its contents are just basic JS value literals (and thus unaffected by any scoping concerns), so our focus here will be
// on the var students = [ .. ] declaration and initialization-assignment parts.
// We typically think of that as a single statement, but that's not how our friend Engine sees it. In fact, Engine sees two
// distinct operations, one which Compiler will handle during compilation, and the other which Engine will handle
// during execution.
// The first thing Compiler will do with this program is perform lexing to break it down into tokens, which it will then
// parse into a tree (AST).

// Once Compiler gets to code-generation, there's more detail to consider than may be obvious. A reasonable
// assumption would be that Compiler will produce code for the first statement such as: "Allocate memory for a
// variable, label it students , then stick a reference to the array into that variable." But there's more to it.

// Here's how Compiler will handle that statement:
// 1. Encountering var students , Compiler will ask Scope Manager to see if a variable named students
// already exists for that particular scope bucket. If so, Compiler would ignore this declaration and move on.
// Otherwise, Compiler will produce code that (at execution time) asks Scope Manager to create a new variable
// called students in that scope bucket.

// 2. Compiler then produces code for Engine to later execute, to handle the students = [] assignment. The
// code Engine runs will first ask Scope Manager if there is a variable called students accessible in the
// current scope bucket. If not, Engine keeps looking elsewhere (see "Nested Scope" below). Once Engine finds
// a variable, it assigns the reference of the [ .. ] array to it.

// In conversational form, the first-phase of compilation for the program might play out between Compiler and Scope
// Manager like this:

// Compiler: Hey Scope Manager (of the global scope), I found a formal declaration for an identifier called
// students , ever heard of it?
// (Global) Scope Manager: Nope, haven't heard of it, so I've just now created it for you.
// Compiler: Hey Scope Manager, I found a formal declaration for an identifier called getStudentName , ever
// heard of it?
// (Global) Scope Manager: Nope, but I just created it for you.
// Compiler: Hey Scope Manager, getStudentName points to a function, so we need a new scope bucket.
// (Function) Scope Manager: Got it, here it is.

// Compiler: Hey Scope Manager (of the function), I found a formal parameter declaration for studentID , ever
// heard of it?
// (Function) Scope Manager: Nope, but now it's registered in this scope.
// Compiler: Hey Scope Manager (of the function), I found a for -loop that will need its own scope bucket.
// ...
// The conversation is a question-and-answer exchange, where Compiler asks the current Scope Manager if an
// encountered identifier declaration has already been encountered? If "no", Scope Manager creates that variable in
// that scope. If the answer were "yes", then it would effectively be skipped over since there's nothing more for that
// Scope Manager to do.

// Compiler also signals when it runs across functions or block scopes, so that a new scope bucket and Scope
// Manager can be instantiated.

// Later, when it comes to execution of the program, the conversation will proceed between Engine and Scope
// Manager, and might play out like this:

// Engine: Hey Scope Manager (of the global scope), before we begin, can you lookup the identifier
// getStudentName so I can assign this function to it?
// (Global) Scope Manager: Yep, here you go.
// Engine: Hey Scope Manager, I found a target reference for students , ever heard of it?
// (Global) Scope Manager: Yes, it was formally declared for this scope, and it's already been initialized to
// undefined , so it's ready to assign to. Here you go.
// Engine: Hey Scope Manager (of the global scope), I found a target reference for nextStudent , ever heard of
// it?

// (Global) Scope Manager: Yes, it was formally declared for this scope, and it's already been initialized to
// undefined , so it's ready to assign to. Here you go.
// Engine: Hey Scope Manager (of the global scope), I found a source reference for getStudentName , ever
// heard of it?

// (Global) Scope Manager: Yes, it was formally declared for this scope. Here you go.
// Engine: Great, the value in getStudentName is a function, so I'm going to execute it.
// Engine: Hey Scope Manager, now we need to instantiate the function's scope.
// ...

// This conversation is another question-and-answer exchange, where Engine first asks the current Scope Manager to
// lookup the hoisted getStudentName identifier, so as to associate the function with it. Engine then proceeds to
// ask Scope Manager about the target reference for students , and so on.

// To review and summarize how a statement like var students = [ .. ] is processed, in two distinct steps:
// 1. Compiler sets up the declaration of the scope variable (since it wasn't previously declared in the current
// scope).

// 2. While Engine is executing, since the declaration has an initialization assignment, Engine asks Scope Manager
// to look up the variable, and assigns to it once found.
