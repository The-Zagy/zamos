import React, { RefObject, useMemo, useState } from "react";

import { Process, ProcessStatus } from "./lib/types"
import { PlusCircleIcon } from "@heroicons/react/24/solid"
import { useTable, Column } from "react-table";
import { Formik, Form, Field } from "formik";
import { checkIntegrityOfInput } from "./lib/utils";
const columns: Array<Column<Process>> = [{
    Header: "PID",
    accessor: "pid",
},
{
    Header: "Arrival Time",
    accessor: "arrivalTime",

},
{
    Header: "Cpu Time",
    accessor: "cpuTime",

},
{
    Header: "IO intervals",
    accessor: "io",
    Cell: ({ value }) => <>{value.map(i => `[${i.start}, ${i.length}]`).join(", ")}</>
},
{
    Header: "Action",
    Cell: () => <a href="#" className="font-medium text-red-400 hover:underline">Delete</a>
}
]

const ProcessForm: React.FC = () => {

    const [processes, setProcesses] = useState<Process[]>([
        {
            "pid": 1,
            "arrivalTime": 0,
            "finishTime": -1,
            "firstRunTime": -1,
            "cpuTime": 10,
            "io": [{ "start": 6, "length": 10 }],
            "status": ProcessStatus.READY
        },
        {
            "pid": 2,
            "arrivalTime": 0,
            "finishTime": -1,
            "firstRunTime": -1,
            "io": [{ "start": 9, "length": 15 }],
            "cpuTime": 15,
            "status": ProcessStatus.READY
        },
        {
            "pid": 3,
            "arrivalTime": 0,
            "finishTime": -1,
            "firstRunTime": -1,
            "io": [{ "start": 3, "length": 5 }],
            "cpuTime": 5,
            "status": ProcessStatus.READY
        }
    ]);
    const tableData = useMemo(() => {
        return [...processes];
    }, [processes])
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable<Process>({
        columns: columns,
        data: tableData
    });
    const deleteProcess = (index: number) => {
        setProcesses((prev) => { return prev.filter((_, i) => i !== index) })
    }
    return (
        <div className="flex flex-col justify-center gap-4">
            <Formik

                initialValues={{
                    io: "",
                    arrivalTime: "",
                    pid: "",
                    cpuTime: ""
                }}
                onSubmit={(values, helpers) => {
                    helpers.setErrors({});
                    if (Number.isNaN(+values.arrivalTime)) {
                        helpers.setFieldError("arrivalTime", "Arrival Time must be a number");
                        return;
                    }
                    if (Number.isNaN(+values.cpuTime)) {
                        helpers.setFieldError("cpuTime", "Cpu Time must be a number");
                        return;
                    }
                    if (Number.isNaN(+values.pid)) {
                        helpers.setFieldError("pid", "PID must be a number");
                        return;
                    }
                    const temp = "[" + values.io + "]";
                    let ioFormat: [number, number][] = [];
                    try {
                        ioFormat = JSON.parse(temp);
                    }
                    catch (err) {
                        helpers.setFieldError("io", "I/O is not in the format specified");
                        return;
                    }
                    const newProcess: Process = {
                        arrivalTime: +values.arrivalTime,
                        cpuTime: +values.cpuTime,
                        io: ioFormat.map(i => ({ start: i[0], length: i[0] })),
                        firstRunTime: -1,
                        finishTime: -1,
                        pid: +values.pid,
                        status: ProcessStatus.READY
                    }
                    try {
                        checkIntegrityOfInput(newProcess);
                    }
                    catch (err) {
                        let error = err as Error;
                        helpers.setFieldError("pid", error.message);
                        return;
                    }
                    setProcesses((prev) => ([...prev, newProcess]));
                    helpers.setValues({ io: "", arrivalTime: "", cpuTime: "", pid: "" })
                }}>
                {
                    form => (
                        <Form>
                            <div className="overflow-x-auto relative shadow-md">
                                <table {...getTableProps()} className="w-full text-sm text-left text-gray-800">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                        {
                                            headerGroups.map(headerGroup => (
                                                <tr {...headerGroup.getFooterGroupProps()}>
                                                    {
                                                        headerGroup.headers.map(column => (
                                                            <th scope="col" className="py-3 px-6"{...column.getHeaderProps()}>
                                                                {column.render("Header")}
                                                            </th>
                                                        ))
                                                    }
                                                </tr>
                                            ))
                                        }
                                    </thead>
                                    <tbody {...getTableBodyProps()}>
                                        {
                                            rows.map(row => {
                                                prepareRow(row);
                                                return (
                                                    <tr {...row.getRowProps()} className="bg-white border-b">
                                                        {
                                                            row.cells.map(cell => {
                                                                if (cell.column.Header === "Action") {
                                                                    return (
                                                                        <td className="py-4 px-6" onClick={() => deleteProcess(cell.row.index)} {...cell.getCellProps()}>
                                                                            {
                                                                                cell.render("Cell")
                                                                            }
                                                                        </td>
                                                                    )
                                                                }
                                                                return (
                                                                    <td className="py-4 px-6" {...cell.getCellProps()}>
                                                                        {
                                                                            cell.render("Cell")
                                                                        }
                                                                    </td>
                                                                )
                                                            }
                                                            )
                                                        }
                                                    </tr>
                                                )
                                            })

                                        }
                                        <tr role="row" className="bg-white border-b">
                                            <td className="py-4 px-6">
                                                <Field name="pid" placeholder="PID" className="shadow-inner outline-none hover:shadow-md focus:shadow-md" />
                                            </td>
                                            <td className="py-4 px-6">
                                                <Field name="arrivalTime" placeholder="Arrival Time" className="shadow-inner outline-none hover:shadow-md focus:shadow-md" />
                                            </td>
                                            <td className="py-4 px-6">
                                                <Field name="cpuTime" placeholder="Cpu Time" className="shadow-inner outline-none hover:shadow-md focus:shadow-md" />
                                            </td>
                                            <td className="py-4 px-6">
                                                <Field name="io" placeholder="[start,length], [start,length]" className="shadow-inner outline-none hover:shadow-md focus:shadow-md" />
                                            </td>

                                        </tr>
                                    </tbody>
                                </table>

                            </div >
                            <pre className="text-center m-auto mt-4 text-red-600">
                                {Object.entries(form.errors).map((i) => {
                                    return <div>{i[1]}</div>;
                                })}
                            </pre>
                            <button type="submit" className="m-auto flex flex-col justify-center items-center mt-2 select-none hover:cursor-pointer text-left text-m">
                                <div>Add a new Process</div>
                                <PlusCircleIcon className="text-blue-500 h-10 w-10" />
                            </button>
                        </Form>
                    )}
            </Formik>
        </div>

    )
}

export default ProcessForm;
