import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../../types';
import styles from './TaskCard.module.css';
import { GripVertical, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface TaskCardProps {
  task: Task;
  onDelete?: (id: string) => void;
  isOverlay?: boolean;
}

export function TaskCard({ task, onDelete, isOverlay }: TaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const formattedDate = new Date(task.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  if (isDragging && !isOverlay) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`${styles.card} ${styles.isDraggingSlot}`}
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.card} ${isOverlay ? styles.isOverlay : ''}`}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{task.title}</h3>
        {onDelete && (
          <button
            type="button"
            className={styles.deleteButton}
            onClick={() => onDelete(task.id)}
            aria-label="Delete task"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
      <div className={styles.footer}>
        <span className={styles.date}>{formattedDate}</span>
        <div
          className={styles.dragHandle}
          {...attributes}
          {...listeners}
          aria-label="Drag task"
        >
          <GripVertical size={16} />
        </div>
      </div>
    </div>
  );
}
