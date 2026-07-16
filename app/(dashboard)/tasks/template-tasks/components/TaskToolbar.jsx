"use client";

import Link from "next/link";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function TaskToolbar({
  search,
  onSearchChange,
  selectedTemplate,
  templates,
  onTemplateChange,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
      <div className="flex items-center gap-2">
        <span className="hidden text-sm font-medium text-muted-foreground sm:block">
          Search:
        </span>
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by task name, template, or responsibility"
            className="h-8 w-56 pl-9 text-sm sm:w-72 focus-visible:border-[#E12729] focus-visible:ring-[#E12729]/20"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="min-w-[240px] border border-[#E12729] rounded-lg">
          <Select
            value={selectedTemplate === "all" ? "" : selectedTemplate}
            onValueChange={onTemplateChange}
          >
            <SelectTrigger className="h-8 w-full text-sm">
              <SelectValue placeholder="Select Template" />
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

        <Link href="/tasks/template-tasks/new">
          <Button className="gap-2 bg-[#E12729] border border-[#E12729] text-white text-sm hover:bg-[#c81f21] cursor-pointer">
            + Add New Task Template
          </Button>
        </Link>
      </div>
    </div>
  );
}
