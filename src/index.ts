import { Process, ProcessStatus, SchedulerRtrn } from "./types";
import {scene} from './scene.json'
import { calcResponseTime, calcTurnAroundTime } from "./utils";

let processQue: Process[]; 
function FIFO(processQue: Process[]): SchedulerRtrn {
    let turnAround = 0;
    // to keep track where we're in the time
    let curTimeSlice = 0;
    let responseTime = 0;
    console.log('FIFO');
    // Sort array by arrival time because FIFO policy is first in first out (by arrival time)..
    processQue = processQue.sort((a, b) => (a.arrivalTime - b.arrivalTime));

    // calc turnAround
    for (const proc of processQue) {
        proc.status = ProcessStatus.RUNNING
        //! log processes MONITOR 
        // to remove the gap if one process arrivaltime is late after the curtimeslice
        if (proc.arrivalTime > curTimeSlice) curTimeSlice = proc.arrivalTime;
        proc.finishTime = curTimeSlice + proc.executionTime;
        proc.firstRunTime = curTimeSlice;
        curTimeSlice += proc.executionTime;
        console.log(calcTurnAroundTime(proc), calcResponseTime(proc))
    }
    console.log(`turn around time = ${turnAround}\nresponse time = ${responseTime}`);
    return {
        responseTime,
        turnAround
    }
}

function main() {
    processQue = (scene as unknown) as Process[];    
    FIFO(processQue);
}
main()
