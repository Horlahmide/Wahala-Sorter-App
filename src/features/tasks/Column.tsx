import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task, ColumnId } from '../../types';
import { TaskCard } from './TaskCard';
import { AddTaskForm } from './AddTaskForm';
import styles from './Column.module.css';

interface ColumnProps {
  id: ColumnId;
  title: string;
  tasks: Task[];
  onAddTask: (title: string, columnId: ColumnId) => void;
  onDeleteTask: (taskId: string) => void;
}

export function Column({ id, title, tasks, onAddTask, onDeleteTask }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'Column',
      column: id,
    },
  });

  const columnClass = `${styles.column} ${styles[id]} ${isOver ? styles.isOver : ''}`;

  return (
    <div className={columnClass} ref={setNodeRef}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <span className={styles.count}>{tasks.length}</span>
      </div>

      <div className={styles.content}>
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={onDeleteTask} />
          ))}
        </SortableContext>
        
        <AddTaskForm onAdd={(title) => onAddTask(title, id)} />
      </div>
    </div>
  );
}
