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
export type ProcessFinalStats = { turnaround: number, responseTime: number, pid: number }
export type ProcessesFinalStats = Array<ProcessFinalStats>
export type Interval = { start: number, finish: number, pid: number }
export type Intervals = Array<Interval>
export interface SchedulerReturn {
    processesData: ProcessesFinalStats
    intervals: Intervals
}