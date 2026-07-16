export default function DesignationTable({
    title,
    data,
}) {
    return (
        <div className="border">

            <div className="bg-gray-100 py-2 text-center font-bold text-xs tracking-widest text-gray-600">
                {title}
            </div>

            <table className="w-full border-collapse text-sm">

                <thead>

                    <tr className="bg-[#c8f1b9]">

                        <th className="border p-2 text-left">
                            Department
                        </th>

                        <th className="border p-2 text-left">
                            Designation
                        </th>

                        <th className="border p-2">
                            No. Of Employees
                        </th>

                        <th className="border p-2">
                            Plan Hours
                        </th>

                        <th className="border p-2">
                            Available Hours
                        </th>

                        <th className="border p-2">
                            Utilization (%)
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {data.map((dept) => (

                        dept.rows.map((row, index) => (

                            <tr key={dept.department + row.designation}>

                                {index === 0 && (

                                    <td
                                        rowSpan={dept.rows.length}
                                        className="border p-2 align-middle font-medium"
                                    >
                                        {dept.department}
                                    </td>

                                )}

                                <td className="border p-2">
                                    {row.designation}
                                </td>

                                <td className="border text-center">
                                    {row.employee}
                                </td>

                                <td className="border text-center">
                                    {row.planHours}
                                </td>

                                <td className="border text-center">
                                    {row.availableHours}
                                </td>

                                <td className="border text-center">
                                    {row.utilization}
                                </td>

                            </tr>

                        ))

                    ))}

                    <tr className="bg-[#2d79c7] text-white font-semibold">

                        <td className="border p-2">
                            Total
                        </td>

                        <td className="border"></td>

                        <td className="border text-center">
                            77
                        </td>

                        <td className="border text-center">
                            374.5
                        </td>

                        <td className="border text-center">
                            3413
                        </td>

                        <td className="border"></td>

                    </tr>

                </tbody>

            </table>

        </div>
    );
}