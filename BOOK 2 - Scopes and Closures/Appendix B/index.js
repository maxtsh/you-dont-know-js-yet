// 1#
// * If you color all the scopes (including the global scope!) different colors, you need at least six colors.
// Make sure to add a code comment labeling each scope with its color.

//     BONUS: identify any implied scopes your code may have.

// * Each scope has at least one identifier.
// * Contains at least two function scopes and at least two block scopes.
// * At least one variable from an outer scope must be shadowed by a nested scope variable (see Chapter 3).
// * At least one variable reference must resolve to a variable declaration at least two levels higher in the scope chain.

// Color 1# => global scope
const tanks = [
  "Tiger",
  "JadgTiger",
  "KingTiger",
  "T90",
  "M26 Pershing",
  "Churchill",
];

// Parameter list implied scope
function tankFactory(targetTank, def = targetTank) {
  // Color 2# tank factory scope

  function shoot() {
    // Color 3# shoot scope
    console.log(`${targetTank} SHOOT!`);
  }

  function backward() {
    // Color 4# backward scope
    console.log(`${targetTank} Turn Back!`);
  }

  // Function name implied scope
  var allMoveForward = function allMoveForward(allTanks) {
    // Color 5# allMoveForward scope
    const moveStr = "Move Forward";

    for (let tank of allTanks) {
      // Color 6# loop block scope
      console.log(`${tank} ${moveStr}`);
    }
  };

  // Shadowed variable
  var targetTank = "Tiger";

  {
    // Color 7# standalone block scope
    let allTanks = tanks;
    const doesExistJadgTiger = allTanks.some((tank) => tank === "JadgTiger");

    doesExistJadgTiger
      ? console.log("JadgTiger is comming!")
      : console.log("JadgTiger is not here!");
  }

  return {
    shoot,
    backward,
    allMoveForward,
  };
}

const jadgTiger = tankFactory(tanks[1]);
jadgTiger.shoot();
jadgTiger.backward();
jadgTiger.allMoveForward(tanks);

// 2#

function prime() {
  // We must bring let cahce = []; out of the isPrime scope
  let cache = {};

  return function isPrime(v) {
    // if we declare cache array here, we can't save values in multiple instances and the array will be Garbage Collected after each instance call
    // let cache = [];
    if (v <= 3) return (cachev[v] = v > 1);
    if (v % 2 == 0 || v % 3 == 0) return (cache[v] = false);

    const vSqrt = Math.sqrt(v);
    for (let i = 5; i <= vSqrt; i += 6) {
      if (v % i == 0 || v % (i + 2) == 0) {
        return (cache[v] = false);
      }
    }
    return (cache[v] = true);
  };
}
const isPrime = prime();

function factor() {
  let cache = {};

  return function factorize(v) {
    if (v in cache) {
      return cache[v];
    }

    if (!isPrime(v)) {
      let i = Math.floor(Math.sqrt(v));
      while (v % i != 0) {
        i--;
      }
      return (cache[v] = [...factorize(i), ...factorize(v / i)]);
    }

    return (cache[v] = [v]);
  };
}
const factorize = factor();

const num = 5543;

console.log(`${num} is prime ? : ${isPrime(num)}`);
console.log(factorize(num));

// 3#

function toggle(...items) {
  let vals = [...items]; // We must deep copy the items array because we don't want to change its reference in memory but make a new one.
  let current;

  if (items.length == 0)
    return function noInput() {
      return "Please put some input!";
    };

  return function print() {
    if (vals.length == 0) {
      vals = [...items];
    }

    current = vals[0];
    vals.shift();

    return current;
  };
}

const hello = toggle("hello");
const onOff = toggle("on", "off");
const speed = toggle("slow", "medium", "fast");

console.log(hello());
console.log(hello());
console.log(hello());

console.log(onOff());
console.log(onOff());
console.log(onOff());
console.log(onOff());
console.log(onOff());
console.log(onOff());

// 4#

function calculator() {
  var currentTotal = 0;
  var currentVal = "";
  var currentOper = "=";

  return pressKey;

  // ********************

  function pressKey(key) {
    // number key?
    if (/\d/.test(key)) {
      currentVal += key;
      return key;
    }
    // operator key?
    else if (/[+*/-]/.test(key)) {
      // multiple operations in a series?
      if (currentOper != "=" && currentVal != "") {
        // implied '=' keypress
        pressKey("=");
      } else if (currentVal != "") {
        currentTotal = Number(currentVal);
      }
      currentOper = key;
      currentVal = "";
      return key;
    }
    // = key?
    else if (key == "=" && currentOper != "=") {
      currentTotal = op(currentTotal, currentOper, Number(currentVal));
      currentOper = "=";
      currentVal = "";
      return formatTotal(currentTotal);
    }
    return "";
  }

  function op(val1, oper, val2) {
    var ops = {
      // NOTE: using arrow functions
      // only for brevity in the book
      "+": (v1, v2) => v1 + v2,
      "-": (v1, v2) => v1 - v2,
      "*": (v1, v2) => v1 * v2,
      "/": (v1, v2) => v1 / v2,
    };
    return ops[oper](val1, val2);
  }
}

function useCalc(calc, keys) {
  return [...keys].reduce(function showDisplay(display, key) {
    var ret = String(calc(key));
    return display + (ret != "" && key == "=" ? "=" : "") + ret;
  }, "");
}

const calc = calculator();

console.log(useCalc(calc, "4+3=")); // 4+3=7
console.log(useCalc(calc, "+9=")); // +9=16
// useCalc(calc, "*8="); // *5=128
// useCalc(calc, "7*2*3="); // 7*2*3=42
// useCalc(calc, "1/0="); // 1/0=ERR
// useCalc(calc, "+3="); // +3=ERR
// useCalc(calc, "51="); // 51

function formatTotal(display) {
  if (Number.isFinite(display)) {
    // constrain display to max 11 chars
    let maxDigits = 11;
    // reserve space for "e+" notation?
    if (Math.abs(display) > 99999999999) {
      maxDigits -= 6;
    }
    // reserve space for "-"?
    if (display < 0) {
      maxDigits--;
    }

    // whole number?
    if (Number.isInteger(display)) {
      display = display.toPrecision(maxDigits).replace(/\.0+$/, "");
    }
    // decimal
    else {
      // reserve space for "."
      maxDigits--;
      // reserve space for leading "0"?
      if (Math.abs(display) >= 0 && Math.abs(display) < 1) {
        maxDigits--;
      }
      display = display.toPrecision(maxDigits).replace(/0+$/, "");
    }
  } else {
    display = "ERR";
  }
  return display;
}
