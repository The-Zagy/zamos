import { Process } from "./types";

export function calcTurnAroundTime(finishTime: number, arrivalTime: number): number {
    return finishTime - arrivalTime;
}
export function calcResponseTime(firstRunTime: number, arrivalTime: number): number {
    return firstRunTime - arrivalTime;
}

function checkIntegrityOfInput(input: Process[]) {
    for (const process of input) {
        //check that i/o is within execution time
    }
}
