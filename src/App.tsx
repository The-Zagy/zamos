import { useMemo, useState } from 'react'

import GanttChart from './GanttChart'
import { Process, ProcessFinalStats, ProcessStatus, SchedulerReturn } from './lib/types'
import Navbar from './Navbar'
import ProcessForm from './ProcessForm'
import SelectPolicy, { Policies } from './SelectPolicy'
import ResultsTable from './ResultsTable'
import { MultiLevelFeedbackQueue, RoundRobin, SJF, firstInFirstOut, shortestTimeToCompletionFirst } from './lib/scheduling-policies'
import { cloneDeep } from 'lodash'
import Footer from './Footer'
const simulate = (policy: Policies, processes: Process[], quantum?: number, quantumLengths?: number[]): ProcessFinalStats[] => {
  const copy = cloneDeep(processes)
  switch (policy) {
    case 'FIFO':
      return firstInFirstOut(copy);
    case "SJF":
      return SJF(copy);
    case "SCTF":
      return shortestTimeToCompletionFirst(copy);
    case 'MLFQ':
      return MultiLevelFeedbackQueue(copy, {level0: quantumLengths![2] || 3, level1: quantumLengths![1] || 2, level2: quantumLengths![0] || 1 });
    case 'RR':
      return RoundRobin(copy, quantum || 3);
    default:
      return []
  }

}
function App() {
  const [choice, setChoice] = useState<Policies | null>(null);
  const [quantum, setQuantum] = useState<number>(3);
  const [quantumLengths, setQuantumLengths] = useState<number[]>([3, 2, 1]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [finalProcesses, setFinalProcesses] = useState<ProcessFinalStats[]>([]);
  const handleSimulate = () => {
    if (choice === null) return;
    if (processes.length === 0) return;
    setFinalProcesses((_) => simulate(choice, processes, quantum, quantumLengths));
  }
  return (
    <>
      <main className='w-full min-h-screen'>
        <Navbar />
        <ProcessForm processes={processes} setProcesses={setProcesses} />
        <SelectPolicy
          choice={choice}
          setChoice={setChoice}
          quantum={quantum}
          quantumLengths={quantumLengths}
          setQuantum={setQuantum}
          setQuantumLengths={setQuantumLengths}
        />
        <button className='bg-sky-600 px-4 py-2 rounded-sm m-auto block text-white font-bold active:bg-sky-400' onClick={handleSimulate}>Simulate</button>
        {finalProcesses.length !== 0 && <GanttChart processes={finalProcesses} />}
        {finalProcesses.length !== 0 && <ResultsTable results={finalProcesses} />}

      </main>
      <Footer />
    </>
  )
}

export default App
