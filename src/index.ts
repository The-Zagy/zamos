import { Process, SchedulerRtrn } from "./types";
import { createRandowScene } from "./utils";
const processQue: Process[] = []; 
function FIFO(): SchedulerRtrn {
    // TODO all arrive at the same time CHANGE ME DADDY
    let turnAround = 0;
    let curTimeSlice = 0;
    let responseTime = 0;
    createRandowScene(processQue);
    console.log('FIFO');
    // calc turnAround
    for (let prc of processQue) {
        if (!prc.length) throw new Error('process length missing');
        //* this part show example what algo resonsible to do in this demo
        prc.finishTime = (curTimeSlice + prc.length);
        prc.firstRunTime = curTimeSlice;
        // all calclutions depend on the assumbtions that all processes arrive at the same time
        turnAround += (prc.length + curTimeSlice);
        responseTime += curTimeSlice;
        curTimeSlice += prc.length;
    }
    turnAround /= processQue.length;
    responseTime /= processQue.length;
    console.log(`turn around time = ${turnAround}\nresponse time = ${responseTime}`);
    return {
        responseTime,
        turnAround
    }
}
FIFO()
