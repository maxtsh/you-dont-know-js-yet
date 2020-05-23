const myAdress = {
  country: "Iran",
  city: "Tehran",
};

// Objects declared with const their value can be changed afterwards in code
const yourAddress = myAdress;
myAdress.country = "Isfahan";
console.log(myAdress.country);
console.log(yourAddress.country);
// ====================================================

// Function inferred names which are anonymous and identifier names
const giveMoney = function () {
  // Inferred name => anonymus
  return true;
};

function getMoney() {
  // Identifier name => cognitive
  return null;
}
console.log(giveMoney.name, giveMoney());
console.log(getMoney.name, getMoney());

// IIFE function declaration
(function show() {
  console.log("SHOW");
})();

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

console.log("===================================================");
// ============================================================================
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
