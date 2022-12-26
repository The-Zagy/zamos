import { firstInFirstOut, SJF } from "../index";
import { Process, SchedulerReturn } from "../types";
import cloneDeep from 'lodash/cloneDeep'
import {scene} from "../fifo-example.json";
import {scene as scene2} from "../sjf-example.json";
import {scene as scene3} from "../sjf-example2.json";
// all test cases will be in the final state array
describe('SJF test cases', () => {
    // perform policy
    let rtrn: SchedulerReturn ;
    beforeAll(() => {
        rtrn = SJF(( cloneDeep(scene) as unknown) as Process[]);
    })

    // proc1
    test('response time for process "1"', () => {
        expect(rtrn[0].pid).toBe(1);
        expect(rtrn[0].responseTime).toBe(3);
    })
    test('turn around for process "1"', () => {
        expect(rtrn[0].turnaround).toBe(24);
    })
    test('process "1" intervals', () => {
        expect(rtrn[0].interval).toEqual(
            expect.arrayContaining([
                expect.objectContaining({start: 0, finish: 3, status: 'ready'}),
                expect.objectContaining({start: 3, finish: 9, status: 'running'}),
                expect.objectContaining({start: 9, finish: 19, status: 'blocked'}),
                expect.objectContaining({start: 19, finish: 20, status: 'ready'}),
                expect.objectContaining({start: 20, finish: 24, status: 'running'}),
            ])
        );        
    })

    //proc2
    test('response time for process "2" ', () => {
        expect(rtrn[1].pid).toBe(2);
        expect(rtrn[1].responseTime).toBe(11);
    })
    test('turn around for process "2"', () => {
        expect(rtrn[1].turnaround).toBe(41);
    })
    test('process "2" intervals', () => {
        expect(rtrn[1].interval).toEqual(
            expect.arrayContaining([
                expect.objectContaining({start: 0, finish: 11, status: 'ready'}),
                expect.objectContaining({start: 11, finish: 20, status: 'running'}),
                expect.objectContaining({start: 20, finish: 35, status: 'blocked'}),
                expect.objectContaining({start: 35, finish: 35, status: 'ready'}),
                expect.objectContaining({start: 35, finish: 41, status: 'running'}),
            ])
        );        
    })

    //proc3
    test('response time for process "3"', () => {
        expect(rtrn[2].pid).toBe(3);
        expect(rtrn[2].responseTime).toBe(0);
    })
    test('turn around for process "3"', () => {
        expect(rtrn[2].turnaround).toBe(11);
    })
    test('process "3" intervals', () => {
        expect(rtrn[2].interval).toEqual(
            expect.arrayContaining([
                expect.objectContaining({start: 0, finish: 0, status: 'ready'}),
                expect.objectContaining({start: 0, finish: 3, status: 'running'}),
                expect.objectContaining({start: 3, finish: 8, status: 'blocked'}),
                expect.objectContaining({start: 8, finish: 9, status: 'ready'}),
                expect.objectContaining({start: 9, finish: 11, status: 'running'}),
            ])
        );        
    })
})

// all test cases will be in the final state array
describe('SJF test cases for second scene', () => {
    // perform policy
    let rtrn: SchedulerReturn ;
    beforeAll(() => {
        rtrn = SJF(( cloneDeep(scene2) as unknown) as Process[]);
    })

    //proc 1
    test('response time for process "1"', () => {
        expect(rtrn[0].pid).toBe(1);
        expect(rtrn[0].responseTime).toBe(0);
    })
    test('turn around for process "1"', () => {
        expect(rtrn[0].turnaround).toBe(25);
    })
    test('process "1" intervals', () => {
        expect(rtrn[0].interval).toEqual(
            expect.arrayContaining([
                expect.objectContaining({start: 0, finish: 0, status: 'ready'}),
                expect.objectContaining({start: 0, finish: 5, status: 'running'}),
                expect.objectContaining({start: 5, finish: 6, status: 'blocked'}),
                expect.objectContaining({start: 6, finish: 10, status: 'ready'}),
                expect.objectContaining({start: 10, finish: 15, status: 'running'}),
                expect.objectContaining({start: 15, finish: 17, status: 'blocked'}),
                expect.objectContaining({start: 17, finish: 20, status: 'ready'}),
                expect.objectContaining({start: 20, finish: 25, status: 'running'}),
            ])
        );        
    })

    //proc 2
    test('response time for process "2" ', () => {
        expect(rtrn[1].pid).toBe(2);
        expect(rtrn[1].responseTime).toBe(4);
    })
    test('turn around for process "2"', () => {
        expect(rtrn[1].turnaround).toBe(16);
    })
    test('process "2" intervals', () => {
        expect(rtrn[1].interval).toEqual(
            expect.arrayContaining([
                expect.objectContaining({start: 4, finish: 8, status: 'ready'}),
                expect.objectContaining({start: 8, finish: 10, status: 'running'}),
                expect.objectContaining({start: 10, finish: 11, status: 'blocked'}),
                expect.objectContaining({start: 11, finish: 15, status: 'ready'}),
                expect.objectContaining({start: 15, finish: 20, status: 'running'}),
            ])
        );        
    })


    //proc 3
    test('response time for process "3"', () => {
        expect(rtrn[2].pid).toBe(3);
        expect(rtrn[2].responseTime).toBe(0);
    })
    test('turn around for process "3"', () => {
        expect(rtrn[2].turnaround).toBe(3);
    })
    test('process "3" intervals', () => {
        expect(rtrn[2].interval).toEqual(
            expect.arrayContaining([
                expect.objectContaining({start: 5, finish: 5, status: 'ready'}),
                expect.objectContaining({start: 5, finish: 8, status: 'running'}),
            ])
        );        
    })
})
// all test cases will be in the final state array
describe('SJF test cases for third scene', () => {
    // perform policy
    let rtrn: SchedulerReturn ;
    beforeAll(() => {
        rtrn = SJF(( cloneDeep(scene3) as unknown) as Process[]);
    })

    //proc 1
    test('response time for process "1"', () => {
        expect(rtrn[0].pid).toBe(1);
        expect(rtrn[0].responseTime).toBe(0);
    })
    test('turn around for process "1"', () => {
        expect(rtrn[0].turnaround).toBe(8);
    })
    test('process "1" intervals', () => {
        expect(rtrn[0].interval).toEqual(
            expect.arrayContaining([
                expect.objectContaining({start: 0, finish: 0, status: 'ready'}),
                expect.objectContaining({start: 0, finish: 3, status: 'running'}),
                expect.objectContaining({start: 3, finish: 8, status: 'blocked'}),
            ])
        );        
    })

})

describe('FIFO test cases', () => {
    // perform policy
    let rtrn: SchedulerReturn ;
    beforeAll(() => {
        rtrn = firstInFirstOut((cloneDeep(scene) as unknown) as Process[]);
    })

    test('response time for process "1"', () => {
        expect(rtrn[0].pid).toBe(1);
        expect(rtrn[0].responseTime).toBe(0);
    })
    test('turn around for process "1"', () => {
        expect(rtrn[0].turnaround).toBe(22);
    })
    test('process "1" intervals', () => {
        expect(rtrn[0].interval).toEqual(
            expect.arrayContaining([
                expect.objectContaining({start: 0, finish: 0, status: 'ready'}),
                expect.objectContaining({start: 0, finish: 6, status: 'running'}),
                expect.objectContaining({start: 6, finish: 16, status: 'blocked'}),
                expect.objectContaining({start: 16, finish: 18, status: 'ready'}),
                expect.objectContaining({start: 18, finish: 22, status: 'running'}),
            ])
        );        
    })

    test('response time for process "1" ', () => {
        expect(rtrn[1].pid).toBe(2);
        expect(rtrn[1].responseTime).toBe(6);
    })
    test('turn around for process "2"', () => {
        expect(rtrn[1].turnaround).toBe(36);
    })
    test('process "2" intervals', () => {
        expect(rtrn[1].interval).toEqual(
            expect.arrayContaining([
                expect.objectContaining({start: 0, finish: 6, status: 'ready'}),
                expect.objectContaining({start: 6, finish: 15, status: 'running'}),
                expect.objectContaining({start: 15, finish: 30, status: 'blocked'}),
                expect.objectContaining({start: 30, finish: 30, status: 'ready'}),
                expect.objectContaining({start: 30, finish: 36, status: 'running'}),
            ])
        );        
    })

    test('response time for process "3"', () => {
        expect(rtrn[2].pid).toBe(3);
        expect(rtrn[2].responseTime).toBe(15);
    })
    test('turn around for process "3"', () => {
        expect(rtrn[2].turnaround).toBe(25);
    })
    test('process "3" intervals', () => {
        expect(rtrn[2].interval).toEqual(
            expect.arrayContaining([
                expect.objectContaining({start: 0, finish: 15, status: 'ready'}),
                expect.objectContaining({start: 15, finish: 18, status: 'running'}),
                expect.objectContaining({start: 18, finish: 23, status: 'blocked'}),
                expect.objectContaining({start: 23, finish: 23, status: 'ready'}),
                expect.objectContaining({start: 23, finish: 25, status: 'running'}),
            ])
        );        
    })
})