export enum ProcessStatus  {
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
export interface SchedulerRtrn {
    turnAround: number;
    responseTime: number;
}