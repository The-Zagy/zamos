export enum ProcessStatus  {
    RUNNING = 'running',
    READY = 'ready',
    BLOCKED = 'blocked'

}
export interface Process {
    name: string;
    pid: number;
    arrivalTime: number;
    length?: number;
    status: ProcessStatus
}
export interface SchedulerRtrn {
    turnAround: number;
    responseTime: number;
}