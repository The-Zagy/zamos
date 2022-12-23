import { useState } from 'react'

import GanttChart from './GanttChart'
import { Process, ProcessFinalStats, ProcessStatus, SchedulerReturn } from './lib/types'
import Navbar from './Navbar'
import ProcessForm from './ProcessForm'
import SelectPolicy, { Policies } from './SelectPolicy'
import ResultsTable from './ResultsTable'
const simulate = (policy: Policies, processes: Process[]): ProcessFinalStats[] => {
  // switch(policy){
  //   case 'FIFO':
  //     return firstInFirstOut(processes);
  //   case "SJF":
  //     return  shortestJobFirst(processes);
  //   case "SCTF":
  //     return shortestTimeToCompletionFirst(processes);
  //   case 'MLFQ':
  //     return multiLevelFeedbackQueue(processes);
  //   case 'RR':
  //     return roundRobin(processes);
  // }
  return []
}
const data: SchedulerReturn = [
  {
    arrivalTime: 0,
    finishTime: 22,
    firstRunTime: 0,
    responseTime: 0,
    turnaround: 22,
    pid: 1,
    interval: [
      { start: 0, finish: 0, status: ProcessStatus.READY },
      { start: 0, finish: 6, status: ProcessStatus.RUNNING },
      { start: 6, finish: 16, status: ProcessStatus.BLOCKED },
      { start: 16, finish: 18, status: ProcessStatus.READY },
      { start: 18, finish: 22, status: ProcessStatus.RUNNING }
    ]
  },
  {
    arrivalTime: 0,
    finishTime: 36,
    firstRunTime: 6,
    responseTime: 6,
    turnaround: 36,
    pid: 2,
    interval: [
      { start: 0, finish: 6, status: ProcessStatus.READY },
      { start: 6, finish: 15, status: ProcessStatus.RUNNING },
      { start: 15, finish: 30, status: ProcessStatus.BLOCKED },
      { start: 30, finish: 30, status: ProcessStatus.READY },
      { start: 30, finish: 36, status: ProcessStatus.RUNNING }
    ]
  },
  {
    arrivalTime: 0,
    finishTime: 25,
    firstRunTime: 15,
    responseTime: 15,
    turnaround: 25,
    pid: 3,
    interval: [
      { start: 0, finish: 15, status: ProcessStatus.READY },
      { start: 15, finish: 18, status: ProcessStatus.RUNNING },
      { start: 18, finish: 23, status: ProcessStatus.BLOCKED },
      { start: 23, finish: 23, status: ProcessStatus.READY },
      { start: 23, finish: 25, status: ProcessStatus.RUNNING }
    ]
  }
]
function App() {
  const [choice, setChoice] = useState<Policies | null>(null);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [finalProcesses, setFinalProcesses] = useState<ProcessFinalStats[]>([]);
  const handleSimulate = () => {
    if (choice === null) return;
    if (processes.length === 0) return;
    setFinalProcesses(simulate(choice, processes));
  }
  return (
    <main className='w-full'>
      <Navbar />
      <ProcessForm processes={processes} setProcesses={setProcesses} />
      <SelectPolicy setChoice={setChoice} />
      <button className='bg-sky-600 px-4 py-2 rounded-sm m-auto block text-white font-bold active:bg-sky-400' onClick={handleSimulate}>Simulate</button>

      {finalProcesses.length !== 0 && <GanttChart processes={finalProcesses} />}
      {finalProcesses.length !== 0 && <ResultsTable results={finalProcesses} />}
    </main>
  )
}

export default App
