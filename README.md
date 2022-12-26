# Zamos Scheduler

a simulator of how the OS scheduler will act with specific processes scenario.

<br/>

The project contains another part which is a CLI that works as a system monitor for Linux systems check [ZAMOSHACKING.md](/ZAMOSHACKING.md) for more information

## Supported Algo

- First Come First Served
	
- Shortest Job First
	
- Shortest Remaining Time First
	
- Round Robin

- Multi-Level Feedback Queue

## Getting Started

> It can work with ".json" file if you're using the code in the terminal

> You can use the UI in the [**main branch**](https://github.com/the-Zagy/zamos/tree/main) or use the deployed link [zamos.zagy.tech](https://zamos.zagy.tech/)

- the interface the file will be tested against.

[Example](/src/fifo-example.json)

    ```js
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
        cpuTime: number;
        //Meaning start after how many seconds of execution
        io: { start: number, length: number }[];
        status: ProcessStatus
    }

    ```
- `npm install`

- `npm run build`

- `npm start` or `npm run dev` 
