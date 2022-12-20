import { Interval, Process, ProcessStatus, SchedulerReturn } from "./types";
import { scene } from './fifo-example.json'
import { calcResponseTime, calcTurnAroundTime } from "./utils";
import { PriorityQueue } from "./helper";
let processQueue: Process[];
//
function firstInFirstOut(processQueue: Process[]): SchedulerReturn {
    let sortedByArrivalTime = processQueue.sort((a, b) => a.arrivalTime - b.arrivalTime);
    let currentTime: number = 0;
    const readyQueue: { arrive: number, process: Process }[] = [];
    let blockedQueue: { process: Process, releaseTime: number }[] = [];
    let currentlyRunning: null | Process = null;
    let currentlyRunningTime: number = 0;
    let currentlyRunningStartTime = 0;
    const result: SchedulerReturn = sortedByArrivalTime.map((i => {
        return (
            {
                arrivalTime: i.arrivalTime,
                finishTime: -1,
                firstRunTime: -1,
                responseTime: -1,
                turnaround: -1,
                pid: i.pid,
                interval: []
            }
        )
    }));

    while (blockedQueue.length !== 0 || readyQueue.length !== 0 || sortedByArrivalTime.length !== 0 || currentlyRunning !== null) {
        //find canditates to be ready from the input and the blocked queue and push them into ready queue
        while (sortedByArrivalTime.length !== 0) {
            const canditate = sortedByArrivalTime.findIndex((i) => {
                if (i.arrivalTime >= currentTime) return true;
                return false;
            });
            if (canditate === -1) break;
            readyQueue.push({ process: sortedByArrivalTime[canditate], arrive: currentTime });
            sortedByArrivalTime.splice(canditate, 1)
        }
        while (blockedQueue.length !== 0) {
            const canditate = blockedQueue.findIndex((i) => {
                if (i.releaseTime <= currentTime) return true;
                return false
            })
            if (canditate === -1) break;
            readyQueue.push({ process: blockedQueue[canditate].process, arrive: currentTime });
            blockedQueue.splice(canditate, 1);
        }
        //if nothing is running dequeue from ready queue that is the queue isn't empty
        //if it is indeed empty just wait for the next second maybe it won't be
        if (currentlyRunning === null) {
            if (readyQueue.length !== 0) {
                const temp = readyQueue.shift();
                currentlyRunning = temp!.process as Process;
                let index = result.findIndex(i => i.pid === currentlyRunning!.pid);
                result[index].interval.push({ start: temp!.arrive, finish: currentTime, status: ProcessStatus.READY })
                currentlyRunningStartTime = currentTime;
                if (currentlyRunning.firstRunTime === -1) currentlyRunning.firstRunTime = currentTime;
            }
            else {
                currentTime++;
                continue;
            }
        }

        //Manipulate current running process and increment running time
        currentlyRunning.cpuTime--;
        currentlyRunningTime++;
        currentTime++;

        //Check if there's any i/o block if it is queue currently running into blocked queue
        //and set currentlyRunning to null
        if (currentlyRunning.io.find((i) => i.start === currentlyRunningTime)) {
            const ioPeriod = currentlyRunning.io.shift();
            blockedQueue.push({
                process: currentlyRunning,
                releaseTime: currentTime + ioPeriod!.length
            })
            let index = result.findIndex(i => i.pid === currentlyRunning!.pid);
            result[index].interval.push({ start: currentlyRunningStartTime, finish: currentTime, status: ProcessStatus.RUNNING });
            result[index].interval.push({ start: currentTime, finish: blockedQueue[blockedQueue.length - 1].releaseTime, status: ProcessStatus.BLOCKED });
            currentlyRunning = null;
            currentlyRunningTime = 0;
        }
        //other wise check if it's cputime is over and also set it to null
        else if (currentlyRunning.cpuTime === 0) {

            let index = result.findIndex(i => i.pid === currentlyRunning!.pid);
            result[index].interval.push({ start: currentlyRunningStartTime, finish: currentTime, status: ProcessStatus.RUNNING });
            result[index].finishTime = currentTime;
            result[index].firstRunTime = currentlyRunning.firstRunTime;
            currentlyRunning = null;
            currentlyRunningTime = 0;
        }

    }
    return result.map((i) => ({
        ...i,
        responseTime: calcResponseTime(i.firstRunTime, i.arrivalTime),
        turnaround: calcTurnAroundTime(i.finishTime, i.arrivalTime),
    }))
}
//assume timeslice is 1
function SJF(processQueue: Process[]): SchedulerReturn {
    let curTime = 0;
    // let auxTime = 0; // var to help cur time in processing which time slice the program in, mainlly will be used in sereve blockq
    //sort process list by arrivalTime to avoid any input errors
    const sortedByArrivalTime = processQueue.sort((a, b) => a.arrivalTime - b.arrivalTime);
    // queue is ordered by cpu time
    //TODO change queue code to take function as argument to decide how to sort the queue
    const readyQu = new PriorityQueue();
    // [process, auxTime]
    const blockedQu: Process[] = [];
    const result: SchedulerReturn = sortedByArrivalTime.map((i => {
        return (
            {
                arrivalTime: i.arrivalTime,
                finishTime: -1,
                firstRunTime: -1,
                responseTime: -1,
                turnaround: -1,
                pid: i.pid,
                interval: []
            }
        )
    }));
    while (sortedByArrivalTime.length > 0 || !readyQu.isEmpty() ) {
        // serve ready qu
        if (!readyQu.isEmpty()) {
            //first process in the ready qu is the smallest
            const currentlyRunning = readyQu.dequeue();
            const i = result.findIndex((itm) => itm.pid == currentlyRunning.pid);
            // set first run time if first run and response time
            if (result[i].firstRunTime == -1) {
                result[i].firstRunTime = curTime;
                result[i].responseTime = result[i].firstRunTime - result[i].arrivalTime;
            }
            //process will run till reach IO, or if no IO run all cpu time
            const runFor = currentlyRunning.io.length > 0 ? currentlyRunning.io[0].start : currentlyRunning.cpuTime;
            currentlyRunning.cpuTime -= runFor;
            // add running interval
            result[i].interval.push({start: curTime, finish: curTime += runFor, status: ProcessStatus.RUNNING })
            // if there's was io so process will need to be added to blocked qu
            if (currentlyRunning.io.length > 0) blockedQu.push(currentlyRunning);
            // set finish time and turnaround if process finished
            if (currentlyRunning.cpuTime == 0 && result[i].finishTime == -1) {
                result[i].finishTime = curTime;
                result[i].turnaround = result[i].finishTime - result[i].arrivalTime;
            }
            // will be used for background work
            // if (auxTime == -1) auxTime = curTime;
        }
        // serve io in the backgroung
        if (blockedQu.length > 0) {
            const curBlocked= blockedQu.shift();
            const i = result.findIndex((itm) => itm.pid == curBlocked!.pid);
            //* add blocked interval NOTE => removing one io interval
            result[i].interval.push({start: curTime, finish: curTime += curBlocked!.io.shift()!.length, status: ProcessStatus.BLOCKED });
            // if process didn't finish cpu time add it to be ready again
            if (curBlocked !== undefined && curBlocked.cpuTime > 0) {
                readyQu.enqueue(curBlocked);
            }
        }
        //reset aux time after block q processing
        // if (auxTime != -1) {
        //     curTime += auxTime;
        //     auxTime = -1;
        // }
        //fill ready queue when process arrival time arrive
        while (sortedByArrivalTime.length > 0 && curTime >= sortedByArrivalTime[0].arrivalTime ) {
            readyQu.enqueue(sortedByArrivalTime.shift() as Process);
        }
        // speed the time if scene didn't finish yet but ready qu is empty
        if (readyQu.isEmpty() && sortedByArrivalTime.length > 0) {
            curTime += (sortedByArrivalTime[0].arrivalTime - curTime);
        }
    }
    return result;
}
// function SJF(processQueue: Process[]): SchedulerReturn {
//     let currentTimeSlice = 0;
//     const intervals: Intervals = [];
//     processQueue = processQueue.sort((a, b) => (a.arrivalTime - b.arrivalTime));
//     processQueue = processQueue.sort((a, b) => {
//         if (a !== b) return 0;
//         return a.cpuTime - b.cpuTime;
//     })
//     for (const process of processQueue) {
//         if (process.arrivalTime > currentTimeSlice) currentTimeSlice = process.arrivalTime;
//         process.finishTime = currentTimeSlice + process.cpuTime;
//         process.firstRunTime = currentTimeSlice;
//         intervals.push({ start: process.firstRunTime, finish: process.finishTime, pid: process.pid });
//         currentTimeSlice += process.cpuTime;
//     }
//     return (
//         {
//             intervals: intervals,
//             processesData: processQueue
//                 .map((process => ({ pid: process.pid, responseTime: calcResponseTime(process), turnaround: calcTurnAroundTime(process) })))
//         }
//     )
// }
// function shortestTimeToCompletion(processQueue: Process[]): SchedulerReturn {
//     let currentTimeSlice = 0;
//     const intervals: Intervals = [];
//     processQueue = processQueue.sort((a, b) => (a.cpuTime - b.cpuTime));
//     while (true) {
//         const currentProcessIndex = processQueue.findIndex(process => process.arrivalTime <= currentTimeSlice && process.cpuTime !== 0);
//         if (currentProcessIndex === -1) break;
//         const interval: Interval = { start: currentTimeSlice, pid: processQueue[currentProcessIndex].pid, finish: 0 }
//         if (processQueue[currentProcessIndex].firstRunTime === -1) processQueue[currentProcessIndex].firstRunTime = currentTimeSlice;
//         processQueue[currentProcessIndex].cpuTime--;
//         currentTimeSlice++;
//         if (processQueue[currentProcessIndex].cpuTime === 0) processQueue[currentProcessIndex].finishTime = currentTimeSlice;
//         interval.finish = currentTimeSlice;
//         intervals.push(interval)
//     }
//     //Refine intervals;
//     let currentPid;
//     let leftPointer = 0;
//     let rightPointer = 0;
//     const temp: Intervals = [];
//     for (let i = 0; i < intervals.length; i++) {
//         if (!currentPid) {
//             currentPid = intervals[i].pid;
//             continue;
//         }
//         if (currentPid === intervals[i].pid) {
//             rightPointer = i;
//         }
//         if (currentPid !== intervals[i].pid) {
//             temp.push({ start: intervals[leftPointer].start, finish: intervals[rightPointer].finish, pid: currentPid });
//             currentPid = intervals[i].pid;
//             leftPointer = i;
//         }
//     }
//     return ({
//         intervals: temp,
//         processesData: processQueue
//             .map((process => ({ pid: process.pid, responseTime: calcResponseTime(process), turnaround: calcTurnAroundTime(process) })))
//     });
// }
//Round Robin, MLFQ
function checkIntegrityOfInput(input: Process[]) {
    for (const process of input) {
        //check that i/o is within execution time
    }
}
function main() {
    processQueue = (scene as unknown) as Process[];
    console.dir(SJF(processQueue), {depth: 4});
}
main();
