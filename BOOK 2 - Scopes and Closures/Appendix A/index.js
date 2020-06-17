// ******** the function parameter list has its own scope if it contains parameters that are not simple like below examples
function getName(newName = jimmy, jimmy) {
  console.log(jimmy);
}

getName("Max", "Jimmy");

function whatsTheDealHere(id, defaultID = () => id) {
  var id;

  console.log(`local variable 'id': ${id}`);
  console.log(`parameter 'id' (closure): ${defaultID()}`);

  console.log("reassigning 'id' to 5");
  id = 5;

  console.log(`local variable 'id': ${id}`);
  console.log(`parameter 'id' (closure): ${defaultID()}`);
}

whatsTheDealHere(3);
// local variable 'id': 3   <--- Huh!? Weird!
// parameter 'id' (closure): 3
// reassigning 'id' to 5
// local variable 'id': 5
// parameter 'id' (closure): 3

// The strange bit here is the first console message. At that moment, the shadowing id local variable has just been var id declared, which Chapter 5 asserts is typically auto-initialized to undefined at the top of its scope. Why doesn't it print undefined?

// In this specific corner case (for legacy compat reasons), JS doesn't auto-initialize id to undefined, but rather to the value of the id parameter (3)!

// Though the two id's look at that moment like they're one variable, they're actually still separate (and in separate scopes). The id = 5 assignment makes the divergence observable, where the id parameter stays 3 and the local variable becomes 5.

// My advice to avoid getting bitten by these weird nuances:

// * Never shadow parameters with local variables

// * Avoid using a default parameter function that closes over any of the parameters

// At least now you're aware and can be careful about the fact that the parameter list is its own scope if any of the parameters are non-simple.

// ******* let's make sure we're on the same page about what a named function is:
function thisIsNamed() {
  // ..
}

// ajax("some.url", function thisIsAlsoNamed() {
//   // ..
// });

var notNamed = function () {
  // ..
};

// makeRequest({
//   data: 42,
//   cb /* also not a name */: function () {
//     // ..
//   },
// });

var stillNotNamed = function butThisIs() {
  // ..
};

// "But wait!", you say. Some of those *are* named, right!?

var notNamed = function () {
  // ..
};

var config = {
  cb: function () {
    // ..
  },
};

notNamed.name;
// notNamed

config.cb.name;
// cb

// Missing Names?
// Yes, these inferred names might show up in stack traces, which is definitely better than "anonymous" showing up. But...

function ajax(url, cb) {
  console.log(cb.name);
}

ajax("some.url", function () {
  // ..
});
// ""

// Oops. Anonymous `function` expressions passed as callbacks are incapable of receiving an inferred name, so `cb.name` holds just the empty string `""`. The vast majority of all `function` expressions, especially anonymous ones, are used as callback arguments; none of these get a name. So relying on name inference is incomplete, at best.

// And it's not just callbacks that fall short with inference:

var config = {};

config.cb = function () {
  // ..
};

config.cb.name;
// ""

var [noName] = [function () {}];
noName.name;
// ""

//  Who am I?
// Without a lexical name identifier, the function has no internal way to refer to itself. Self-reference is important for things like recursion and event handling:
// broken
// runOperation(function (num) {
//   if (num <= 1) return 1;
//   return num * oopsNoNameToCall(num - 1);
// });

// also broken
// btn.addEventListener("click", function () {
//   console.log("should only respond to one click!");
//   btn.removeEventListener("click", oopsNoNameHere);
// });

// Leaving off the lexical name from your callback makes it harder to reliably self-reference the function. You *could* declare a variable in an enclosing scope that references the function, but this variable is *controlled* by that enclosing scope—it could be re-assigned, etc.—so it's not as reliable as the function having its own internal self-reference.

// **************** All functions need names. Every single one. No exceptions. Any name you omit is making the program harder to read, harder to debug, harder to extend and maintain later.

// ***************** Arrow Functions
// Arrow functions are **always** anonymous, even if (rarely) they're used in a way that gives them an inferred name. I just spent several pages explaining why anonymous functions are a bad idea, so you can probably guess what I think about arrow functions.

// Don't use them as a general replacement for regular functions. They're more concise, yes, but that brevity comes at the cost of omitting key visual delimiters that help our brains quickly parse out what we're reading. And, to the point of this discussion, they're anonymous, which makes them worse for readability from that angle as well.

// Arrow functions have a purpose, but that purpose is not to save keystrokes. Arrow functions have *lexical this* behavior, which is somewhat beyond the bounds of our discussion in this book.

// Briefly: arrow functions don't define a `this` identifier keyword at all. If you use a `this` inside an arrow function, it behaves exactly as any other variable reference, which is that the scope chain is consulted to find a function scope (non-arrow function) where it *is* defined, and to use that one.

// In other words, arrow functions treat `this` like any other lexical variable.

// If you're used to hacks like `var self = this`, or if you prefer to call `.bind(this)` on inner `function` expressions, just to force them to inherit a `this` from an outer function like it was a lexical variable, then `=>` arrow functions are absolutely the better option. They're designed specifically to fix that problem.

// So, in the rare cases you need *lexical this*, use an arrow function. It's the best tool for that job. But just be aware that in doing so, you're accepting the downsides of an anonymous function. You should expend additional effort to mitigate the readability *cost*, such as more descriptive variable names and code comments.

// IIFEs are typically defined by placing `( .. )` around the `function` expression, as shown in those previous snippets. But that's not the only way to define an IIFE. Technically, the only reason we're using that first surrounding set of `( .. )` is just so the `function` keyword isn't in a position to qualify as a `function` declaration to the JS parser. But there are other syntactic ways to avoid being parsed as a declaration:

!(function thisIsAnIIFE() {
  // ..
})();

+(function soIsThisOne() {
  // ..
})();

~(function andThisOneToo() {
  // ..
})();

// The `!`, `+`, `~`, and several other unary operators (operators with one operand) can all be placed in front of `function` to turn it into an expression. Then the final `()` call is valid, which makes it an IIFE.
// I actually kind of like using the `void` unary operator when defining a standalone IIFE:

void (function yepItsAnIIFE() {
  // ..
})();

// The benefit of `void` is, it clearly communicates at the beginning of the function that this IIFE won't be returning any value.
// However you define your IIFEs, show them some love by giving them names.

//  **** LINE 732 to 791 TDZ explaination is important Appendix A
//  **** LINE 801 to 880 explaination is important Appendix A
