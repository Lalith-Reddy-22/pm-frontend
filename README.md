# Medtrix PM Tool

Medtrix PM Tool is a role-aware project management dashboard for managing projects, clients, employees, tasks, finance data, timesheets, IT requests, and operational reports.

The application is built with Next.js App Router and uses Redux Toolkit, TanStack Query/Table, Axios, Chart.js, Recharts, and Tailwind CSS.

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm
- Access to the Medtrix API (the local fallback is `http://localhost:5234`)

### Install dependencies

```bash
npm install
```

### Configure the API

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5234
```

The API client uses `/api/v1` for authenticated service requests. Use the base URL required by your backend environment.

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser. The dashboard root redirects to the daily reports view after authentication.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## Main Areas

- **Projects and tasks**: project details, task allocation, templates, and project creation
- **Clients and employees**: client records, employee profiles, rate cards, and resource allocation
- **Finance**: finance clients, project lists, rate cards, and buying centers
- **Reports**: daily reports, summary reports, resource allocation, and week utilization
- **Operations**: calendar, timesheets, leave, IT tickets, and asset claims
- **Authentication**: session persistence, role-based navigation, and session timeout handling

## Useful Routes

- `/login` - Sign in
- `/reports/daily-report` - Daily reports
- `/project` - Projects
- `/tasks` - Tasks
- `/employee` - Employees
- `/clients` - Clients
- `/finance` - Finance workspace
- `/calendar` - Calendar
- `/timesheet` - Timesheets

Access to routes is filtered by the authenticated user's role.

## Production

Build and run the production application with:

```bash
npm run build
npm run start
```

Set `NEXT_PUBLIC_API_URL` to the production API base URL before building.
