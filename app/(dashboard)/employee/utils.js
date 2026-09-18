import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Copy
export async function handleCopy(sorted) {
  const text = sorted
    .map(
      (e) =>
        `${e.name}\t${e.email}\t${e.designation}\t${e.team}\t${e.type}\t${e.createdDate}\t${e.status}`
    )
    .join("\n");

  await navigator.clipboard.writeText(text);

  alert("Employee list copied successfully!");
}

// CSV
export function handleCSV(sorted) {
  const headers = [
    "Name",
    "Email",
    "Designation",
    "Team",
    "Type",
    "Created Date",
    "Status",
  ];

  const rows = sorted.map((e) => [
    e.name,
    e.email,
    e.designation,
    e.team,
    e.type,
    e.createdDate,
    e.status,
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "Employee_List.csv";

  link.click();

  URL.revokeObjectURL(url);
}

// Print
export function handlePrint(sorted) {
  const printWindow = window.open("", "", "width=900,height=700");

  printWindow.document.write(`
    <html>

      <head>

        <title>Employee List</title>

        <style>

          body{
            font-family:Arial;
            padding:20px;
          }

          table{
            width:100%;
            border-collapse:collapse;
          }

          th,td{
            border:1px solid #ddd;
            padding:8px;
            text-align:left;
          }

          th{
            background:#E12729;
            color:white;
          }

        </style>

      </head>

      <body>

        <h2>Employee Details</h2>

        <table>

          <thead>

            <tr>

              <th>Name</th>
              <th>Email</th>
              <th>Designation</th>
              <th>Team</th>
              <th>Status</th>

            </tr>

          </thead>

          <tbody>

            ${sorted
              .map(
                (e) => `
                  <tr>
                    <td>${e.name}</td>
                    <td>${e.email}</td>
                    <td>${e.designation}</td>
                    <td>${e.team}</td>
                    <td>${e.status}</td>
                  </tr>
                `
              )
              .join("")}

          </tbody>

        </table>

      </body>

    </html>
  `);

  printWindow.document.close();

  printWindow.print();
}

export function handlePDF(sorted) {
  const doc = new jsPDF();

  doc.setFontSize(18);

  doc.text("Employee Details", 14, 20);

  autoTable(doc, {
    startY: 30,

    head: [
      [
        "Name",
        "Email",
        "Designation",
        "Team",
        "Type",
        "Created",
        "Status",
      ],
    ],

    body: sorted.map((e) => [
      e.name,
      e.email,
      e.designation,
      e.team,
      e.type,
      e.createdDate,
      e.status,
    ]),

    headStyles: {
      fillColor: [225, 39, 41],
    },
  });

  doc.save("Employee_List.pdf");
}