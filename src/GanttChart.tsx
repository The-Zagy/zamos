import { ReactElement, useEffect, useMemo, useState } from "react";
import { ProcessStatus, ProcessesFinalStats } from "./lib/types"
import { PlusIcon } from "@heroicons/react/24/outline";
import { MinusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
// Define a function to generate the class names for the cells based on the status of the process
function getClassNames(status: ProcessStatus | undefined, base: string): string {
    switch (status) {
        case ProcessStatus.READY:
            return "bg-yellow-200" + " " + base;
        case ProcessStatus.BLOCKED:
            return "bg-red-400" + " " + base;
        case ProcessStatus.RUNNING:
            return "bg-green-400" + " " + base;
        default:
            return "bg-white" + " " + base;
    }
}
function getWidthAndHeight(zoomLevel: number) {
    return `w-${zoomLevel} h-${zoomLevel} `
}
const GanttChart: React.FC<{ processes: ProcessesFinalStats }> = ({ processes }) => {
    console.log(processes)
    const findMaxFinishTime = (processes: ProcessesFinalStats): number => {
        return Math.max(...processes.map((i => i.finishTime)));
    }
    const [zoom, setZoom] = useState<number>(8);
    const handleZooming = (zoomType: 1 | -1) => {
        if (zoomType === 1) {
            if (zoom === 10) return
            setZoom((prev => prev + 1));
            return
        }
        if (zoom === 5) return;
        setZoom((prev => prev - 1));

    }
    const drawNumbersRow = () => {
        const rowCells: ReactElement[] = [<div className={`${getWidthAndHeight(zoom)} text-center`}></div>];
        for (let i = 0; i <= maxFinishTime; i++) {
            rowCells.push(<div className={`${getWidthAndHeight(zoom)} text-center`}>{i}</div>)
        }
        return rowCells;
    }
    const maxFinishTime = useMemo(() => {
        return findMaxFinishTime(processes);
    }, [processes])
    return (
        //todo remove width later and let parent decide the width 
        <div className="overflow-x-scroll py-10 px-5">
            <div className='min-w-max rounded-sm'>
                {/**Generate grid with x-axis (cols) length = maxFinishTime & y-axis (rows) length = num of processes */}
                <div className="flex flex-col">
                    {processes.map((process, index) => {
                        const rowCells: ReactElement[] = [<div className={`${getWidthAndHeight(zoom)} text-center`}>{process.pid}</div>];
                        for (let i = 0; i <= maxFinishTime; i++) {
                            const currentState = process.interval.find((interval => {
                                if (interval.start === interval.finish) return false;
                                if (i >= interval.start && i < interval.finish) {
                                    return true;
                                }
                                return false;
                            }))
                            rowCells.push(
                                <div
                                    className={
                                        getClassNames(currentState?.status,
                                            clsx(`${getWidthAndHeight(zoom)} border-r border-b border-gray-600`, { "border-t": index === 0 }, { "border-l": i === 0 }))}>

                                </div>)
                        }
                        return <div className="flex flex-row border-gray-600">
                            {rowCells}
                        </div>;
                    })}
                    <div className="flex flex-row">{drawNumbersRow()}</div>
                </div>
            </div>
            <div className="flex flex-row gap-4">
                <div>
                    <span>Blocked</span>
                    <span className="w-3 h-3 ml-2 inline-block bg-red-400"></span>
                </div>
                <div>
                    <span>Ready</span>
                    <span className="w-3 h-3 ml-2 inline-block bg-yellow-200"></span>
                </div>
                <div>
                    <span>Running</span>
                    <span className="w-3 h-3 ml-2 inline-block bg-green-400"></span>
                </div>
                <div className="ml-4 flex flex-row gap-4">
                    <div><PlusIcon className="text-black w-5 h-5 cursor-pointer" onClick={() => handleZooming(1)} /></div>
                    <div><MinusIcon className="text-black w-5 h-5 cursor-pointer" onClick={() => handleZooming(-1)} /></div>
                </div>
            </div>
        </div>
    )
}

export default GanttChart
