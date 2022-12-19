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
    executionTime: number;
    status: ProcessStatus
}
export type ProcessFinalStats = {
    turnaround: number,
    responseTime: number,
    finishTime: number,
    pid: number,
}
export type ProcessesFinalStats = Array<ProcessFinalStats>
export type Intervals = [{ [k: string]: { start: number, finish: number, status: ProcessStatus }[] }]
export interface SchedulerReturn {
    processesData: ProcessesFinalStats,
    intervals: Intervals
}