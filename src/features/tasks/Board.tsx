import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Column } from "./Column";
import { TaskCard } from "./TaskCard";
import { useTaskStore } from "../../hooks/useTaskStore";
import type { Task, ColumnId } from "../../types";
import styles from "./Board.module.css";

const COLUMNS: { id: ColumnId; title: string }[] = [
  { id: "now", title: "Now" },
  { id: "soon", title: "Soon" },
  { id: "later", title: "Later" },
];

export function Board() {
  const { tasks, addTask, updateTaskStatus, deleteTask, reorderTasks } =
    useTaskStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";
    const isOverColumn = over.data.current?.type === "Column";

    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      const activeTask = tasks.find((t) => t.id === activeId);
      const overTask = tasks.find((t) => t.id === overId);

      if (activeTask && overTask && activeTask.status !== overTask.status) {
        updateTaskStatus(activeId, overTask.status);
      }
    }

    if (isActiveTask && isOverColumn) {
      const activeTask = tasks.find((t) => t.id === activeId);
      if (activeTask && activeTask.status !== overId) {
        updateTaskStatus(activeId, overId as ColumnId);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId !== overId) {
      reorderTasks(activeId, overId);
    }
  };

  return (
    <div className={styles.boardContainer}>
      <header className={styles.boardHeader}>
        <h1 className={styles.boardTitle}>Wahala Sorter</h1>
        <p className={styles.boardSubtitle}>Organize your daily chaos</p>
      </header>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className={styles.columnsContainer}>
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              id={col.id}
              title={col.title}
              tasks={tasks.filter((t) => t.status === col.id)}
              onAddTask={addTask}
              onDeleteTask={deleteTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
