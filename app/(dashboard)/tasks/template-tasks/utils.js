export function filterTemplateTasks(tasks, search, selectedTemplate) {
  const normalizedSearch = search.trim().toLowerCase();

  const normalizedSelectedTemplate = String(selectedTemplate)
    .trim()
    .toLowerCase();

  return tasks.filter((task) => {
    const normalizedTaskTemplate = String(task.templateName ?? "")
      .trim()
      .toLowerCase();

    const matchesTemplate =
      normalizedSelectedTemplate === "all" ||
      normalizedTaskTemplate === normalizedSelectedTemplate;

    const matchesSearch =
      normalizedSearch === "" ||
      [task.taskName, task.templateName, task.responsibility]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .trim()
            .toLowerCase()
            .includes(normalizedSearch)
        );

    return matchesTemplate && matchesSearch;
  });
}

export function sortTemplateTasks(tasks, sortBy, sortDirection) {
  if (!sortBy) return tasks;

  return [...tasks].sort((a, b) => {
    const first = a[sortBy] ?? "";
    const second = b[sortBy] ?? "";

    if (typeof first === "number" && typeof second === "number") {
      return sortDirection === "asc" ? first - second : second - first;
    }

    return sortDirection === "asc"
      ? String(first).localeCompare(String(second))
      : String(second).localeCompare(String(first));
  });
}

export function paginateTemplateTasks(tasks, page, pageSize) {
  const start = (page - 1) * pageSize;
  return tasks.slice(start, start + pageSize);
}
