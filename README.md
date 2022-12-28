# Zamos Scheduler

a simulator of how the OS scheduler will act with specific processes scenarios 

you can check the deployment [here](zamos.zagy.tech/)

<br/>

You can check our project which is a CLI that works as a system monitor for Linux systems check [ps-cli/ZAMOSHACKING.md](https://github.com/The-Zagy/zamos/blob/ps-cli/ZAMOSHACKING.md) for more information

## Supported Scheduling Policies

- First Come First Served
	
- Shortest Job First
	
- Shortest Completion Time First

- Round Robin

- Multi-level Feedback Queue 

## Getting Started
`npm install`
`npm run dev`
to start developing

## TODO

The project has low priority right now but if you want to contribute here are a few ideas

- Make the scheduling code more modular because it contains a lot of repeated code

- Make MLFQ code more general by making the number of levels variable, right now it's fixed to 3

- We need tests ... a lot of them to be honest

- Make a compact timeline and give the user the ablitiy to switch between it and the current gannt chart, it looks something like this where the running intervals of each process only shows |1 1 1| 2 2 |

- Not really a todo but if you want to add a new scheduling policy you're more than welcome to do so


