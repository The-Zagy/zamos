import { Process, ProcessStatus } from './types';
import { faker } from '@faker-js/faker';
export function createProcess(): Process {
    return {
        name: faker.commerce.productName(),
        arrivalTime: 0,
        pid: faker.datatype.number(1000),
        status: ProcessStatus.READY,
        length: faker.datatype.number(50)
    }
}