// Apendix A

// Values vs. References
// In Chapter 2, we introduced the two main types of values: primitives and objects. But we didn't discuss yet one key
// difference between the two: how these values are assigned and passed around.
// In many languages, the developer can choose between assigning/passing a value as the value itself, or as a
// reference to the value. In JS, however, this decision is entirely determined by the kind of value. That surprises a lot
// of developers from other languages when they start using JS.
// If you assign/pass a value itself, the value is copied. For example:

var myName = "Kyle";
var yourName = myName;
// Here, the yourName variable has a separate copy of the "Kyle" string from the value that's stored in myName .
// That's because the value is a primitive, and primitive values are always assigned/passed as value copies.
// Here's how you can prove there's two separate values involved:
var myName = "Kyle";
var yourName = myName;
myName = "Frank";
console.log(myName);
// Frank
console.log(yourName);
// Kyle

// See how yourName wasn't affected by the re-assignment of myName to "Frank" ? That's because each
// variable holds its own copy of the value.
// By contrast, references are the idea that two or more variables are pointing at the same value, such that modifying
// this shared value would be reflected by an access via any of those references. In JS, only object values (arrays,
// objects, functions, etc.) are treated as references.
// Consider:

const myAdress = {
  country: "Iran",
  city: "Tehran",
};

// Objects declared with const their value can be changed afterwards in code but they can't be re-assigned again like let
const yourAddress = myAdress;
myAdress.country = "Isfahan";
console.log(myAdress.country);
console.log(yourAddress.country);

// Because the value assigned to myAddress is an object, it's held/assigned by reference, and thus the assignment
// to the yourAddress variable is a copy of the reference, not the object value itself. That's why the updated value
// assigned to the myAddress.country is reflected when we access yourAddress.country . myAddress and
// yourAddress have copies of the reference to the single shared object, so an update to one is an update to both.

// Again, JS chooses the value-copy vs. reference-copy behavior based on the value type. Primitives are held by value,
// objects are held by reference. There's no way to override this in JS, in either direction.
// ====================================================

// **** So Many Function Forms

// Function inferred names which are anonymous and identifier names
const giveMoney = function () {
  // Inferred name => anonymus
  return true;
};

// The function expression here is referred to as an anonymous function expression, since it has no name identifier
// between the function keyword and the (..) parameter list. This point confuses many JS developers because
// as of ES6, JS performs a "name inference" on an anonymous function:
giveMoney.name;
// "awesomeFunction"
// The name property of a function will reveal either its directly given name (in the case of a declaration) or its
// inferred name in the case of an anonymous function expression. That value is generally used by developer tools
// when inspecting a function value or when reporting an error stack trace.

// So even an anonymous function expression might get a name. However, name inference only happens in limited
// cases such as when the function expression is assigned (with = ). If you pass a function expression as an
// argument to a function call, for example, no name inference occurs; the name property will be an empty string, and
// the developer console will usually report "(anonymous function)".
// Even if a name is inferred, it's still an anonymous function. Why? Because the inferred name is a metadata string
// value, not an available identifier to refer to the function. An anonymous function doesn't have an identifier to use to
// refer to itself from inside itself—for recursion, event unbinding, etc.

// Compare the anonymous function expression form to:
// let awesomeFunction = ..
// const awesomeFunction = ..
var someFunc = function getMoney() {
  // Identifier name => cognitive
  return null;
};
console.log(giveMoney.name, giveMoney());
console.log(someFunc.name, someFunc());

// This function expression is a named function expression, since the identifier someName is directly associated with
// the function expression at compile time; the association with the identifier awesomeFunction still doesn't
// happen until runtime at the time of that statement. Those two identifiers don't have to match; sometimes it makes
// sense to have them be different, other times it's better to have them be the same.
// Notice also that the explicit function name, the identifier someName , takes precedence when assigning a name for
// the name property.
// Should function expressions be named or anonymous? Opinions vary widely on this. Most developers tend to be
// unconcerned with using anonymous functions. They're shorter, and unquestionably more common in the broad
// sphere of JS code out there.
// In my opinion, if a function exists in your program, it has a purpose; otherwise, take it out! And if it has a purpose, it
// has a natural name that describes that purpose.

// If a function has a name, you the code author should include that name in the code, so that the reader does not
// have to infer that name from reading and mentally executing that function's source code. Even a trivial function
// body like x * 2 has to be read to infer a name like "double" or "multBy2"; that brief extra mental work is
// unnecessary when you could just take a second to name the function "double" or "multBy2" once, saving the reader
// that repeated mental work every time it's read in the future.
// There are, regrettably in some respects, many other function definition forms in JS as of early 2020 (maybe more in
// the future!).
// Here are some more declaration forms:

// generator function declaration
function* two() {}

// async function declaration
async function three() {}

// async generator function declaration
async function* four() {}

// named function export declaration (ES6 modules)
// export function five() {}

// And here are some more of the (many!) function expression forms:

// IIFE function declaration
(function show() {
  console.log("SHOW");
})();

// asynchronous IIFE
(async function () {})();
(async function namedAIIFE() {})();

// Arrow function declarations
// 1#
const power2 = (x) => {
  // curley brace and you must return output value in code
  return x * x;
};
console.log(power2(2));

// 2#
const power3 = (x) => x * x * x; // without curley brace it returns automatically after
console.log(power3(3));

// 3#
const power4 = (x) => ({ x: Math.pow(x, 4) });
console.log(power4(5).x);

// Examples
var f1 = () => 42;
var f2 = (x) => x * 2;
var f3 = (x) => x * 2;
var f4 = (x, y) => x * y;
var f5 = (x) => ({ x: x * 2 });
var f6 = (x) => {
  return x * 2;
};
const f7 = async (x) => {
  function calc(input) {
    return input + 1;
  }
  var y = await calc(x);
  return y * 2;
};
console.log(f7((x) => x * 2));

// Arrow functions are syntactically anonymous, meaning the syntax doesn't provide a
// way to provide a direct name identifier for the function.

// Since I don't think anonymous functions are a good idea to use frequently in your programs, I'm not a fan of using
// the => arrow function form. This kind of function actually has a specific purpose (i.e., handling the this
// keyword lexically), but that doesn't mean we should use it for every function we write. Use the most appropriate tool
// for each job.

// function declaration in classes called methods
class Airplane {
  constructor() {}
  // class methods
  // 1#
  airplane1(name) {
    return "airplane-1" + " " + name;
  }
  //2#
  airplane2(name) {
    return "airplane-2" + " " + name;
  }
}
const airCompany = new Airplane(); // creating instance

console.log(airCompany.airplane1("F/A 18 Super Hornet"));
console.log(airCompany.airplane2("B-2 Sprit"));

// Object literal functions
const foodGenerator = {
  // 1#
  name1(food) {
    return food + " " + "Not eatable";
  },
  // 2#
  name2(food) {
    return food + " " + "Eatable";
  },
  // 3#
  name3: function (food) {
    return food + " " + "is Fruit";
  },
};
console.log(foodGenerator.name1("Iron!"));
console.log(foodGenerator.name2("Tomato!"));
console.log(foodGenerator.name3("Orange"));

// Prototype Declaration
function ClassRoom() {}

// ** Adding welcome property which is now a function to the Classroom prototype which was an empty object
ClassRoom.prototype.welcome = function hello() {
  console.log("WELCOME STUDENTS");
};

// All functions by default reference an empty object at a property named prototype . Despite the confusing
// naming, this is not the function's prototype (where the function is prototype linked to), but rather the prototype
// object to link to when other objects are created by calling the function with new

// ** new ClassRoom creates a new Object and prototype links it to the existing ClassRoom prototype object meaning that MathClass has now access to all the prototype properties of ClassRoom;
const MathClass = new ClassRoom();
MathClass.welcome();

// All functions by default reference an empty object at a property named prototype . Despite the confusing
// naming, this is not the function's prototype (where the function is prototype linked to), but rather the prototype
// object to link to when other objects are created by calling the function with new .

// We add a welcome property on that empty object (called Classroom.prototype ), pointing at the hello()
// function.
// Then new Classroom() creates a new object (assigned to mathClass ), and prototype links it to the existing
// Classroom.prototype object.

class Save {
  constructor(name) {
    this.name = name;
  }

  showName() {
    console.log(this.name); // ES6 + Methods
  }
}

const sv = new Save("Max");

Save.prototype.showFullName = function () {
  // Before ES6 Prototypal functions
  console.log(`Fullname: ${this.name}`);
};

sv.showFullName("Jonas");

console.log(Save.prototype);

// ***So Each class and function has their own prototype object which is empty at first and we can add stuff to it for example more functions or methods

console.log("===================================================");
// ====================================================================================================================

// Appendix B

// Practice 1#
const dayStart = "07:30"; // Start of the working day
const dayEnd = "17:45"; // End of the working day

function scheduleMeeting(start, durition) {
  // Start Of A Meeting
  const meetingStart = {
    hour: Number(start.split(":")[0]),
    minute: Number(start.split(":")[1]),
  };
  // **Duration Of A Meeting
  const meetingDuration = {
    hours: Math.floor(durition / 60), // Calculating hours of durition
    minutes: durition % 60, // Calculating minutes of durition
  };

  // **Seprating the meeting's End-Time into Hour and Minute
  const endOfMeeting = {
    hour: meetingStart.hour + meetingDuration.hours, // Calculating Meetings Ending Hour
    minute: meetingStart.minute + meetingDuration.minutes, // Calculating Meetings Ending Minute
  };

  // **Calculating if the minute is more than 60
  //we must add proportional extra hour and minus the proportional 60 minutes
  if (meetingStart.minute + meetingDuration.minutes >= 60) {
    endOfMeeting.hour = endOfMeeting.hour + 1;
    endOfMeeting.minute = endOfMeeting.minute - 60;
  }

  const meetingEndTime = `${String(endOfMeeting.hour).padStart(
    2,
    "0"
  )}:${String(endOfMeeting.minute).padStart(2, "0")}`;

  console.log(start, meetingEndTime, meetingDuration);

  if (dayEnd >= meetingEndTime && start >= dayStart) {
    return "It is a perfect Schedule!";
  } else {
    return "It is not a good schedule";
  }
}

console.log(scheduleMeeting("08:30", 50));
console.log(scheduleMeeting("11:30", 60));
console.log(scheduleMeeting("17:00", 45));
console.log(scheduleMeeting("13:00", 55));
console.log(scheduleMeeting("17:30", 30));
console.log(scheduleMeeting("16:00", 121));
console.log(scheduleMeeting("16:10", 110));
console.log(scheduleMeeting("07:30", 626));

console.log("===================================================");
// ============================================================================
// Practice 2#
function range(start, end) {
  if (end === undefined) {
    return function getEnd(end) {
      return getRange(start, end);
    };
  } else {
    return getRange(start, end);
  }

  function getRange(start, end) {
    let output = [];
    if (end >= start) {
      for (n = start; n <= end; n++) {
        output.push(n);
      }
    }
    return output;
  }
}

console.log(range(4, 9));
console.log(range(3, 0));
console.log(range(5, 10));

const start6 = range(6);
console.log(start6(9));

console.log("===================================================");
// ============================================================================
// Practice 3#
function randMax(max) {
  return Math.trunc(1e9 * Math.random()) % max;
}
var reel = {
  symbols: ["♠", "♥", "♦", "♣", "☺", "★", "☾", "☀"],
  spin() {
    if (this.position == null) {
      this.position = randMax(this.symbols.length - 1);
    }
    this.position = (this.position + 100 + randMax(100)) % this.symbols.length;
  },
  display() {
    if (this.position == null) {
      this.position = randMax(this.symbols.length - 1);
    }
    return this.symbols[this.position];
  },
};
var slotMachine = {
  reels: [Object.create(reel), Object.create(reel), Object.create(reel)],
  spin() {
    this.reels.forEach(function spinReel(reel) {
      reel.spin();
    });
  },
  display() {
    var lines = [];
    // display all 3 lines on the slot machine
    for (let linePos = -1; linePos <= 1; linePos++) {
      let line = this.reels.map(function getSlot(reel) {
        var slot = Object.create(reel);
        slot.position =
          (reel.symbols.length + reel.position + linePos) % reel.symbols.length;
        return reel.display.call(slot);
      });
      lines.push(line.join(" | "));
    }
    return lines.join("\n");
  },
};
