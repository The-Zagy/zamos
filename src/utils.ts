import { Process, ProcessStatus } from './types';
import { faker } from '@faker-js/faker';
export function createProcess(): Process {
    // TODO make sure that pid is unique or easy enough use uuid, another idea use var that start from zero and inc it each time normal int var is enough in our case 
    //TODO edit arrival time
    // finishTime and firstRunTime supposed to be changed by the scheduler algo so here will be -1
    return {
        arrivalTime: 0,
        finishTime: -1,
        firstRunTime: -1,
        pid: faker.datatype.number(1000),
        status: ProcessStatus.READY,
        length: faker.datatype.number(50)
    }
}
export function createRandowScene(que: Process[]): void {
    console.log(`create random workload`);
    for (let i = 0; i < 3; ++i) {
        const prc = createProcess();
        console.dir(prc, {depth: 1})
        que.push(prc);
    }
}