# Zamos Scheduler

a simulator to how the OS scheduler will act with specific processes scenerio 

## Supported Algo

- First Come First Served
	
- Shortest Job First
	
- Shortest Remaining Time First
	
- Priority-based (non-preemptive)
	
- Priority-based (preemptive)
	
- Round Robin

## Getting Started

> it can work with ".json" file or the program has methods to create random workload
- the interface the file will be tested against
```
enum ProcessStatus  {
    RUNNING = 'running',
    READY = 'ready',
    BLOCKED = 'blocked'
}

interface Process {
    pid: number;
    arrivalTime: number;
    finishTime: number;
    firstRunTime: number;
    length?: number;
    status: ProcessStatus
}

```
- `npm install`

- `npm start -- scene.json` 
