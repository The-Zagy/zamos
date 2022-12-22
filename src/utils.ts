import { Process } from "./types";
export function calcTurnAroundTime(finishTime: number, arrivalTime: number): number {
    return finishTime - arrivalTime;
}
export function calcResponseTime(firstRunTime: number, arrivalTime: number): number {
    return firstRunTime - arrivalTime;
}

// export function createProcess(): Process {
//     // TODO make sure that pid is unique or easy enough use uuid, another idea use var that start from zero and inc it each time normal int var is enough in our case
//     //TODO edit arrival time
//     // finishTime and firstRunTime supposed to be changed by the scheduler algo so here will be -1
//     return {
//         arrivalTime: 0,
//         finishTime: -1,
//         firstRunTime: -1,
//         pid: config.id++,
//         io:[],
//         status: ProcessStatus.READY,
//         cpuTime: faker.datatype.number(50)
//     }
// }
// export function createRandowScene(que: Process[]): void {
//     console.log(`create random workload`);
//     for (let i = 0; i < 3; ++i) {
//         const prc = createProcess();
//         console.dir(prc, {depth: 1})
//         que.push(prc);
//     }
// }

function isFloat(n: number){
    return Number(n) === n && n % 1 !== 0;
}

function checkIntegrityOfInput(...input: Process[]) {
    for (const proc of input) {
        if (proc.pid <= 0) throw new Error("pid must be bigger than 0");
        if (isFloat(proc.arrivalTime) && proc.arrivalTime < 0) throw new Error("arrival time must be bigger than 0 and integer");
        if (isFloat(proc.cpuTime) && proc.cpuTime <= 0) throw new Error("cpu time  must be bigger than 0 and integer");
        //check that i/o is within execution time
        for (let i = 0; i < proc.io.length; ++i) {
            if (proc.io[i].start < 0) throw new Error("io start cannot be less than zero (0 <= start <= cpuTime)");
            if (proc.io[i].start > proc.cpuTime) throw new Error("io start must be relative to cpu time (0 <= start <= cpuTime)");
            if (proc.io[i]["length"] <= 0) throw new Error("io length must be bigger than zero");
            // check io order is correct
            if (i > 0 && proc.io[i].start <= proc.io[i-1].start)  throw new Error("io array start must be in ascending order");
        }
    }
}