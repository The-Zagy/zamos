import { Interval, Process, ProcessFinalStats, ProcessStatus, SchedulerReturn } from "./types";
import {  quantumLengths } from './mlfq-example.json'
import { scene } from './STCF-example.json'
import { calcResponseTime, calcTurnAroundTime } from "./utils";
import { PriorityQueue } from "./helper";
let processQueue: Process[];
let quantum: { level2: number, level1: number, level0: number };

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
                if (i.arrivalTime <= currentTime) return true;
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
                result[index].interval.push({ start: temp!.arrive, finish: currentTime, status: ProcessStatus.READY, level: -1 })
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
            result[index].interval.push({ start: currentlyRunningStartTime, finish: currentTime, status: ProcessStatus.RUNNING, level: -1 });
            result[index].interval.push({ start: currentTime, finish: blockedQueue[blockedQueue.length - 1].releaseTime, status: ProcessStatus.BLOCKED, level: -1 });
            currentlyRunning = null;
            currentlyRunningTime = 0;
        }
        //other wise check if it's cputime is over and also set it to null
        else if (currentlyRunning.cpuTime === 0) {

            let index = result.findIndex(i => i.pid === currentlyRunning!.pid);
            result[index].interval.push({ start: currentlyRunningStartTime, finish: currentTime, status: ProcessStatus.RUNNING, level: -1 });
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

function SJF(processQueue: Process[]): SchedulerReturn {
    let curTime = 0;
    //sort process list by arrivalTime to avoid any input errors [list for futur processes]
    let sortedByArrivalTime = processQueue.sort((a, b) => a.arrivalTime - b.arrivalTime);
    // queue is ordered by cpu time
    const readyQu = new PriorityQueue<Process>((cur, toBeAdded) => {return cur.cpuTime < toBeAdded.cpuTime});
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
            // edit last interval in this process to add finish time to ready interval
            result[i].interval.at(-1)!.finish = curTime; 
            // add running interval
            result[i].interval.push({start: curTime, finish: curTime += runFor, status: ProcessStatus.RUNNING, level: -1 })
            // if there's was io so process will need to be added to blocked qu
            if (currentlyRunning.io.length > 0) blockedQu.push(currentlyRunning);
            // set finish time and turnaround if process finished
            if (currentlyRunning.cpuTime == 0 && result[i].finishTime == -1) {
                result[i].finishTime = curTime;
                result[i].turnaround = result[i].finishTime - result[i].arrivalTime;
            }
        }


        // serve io in the backgroung
        if (blockedQu.length > 0) {
            const curBlocked= blockedQu.shift();
            const i = result.findIndex((itm) => itm.pid == curBlocked!.pid);
            const io = curBlocked!.io.shift()!.length
            //* add blocked interval NOTE => removing one io interval
            result[i].interval.push({start: curTime, finish: curTime + io, status: ProcessStatus.BLOCKED, level: -1 });
            // if process didn't finish cpu time add it to be ready again
            if (curBlocked !== undefined && curBlocked.cpuTime > 0) {
                curBlocked.arrivalTime = curTime + io;
                // add process back into the future list to make sure it will be added again in ready queue at the right time
                sortedByArrivalTime.push(curBlocked);
                // note also resort future list to avoid errors if predefined processes arrival time is in the far future
                //todo maybe change how to sort this list over and over[insertion sort or change it to priority queue]
                sortedByArrivalTime = sortedByArrivalTime.sort((a, b) => a.arrivalTime - b.arrivalTime);
            }
        }


        //fill ready queue when process arrival time arrive, and add ready interval start for this process
        while (sortedByArrivalTime.length > 0 && curTime >= sortedByArrivalTime[0].arrivalTime ) {
            const proc = sortedByArrivalTime.shift() as Process;
            readyQu.enqueue(proc);
            const i = result.findIndex((itm) => itm.pid == proc.pid);
            // note finish time will be set when the process run
            result[i].interval.push({start: proc.arrivalTime, finish: -1, status: ProcessStatus.READY, level: -1 })
        }


        // speed the time if scene didn't finish yet but ready qu is empty
        if (readyQu.isEmpty() && sortedByArrivalTime.length > 0) {
            curTime += (sortedByArrivalTime[0].arrivalTime - curTime);
        }
    }
    return result;
}
// 3-level MLFQ, the topmost level (2) is the highest priority 
// using Round Robin RR in all levels 
function MultiLevelFeedbackQueue(processQueue: Process[], quantumLengths: { level2: number, level1: number, level0: number }): SchedulerReturn {
    const readyQueueLevel2: { arrivalTime: number, process: Process }[] = [];
    const readyQueueLevel1: { arrivalTime: number, process: Process }[] = [];
    const readyQueueLevel0: { arrivalTime: number, process: Process }[] = [];
    
    let runningProcess: null | Process = null;
    let currentTime: number = 0;
    let currentQuantumLength: number = 0;
    
    processQueue = processQueue.sort((p1, p2) => p1.arrivalTime - p2.arrivalTime);
    const result: SchedulerReturn = processQueue.map(p => {
        return (
            {
                pid: p.pid,
                turnaround: -1,
                responseTime: -1,
                finishTime: -1,
                firstRunTime: -1,
                arrivalTime: p.arrivalTime,
                interval: []
            }
        )
    });

    /* when a process enters the system, it is placed at the highest priority level,
    so initially, put all processes in level 2 */
    for(let process of processQueue) {
        readyQueueLevel2.push({ arrivalTime: process.arrivalTime, process });
    }
    
    while(readyQueueLevel2.length || readyQueueLevel1.length || readyQueueLevel0.length ) {
        if(readyQueueLevel2.length && readyQueueLevel2[0].arrivalTime <= currentTime) {
            runningProcess = readyQueueLevel2[0].process;
            currentQuantumLength = quantumLengths.level2;
            readyQueueLevel2.shift();
            let pIndex = result.findIndex(p => (p.pid === runningProcess?.pid));
            if(result[pIndex].firstRunTime === -1) result[pIndex].firstRunTime = currentTime;
            if(runningProcess.cpuTime <= currentQuantumLength) {
                result[pIndex].interval.push({ start: currentTime, finish: currentTime + runningProcess.cpuTime, status: ProcessStatus.RUNNING, level: 2 });
                currentTime += runningProcess.cpuTime;
                runningProcess.cpuTime = 0;
                result[pIndex].finishTime = currentTime;
                result[pIndex].turnaround = calcTurnAroundTime(result[pIndex].finishTime, result[pIndex].arrivalTime);
                result[pIndex].responseTime = calcResponseTime(result[pIndex].firstRunTime, result[pIndex].arrivalTime);
            }
            else {
                result[pIndex].interval.push({ start: currentTime, finish: currentTime + currentQuantumLength, status: ProcessStatus.RUNNING, level: 2 });
                currentTime += currentQuantumLength;
                runningProcess.cpuTime -= currentQuantumLength;
                readyQueueLevel1.push({ arrivalTime: currentTime, process: runningProcess });
            }
        }
        else if(readyQueueLevel1.length && readyQueueLevel1[0].arrivalTime <= currentTime) {
            runningProcess = readyQueueLevel1[0].process;
            currentQuantumLength = quantumLengths.level1;
            readyQueueLevel1.shift();
            let pIndex = result.findIndex(p => (p.pid === runningProcess?.pid));
            if(runningProcess.cpuTime <= currentQuantumLength) {
                result[pIndex].interval.push({ start: currentTime, finish: currentTime + runningProcess.cpuTime, status: ProcessStatus.RUNNING, level: 1 });
                currentTime += runningProcess.cpuTime;
                runningProcess.cpuTime = 0;
                result[pIndex].finishTime = currentTime;
                result[pIndex].turnaround = calcTurnAroundTime(result[pIndex].finishTime, result[pIndex].arrivalTime);
                result[pIndex].responseTime = calcResponseTime(result[pIndex].firstRunTime, result[pIndex].arrivalTime);
            }
            else {
                result[pIndex].interval.push({ start: currentTime, finish: currentTime + currentQuantumLength, status: ProcessStatus.RUNNING, level: 1 });
                currentTime += currentQuantumLength;
                runningProcess.cpuTime -= currentQuantumLength;
                readyQueueLevel0.push({ arrivalTime: currentTime, process: runningProcess });
            }
        }
        else if(readyQueueLevel0.length && readyQueueLevel0[0].arrivalTime <= currentTime) {
            runningProcess = readyQueueLevel0[0].process;
            currentQuantumLength = quantumLengths.level0;
            readyQueueLevel0.shift();
            let pIndex = result.findIndex(p => p.pid === runningProcess?.pid);
            if(runningProcess.cpuTime <= currentQuantumLength) {
                result[pIndex].interval.push({ start: currentTime, finish: currentTime + runningProcess.cpuTime, status: ProcessStatus.RUNNING, level: 0 });
                currentTime += runningProcess.cpuTime;
                runningProcess.cpuTime = 0;
                result[pIndex].finishTime = currentTime;
                result[pIndex].turnaround = calcTurnAroundTime(result[pIndex].finishTime, result[pIndex].arrivalTime);
                result[pIndex].responseTime = calcResponseTime(result[pIndex].firstRunTime, result[pIndex].arrivalTime);
            }
            else {
                result[pIndex].interval.push({ start: currentTime, finish: currentTime + currentQuantumLength, status: ProcessStatus.RUNNING, level: 0 });
                currentTime += currentQuantumLength;
                runningProcess.cpuTime -= currentQuantumLength;
                readyQueueLevel0.push({ arrivalTime: currentTime, process: runningProcess });
            }
        }
        else {
            runningProcess = null;
            currentTime++;
        }

    }
    return result;
}

function shortestTimeToCompletion(processQueue: Process[]): SchedulerReturn {
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
                if (i.arrivalTime <= currentTime) return true;
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
                // Find the process with the shortest burst time (i.e., lowest cpuTime value)
                const shortestJobIndex = readyQueue.reduce((minIndex, queueItem, index) => {
                    if (queueItem.process.cpuTime < readyQueue[minIndex].process.cpuTime) {
                        return index;
                    }
                    return minIndex;
                }, 0);
                const temp = readyQueue.splice(shortestJobIndex, 1)[0];
                currentlyRunning = temp.process;
                let index = result.findIndex((i) => i.pid === currentlyRunning!.pid);
                result[index].interval.push({
                    start: temp.arrive,
                    finish: currentTime,
                    status: ProcessStatus.READY,
                    level: -1,
                });
                currentlyRunningStartTime = currentTime;
                if (currentlyRunning.firstRunTime === -1) currentlyRunning.firstRunTime = currentTime;
            } else {
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
            result[index].interval.push({ start: currentlyRunningStartTime, finish: currentTime, status: ProcessStatus.RUNNING, level: -1 });
            result[index].interval.push({ start: currentTime, finish: blockedQueue[blockedQueue.length - 1].releaseTime, status: ProcessStatus.BLOCKED, level: -1 });
            currentlyRunning = null;
            currentlyRunningTime = 0;
        }
        //other wise check if it's cputime is over and also set it to null
        else if (currentlyRunning.cpuTime === 0) {

            let index = result.findIndex(i => i.pid === currentlyRunning!.pid);
            result[index].interval.push({ start: currentlyRunningStartTime, finish: currentTime, status: ProcessStatus.RUNNING, level: -1 });
            result[index].finishTime = currentTime;
            result[index].firstRunTime = currentlyRunning.firstRunTime;
            currentlyRunning = null;
            currentlyRunningTime = 0;
        } else {
            let preempt = false;
            const preemptCanditate = readyQueue.find((i) => i.process.cpuTime < currentlyRunning!.cpuTime);
            if (preemptCanditate) preempt = true;

            if (preempt) {
                readyQueue.push({ process: currentlyRunning, arrive: currentTime });
                let index = result.findIndex((i) => i.pid === currentlyRunning!.pid);
                result[index].interval.push({
                    start: currentlyRunningStartTime,
                    finish: currentTime,
                    status: ProcessStatus.RUNNING,
                    level: -1,
                });
                currentlyRunning = null;
                currentlyRunningTime = 0;
                continue;
            }
        }

    }
    return result.map((i) => ({
        ...i,
        responseTime: calcResponseTime(i.firstRunTime, i.arrivalTime),
        turnaround: calcTurnAroundTime(i.finishTime, i.arrivalTime),
    }))
}

function checkIntegrityOfInput(input: Process[]) {
    for (const process of input) {
        //check that i/o is within execution time
    }
}
function main() {
    processQueue = (scene as unknown) as Process[];
    quantum = (quantumLengths as unknown) as { level2: number, level1: number, level0: number };
    //console.dir(MultiLevelFeedbackQueue(processQueue, quantum)[0].interval);

    console.dir(shortestTimeToCompletion(processQueue), {depth: 4});
}
main();
