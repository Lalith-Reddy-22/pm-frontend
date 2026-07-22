/**
 * Task Allocation Report Service
 * 
 * Handles fetching and processing task allocation report data
 * based on various filters (project, date range, search, sort, pagination)
 */

// Sample data for demonstration
const SAMPLE_TASK_ALLOCATION_DATA = [
  {
    id: 1,
    projectCode: "0737",
    projectTitle: "AMI LATAM 3D Face Ageing Module",
    client: "Allergan",
    subClient: "Sub Client A",
    taskId: "TSK001",
    taskTitle: "UI Development",
    type: "Development",
    startDate: "2026-06-20",
    endDate: "2026-06-25",
    employeeName: "Abhishek Badiger",
    designation: "Senior Developer",
    function: "Frontend",
    plannedHours: 40,
    actualHours: 42,
    unitCost: 150,
    plannedCost: 6000,
    actualCost: 6300,
    difference: 300,
  },
  {
    id: 2,
    projectCode: "0738",
    projectTitle: "BioGen Neural Mapping Phase II",
    client: "BioGen",
    subClient: "Sub Client B",
    taskId: "TSK002",
    taskTitle: "API Integration",
    type: "Development",
    startDate: "2026-06-21",
    endDate: "2026-06-30",
    employeeName: "Priya Sharma",
    designation: "Backend Developer",
    function: "Backend",
    plannedHours: 60,
    actualHours: 58,
    unitCost: 160,
    plannedCost: 9600,
    actualCost: 9280,
    difference: -320,
  },
  {
    id: 3,
    projectCode: "0739",
    projectTitle: "Pfizer Global Skin Analysis Tool",
    client: "Pfizer",
    subClient: "Sub Client C",
    taskId: "TSK003",
    taskTitle: "Database Design",
    type: "Design",
    startDate: "2026-06-22",
    endDate: "2026-06-27",
    employeeName: "Sahil Jain",
    designation: "Database Architect",
    function: "Database",
    plannedHours: 32,
    actualHours: 35,
    unitCost: 180,
    plannedCost: 5760,
    actualCost: 6300,
    difference: 540,
  },
  {
    id: 4,
    projectCode: "0740",
    projectTitle: "J&J Dermal Simulation Engine",
    client: "J&J",
    subClient: "Sub Client D",
    taskId: "TSK004",
    taskTitle: "Testing & QA",
    type: "Testing",
    startDate: "2026-06-23",
    endDate: "2026-07-03",
    employeeName: "Meera Joshi",
    designation: "QA Engineer",
    function: "Testing",
    plannedHours: 50,
    actualHours: 52,
    unitCost: 120,
    plannedCost: 6000,
    actualCost: 6240,
    difference: 240,
  },
  {
    id: 5,
    projectCode: "0741",
    projectTitle: "AstraZeneca Wound Healing AI",
    client: "AstraZeneca",
    subClient: "Sub Client E",
    taskId: "TSK005",
    taskTitle: "Data Analysis",
    type: "Analysis",
    startDate: "2026-06-24",
    endDate: "2026-07-01",
    employeeName: "Nikhil R",
    designation: "Data Analyst",
    function: "Analytics",
    plannedHours: 45,
    actualHours: 43,
    unitCost: 140,
    plannedCost: 6300,
    actualCost: 6020,
    difference: -280,
  },
  {
    id: 6,
    projectCode: "0742",
    projectTitle: "Roche Digital Pathology Review",
    client: "Roche",
    subClient: "Sub Client F",
    taskId: "TSK006",
    taskTitle: "Documentation",
    type: "Documentation",
    startDate: "2026-06-25",
    endDate: "2026-06-29",
    employeeName: "Akshaya K",
    designation: "Technical Writer",
    function: "Documentation",
    plannedHours: 30,
    actualHours: 28,
    unitCost: 100,
    plannedCost: 3000,
    actualCost: 2800,
    difference: -200,
  },
  {
    id: 7,
    projectCode: "0743",
    projectTitle: "Sanofi Patient Outcome Predictor",
    client: "Sanofi",
    subClient: "Sub Client G",
    taskId: "TSK007",
    taskTitle: "Review & Approval",
    type: "Review",
    startDate: "2026-06-26",
    endDate: "2026-06-30",
    employeeName: "Rupesh K",
    designation: "Project Manager",
    function: "Management",
    plannedHours: 20,
    actualHours: 22,
    unitCost: 130,
    plannedCost: 2600,
    actualCost: 2860,
    difference: 260,
  },
  {
    id: 8,
    projectCode: "0744",
    projectTitle: "Novartis Real-World Evidence Platform",
    client: "Novartis",
    subClient: "Sub Client H",
    taskId: "TSK008",
    taskTitle: "Deployment",
    type: "Deployment",
    startDate: "2026-06-27",
    endDate: "2026-07-02",
    employeeName: "Anaya M",
    designation: "DevOps Engineer",
    function: "Infrastructure",
    plannedHours: 25,
    actualHours: 26,
    unitCost: 170,
    plannedCost: 4250,
    actualCost: 4420,
    difference: 170,
  },
  {
    id: 9,
    projectCode: "0737",
    projectTitle: "AMI LATAM 3D Face Ageing Module",
    client: "Allergan",
    subClient: "Sub Client A",
    taskId: "TSK009",
    taskTitle: "Backend API Development",
    type: "Development",
    startDate: "2026-06-28",
    endDate: "2026-07-07",
    employeeName: "Vikram Singh",
    designation: "Backend Developer",
    function: "Backend",
    plannedHours: 55,
    actualHours: 54,
    unitCost: 160,
    plannedCost: 8800,
    actualCost: 8640,
    difference: -160,
  },
  {
    id: 10,
    projectCode: "0738",
    projectTitle: "BioGen Neural Mapping Phase II",
    client: "BioGen",
    subClient: "Sub Client B",
    taskId: "TSK010",
    taskTitle: "Unit Testing",
    type: "Testing",
    startDate: "2026-06-29",
    endDate: "2026-07-06",
    employeeName: "Isha Patel",
    designation: "QA Lead",
    function: "Testing",
    plannedHours: 40,
    actualHours: 44,
    unitCost: 125,
    plannedCost: 5000,
    actualCost: 5500,
    difference: 500,
  },
  {
    id: 11,
    projectCode: "0739",
    projectTitle: "Pfizer Global Skin Analysis Tool",
    client: "Pfizer",
    subClient: "Sub Client C",
    taskId: "TSK011",
    taskTitle: "UI/UX Design",
    type: "Design",
    startDate: "2026-06-30",
    endDate: "2026-07-10",
    employeeName: "Rajesh Kumar",
    designation: "UI Designer",
    function: "Design",
    plannedHours: 48,
    actualHours: 46,
    unitCost: 140,
    plannedCost: 6720,
    actualCost: 6440,
    difference: -280,
  },
  {
    id: 12,
    projectCode: "0740",
    projectTitle: "J&J Dermal Simulation Engine",
    client: "J&J",
    subClient: "Sub Client D",
    taskId: "TSK012",
    taskTitle: "Performance Optimization",
    type: "Development",
    startDate: "2026-07-01",
    endDate: "2026-07-08",
    employeeName: "Anita Verma",
    designation: "Senior Developer",
    function: "Backend",
    plannedHours: 35,
    actualHours: 38,
    unitCost: 170,
    plannedCost: 5950,
    actualCost: 6460,
    difference: 510,
  },
  {
    id: 13,
    projectCode: "0741",
    projectTitle: "AstraZeneca Wound Healing AI",
    client: "AstraZeneca",
    subClient: "Sub Client E",
    taskId: "TSK013",
    taskTitle: "Data Visualization",
    type: "Development",
    startDate: "2026-07-02",
    endDate: "2026-07-09",
    employeeName: "Karan Sharma",
    designation: "Frontend Developer",
    function: "Frontend",
    plannedHours: 42,
    actualHours: 40,
    unitCost: 145,
    plannedCost: 6090,
    actualCost: 5800,
    difference: -290,
  },
  {
    id: 14,
    projectCode: "0742",
    projectTitle: "Roche Digital Pathology Review",
    client: "Roche",
    subClient: "Sub Client F",
    taskId: "TSK014",
    taskTitle: "System Architecture",
    type: "Design",
    startDate: "2026-07-03",
    endDate: "2026-07-11",
    employeeName: "Deepak Nair",
    designation: "Architect",
    function: "Design",
    plannedHours: 38,
    actualHours: 40,
    unitCost: 190,
    plannedCost: 7220,
    actualCost: 7600,
    difference: 380,
  },
  {
    id: 15,
    projectCode: "0743",
    projectTitle: "Sanofi Patient Outcome Predictor",
    client: "Sanofi",
    subClient: "Sub Client G",
    taskId: "TSK015",
    taskTitle: "User Training",
    type: "Documentation",
    startDate: "2026-07-04",
    endDate: "2026-07-07",
    employeeName: "Pooja Gupta",
    designation: "Training Specialist",
    function: "Training",
    plannedHours: 25,
    actualHours: 24,
    unitCost: 110,
    plannedCost: 2750,
    actualCost: 2640,
    difference: -110,
  },
  {
    id: 16,
    projectCode: "0744",
    projectTitle: "Novartis Real-World Evidence Platform",
    client: "Novartis",
    subClient: "Sub Client H",
    taskId: "TSK016",
    taskTitle: "Security Review",
    type: "Review",
    startDate: "2026-07-05",
    endDate: "2026-07-12",
    employeeName: "Sanjay Desai",
    designation: "Security Lead",
    function: "Security",
    plannedHours: 30,
    actualHours: 32,
    unitCost: 200,
    plannedCost: 6000,
    actualCost: 6400,
    difference: 400,
  },
  {
    id: 17,
    projectCode: "0737",
    projectTitle: "AMI LATAM 3D Face Ageing Module",
    client: "Allergan",
    subClient: "Sub Client A",
    taskId: "TSK017",
    taskTitle: "Integration Testing",
    type: "Testing",
    startDate: "2026-07-06",
    endDate: "2026-07-13",
    employeeName: "Neha Singh",
    designation: "QA Engineer",
    function: "Testing",
    plannedHours: 45,
    actualHours: 47,
    unitCost: 120,
    plannedCost: 5400,
    actualCost: 5640,
    difference: 240,
  },
  {
    id: 18,
    projectCode: "0738",
    projectTitle: "BioGen Neural Mapping Phase II",
    client: "BioGen",
    subClient: "Sub Client B",
    taskId: "TSK018",
    taskTitle: "Bug Fixes & Maintenance",
    type: "Development",
    startDate: "2026-07-07",
    endDate: "2026-07-14",
    employeeName: "Rohit Patel",
    designation: "Developer",
    function: "Backend",
    plannedHours: 36,
    actualHours: 35,
    unitCost: 140,
    plannedCost: 5040,
    actualCost: 4900,
    difference: -140,
  },
  {
    id: 19,
    projectCode: "0739",
    projectTitle: "Pfizer Global Skin Analysis Tool",
    client: "Pfizer",
    subClient: "Sub Client C",
    taskId: "TSK019",
    taskTitle: "Accessibility Compliance",
    type: "Development",
    startDate: "2026-07-08",
    endDate: "2026-07-15",
    employeeName: "Manisha Roy",
    designation: "Developer",
    function: "Frontend",
    plannedHours: 28,
    actualHours: 30,
    unitCost: 135,
    plannedCost: 3780,
    actualCost: 4050,
    difference: 270,
  },
  {
    id: 20,
    projectCode: "0740",
    projectTitle: "J&J Dermal Simulation Engine",
    client: "J&J",
    subClient: "Sub Client D",
    taskId: "TSK020",
    taskTitle: "Client Feedback Implementation",
    type: "Development",
    startDate: "2026-07-09",
    endDate: "2026-07-16",
    employeeName: "Arjun Kapoor",
    designation: "Senior Developer",
    function: "Frontend",
    plannedHours: 50,
    actualHours: 52,
    unitCost: 165,
    plannedCost: 8250,
    actualCost: 8580,
    difference: 330,
  },
];

/**
 * Fetch task allocation report with filtering and sorting
 * @param {Object} filters - Filter parameters
 * @param {string} filters.projectId - Project filter (optional, "all" for all projects)
 * @param {string} filters.startDate - Start date for date range (ISO format)
 * @param {string} filters.endDate - End date for date range (ISO format)
 * @param {string} filters.search - Search query (searches across multiple fields)
 * @param {string} filters.sortBy - Column to sort by
 * @param {string} filters.sortDirection - Sort direction ('asc' or 'desc')
 * @param {number} filters.page - Page number (1-indexed)
 * @param {number} filters.pageSize - Number of records per page
 * @returns {Promise<Object>} - Returns { data: [], total: number, page: number, pageSize: number }
 */
export async function getTaskAllocationReport(filters = {}) {
  try {
    const {
      projectId = "all",
      startDate = null,
      endDate = null,
      search = "",
      sortBy = "projectCode",
      sortDirection = "asc",
      page = 1,
      pageSize = 10,
    } = filters;

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    let result = [...SAMPLE_TASK_ALLOCATION_DATA];

    // Filter by project
    if (projectId !== "all") {
      result = result.filter((item) => item.projectCode === projectId);
    }

    // Filter by date range
    if (startDate || endDate) {
      result = result.filter((item) => {
        const itemDate = new Date(item.startDate);
        let include = true;

        if (startDate) {
          const filterStart = new Date(startDate);
          include = include && itemDate >= filterStart;
        }

        if (endDate) {
          const filterEnd = new Date(endDate);
          include = include && itemDate <= filterEnd;
        }

        return include;
      });
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.projectCode.toLowerCase().includes(q) ||
          item.projectTitle.toLowerCase().includes(q) ||
          item.client.toLowerCase().includes(q) ||
          item.taskTitle.toLowerCase().includes(q) ||
          item.employeeName.toLowerCase().includes(q) ||
          item.designation.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy) {
      result.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];

        // Handle numeric sorting
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
        }

        // Handle string sorting
        if (typeof aVal === "string" && typeof bVal === "string") {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
          if (sortDirection === "asc") {
            return aVal.localeCompare(bVal);
          } else {
            return bVal.localeCompare(aVal);
          }
        }

        return 0;
      });
    }

    // Get total count before pagination
    const total = result.length;

    // Pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = result.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (error) {
    console.error("Error fetching task allocation report:", error);
    throw new Error("Failed to fetch task allocation report");
  }
}

/**
 * Get unique projects for filter dropdown
 * @returns {Promise<Array>} - Array of projects with { code, title }
 */
export async function getProjects() {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Extract unique projects from sample data
    const projects = Array.from(
      new Map(
        SAMPLE_TASK_ALLOCATION_DATA.map((item) => [
          item.projectCode,
          {
            code: item.projectCode,
            title: item.projectTitle,
          },
        ])
      ).values()
    );

    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Failed to fetch projects");
  }
}

/**
 * Export report data to CSV format
 * @param {Array} data - Report data to export
 * @returns {string} - CSV formatted string
 */
export function generateCSV(data) {
  if (!data || data.length === 0) {
    return "";
  }

  const headers = [
    "Project Code",
    "Project Title",
    "Client",
    "Sub Client",
    "Task ID",
    "Task Title",
    "Type",
    "Start Date",
    "End Date",
    "Employee Name",
    "Designation",
    "Function",
    "Planned Hours",
    "Actual Hours",
    "Unit Cost",
    "Planned Cost",
    "Actual Cost",
    "Difference",
  ];

  const rows = data.map((item) => [
    item.projectCode,
    `"${item.projectTitle}"`,
    item.client,
    item.subClient,
    item.taskId,
    `"${item.taskTitle}"`,
    item.type,
    item.startDate,
    item.endDate,
    item.employeeName,
    item.designation,
    item.function,
    item.plannedHours,
    item.actualHours,
    item.unitCost,
    item.plannedCost,
    item.actualCost,
    item.difference,
  ]);

  const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
    "\n"
  );

  return csv;
}

/**
 * Export report data to PDF format
 * @param {Array} data - Report data to export
 * @param {Object} options - PDF options
 * @returns {void} - Triggers PDF download
 */
export function generatePDF(data, options = {}) {
  try {
    const jsPDF = require("jspdf");
    const autoTable = require("jspdf-autotable");

    const doc = new jsPDF.jsPDF("l", "mm", "a4");

    const headers = [
      "Project Code",
      "Project Title",
      "Client",
      "Task ID",
      "Task Title",
      "Type",
      "Employee Name",
      "Planned Hours",
      "Actual Hours",
      "Planned Cost",
      "Actual Cost",
    ];

    const rows = data.map((item) => [
      item.projectCode,
      item.projectTitle.substring(0, 20),
      item.client,
      item.taskId,
      item.taskTitle.substring(0, 15),
      item.type,
      item.employeeName,
      item.plannedHours,
      item.actualHours,
      item.plannedCost,
      item.actualCost,
    ]);

    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 10,
      theme: "grid",
      styles: { fontSize: 8 },
    });

    doc.save("task-allocation-report.pdf");
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF");
  }
}
