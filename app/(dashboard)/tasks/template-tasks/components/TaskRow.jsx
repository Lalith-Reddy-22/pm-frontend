"use client";

import { Button } from "@/components/ui/button";

export default function TaskRow({ task, onAddTask, isStriped }) {
  return (
    <tr className={`transition-colors ${isStriped ? "bg-muted/50" : "bg-card"} hover:bg-accent/30`}>
      <td className="px-6 py-3 text-sm text-foreground font-medium">{task.taskName}</td>
      <td className="px-6 py-3 text-sm text-muted-foreground">{task.templateName}</td>
      <td className="px-6 py-3 text-sm text-muted-foreground">{task.responsibility}</td>
      <td className="px-6 py-3 text-sm text-muted-foreground">{task.actualHours}</td>
      <td className="px-6 py-3 text-right">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onAddTask?.(task)}
          className="border-[#E12729] text-[#E12729] hover:bg-[#fee2e2]"
        >
          Add Task
        </Button>
      </td>
    </tr>
  );
}
