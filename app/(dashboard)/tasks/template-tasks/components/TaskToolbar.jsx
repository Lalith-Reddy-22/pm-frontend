"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

export default function TaskToolbar({
  search,
  onSearchChange,
  selectedTemplate,
  templates,
  onTemplateChange,
}) {
  const router = useRouter();

  const openNewTemplatePage = () => {
    router.push("/tasks/template-tasks/new");
  };
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-5 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by task name, template, or responsibility"
            className="pl-9"
          />
        </div>

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
      </div>

      <div className="flex justify-end ">
        <Button
          className="gap-2 bg-[#E12729] border border-[#E12729] text-white p-4 rounded-lg hover:bg-[#c81f21] border-[#E12729] cursor-pointer" 
          onClick={openNewTemplatePage}
        >
          + Add New Task Template
        </Button>
      </div>
    </div>
  );
}
