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
