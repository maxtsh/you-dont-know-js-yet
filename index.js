const dayStart = "07:30";
const dayEnd = "17:45";

function scheduleMeeting(start, duration) {
  if (typeof start !== "string") return "No string input for start time";
  if (typeof duration !== "number") return "No number input for duration";

  const startOfMeetingHour = Number(start.split(":")[0]);
  const startOfMeetingMinute = Number(start.split(":")[1]);

  const durationHour = Math.floor(duration / 60);
  const durationMinute = duration % 60;

  let endOfMeetingHour = startOfMeetingHour + durationHour;
  let endOfMeetingMinute = startOfMeetingMinute + durationMinute;

  if (startOfMeetingMinute + durationMinute >= 60) {
    endOfMeetingHour++;
    endOfMeetingMinute - 60;
  }

  const startTime = `${startOfMeetingHour
    .toString()
    .padStart(2, 0)}:${startOfMeetingMinute.toString().padStart(2, 0)}`;

  const endTime = `${endOfMeetingHour
    .toString()
    .padStart(2, 0)}:${endOfMeetingMinute.toString().padStart(2, 0)}`;

  console.log(`Start:${startTime} End:${endTime}`);

  return dayEnd >= endTime && startTime >= dayStart;
}

console.log(scheduleMeeting("7:00", 15)); // false
console.log(scheduleMeeting("07:15", 28)); // false
console.log(scheduleMeeting("7:30", 30)); // true
console.log(scheduleMeeting("11:30", 60)); // true
console.log(scheduleMeeting("17:00", 45)); // true
console.log(scheduleMeeting("17:30", 30)); // false
console.log(scheduleMeeting("18:00", 15)); // false
console.log(scheduleMeeting("18:00", 110)); // false
console.log(scheduleMeeting("17:44", 1)); // false

console.log("================");

function range(start, end) {
  if (end === undefined) {
    return function getEnd(end) {
      return calc(start, end);
    };
  } else {
    return calc(start, end);
  }

  function calc(start, end) {
    let arr = [];
    for (let i = start; i <= end; i++) {
      arr.push(i);
    }
    return arr;
  }
}

console.log(range(3, 3)); // [3]
console.log(range(3, 8)); // [3,4,5,6,7,8]
console.log(range(3, 0)); // []

const end12 = range(6);
console.log(end12(12));

function diagonalDifference(n, ...rest) {
  console.log(n);
  console.log(rest);

  if (n !== rest.length) return "Not a compatible format";
  console.log(rest[1][1]);
  let arr = [];
  let coords = [];

  for (let x = 1; x <= n; x++) {
    for (let y = 1; y <= n; y++) {
      coords.push(rest[x - 1][y - 1] + rest[x][y] + rest[x + 1][y + 1]);
    }
  }
  return coords;
}

console.log(diagonalDifference(3, [1, 2, 3], [4, 5, 6], [7, 8, 9]));
