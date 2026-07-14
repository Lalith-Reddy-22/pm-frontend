"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TaskFilters({ selectedTemplate, templates, onTemplateChange }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-5 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="min-w-[240px]">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Select Template
        </label>
        <Select value={selectedTemplate} onValueChange={onTemplateChange}>
          <SelectTrigger className="h-8 w-full text-sm">
            <SelectValue placeholder="All Templates" />
          </SelectTrigger>
          <SelectContent>
            {templates.map((template) => (
              <SelectItem key={template.value} value={template.value}>
                {template.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
