import { Interval, Intervals, Process, ProcessStatus, SchedulerReturn } from "./types";
import { scene } from './scene.json'
import { calcResponseTime, calcTurnAroundTime } from "./utils";

let processQueue: Process[];
function firstInFirstOut(processQueue: Process[]): SchedulerReturn {
    let turnAround = 0;
    // to keep track where we're in the time
    let currentTimeSlice = 0;
    let responseTime = 0;
    console.log('FIFO');
    // Sort array by arrival time because FIFO policy is first in first out (by arrival time)..
    processQueue = processQueue.sort((a, b) => (a.arrivalTime - b.arrivalTime));
    const intervals: Intervals = [];
    // calc turnAround
    for (const process of processQueue) {
        process.status = ProcessStatus.RUNNING
        //! log processes MONITOR 
        // to remove the gap if one process arrivaltime is late after the currentTimeSlice
        if (process.arrivalTime > currentTimeSlice) currentTimeSlice = process.arrivalTime;
        process.finishTime = currentTimeSlice + process.executionTime;
        process.firstRunTime = currentTimeSlice;
        currentTimeSlice += process.executionTime;
        intervals.push({ start: process.firstRunTime, finish: process.finishTime, pid: process.pid });
        console.log(calcTurnAroundTime(process), calcResponseTime(process))
    }
    return (
        {
            intervals: intervals,
            processesData: processQueue
                .map((process => ({ pid: process.pid, responseTime: calcResponseTime(process), turnaround: calcTurnAroundTime(process) })))
        }
    )
}
function SJF(processQueue: Process[]): SchedulerReturn {
    let currentTimeSlice = 0;
    const intervals: Intervals = [];
    processQueue = processQueue.sort((a, b) => (a.arrivalTime - b.arrivalTime));
    processQueue = processQueue.sort((a, b) => {
        if (a !== b) return 0;
        return a.executionTime - b.executionTime;
    })
    for (const process of processQueue) {
        if (process.arrivalTime > currentTimeSlice) currentTimeSlice = process.arrivalTime;
        process.finishTime = currentTimeSlice + process.executionTime;
        process.firstRunTime = currentTimeSlice;
        intervals.push({ start: process.firstRunTime, finish: process.finishTime, pid: process.pid });
        currentTimeSlice += process.executionTime;
    }
    return (
        {
            intervals: intervals,
            processesData: processQueue
                .map((process => ({ pid: process.pid, responseTime: calcResponseTime(process), turnaround: calcTurnAroundTime(process) })))
        }
    )
}
function shortestTimeToCompletion(processQueue: Process[]): SchedulerReturn {
    let currentTimeSlice = 0;
    const intervals: Intervals = [];
    processQueue = processQueue.sort((a, b) => (a.executionTime - b.executionTime));
    while (true) {
        const currentProcessIndex = processQueue.findIndex(process => process.arrivalTime <= currentTimeSlice && process.executionTime !== 0);
        if (currentProcessIndex === -1) break;
        const interval: Interval = { start: currentTimeSlice, pid: processQueue[currentProcessIndex].pid, finish: 0 }
        if (processQueue[currentProcessIndex].firstRunTime === -1) processQueue[currentProcessIndex].firstRunTime = currentTimeSlice;
        processQueue[currentProcessIndex].executionTime--;
        currentTimeSlice++;
        if (processQueue[currentProcessIndex].executionTime === 0) processQueue[currentProcessIndex].finishTime = currentTimeSlice;
        interval.finish = currentTimeSlice;
        intervals.push(interval)
    }
    //Refine intervals;
    let currentPid;
    let leftPointer = 0;
    let rightPointer = 0;
    const temp: Intervals = [];
    for (let i = 0; i < intervals.length; i++) {
        if (!currentPid) {
            currentPid = intervals[i].pid;
            continue;
        }
        if (currentPid === intervals[i].pid) {
            rightPointer = i;
        }
        if (currentPid !== intervals[i].pid) {
            temp.push({ start: intervals[leftPointer].start, finish: intervals[rightPointer].finish, pid: currentPid });
            currentPid = intervals[i].pid;
            leftPointer = i;
        }
    }
    return ({
        intervals: temp,
        processesData: processQueue
            .map((process => ({ pid: process.pid, responseTime: calcResponseTime(process), turnaround: calcTurnAroundTime(process) })))
    });
}
// function roundrobin(processes: Process[], timeSlice: number): SchedulerReturn {
//     const intervals: Intervals = [];
//     let currentTimeSlice = 0;
//     processes = processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
//     let currentProcess: Process | undefined;
//     const processQueue: Process[] = [];
//     const result: Process[] = [];
//     let sliceTimer = 0;
//     while (processes.length !== 0 || processQueue.length !== 0) {
//         if (processes[0]?.arrivalTime === currentTimeSlice) {
//         sliceTimer++;
//         currentTimeSlice++;
//     }
//     return {
//         intervals,
//         processesData: result
//             .map((process => ({ pid: process.pid, responseTime: calcResponseTime(process), turnaround: calcTurnAroundTime(process) })))
//     };
// }
function main() {
    processQueue = (scene as unknown) as Process[];
}
main()
