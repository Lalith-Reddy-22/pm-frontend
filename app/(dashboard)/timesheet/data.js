export const PRIORITY_STYLES = {
  LOW: "bg-sky-500",
  MEDIUM: "bg-amber-500",
  HIGH: "bg-red-600",
};

export const DAY_KEYS = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
];

export const TASKS = [
  {
    id: "66280", title: "PM - Tool App Developement - Revamp", owner: "Stalin B", priority: "MEDIUM",
    planned: { mon: 3, tue: 3, wed: 3, thu: 3, fri: 3 },
    actual:  { mon: 3, tue: 3, wed: 2, thu: 0, fri: 0 },
  },
  {
    id: "58412", title: "PTC Degree Resource Check In Live Site", owner: "Shijin Pulikkotil", priority: "MEDIUM",
    planned: { tue: 2, wed: 7, thu: 8, fri: 0 },
    actual:  { tue: 2, wed: 6.5, thu: 8, fri: 0 },
  },
  {
    id: "58413", title: "Learning and upskilling in backend", owner: "Shijin Pulikkotil", priority: "MEDIUM",
    planned: { tue: 2, wed: 7, thu: 8, fri: 0 },
    actual:  { tue: 2, wed: 6.5, thu: 8, fri: 0 },
  }
];
