import { useState } from 'react'

import GanttChart from './GanttChart'
import { Process, ProcessFinalStats, ProcessStatus, SchedulerReturn } from './lib/types'
import Navbar from './Navbar'
import ProcessForm from './ProcessForm'
import SelectPolicy, { Policies } from './SelectPolicy'
import ResultsTable from './ResultsTable'
import { MultiLevelFeedbackQueue, RoundRobin, SJF, firstInFirstOut, shortestTimeToCompletion } from './lib/scheduling-policies'
import { cloneDeep } from 'lodash'
import Footer from './Footer'
const simulate = (policy: Policies, processes: Process[]): ProcessFinalStats[] => {
  const copy = cloneDeep(processes)
  switch (policy) {
    case 'FIFO':
      return firstInFirstOut(copy);
    case "SJF":
      return SJF(copy);
    case "SCTF":
      return shortestTimeToCompletion(copy);
    case 'MLFQ':
      return MultiLevelFeedbackQueue(copy, { level0: 3, level1: 2, level2: 1 });
    case 'RR':
      return RoundRobin(copy, 2);
    default:
      return []
  }

}
function App() {
  const [choice, setChoice] = useState<Policies | null>(null);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [finalProcesses, setFinalProcesses] = useState<ProcessFinalStats[]>([]);
  const handleSimulate = () => {
    if (choice === null) return;
    if (processes.length === 0) return;
    setFinalProcesses((_) => simulate(choice, processes));
  }
  return (
    <>
      <main className='w-full min-h-screen'>
        <Navbar />
        <ProcessForm processes={processes} setProcesses={setProcesses} />
        <SelectPolicy setChoice={setChoice} />
        <button className='bg-sky-600 px-4 py-2 rounded-sm m-auto block text-white font-bold active:bg-sky-400' onClick={handleSimulate}>Simulate</button>
        {finalProcesses.length !== 0 && <GanttChart processes={finalProcesses} />}
        {finalProcesses.length !== 0 && <ResultsTable results={finalProcesses} />}

      </main>
      <Footer />
    </>
  )
}

export default App
