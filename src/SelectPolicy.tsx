import { useState } from "react";

import Select from 'react-select';
import { MLFQQuanta } from "./lib/types";
export type Policies = "FIFO" | "SCTF" | "SJF" | "MLFQ" | "RR"
const options: { value: Policies, label: string }[] = [
    {
        label: "First In First Out (FIFO)", value: "FIFO"
    },
    {
        label: "Shortes Job First (SJF)", value: "SJF"
    },
    {
        label: "Shortest Completion Time First (SCTF)", value: "SCTF"
    },
    {
        label: "Round Robin (RR)", value: "RR"
    },
    {
        label: "Multi-Level Feedback Queue (MLFQ)", value: "MLFQ"
    }
]
const SelectPolicy: React.FC<{
    choice: Policies | null,
    setChoice: React.Dispatch<React.SetStateAction<Policies | null>>
    setQuantum: React.Dispatch<React.SetStateAction<number>>,
    setQuantumLengths: React.Dispatch<React.SetStateAction<MLFQQuanta>>,
    quantum: number,
    quantumLengths: MLFQQuanta

}> = ({ choice, setChoice, quantum, setQuantum, quantumLengths, setQuantumLengths }) => {
    const onMLFQQuantumChange = (level: 2 | 1 | 0, value: number) => {
        if (value <= 0) return
        setQuantumLengths(prev => ({
            ...prev,
            [`level${level}`]: value
        }))
    }
    return (
        <div className="py-10 px-5">
            <Select
                className="basic-single"
                classNamePrefix="select"
                placeholder="Select a scheduling Policy"
                isSearchable
                options={options}
                onChange={(e) => {
                    if (e?.value) {
                        setChoice(e.value);
                    }
                }}
            />
            {choice === "RR" &&
                <div className="flex gap-2 mt-5">
                    <label className="text-sm font-medium">Quantum</label>
                    <input className="shadow-inner px-2 outline-none border border-gray-400" type={"number"} value={quantum} onChange={(e) => {
                        if (+e.target.value <= 0) return
                        setQuantum(+e.target.value)
                    }} />
                </div>
            }
            {choice === "MLFQ" &&
                <div className="flex gap-4 mt-5">
                    <label className="text-sm font-medium">Quantum Lengths</label>
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-4 justify-between">
                            <label >Level 2 (Topmost)</label>
                            <input className="text-sm shadow-inner px-2 py-1 outline-none border border-gray-400"
                                type={"number"}
                                value={quantumLengths.level2}
                                onChange={(e) => { onMLFQQuantumChange(2, +e.target.value) }}
                            />
                        </div>
                        <div className="flex gap-4 justify-between">
                            <label>Level 1 </label>
                            <input className="text-sm shadow-inner px-2 py-1 outline-none border border-gray-400"
                                type={"number"}
                                value={quantumLengths.level1}
                                onChange={(e) => { onMLFQQuantumChange(1, +e.target.value) }}
                            />
                        </div>
                        <div className="flex gap-4 justify-between">
                            <label>Level 0 </label>
                            <input className="text-sm shadow-inner px-2 py-1 outline-none border border-gray-400"
                                type={"number"}
                                value={quantumLengths.level0}
                                onChange={(e) => { onMLFQQuantumChange(0, +e.target.value) }}
                            />
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default SelectPolicy
