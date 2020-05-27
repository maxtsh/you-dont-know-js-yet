// ********* Chapter 4: The Bigger Picture *********** ==========================================================================

// This book surveys what you need to be aware of as you get started with JS. The goal is to fill in gaps that readers
// newer to JS might have tripped over in their early encounters with the language. I also hope that we've hinted at
// enough deeper detail throughout to pique your curiosity to want to dig more into the language.
// The rest of the books in this series are where we will unpack all of the rest of the language, in far greater detail than
// we could have done in a few brief chapters here.
// Remember to take your time, though. Rather than rushing onto the next book in an attempt to churn through all the
// books expediently, spend some time going back over the material in this book. Spend some more time looking
// through code in your current projects, and comparing what you see to what's been discussed so far.
// When you're ready, this final chapter divides the organization of the JS language into three main pillars, then offers
// a brief roadmap of what to expect from the rest of the book series, and how I suggest you proceed. Also, don't skip
// the appendices, especially Appendix B, "Practice, Practice, Practice!".

// ****** Pillar 1: Scope and Closure
// The organization of variables into units of scope (functions, blocks) is one of the most foundational characteristics
// of any language; perhaps no other characteristic has a greater impact on how programs behave.
// Scopes are like buckets, and variables are like marbles you put into those buckets. The scope model of a language
// is like the rules that help you determine which color marbles go in which matching-color buckets.
// Scopes nest inside each other, and for any given expression or statement, only variables at that level of scope
// nesting, or in higher/outer scopes, are accessible; variables from lower/inner scopes are hidden and inaccessible.
// This is how scopes behave in most languages, which is called lexical scope. The scope unit boundaries, and how
// variables are organized in them, is determined at the time the program is parsed (compiled). In other words, it's an
// author-time decision: where you locate a function/scope in the program determines what the scope structure of
// that part of the program will be.

// JS is lexically scoped, though many claim it isn't, because of two particular characteristics of its model that are not
// present in other lexically scoped languages.
// The first is commonly called hoisting: when all variables declared anywhere in a scope are treated as if they're
// declared at the beginning of the scope. The other is that var -declared variables are function scoped, even if they
// appear inside a block.

// Neither hoisting nor function-scoped var are sufficient to back the claim that JS is not lexically scoped.
// let / const declarations have a peculiar error behavior called the "Temporal Dead Zone" (TDZ) which results in
// observable but unusable variables. Though TDZ can be strange to encounter, it's also not an invalidation of lexical
// scoping. All of these are just unique parts of the language that should be learned and understood by all JS
// developers.

// Closure is a natural result of lexical scope when the language has functions as first-class values, as JS does. When
// a function makes reference to variables from an outer scope, and that function is passed around as a value and
// executed in other scopes, it maintains access to its original scope variables; this is closure.
// Across all of programming, but especially in JS, closure drives many of the most important programming patterns,
// including modules. As I see it, modules are as with the grain as you can get, when it comes to code organization in
// JS.
// To dig further into scope, closures, and how modules work, read Book 2, Scope & Closures.

// ****** Pillar 2: Prototypes
// The second pillar of the language is the prototypes system. We covered this topic in-depth in Chapter 3
// ("Prototypes"), but I just want to make a few more comments about its importance.
// JS is one of very few languages where you have the option to create objects directly and explicitly, without first
// defining their structure in a class.
// For many years, people implemented the class design pattern on top of prototypes—so-called "prototypal
// inheritance" (see Appendix A, "Prototypal 'Classes'")—and then with the advent of ES6's class keyword, the
// language doubled-down on its inclination toward OO/class-style programming.
// But I think that focus has obscured the beauty and power of the prototype system: the ability for two objects to
// simply connect with each other and cooperate dynamically (during function/method execution) through sharing a
// this context.

// Classes are just one pattern you can build on top of such power. But another approach, in a very different direction,
// is to simply embrace objects as objects, forget classes altogether, and let objects cooperate through the prototype
// chain. This is called behavior delegation. I think delegation is more powerful than class inheritance, as a means for
// organizing behavior and data in our programs.
// But class inheritance gets almost all the attention. And the rest goes to functional programming (FP), as the sort of
// "anti-class" way of designing programs. This saddens me, because it snuffs out any chance for exploration of
// delegation as a viable alternative.
// I encourage you to spend plenty of time deep in Book 3, Objects & Classes, to see how object delegation holds far
// more potential than we've perhaps realized. This isn't an anti- class message, but it is intentionally a "classes
// aren't the only way to use objects" message that I want more JS developers to consider.
// Object delegation is, I would argue, far more with the grain of JS, than classes (more on grains in a bit).

// ******* Pillar 3: Types and Coercion
// The third pillar of JS is by far the most overlooked part of JS's nature.
// The vast majority of developers have strong misconceptions about how types work in programming languages, and
// especially how they work in JS. A tidal wave of interest in the broader JS community has begun to shift to "static
// typing" approaches, using type-aware tooling like TypeScript or Flow.
// I agree that JS developers should learn more about types, and should learn more about how JS manages type
// conversions. I also agree that type-aware tooling can help developers, assuming they have gained and used this
// knowledge in the first place!
// But I don't agree at all that the inevitable conclusion of this is to decide JS's type mechanism is bad and that we
// need to cover up JS's types with solutions outside the language. We don't have to follow the "static typing" way to
// be smart and solid with types in our programs. There are other options, if you're just willing to go against the grain
// of the crowd, and with the grain of JS (again, more on that to come).
// Arguably, this pillar is more important than the other two, in the sense that no JS program will do anything useful if
// it doesn't properly leverage JS's value types, as well as the conversion (coercion) of values between types.
// Even if you love TypeScript/Flow, you are not going to get the most out of those tools or coding approaches if you
// aren't deeply familiar with how the language itself manages value types.
// To learn more about JS types and coercion, check out Book 4, Types & Grammar. But please don't skip over this
// topic just because you've always heard that we should use === and forget about the rest.
// Without learning this pillar, your foundation in JS is shaky and incomplete at best.
