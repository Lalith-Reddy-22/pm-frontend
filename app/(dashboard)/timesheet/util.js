export function startOfWeek(date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export function formatMDY(d) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${mm}/${dd}/${d.getFullYear()}`;
}

export function formatPillRange(monday, friday) {
  const optsFull = { month: "long", day: "numeric", year: "numeric" };
  const sameMonth = monday.getMonth() === friday.getMonth();
  const start = monday.toLocaleDateString("en-US", sameMonth ? { month: "long", day: "numeric" } : optsFull);
  const end = friday.toLocaleDateString("en-US", optsFull);
  return `${start} - ${end}`;
}

export function hoursLabel(totalHours) {
  const sign = totalHours < 0 ? "-" : "";
  const abs = Math.abs(totalHours);
  const h = Math.floor(abs);
  const m = Math.round((abs - h) * 60);
  return `${sign}${h}h ${String(m).padStart(2, "0")}m`;
}