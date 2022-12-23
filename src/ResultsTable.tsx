import React, { useMemo } from "react";

import { ProcessFinalStats, ProcessesFinalStats } from "./lib/types"

import { useTable, Column } from "react-table";

const columns: Array<Column<ProcessFinalStats>> = [{
    Header: "PID",
    accessor: "pid",
},
{
    Header: "Turnaround time",
    accessor: "turnaround",

},
{
    Header: "Response Time",
    accessor: "responseTime",

},
{
    Header: "First Run Time",
    accessor: "firstRunTime",
},
{
    Header: "Finish Time",
    accessor: "finishTime",
}
]

const ResultsTable: React.FC<{ results: ProcessesFinalStats }> = ({ results }) => {

    const tableData = useMemo(() => {
        return [...results];
    }, [results])
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable<ProcessFinalStats>({
        columns: columns,
        data: tableData
    });

    return (
        <div className="flex flex-col justify-center gap-4">
            <div className="overflow-x-auto relative">
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
                    </tbody>
                </table>
            </div >
        </div>
    )
}

export default ResultsTable;
