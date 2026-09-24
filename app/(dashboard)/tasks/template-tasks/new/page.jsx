"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Eye, Plus, UploadCloud } from "lucide-react";

export default function NewTemplateTaskPage() {
  const [templateName, setTemplateName] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setSelectedFileName(file ? file.name : "");
  };

  const handleShowFileData = () => {
    if (!selectedFileName) {
      toast.error("Please select file");
      return;
    }

    // TODO: Implement file preview or parsing logic here.
  };

  return (
    <div className="w-full space-y-6 p-6">
      <div className="rounded-md border border-border bg-white p-8 shadow-lg shadow-black/5">
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-md font-semibold text-muted-foreground">
              Template Name
            </label>
            <input
              type="text"
              value={templateName}
              onChange={(event) => setTemplateName(event.target.value)}
              placeholder="Enter the Template Name"
              className="w-full rounded-md border border-red-200 px-5 py-2 text-sm text-foreground outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100 mt-2"
            />
          </div>

          <div className="rounded-md border border-dashed border-red-200 p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-red-100 text-red-600">
                  <UploadCloud size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-semibold text-foreground">Choose File</p>
                  <p className="text-sm text-muted-foreground">{selectedFileName || "No file chosen"}</p>
                  <p className="text-sm text-muted-foreground">Upload a file to import task details</p>
                </div>
              </div>

              <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-red-300 px-5 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100">
                <UploadCloud size={16} />
                Browse Files
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <button
            type="button"
            onClick={handleShowFileData}
            className="inline-flex items-center gap-2 rounded-md bg-green-100 px-4 py-2 text-sm font-semibold text-green-700 transition"
          >
            <Eye size={16} className="text-green-700" />
            Show File Data
          </button>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
            <Link
              href="/tasks/template-tasks"
              className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold text-slate-700 transition border border-slate-300"
            >
              <ArrowLeft size={16} />
              Back To List
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              <Plus size={16} />
              Create Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
