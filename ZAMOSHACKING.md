# ZAMOS - CLI

Zamos is a system monitor built for Linux

## HOW TO INSTALL

- `npm install` - install dependencies
- `npm run build` - build the solution
- `npm i -g` - install the cli globally under the name ***zamos***

## HOW TO USE

```cpp
zamos [command] --opt [val]

Commands:
  zamos ps   show a snap shot for the system
  zamos top  show real-time status for the system

Options:
      --version  Show version number                                   [boolean]
  -s, --sort     set how to sort the output, by cpu usage or mem usage or pid
                 [the default sort is by cpu, the sort is descending by default]
                                 [choices: "cpu", "mem", "pid"] [default: "cpu"]
  -l, --length   set how to sort the output, by cpu usage or mem usage or pid
                 [the default sort is by cpu, the sort is descending by default]
                                                          [number] [default: 20]
  -h             Show help                                             [boolean]

```

## OUTPUT SAMPLE

![sample ouput](/assets/ouputSample.png)

## /PROC FILE SYSTEM 

*for more information see the man pages for proc file system `man proc` or the link [proc man pages](https://man7.org/linux/man-pages/man5/proc.5.html)*

- *What is PROC file system*: 
  > filesystem is a pseudo-filesystem which provides an
  interface to kernel data structures.<br/> Proc file system (procfs) is virtual file system created on fly when system boots and is dissolved at time of system shut down.
  It contains useful information about the processes that are currently running, it is regarded as control and information center for kernel.
  The proc file system also provides communication medium between kernel space and user space. 

- *Each folder in **/proc consider a pid** for running process in the system and here's an example for files inside each directory[process] and what information each provide*

  ![folder content](/assets/procFolderContent.png)

- *Procfs contain another files that provide information about the system not a certain process for example*

  ![folder content](/assets/procSysContent.png)


## HOW IT WORKS

- *using `/proc/{pid}/status` file to provide information about the process like*
  > Name   Command run by this process

  > State  Current state of the process
  
  > PPid   PID of parent process.

  > VmRSS  Resident set size.  Note that the value here is the
                     sum of RssAnon, RssFile, and RssShmem.
  
- *using `/proc/{pid}/stats` file to provide information about the process status like*

  > (14) utime  %lu
                     Amount of time that this process has been scheduled
                     in user mode, measured in clock ticks
  
  > (15) stime  %lu
                     Amount of time that this process has been scheduled
                     in kernel mode, measured in clock ticks
            
  > (22) starttime  %llu
                     The time the process started after system boot.  In
                     kernels before Linux 2.6, this value was expressed
                     in jiffies.  Since Linux 2.6, the value is
                     expressed in clock ticks (divide by
                     sysconf(_SC_CLK_TCK)).

- *using `/proc/stats` to read total cpu usage*

- *To mesaure cpu usage we use sampling by reading `utime, stime and total cpu usage` then after time slice read same data again to get real-time values of the cpu usage for a process*
  ```js
  (100 * ((procStatAfter['utime'] - procStatBefore['utime']) + (procStatAfter['stime'] - procStatBefore['stime'])) / (totalCpuTimeAfter.timeTotal - totalCpuTimeBefore.timeTotal))
  ```

- *To mesaure mem usage for a process we use `/proc/{pid}/statm` to get information about the process like the value of **data and stack sizes***

  > resident   (2) resident set size

  > data       (6) data + stack
  ```js
  (((+STATM[STATMIndices.RESIDENT] + +STATM[STATMIndices.DATA_AND_STACK])) / 1024)
  ```

- *we're using cpp code to get system clock tics per second from the system call `sysconf(_SC_CLK_TCK)` using the executable of the program and running it in node.js using `child_process.exec()`*

  > Unlike the exec(3) POSIX system call, child_process.exec() does not replace the existing process and uses a shell to execute the command.