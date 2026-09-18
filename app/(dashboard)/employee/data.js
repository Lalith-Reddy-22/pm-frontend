// ── Shared mock employee data ───────────────────────────────────────────
// Swap for a real fetch (e.g. `/api/employees`, `/api/employees/[id]`)
// later — both the list page and the detail page import from here so
// there's a single source of truth for the shape.

import { Monitor, PlayCircle, LayoutGrid, FileText, Image as ImageIcon, Headphones } from "lucide-react";

export const EMPLOYEES = [
  {
    id: "e01", name: "Abigail Adair", email: "abigail.adair@medtrixhealthcare.com",
    phone: "+91 98450 11201", location: "Bengaluru, India", designation: "VP-Client Engagement",
    team: "PM Team", type: "PM_Employee", employeeCode: "MDX-EMP-101",
    reportingManager: "Rahul Menon", createdDate: "06/05/2024", status: "Inactive",
    projects: [
      { id: "p01", name: "Client Onboarding Automation", role: "Sponsor",   status: "Ongoing",   priority: "HIGH" },
      { id: "p02", name: "Q3 Roadmap Planning",           role: "Reviewer", status: "Completed", priority: "MEDIUM" },
    ],
  },
  {
    id: "e02", name: "Akila A", email: "akila.a@medtrixhealthcare.com",
    phone: "+91 90080 22345", location: "Chennai, India", designation: "Jr.Medical writer",
    team: "Content Team", type: "Employee", employeeCode: "MDX-EMP-102",
    reportingManager: "Divya Nair", createdDate: "07/15/2025", status: "Active",
    projects: [
      { id: "p03", name: "Medical Content Library Refresh", role: "Contributor", status: "Ongoing", priority: "MEDIUM" },
    ],
  },
  {
    id: "e03", name: "Abhishek Badiger", email: "abhishek.b@medtrixhealthcare.com",
    phone: "+91 99720 33456", location: "Pune, India", designation: "Jr.Dotnet developer",
    team: "Tech Team", type: "Employee", employeeCode: "MDX-EMP-103",
    reportingManager: "Harish Chandra", createdDate: "09/23/2024", status: "Active",
    projects: [
      { id: "p04", name: "PM Tool App Development - Revamp", role: "Developer", status: "Ongoing", priority: "MEDIUM" },
      { id: "p05", name: "API Gateway Upgrade",               role: "Developer", status: "On Hold", priority: "LOW" },
    ],
  },
  {
    id: "e04", name: "Amita Byatnal", email: "amita.b@medtrixhealthcare.com",
    phone: "+91 98765 44567", location: "Bengaluru, India", designation: "Copy Editor",
    team: "Content Team", type: "Employee", employeeCode: "MDX-EMP-104",
    reportingManager: "Divya Nair", createdDate: "01/11/2023", status: "Active",
    projects: [
      { id: "p06", name: "SEO Content Audit", role: "Editor", status: "Ongoing", priority: "LOW" },
    ],
  },
  {
    id: "e05", name: "Aditi Dash", email: "aditi.d@medtrixhealthcare.com",
    phone: "+91 90352 55678", location: "Hyderabad, India", designation: "Project Associate",
    team: "PM Team", type: "PM", employeeCode: "MDX-EMP-105",
    reportingManager: "Abhishek Kumar", createdDate: "06/20/2024", status: "Active",
    projects: [
      { id: "p04", name: "PM Tool App Development - Revamp", role: "Coordinator", status: "Ongoing", priority: "MEDIUM" },
      { id: "p07", name: "PTC Degree Resource Check In Live Site", role: "Coordinator", status: "Ongoing", priority: "MEDIUM" },
    ],
  },
  {
    id: "e06", name: "Abhishek Kumar", email: "abhishek.k@medtrixhealthcare.com",
    phone: "+91 99456 66789", location: "Bengaluru, India", designation: "Sr. Project Manager",
    team: "PM Team", type: "Admin", employeeCode: "MDX-EMP-106",
    reportingManager: "Abigail Adair", createdDate: "06/12/2025", status: "Inactive",
    projects: [
      { id: "p04", name: "PM Tool App Development - Revamp", role: "Project Manager", status: "Ongoing",   priority: "HIGH" },
      { id: "p01", name: "Client Onboarding Automation",     role: "Project Manager", status: "Ongoing",   priority: "HIGH" },
      { id: "p02", name: "Q3 Roadmap Planning",               role: "Project Manager", status: "Completed", priority: "MEDIUM" },
    ],
  },
  {
    id: "e07", name: "Amith KP", email: "amith.kp@medtrixhealthcare.com",
    phone: "+91 96110 77890", location: "Kochi, India", designation: "3D Artist",
    team: "Creative Team", type: "Employee", employeeCode: "MDX-EMP-107",
    reportingManager: "Isha Kapoor", createdDate: "10/17/2024", status: "Active",
    projects: [
      { id: "p08", name: "Product Explainer Video Series", role: "3D Artist", status: "Ongoing", priority: "MEDIUM" },
    ],
  },
  {
    id: "e08", name: "Ankit Kumar Singh", email: "ankit.ks@medtrixhealthcare.com",
    phone: "+91 97654 88901", location: "Noida, India", designation: "Junior Software Engineer",
    team: "Tech Team", type: "Employee", employeeCode: "MDX-EMP-108",
    reportingManager: "Harish Chandra", createdDate: "08/17/2023", status: "Inactive",
    projects: [
      { id: "p09", name: "Internal QA Automation Suite", role: "Developer", status: "On Hold", priority: "LOW" },
    ],
  },
  {
    id: "e09", name: "Bhavana Rao", email: "bhavana.rao@medtrixhealthcare.com",
    phone: "+91 91234 99012", location: "Bengaluru, India", designation: "UI/UX Designer",
    team: "Creative Team", type: "Employee", employeeCode: "MDX-EMP-109",
    reportingManager: "Isha Kapoor", createdDate: "03/02/2024", status: "Active",
    projects: [
      { id: "p10", name: "Design System Overhaul",           role: "Designer", status: "Ongoing",   priority: "HIGH" },
      { id: "p04", name: "PM Tool App Development - Revamp", role: "Designer", status: "Ongoing",   priority: "MEDIUM" },
    ],
  },
  {
    id: "e10", name: "Chetan Verma", email: "chetan.verma@medtrixhealthcare.com",
    phone: "+91 90045 10123", location: "Indore, India", designation: "QA Engineer",
    team: "Tech Team", type: "Employee", employeeCode: "MDX-EMP-110",
    reportingManager: "Harish Chandra", createdDate: "11/29/2023", status: "Active",
    projects: [
      { id: "p09", name: "Internal QA Automation Suite", role: "QA Engineer", status: "On Hold", priority: "LOW" },
      { id: "p05", name: "API Gateway Upgrade",           role: "QA Engineer", status: "On Hold", priority: "LOW" },
    ],
  },
  {
    id: "e11", name: "Divya Nair", email: "divya.nair@medtrixhealthcare.com",
    phone: "+91 98432 21234", location: "Kochi, India", designation: "Content Strategist",
    team: "Content Team", type: "Employee", employeeCode: "MDX-EMP-111",
    reportingManager: "Abigail Adair", createdDate: "05/14/2025", status: "Active",
    projects: [
      { id: "p03", name: "Medical Content Library Refresh", role: "Strategist", status: "Ongoing", priority: "MEDIUM" },
      { id: "p06", name: "SEO Content Audit",                role: "Strategist", status: "Ongoing", priority: "LOW" },
    ],
  },
  {
    id: "e12", name: "Farhan Sheikh", email: "farhan.sheikh@medtrixhealthcare.com",
    phone: "+91 99887 32345", location: "Hyderabad, India", designation: "DevOps Engineer",
    team: "Tech Team", type: "Employee", employeeCode: "MDX-EMP-112",
    reportingManager: "Harish Chandra", createdDate: "02/09/2024", status: "Inactive",
    projects: [
      { id: "p05", name: "API Gateway Upgrade", role: "DevOps Engineer", status: "On Hold", priority: "LOW" },
    ],
  },
  {
    id: "e13", name: "Gayatri Iyer", email: "gayatri.iyer@medtrixhealthcare.com",
    phone: "+91 90876 43456", location: "Bengaluru, India", designation: "HR Business Partner",
    team: "PM Team", type: "Admin", employeeCode: "MDX-EMP-113",
    reportingManager: "Abigail Adair", createdDate: "04/18/2023", status: "Active",
    projects: [
      { id: "p01", name: "Client Onboarding Automation", role: "HR Partner", status: "Ongoing", priority: "MEDIUM" },
    ],
  },
  {
    id: "e14", name: "Harish Chandra", email: "harish.c@medtrixhealthcare.com",
    phone: "+91 98120 54567", location: "Pune, India", designation: "Backend Developer",
    team: "Tech Team", type: "Employee", employeeCode: "MDX-EMP-114",
    reportingManager: "Abhishek Kumar", createdDate: "12/01/2024", status: "Active",
    projects: [
      { id: "p04", name: "PM Tool App Development - Revamp", role: "Tech Lead", status: "Ongoing", priority: "HIGH" },
      { id: "p05", name: "API Gateway Upgrade",               role: "Tech Lead", status: "On Hold", priority: "LOW" },
      { id: "p09", name: "Internal QA Automation Suite",      role: "Tech Lead", status: "On Hold", priority: "LOW" },
    ],
  },
  {
    id: "e15", name: "Isha Kapoor", email: "isha.kapoor@medtrixhealthcare.com",
    phone: "+91 97001 65678", location: "Bengaluru, India", designation: "Graphic Designer",
    team: "Creative Team", type: "Employee", employeeCode: "MDX-EMP-115",
    reportingManager: "Abhishek Kumar", createdDate: "07/07/2023", status: "Active",
    projects: [
      { id: "p10", name: "Design System Overhaul",           role: "Design Lead", status: "Ongoing", priority: "HIGH" },
      { id: "p08", name: "Product Explainer Video Series",   role: "Design Lead", status: "Ongoing", priority: "MEDIUM" },
    ],
  },
  {
    id: "e16", name: "Jatin Malhotra", email: "jatin.m@medtrixhealthcare.com",
    phone: "+91 96543 76789", location: "Delhi, India", designation: "Project Manager",
    team: "PM Team", type: "PM", employeeCode: "MDX-EMP-116",
    reportingManager: "Abhishek Kumar", createdDate: "09/09/2024", status: "Inactive",
    projects: [
      { id: "p07", name: "PTC Degree Resource Check In Live Site", role: "Project Manager", status: "Ongoing", priority: "MEDIUM" },
    ],
  },
];

export const AVATAR_STYLES = {
  light: "bg-rose-100 text-rose-500",
  dark:  "bg-rose-500/10 text-rose-400",
};

export const STATUS_STYLES = {
  Active:   "bg-green-500 text-white",
  Inactive: "bg-gray-400 text-white",
};

// ── Project status / priority styling (mirrors the app's badge patterns) ──

export const PROJECT_STATUS_STYLES = {
  Ongoing:   "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
  "On Hold": "bg-amber-100 text-amber-700",
};

export const PROJECT_STATUS_STYLES_DARK = {
  Ongoing:   "bg-blue-500/10 text-blue-400",
  Completed: "bg-green-500/10 text-green-400",
  "On Hold": "bg-amber-500/10 text-amber-400",
};

export const PRIORITY_STYLES = {
  LOW:    "bg-sky-500",
  MEDIUM: "bg-amber-500",
  HIGH:   "bg-red-600",
};

export function initials(name) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function parseMDY(str) {
  const [m, d, y] = str.split("/").map(Number);
  return new Date(y, m - 1, d).getTime();
}

export function getEmployeeById(id) {
  return EMPLOYEES.find((e) => e.id === id) ?? null;
}

// ── Project display helpers (icons, client, task/progress/hours) ──────────
// Each project entry only stores { id, name, role, status, priority } —
// the rest is derived deterministically from the project so it stays
// consistent across renders without hand-authoring numbers for every row.
// A real API would just return these fields directly.

export const CATEGORY_STYLES = {
  design:  { icon: Monitor,    light: "bg-rose-100 text-rose-600",     dark: "bg-rose-500/10 text-rose-400" },
  video:   { icon: PlayCircle, light: "bg-green-100 text-green-600",   dark: "bg-green-500/10 text-green-400" },
  layout:  { icon: LayoutGrid, light: "bg-amber-100 text-amber-600",   dark: "bg-amber-500/10 text-amber-400" },
  doc:     { icon: FileText,   light: "bg-purple-100 text-purple-600", dark: "bg-purple-500/10 text-purple-400" },
  image:   { icon: ImageIcon,  light: "bg-blue-100 text-blue-600",     dark: "bg-blue-500/10 text-blue-400" },
  support: { icon: Headphones, light: "bg-cyan-100 text-cyan-600",     dark: "bg-cyan-500/10 text-cyan-400" },
};

const CATEGORY_KEYS = Object.keys(CATEGORY_STYLES);
const CLIENTS = ["Stemline", "Sanofi", "Biogen", "Novartis", "Pfizer", "Roche", "Astellas"];

function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

export function getProjectVisuals(project) {
  const h = hashStr(project.id + project.name);
  const category = CATEGORY_KEYS[h % CATEGORY_KEYS.length];
  const client = CLIENTS[Math.floor(h / 7) % CLIENTS.length];
  const tasksTotal = 1 + (h % 6);

  let tasksDone;
  if (project.status === "Completed") tasksDone = tasksTotal;
  else if (project.status === "On Hold") tasksDone = Math.floor(tasksTotal * 0.15);
  else tasksDone = Math.min(tasksTotal, Math.round(tasksTotal * (0.25 + (h % 5) * 0.12)));

  const progress = tasksTotal === 0 ? 0 : Math.round((tasksDone / tasksTotal) * 100);
  const actualHours = tasksDone * (2 + (h % 4));

  return { category, client, tasksTotal, tasksDone, progress, actualHours };
}
