import { useState, useEffect, useCallback } from "react";
import type { Task, ColumnId } from "../types";
import { arrayMove } from "@dnd-kit/sortable";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "wahala_tasks";

export function useTaskStore() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // const addTask = useCallback((title: string, status: ColumnId = "soon") => {
  //   const newTask: Task = {
  //     id: uuidv4(),
  //     title,
  //     status,
  //     createdAt: Date.now(),
  //   };
  //   setTasks((prev) => [...prev, newTask]);
  // }, []);

  const addTask = (title: string, status: ColumnId = "soon") => {
    const newTask: Task = {
      id: uuidv4(),
      title,
      status,
      createdAt: Date.now(),
    };
    setTasks((prev) => [...prev, newTask]);
  };

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
