import { teamData } from "../data";

export default function SummaryTable({ title }) {
  return (
    <div className="border">

      <div className="bg-gray-100 py-2 text-center text-xs font-bold tracking-widest text-gray-600">
        {title}
      </div>

      <table className="w-full text-sm">

        <thead>

          <tr className="bg-[#c8f1b9]">

            <th className="border p-2 text-left">TEAM</th>

            <th className="border p-2">PLANNED HOURS</th>

            <th className="border p-2">AVAILABILITY HOURS</th>

            <th className="border p-2">UTILIZATION (%)</th>

            <th className="border p-2">PLANNED REVENUE</th>

          </tr>

        </thead>

        <tbody>

          {teamData.map((item) => (
            <tr key={item.team}>

              <td className="border p-2">{item.team}</td>

              <td className="border text-center">
                {item.hours}
              </td>

              <td className="border text-center">
                {item.available}
              </td>

              <td className="border text-center">
                {item.utilization}
              </td>

              <td className="border text-center">
                {item.revenue}
              </td>

            </tr>
          ))}

          <tr className="bg-[#2d79c7] text-white font-semibold">

            <td className="border p-2">Total</td>

            <td className="border text-center">374.5</td>

            <td className="border text-center">3728</td>

            <td className="border"></td>

            <td className="border text-center">22802.59</td>

          </tr>

        </tbody>

      </table>

    </div>
  );
}