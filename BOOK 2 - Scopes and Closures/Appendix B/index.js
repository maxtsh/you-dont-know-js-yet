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
function isPrime(v) {
  if (v <= 3) {
    return v > 1;
  }
  if (v % 2 == 0 || v % 3 == 0) {
    return false;
  }
  var vSqrt = Math.sqrt(v);
  for (let i = 5; i <= vSqrt; i += 6) {
    if (v % i == 0 || v % (i + 2) == 0) {
      return false;
    }
  }
  return true;
}

function factorize(v) {
  if (!isPrime(v)) {
    let i = Math.floor(Math.sqrt(v));
    while (v % i != 0) {
      i--;
    }
    return [...factorize(i), ...factorize(v / i)];
  }
  return [v];
}

console.log(isPrime(12)); // false
console.log(factorize(11));
