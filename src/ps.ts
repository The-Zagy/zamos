#! /usr/bin/env node
/**
 * RESOURSES
 * https://man7.org/linux/man-pages/man5/proc.5.html
 */
import fs from 'fs';
import os from 'os';
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path';
import yargs from 'yargs';
import { hideBin }  from 'yargs/helpers';

// define cli constrains
const argv = yargs(hideBin(process.argv))
    .usage('zamos [command] --opt [val]')
    .command('ps', 'show a snap shot for the system')
    .command('top', 'show real-time status for the system')
    .option('sort', {
        alias: 's',
        choices: ['cpu', 'mem', 'pid'],
        default: 'cpu',
        description: "set how to sort the output, by cpu usage or mem usage or pid [the default sort is by cpu, the sort is descending by default]"
    })
    .option('length', {
        alias: 'l',
        type: 'number',
        default: 20,
        description: "set how to sort the output, by cpu usage or mem usage or pid [the default sort is by cpu, the sort is descending by default]"
    })
    .help('h')
    .argv

const execPromisified = promisify(exec);

enum STATUSIndices {
    NAME = 0,
    STAT = 2,
    PID = 5,
    PARENT_PID = 6,
    USER_ID = 8,
    VmRSS = 21
}
enum STATIndices {
    UTIME = 13,
    STIME = 14,
    CUT_TIME = 15,
    CS_TIME = 16,
    START_TIME = 21,

}
enum STATMIndices {
    RESIDENT = 1,
    DATA_AND_STACK = 5

}
//Yes Status and stat are two different files don't get confused
type ProcessInfo = {
    NAME: string,
    UID: string,
    PID: number,
    PPID: string,
    CPU: number,
    MEM: number,
    STAT: string,
    START: string,
    TIME: number,
    CMD: string
}
const extractNumber = (str: string) => {
    let res = str.match(/\d+/);
    if (!res) throw new Error("No numbers to extract");
    return res[0];
}
const extractStatusField = (line: string): { filed: string, value: string } => {
    // const regex = /: *(\S+)/;
    // const match = line.match(regex);
    // // const match = regex.exec(line);
    // if(!match) throw new Error('line don"t go with the regex');
    // const word = match[1];
    // return word;

    //TODO change back to regex stop being a loser
    const splited = line.split(':')
    if (splited.length != 2) throw new Error('not a status line');
    return {
        filed: splited[0],
        value: splited[1]
    }

}


/**
 * Resident Set Size: number of pages the process has
    in real memory.  This is just the pages which count
    toward text, data, or stack space.  This does not
    include pages which have not been demand-loaded in,
    or which are swapped out.  This value is
    inaccurate; see /proc/[pid]/statm below.
 */
// statm => Provides information about memory usage
/**
 * size       (1) total program size
                        (same as VmSize in /proc/[pid]/status)
            resident   (2) resident set size
                        (inaccurate; same as VmRSS in /proc/[pid]/status)
            shared     (3) number of resident shared pages
                        (i.e., backed by a file)
                        (inaccurate; same as RssFile+RssShmem in
                        /proc/[pid]/status)
            text       (4) text (code)
            lib        (5) library (unused since Linux 2.6; always 0)
            data       (6) data + stack
            dt         (7) dirty pages (unused since Linux 2.6; always 0)
 */


// return info about cpu state like total usage
function readCpuStat(): { timeTotal: number } {
    const CPU_STAT = fs.readFileSync(`/proc/stat`, { encoding: 'utf-8' }).split('\n')[0].split(' ');
    let timeTotal = 0;
    for (let i = 1; i < CPU_STAT.length; ++i) {
        timeTotal += +CPU_STAT[i];
    }
    return { timeTotal };
}

// [utime, stime, startTime] start time in clock ticks to convert it to seconds need to divide by "sysconf(_SC_CLK_TCK)"
function readProcStat(pid: string): { utime: number, stime: number, startTime: number } {
    const STAT = fs.readFileSync(`/proc/${pid}/stat`, { encoding: 'utf-8' }).split(' ');
    return { utime: +STAT[STATIndices.UTIME], stime: +STAT[STATIndices.STIME], startTime: +STAT[STATIndices.START_TIME] }
}
// function will be used to display one process cpuUsage in real time[kinda like top but only for one process]
async function readCpuUsageRealTime(pid: string): Promise<number> {
    try {
        const totalCpuTimeBefore = readCpuStat();
        const procStatBefore = readProcStat(pid);
        await delay(1000);
        const totalCpuTimeAfter = readCpuStat();
        const procStatAfter = readProcStat(pid);
        return +(100 * ((procStatAfter['utime'] - procStatBefore['utime']) + (procStatAfter['stime'] - procStatBefore['stime'])) / (totalCpuTimeAfter.timeTotal - totalCpuTimeBefore.timeTotal)).toFixed(2);
    } catch {
        throw new Error('process doesnot exist or ended');
    }
}

// return both cpu usage and length of the process
/**
 * 
 *  (22) starttime  %llu
    The time the process started after system boot.  In
    kernels before Linux 2.6, this value was expressed
    in jiffies.  Since Linux 2.6, the value is
    expressed in clock ticks (divide by
    sysconf(_SC_CLK_TCK)).
 *  
 */
function readCpuUsage(procStat: {
    utime: number;
    stime: number;
    startTime: number;
}): { CPU: number } {
    const totalCpuTime = readCpuStat();
    return { CPU: +(100 * ((procStat['utime'] + procStat['stime']) / totalCpuTime.timeTotal)).toFixed(2) };
}

type ProcBasicInfo = { NAME: string, STAT: string, PPID: string, UID: string, CMD: string, MEM: number };

function readProcBasicInfo(pid: string): ProcBasicInfo {
    // status file is divided by \n in that shape
    /**
     * Name:  name
     * data:  value
     */
    const STATUS = fs.readFileSync(`/proc/${pid}/status`, { encoding: 'utf-8' }).split("\n");
    const COMMAND = fs.readFileSync(`/proc/${pid}/cmdline`, { encoding: 'utf-8' });
    return {
        CMD: COMMAND.slice(0, 20),
        NAME: extractStatusField(STATUS[STATUSIndices.NAME]).value.trim(),
        STAT: extractStatusField(STATUS[STATUSIndices.STAT]).value.trim(),
        PPID: extractStatusField(STATUS[STATUSIndices.PARENT_PID]).value.trim(),
        UID: extractNumber(STATUS[STATUSIndices.USER_ID]),
        MEM: +extractNumber(STATUS[STATUSIndices.VmRSS]) / 1024
    }
}
/**
 * Why ps is "wrong" in memory usage

Depending on how you look at it, ps is not reporting the real memory usage of processes. What it is really doing is showing how much real memory each process would take up if it were the only process running. Of course, a typical Linux machine has several dozen processes running at any given time, which means that the VSZ and RSS numbers reported by ps are almost definitely wrong.
 */
function readPhyMemUsage(pid: string): number {
    const STATM = fs.readFileSync(`/proc/${pid}/statm`, { encoding: 'utf-8' }).split(" ");
    return +(((+STATM[STATMIndices.RESIDENT] + +STATM[STATMIndices.DATA_AND_STACK])) / 1024).toFixed(2);
}
// function to cause delay in code execution
const delay = (ms: number) => { return new Promise(resolve => setTimeout(resolve, ms)) }

//function return when the process started and for how long
function readStartTime(procStat: {
    utime: number;
    stime: number;
    startTime: number;
}, clockTicksPerSecond: number = 100): { startDate: string, timeSinceStarted: number } {

    // Convert the start time to seconds
    let startTimeInSeconds = procStat.startTime / clockTicksPerSecond;
    // startTime from stat is => The time the process started after system boot
    startTimeInSeconds = os.uptime() - startTimeInSeconds;
    // Convert the start time in seconds to a date object
    const startTimeInMS = Date.now() - (startTimeInSeconds * 1000);
    const startTime = new Date(startTimeInMS);
    const timeFormat = new Intl.DateTimeFormat(undefined, {
        hour: '2-digit',
        minute: '2-digit',
    });
    const localizedTime = timeFormat.format(startTime);
    return { startDate: localizedTime, timeSinceStarted: +((Date.now() - startTimeInMS) / 1000).toFixed(2) }

}
type SortByOpts = 'CPU' | 'MEM' | 'PID'
//todo add flags to main to sort by something
async function main() {
    if (os.type() !== 'Linux') throw new Error('works only on Linux sorry');
    // read the proc file system to get snapshot for all processes in the system
    const PROC = fs.readdirSync('/proc').sort();
    // clk tics is fixed per system so calc it once before running the program 
    const CPU_STAT = fs.readFileSync(`/proc/stat`, { encoding: 'utf-8' });
    let clockTicksPerSecond: number;
    try {
        let res = (await execPromisified(path.join(__dirname, '/clkTics')));
        clockTicksPerSecond = +res.stdout;
    } catch (err) {
        // console.log(err)
        clockTicksPerSecond = 100;
    }
    // store all the data in array to make sort utility easier


    //each dir in proc consider to be process id[pid]
    function ps(length: number, sortBy: SortByOpts) {
        const curSnapShot: ProcessInfo[] = [];
        for (const pid of PROC) {
            try {
                // proc contain another dirs/files that are not processes so ignoring them
                if (!Number.isInteger(+pid)) continue;
                const procBasicInfo = readProcBasicInfo(pid);
                const stat = readProcStat(pid);
                const cpuUsage = readCpuUsage(stat);
                const startTime = readStartTime(stat, clockTicksPerSecond)
                curSnapShot.push({ PID: +pid, ...procBasicInfo, CPU: cpuUsage.CPU, START: startTime.startDate, TIME: startTime.timeSinceStarted, MEM: readPhyMemUsage(pid) })
            } catch {
                // process ended so just ignore it and jump to the next one 
                // todo check if it was already added to the curSnapShot array and remove it
                continue;
            }
        }
        console.clear()
        console.table(curSnapShot.sort((a, b) => b[sortBy] - a[sortBy]).splice(0, length))
    }
    async function psWithSampling(length: number, sortBy: SortByOpts) {
        const resolved = (await Promise.all(PROC.filter((pid) => Number.isInteger(+pid)).map(async (pid) => {
            try {
                // proc contain another dirs/files that are not processes so ignoring them
                const procBasicInfo = readProcBasicInfo(pid);
                const stat = readProcStat(pid);
                const cpuUsage = await readCpuUsageRealTime(pid);
                const startTime = readStartTime(stat, clockTicksPerSecond)
                return ({
                    PID: +pid,
                    ...procBasicInfo
                    , CPU: cpuUsage,
                    START: startTime.startDate,
                    TIME: startTime.timeSinceStarted,
                    MEM: readPhyMemUsage(pid)
                })
            } catch (err) {
                //if error happened return undefined then filter it later
                return undefined;
            }
        }))).filter((i) => i !== undefined) as ProcessInfo[]
        console.clear()
        console.table(resolved.sort((a, b) => b[sortBy] - a[sortBy]).splice(0, length))
    }

    function top(length: number, sortBy: SortByOpts) {
        ps(length, sortBy);
        setInterval(() => {
            // console.clear()
            ps(length, sortBy)
        }, 1000);
    }

    function topWithSampling(length: number, sortBy: SortByOpts) {
        ps(length, sortBy);
        setInterval(async () => {
            await psWithSampling(length, sortBy)
        }, 2000);
    }
    return ({
        ps,
        psWithSampling,
        top,
        topWithSampling
    })
}

main().then( async (fn) => {
    const opts = await argv
    if (opts._[0] === 'ps') {
        fn.ps(opts.length, opts.sort.toUpperCase() as SortByOpts);
    } else {
        fn.topWithSampling(opts.length, opts.sort.toUpperCase() as SortByOpts);
    }
})