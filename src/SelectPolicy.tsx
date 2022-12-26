import { useState } from "react";

import Select from 'react-select';
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
    setQuantumLengths: React.Dispatch<React.SetStateAction<number[]>>,
    quantum: number,
    quantumLengths: number[]

}> = ({ choice, setChoice, quantum, setQuantum, quantumLengths, setQuantumLengths }) => {
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
                <div className="flex gap-2 mt-3">
                    <label className="text-sm font-semibold">Quantum</label>
                    <input className="shadow-inner px-2 outline-none border border-gray-400" type={"number"} value={quantum} onChange={(e) => {
                        if (+e.target.value <= 0) return
                        setQuantum(+e.target.value)
                    }} />
                </div>
            }
            {choice === "MLFQ" &&
                <div className="flex gap-2 mt-3">
                    <label className="text-sm font-semibold">Quantum Lengths</label>
                    <input className="text-sm shadow-inner px-2 py-1 outline-none border border-gray-400" size={40} type={"text"} placeholder={"level2(the topmost) = 1, level1 = 2, level0 = 3"} onBlur={(e) => {
                        let temp = "[" + e.target.value + "]"
                        let t: number[] = JSON.parse(temp);
                        for(let i of t) {
                            if(i <= 0) return;
                        }
                        quantumLengths = t;
                        setQuantumLengths(quantumLengths)
                    }} />
                </div>
            }
        </div>
    )
}

export default SelectPolicy
