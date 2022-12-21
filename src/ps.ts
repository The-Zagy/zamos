/**
 * RESOURSES
 * https://man7.org/linux/man-pages/man5/proc.5.html
 */
import fs from 'fs';
import os from 'os';
enum STATUSIndices {
    NAME = 0,
    STAT = 2,
    PID = 5,
    PARENT_PID = 6,
    USER_ID = 8,
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
    USER: string,
    PID: number,
    CPU: number,
    MEM: number,
    STAT: string,
    START: string,
    TIME: string,
    COMMAND: string
}
const extractNumber = (str: string) => {
    let res = str.match(/\d+/);
    if (!res) throw new Error("No numbers to extract");
    return res[0];
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
function main() {
    const directories = fs.readdirSync('/proc').sort();
    const MEMINFO = fs.readFileSync(`/proc/meminfo`, { encoding: 'utf-8' }).split('\n')[0];
    const total_mem = +extractNumber(MEMINFO);
    const numCpus = os.cpus().length;
    // const processesInfo:ProcessInfo[]=[];
    const data: [number, number, number][] = [];
    for (const directory of directories) {
        if (!Number.isInteger(+directory)) continue;
        const ticksPerSecond = os.uptime();
        // const CPU_STAT = fs.readFileSync(`/proc/stat`, { encoding: 'utf-8' }).split('\n')[0].split(' ');
        // // let cpuUsage = 0;
        // for (let i = 1; i < CPU_STAT.length; ++i) {
        //     cpuUsage += +CPU_STAT[i];
        // }
        // if (+directory == 2295) {
        //     const statT = fs.readFileSync(`/proc/${directory}/stat`, {encoding: 'utf-8'}).split(' ');
        //     // console.table(statT);
        // }
        // const STATUS = fs.readFileSync(`/proc/${directory}/status`, {encoding: 'utf-8'}).split("\n");
        const STATM = fs.readFileSync(`/proc/${directory}/statm`, { encoding: 'utf-8' }).split(" ");
        // const STAT = fs.readFileSync(`/proc/${directory}/stat`, { encoding: 'utf-8' }).split(' ');
        //check this out to understand the formula below
        //https://stackoverflow.com/questions/1420426/how-to-calculate-the-cpu-usage-of-a-process-by-pid-in-linux-from-c/1424556#1424556
        // let total_time = +STAT[STATIndices.UTIME] + +STAT[STATIndices.STIME] + +STAT[STATIndices.CUT_TIME] + +STAT[STATIndices.CS_TIME];
        // console.log(`process total ${total_time}`);
        // const cpu_percentage = (total_time / cpuUsage) * 100;
        const statFile = fs.readFileSync(`/proc/${directory}/stat`, 'utf8');
        const fields = statFile.split(' ');
        const utime = parseInt(fields[13], 10);
        const stime = parseInt(fields[14], 10);
        const starttime = parseInt(fields[21], 10);

        const elapsed = (utime + stime) / numCpus / ticksPerSecond;
        const uptime = os.uptime() - starttime / ticksPerSecond;
        const cpuUsage = (elapsed / uptime) * 100;
        const mem = ((+STATM[STATMIndices.RESIDENT] + +STATM[STATMIndices.DATA_AND_STACK])) / 1024;
        data.push([+directory, +cpuUsage.toFixed(3), +mem.toFixed(3)])
        // console.log(`cpu usage for ${directory} =\t ${cpu_percentage.toFixed(3)} mem usage = \t${mem}`)
        // const COMMAND = fs.readFileSync(`/proc/${directory}/cmdline`, {encoding: 'utf-8'});
        // const SYS_UPTIME = fs.readFileSync(`/proc/uptime`, {encoding: 'utf-8'});
        // console.log(`PID: ${directory}\t${st.split('\n')[0]}\tcmd: ${cmdl.split(':').toString()}`, '\n*************************************\n');
    }
    console.table(data.sort((a, b) => a[1] - b[1]))
}

const cpuUsage = () => {
        const directories = fs.readdirSync('/proc').sort();
        const numCpus = os.cpus().length;
        const data: [number, number][] = [];
        for (const pid of directories) {
            if (!Number.isInteger(+pid)) continue;
            // Get the number of clock ticks per second on the system
            const ticksPerSecond = os.uptime();

            // Read the /proc/[pid]/stat file for the process
            const statFile = fs.readFileSync(`/proc/${pid}/stat`, 'utf8');

            // Split the file into fields
            const fields = statFile.split(' ');

            // Extract the utime and stime fields (user time and system time)
            const utime = parseInt(fields[13], 10);
            const stime = parseInt(fields[14], 10);

            // Extract the starttime field (time the process started)
            const starttime = parseInt(fields[21], 10);

            // Calculate the elapsed time for the process (utime + stime)
            const elapsed = (utime + stime) / numCpus / ticksPerSecond;

            // Calculate the uptime of the system
            const uptime = os.uptime() - starttime / ticksPerSecond;

            // Calculate the CPU usage as a percentage
            const cpuUsage = elapsed / uptime * 100 * 100;
            data.push([+pid, cpuUsage]);
        }
        console.table(data.sort((a, b) => b[1] - a[1]).slice(0, 10))
} 
setInterval(() => { console.clear();
    cpuUsage()
}, 1000);

