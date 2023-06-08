var readline = require("readline");
var rl = readline.createInterface(process.stdin, process.stdout);

let caseCnt;
const caseStr = "Case";

let linesRead = 0;
let i = 0;

rl.on("line", (line) => {
    let input = line.split(" ");

    linesRead++;
    if (linesRead === 1) {
        caseCnt = parseInt(input);
        return;
    }

    const split = input;

    const b1x =  parseInt(split[0]);
    const b1y =  parseInt(split[1]);

    const b2x =  parseInt(split[2]);
    const b2y =  parseInt(split[3]);

    let answer;

    /* Different color */ 
    if ((b1x + b1y) % 2 !== (b2x + b2y) % 2) {
        answer = ": impossible";
    } else if (
        b1x + b1y === b2x + b2y ||
        Math.abs(b1x - b2x) == Math.abs(b1y - b2y)
    ) {
        answer = ": 1";
    } else {
        answer = ": 2";
    }
    i++;
    console.log(`${caseStr} ${i}${answer}`);
});
