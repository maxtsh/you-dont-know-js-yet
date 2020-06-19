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
