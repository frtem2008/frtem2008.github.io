/* Deque */

class Deque {
    constructor(size) {
        this.elements = [];
        this.maxSize = size;
    }

    pushRight(num) {
        if (this.elements.length < this.maxSize) {
            this.elements.push(num);
            return num;
        }
        return undefined;
    }

    popRight() {
        return this.elements.pop();
    }

    pushLeft(num) {
        if (this.elements.length < this.maxSize) {
            this.elements.unshift(num);
            return num;
        }
        return undefined;
    }

    popLeft() {
        return this.elements.shift();
    }
}

var readline = require("readline");
var rl = readline.createInterface(process.stdin, process.stdout);

let caseCnt;
let caseNo = 1;

let deque;
let dequeSize;

let States = {
    CaseCount: "CaseCnt",
    DequeProps: "Read deque props",
    Commands: "Executing commands",
};

let state = States.CaseCount;
let executedCommandsCount = 0;
let caseCommandCount = 0;

rl.on("line", (line) => {
    const split = line.split(" ");

    if (state === States.CaseCount) {
        caseCnt = parseInt(line);
        state = States.DequeProps;
    } else if (state === States.DequeProps) {
        dequeSize = parseInt(split[0]);
        caseCommandCount = parseInt(split[1]);
        deque = new Deque(dequeSize);
        state = States.Commands;
        executedCommandsCount = 0;
        console.log(`Case ${caseNo}:`);
        caseNo++;
    } else {
        const command = split[0];
        let num;

        if (split.length > 1) {
            num = parseInt(split[1]);
        }

        let answer, res;

        switch (command) {
            case "pushLeft":
                res = deque.pushLeft(num);
                if (res == undefined) answer = "The queue is full";
                else answer = `Pushed in left: ${res}`;
                break;

            case "pushRight":
                res = deque.pushRight(num);
                if (res == undefined) answer = "The queue is full";
                else answer = `Pushed in right: ${res}`;
                break;

            case "popLeft":
                res = deque.popLeft();
                if (res == undefined) answer = "The queue is empty";
                else answer = `Popped from left: ${res}`;
                break;

            case "popRight":
                res = deque.popRight();
                if (res == undefined) answer = "The queue is empty";
                else answer = `Popped from right: ${res}`;
                break;
        }

        console.log(answer);
        executedCommandsCount++;
        if (executedCommandsCount === caseCommandCount)
            state = States.DequeProps;
    }
});
