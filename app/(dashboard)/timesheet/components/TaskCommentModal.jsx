"use client";

import { X, MessageSquare } from "lucide-react";

export default function TaskCommentModal({
  open,
  task,
  commentText,
  setCommentText,
  onClose,
  onSubmit,
  loading = false,
  error = null,
}) {
  if (!open || !task) {
    return null;
  }

  const plannedHours = Object.values(
    task.planned || {}
  ).reduce(
    (sum, value) => sum + (Number(value) || 0),
    0
  );

  const actualHours = Object.values(
    task.actual || {}
  ).reduce(
    (sum, value) => sum + (Number(value) || 0),
    0
  );

  const difference = actualHours - plannedHours;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-background shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-[#E12729]">
              <MessageSquare size={18} />
            </div>

            <div>
              <h2 className="text-base font-semibold">
                Comment on Task
              </h2>

              <p className="text-xs text-muted-foreground">
                Raise an issue with the Project Manager
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X size={20} />
          </button>

        </div>


        {/* BODY */}
        <div className="space-y-5 p-5">

          {/* TASK */}
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Task
            </label>

            <div className="mt-1 rounded-lg border border-border bg-muted/30 p-3">

              <p className="text-sm font-semibold">
                {task.title}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Task ID: #{task.id}
              </p>

            </div>
          </div>


          {/* HOURS */}
          <div className="grid grid-cols-3 gap-3">

            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">
                Planned
              </p>

              <p className="mt-1 text-base font-semibold">
                {plannedHours.toFixed(2)} hrs
              </p>
            </div>


            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">
                Actual
              </p>

              <p className="mt-1 text-base font-semibold">
                {actualHours.toFixed(2)} hrs
              </p>
            </div>


            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">
                Difference
              </p>

              <p
                className={`mt-1 text-base font-semibold ${
                  difference > 0
                    ? "text-[#E12729]"
                    : difference < 0
                    ? "text-amber-600"
                    : "text-green-600"
                }`}
              >
                {difference > 0 ? "+" : ""}
                {difference.toFixed(2)} hrs
              </p>
            </div>

          </div>


          {/* COMMENT */}
          <div>

            <label className="text-sm font-medium">
              Comment
            </label>

            <textarea
              value={commentText}
              onChange={(e) =>
                setCommentText(e.target.value)
              }
              placeholder="Explain why the allocated hours were not sufficient or why additional time was required..."
              rows={5}
              className="mt-2 w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-[#E12729] focus:ring-2 focus:ring-[#E12729]/20"
            />

            <p className="mt-1 text-xs text-muted-foreground">
              This comment will be shared with the Project Manager.
            </p>

          </div>


          {/* ERROR */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

        </div>


        {/* FOOTER */}
        <div className="flex justify-end gap-3 border-t border-border px-5 py-4">

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
          >
            Cancel
          </button>


          <button
  type="button"
  disabled={
    loading ||
    !commentText.trim()
  }
  onClick={onSubmit}
  className="rounded-lg bg-[#E12729] px-5 py-2 text-sm font-medium text-white hover:bg-[#c91f21] disabled:cursor-not-allowed disabled:opacity-50"
>
  {loading
    ? "Sending..."
    : "Send Comment"}
</button>

        </div>

      </div>

    </div>
  );
}