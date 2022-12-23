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
const SelectPolicy: React.FC<{ setChoice: React.Dispatch<React.SetStateAction<Policies | null>> }> = ({ setChoice }) => {
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
        </div>
    )
}

export default SelectPolicy
