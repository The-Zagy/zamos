import { Process } from './types';
import { faker } from '@faker-js/faker';
export function createProcess(): Process {
    return {
        name: faker.commerce.productName(),
        arrivalTime: faker.datatype.number(1000),
        pid: faker.datatype.number(1000),
        length: faker.datatype.number(50)
    }
}