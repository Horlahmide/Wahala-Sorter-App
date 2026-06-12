import { useState, useEffect, useCallback } from "react";
import type { Task, ColumnId } from "../types";
import { arrayMove } from "@dnd-kit/sortable";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "wahala_tasks";

// StorageAdapter interface for dependency injection (DIP)
interface StorageAdapter {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
}

export function useTaskStore(
  storage: StorageAdapter = window.localStorage as StorageAdapter,
) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const item = storage.getItem(STORAGE_KEY);
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      storage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [tasks, storage]);

  // Multi-tab sync: Listen for changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setTasks(JSON.parse(e.newValue));
        } catch (error) {
          console.error("Error syncing tasks from another tab:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const addTask = useCallback((title: string, status: ColumnId = "soon") => {
    const newTask: Task = {
      id: uuidv4(),
      title,
      status,
      createdAt: Date.now(),
    };
    setTasks((prev) => [...prev, newTask]);
  }, []);

  const updateTaskStatus = useCallback((id: string, newStatus: ColumnId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task,
      ),
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const reorderTasks = useCallback((activeId: string, overId: string) => {
    setTasks((prev) => {
      const oldIndex = prev.findIndex((t) => t.id === activeId);
      const newIndex = prev.findIndex((t) => t.id === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        return arrayMove(prev, oldIndex, newIndex);
      }
      return prev;
    });
  }, []);

  return {
    tasks,
    setTasks,
    addTask,
    updateTaskStatus,
    deleteTask,
    reorderTasks,
  };
}
