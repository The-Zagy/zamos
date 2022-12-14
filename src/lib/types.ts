export enum ProcessStatus {
    RUNNING = 'running',
    READY = 'ready',
    BLOCKED = 'blocked'
}

export interface Process {
    pid: number;
    arrivalTime: number;
    finishTime: number;
    firstRunTime: number;
    cpuTime: number;
    //Meaning start after how many seconds of execution
    io: { start: number, length: number }[];
    status: ProcessStatus
}

export type ProcessFinalStats = {
    pid: number,
    turnaround: number,
    responseTime: number,
    finishTime: number,
    firstRunTime: number,
    arrivalTime: number,
    interval: Interval
}
export type MLFQQuanta = { level2: number, level1: number, level0: number }

export type ProcessesFinalStats = Array<ProcessFinalStats>
export type Interval = { start: number, finish: number, status: ProcessStatus, level?: number }[]
export type SchedulerReturn = ProcessesFinalStats