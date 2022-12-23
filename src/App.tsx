import { useState } from 'react'

import GanttChart from './GanttChart'
import { ProcessStatus, SchedulerReturn } from './lib/types'
import Navbar from './Navbar'
import ProcessForm from './ProcessForm'
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
  const [count, setCount] = useState(0)

  return (
    <main className='w-full'>
      <Navbar />
      <ProcessForm />

      <GanttChart processes={data} />
    </main>
  )
}

export default App
