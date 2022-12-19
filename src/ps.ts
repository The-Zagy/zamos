// import path from "path";
import fs from 'fs';

function main() {
    const dirs = fs.readdirSync('/proc').sort();
    dirs.forEach((itm) => {
        if (Number.isInteger(+itm)) {
            const st = fs.readFileSync(`/proc/${itm}/status`, {encoding: 'utf-8'});
            const cmdl = fs.readFileSync(`/proc/${itm}/cmdline`, {encoding: 'utf-8'});
            console.log(`PID: ${itm}\t${st.split('\n')[0]}\tcmd: ${cmdl.split(':').toString()}`, '\n*************************************\n');
        }
    }) 
}
main()
