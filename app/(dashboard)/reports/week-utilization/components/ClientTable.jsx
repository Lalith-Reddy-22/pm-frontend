export default function ClientTable({ data }) {
    const totalHours = data.reduce(
        (sum, item) => sum + item.hours,
        0
    );

    const totalCost = data.reduce(
        (sum, item) => sum + item.cost,
        0
    );

    return (
        <div className="overflow-hidden rounded border">

            <table className="w-full border-collapse text-sm">

                <thead>

                    <tr className="bg-black text-white">

                        <th className="border border-gray-300 px-3 py-2 text-left">
                            CLIENT
                        </th>

                        <th className="border border-gray-300 px-3 py-2 text-center">
                            PLANNED HOURS
                        </th>

                        <th className="border border-gray-300 px-3 py-2 text-center">
                            PLANNED COST
                        </th>

                        <th className="border border-gray-300 px-3 py-2 text-center">
                            UTILIZATION (%)
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {data.map((client, index) => (

                        <tr
                            key={client.name}
                            className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                        >

                            <td className="border px-3 py-2">
                                {client.name}
                            </td>

                            <td className="border text-center">
                                {client.hours}
                            </td>

                            <td className="border text-center">
                                {client.cost}
                            </td>

                            <td className="border text-center">
                                {client.utilization}
                            </td>

                        </tr>

                    ))}

                    <tr className="bg-[#2d79c7] text-white font-semibold">

                        <td className="border px-3 py-2">
                            Total
                        </td>

                        <td className="border text-center">
                            {totalHours}
                        </td>

                        <td className="border text-center">
                            {totalCost.toFixed(2)}
                        </td>

                        <td className="border text-center">
                            100%
                        </td>

                    </tr>

                </tbody>

            </table>

        </div>
    );
}