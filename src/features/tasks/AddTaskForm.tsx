import { useState, FormEvent, useRef, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Plus, X } from 'lucide-react';
import styles from './AddTaskForm.module.css';

interface AddTaskFormProps {
  onAdd: (title: string) => void;
}

export function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
      setTitle('');
      setIsExpanded(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <Button
        variant="ghost"
        fullWidth
        className={styles.triggerButton}
        onClick={() => setIsExpanded(true)}
      >
        <Plus size={18} />
        <span>Add Task</span>
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <Input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        fullWidth
        className={styles.input}
      />
      <div className={styles.actions}>
        <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="sm" disabled={!title.trim()}>
          Save
        </Button>
      </div>
    </form>
  );
}
