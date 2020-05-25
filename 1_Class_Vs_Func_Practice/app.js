// Class-Based

class AirplaneFactory {
  constructor(name, prodYear, amount) {
    this.name = name;
    this.prodYear = prodYear;
    this.amount = amount;
  }

  introduce() {
    console.log(
      `The ${this.name} was made on ${this.prodYear} and there are ${this.amount} of them available today`
    );
  }
}

class FlyThePlane extends AirplaneFactory {
  constructor(flyTime, speed, name, prodYear, amount) {
    super(name, prodYear, amount);
    this.flyTime = flyTime;
    this.speed = speed;
  }

  tryToFly() {
    const B2Sprit = new AirplaneFactory(this.name, this.prodYear, this.amount);
    B2Sprit.introduce();
    console.log(`${this.name} can travel at ${this.speed} for ${this.flyTime}`);
  }
}

const fly = new FlyThePlane("10 Hours", "1100 KM/h", "B-2 Sprit", "1982", "23");
fly.tryToFly();

// Function-Based 1 YDKJS instance
function AirplaneFactory2(name, prodYear, amount) {
  const apfAPI = {
    introduce() {
      console.log(
        `The ${name} was made on ${prodYear} and there are ${amount} of them available today`
      );
    },
  };
  return apfAPI;
}

function FlyThePlane2(name, prodYear, amount, flyTime, speed) {
  const apf2 = AirplaneFactory2(name, prodYear, amount);

  const flyThePlaneAPI = {
    tryToFly() {
      apf2.introduce();
      console.log(`${name} can travel at ${speed} for ${flyTime}`);
    },
  };
  return flyThePlaneAPI;
}

const F35 = FlyThePlane2("F-35", "1992", "450", "12 Hours", "1400 KM/h");
F35.tryToFly();

// Function-Based 2
function CarFactory(name, prodYear, amount) {
  const introduce = function () {
    console.log(
      `The ${name} was made on ${prodYear} and there are ${amount} of them available today`
    );
  };
  return introduce;
}

function DriveTheCar(name, prodYear, amount, speed, fuelStore, driveTime) {
  const CF = CarFactory(name, prodYear, amount);

  const drive = function () {
    CF();
    console.log(
      `${name} can travel at ${speed} with ${fuelStore} Fuel for ${driveTime}`
    );
  };

  return drive;
}

const BMW = DriveTheCar(
  "BMW 730Li",
  "2019",
  1340,
  "250 KM/h",
  "60Lit",
  "5 Hour"
);
BMW();
