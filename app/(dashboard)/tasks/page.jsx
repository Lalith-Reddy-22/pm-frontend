"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import TaskList from "./TaskList";
import { fetchTasks } from "@/store/slices/taskSlice";

export default function TasksPage() {
  const dispatch = useDispatch();

  const [dateRange, setDateRange] = useState({
    from: new Date(2026, 0, 1),
    to: new Date(2026, 11, 31),
  });

  const [search, setSearch] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const {
    tasks,
    loading,
    error,
    totalCount,
    totalPages,
    pageNumber,
    pageSize,
  } = useSelector((state) => state.task);

  function formatDate(date) {
    if (!date) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search);
  }, 500);

  return () => clearTimeout(timer);
}, [search]);

  useEffect(() => {
  const empId = Number(
    sessionStorage.getItem("empId") || 0
  );

  const userType = Number(
    sessionStorage.getItem("userType") || 0
  );

  const startDate = formatDate(dateRange.from);
  const endDate = formatDate(dateRange.to);

  dispatch(
    fetchTasks({
      empId,
      userType,
      startDate,
      endDate,
      searchText: debouncedSearch,
      projectId: null,
      pageNumber: 1,
      pageSize: 10,
    })
  );
}, [
  dispatch,
  dateRange.from,
  dateRange.to,
  debouncedSearch,
]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading tasks...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load tasks.

        <p className="mt-1 text-sm">
          {error}
        </p>
      </div>
    );
  }

  return (
    <TaskList
      tasks={tasks}
      totalCount={totalCount}
      totalPages={totalPages}
      pageNumber={pageNumber}
      pageSize={pageSize}

      dateRange={dateRange}
      setDateRange={setDateRange}

      search={search}
      setSearch={setSearch}
    />
  );
}