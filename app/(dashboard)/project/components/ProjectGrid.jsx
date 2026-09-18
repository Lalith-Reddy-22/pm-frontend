"use client";

export default function ProjectGrid() {
  return (
    <div className="grid grid-cols-4 gap-4 p-6">
      <div className="rounded-xl border p-5 shadow-sm">
        Project Card 1
      </div>

      <div className="rounded-xl border p-5 shadow-sm">
        Project Card 2
      </div>

      <div className="rounded-xl border p-5 shadow-sm">
        Project Card 3
      </div>

      <div className="rounded-xl border p-5 shadow-sm">
        Project Card 4
      </div>
    </div>
  );
}