import { type } from "os";
import { start } from "repl";

export enum ProcessStatus {
    RUNNING = 'running',
    READY = 'ready',
    BLOCKED = 'blocked'

}
export interface Process {
    name: string,
    pid: number;
    arrivalTime: number;
    finishTime: number;
    firstRunTime: number;
    executionTime: number;
    status: ProcessStatus
}
export type ProcessFinalStats = {
    name: string
    pid: number,
    turnaround: number,
    responseTime: number,
    finishTime: number,
    interval: Interval
}
export type ProcessesFinalStats = Array<ProcessFinalStats>
export type Interval = { start: number, finish: number, status: ProcessStatus }[]

export type SchedulerReturn = ProcessesFinalStats

//example
const ret: SchedulerReturn = [
    {
        name: "A",
        pid: 3,
        finishTime: 5,
        responseTime: 23,
        turnaround: 32,
        interval: [{ start: 1, finish: 4, status: ProcessStatus.READY }, { start: 4, finish: 7, status: ProcessStatus.BLOCKED }]
    },
    {
        name: "B",
        pid: 1,
        finishTime: 2,
        responseTime: 13,
        turnaround: 6,
        interval: [{ start: 9, finish: 15, status: ProcessStatus.RUNNING }, { start: 4, finish: 7, status: ProcessStatus.BLOCKED }]
    }
]