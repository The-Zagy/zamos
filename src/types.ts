export interface Process {
    name: string;
    pid: number;
    arrivalTime: number;
    length?: number
}