import { ReactElement, useMemo } from "react";
import { ProcessStatus, ProcessesFinalStats } from "./lib/types"
const GanttChart: React.FC<{ processes: ProcessesFinalStats }> = ({ processes }) => {
    const findMaxFinishTime = (processes: ProcessesFinalStats): number => {
        return Math.max(...processes.map((i => i.finishTime)));
    }
    const drawNumbersRow = () => {
        const rowCells: ReactElement[] = [<div className="w-16 h-8 text-center"></div>];
        for (let i = 0; i <= maxFinishTime; i++) {
            rowCells.push(<div className="w-8 h-8 text-center">{i}</div>)
        }
        return rowCells;
    }
    const maxFinishTime = useMemo(() => {
        return findMaxFinishTime(processes);
    }, [processes])
    return (
        //todo remove width later and let parent decide the width 
        <div className="overflow-x-scroll">
            <div className='m-auto mt-4 min-w-max rounded-sm'>
                {/**Generate grid with x-axis (cols) length = maxFinishTime & y-axis (rows) length = num of processes */}
                <div className="flex flex-col">
                    {processes.map((process) => {
                        const rowCells: ReactElement[] = [<div className="w-16 h-8 text-center">{process.pid}</div>];
                        for (let i = 0; i <= maxFinishTime; i++) {
                            const currentState = process.interval.find((interval => {
                                if (interval.start === interval.finish) return false;
                                if (i >= interval.start && i <= interval.finish) {
                                    return true;
                                }
                                return false;
                            }))
                            switch (currentState?.status) {
                                case ProcessStatus.READY:
                                    rowCells.push(<div className="bg-yellow-200 w-8 h-8 border-r border-b border-gray-600"></div>)
                                    break;
                                case ProcessStatus.BLOCKED:
                                    rowCells.push(<div className="bg-red-400 w-8 h-8 border-r border-b border-gray-600"></div>)
                                    break;
                                case ProcessStatus.RUNNING:
                                    rowCells.push(<div className="bg-green-400 w-8 h-8 border-r border-b border-gray-600"></div>)
                                    break;
                                default:
                                    rowCells.push(<div className="bg-white w-8 h-8 border-r border-b border-gray-600"></div>)
                                    break;
                            }
                        }
                        return <div className="flex flex-row border-gray-600">
                            {rowCells}
                        </div>;
                    })}
                    <div className="flex flex-row">{drawNumbersRow()}</div>
                </div>
            </div>
        </div>
    )
}

export default GanttChart
