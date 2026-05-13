# Software Engineering Principles in Wahala Sorter

Here is a breakdown of the core software engineering principles applied throughout the Wahala Sorter codebase, explained in plain language, along with exact code examples.

## 1. Single Responsibility Principle (SRP)

**What it means in plain words:** 
Every file, function, or component should have exactly one job and one reason to change. Imagine a restaurant: the chef only cooks, the waiter only serves, and the cashier only takes money. If someone tries to do all three, things get messy and people make mistakes.

**Where it appears in our code:**
The `useTaskStore` hook (`src/hooks/useTaskStore.ts`) has only one responsibility: managing the task data and saving it. It does not draw any buttons, lists, or cards on the screen. 

*Lines 8-65 in `src/hooks/useTaskStore.ts`:*
```typescript
export function useTaskStore() {
  const [tasks, setTasks] = useState<Task[]>(...)
  // ... state management logic ...
  return { tasks, setTasks, addTask, updateTaskStatus, deleteTask, reorderTasks };
}
```

Similarly, our `Button` component (`src/components/ui/Button.tsx`) only cares about rendering a button. It knows absolutely nothing about Tasks or Columns.

## 2. DRY (Don't Repeat Yourself)

**What it means in plain words:**
If you find yourself writing the exact same code more than twice, you should turn it into a reusable piece. If you need to change how it works later, you only have to change it in one place instead of hunting down twenty different copies scattered across your project.

**Where it appears in our code:**
Instead of writing `#8069bf` everywhere we need our primary color, we defined it once as a CSS Variable. If we ever want to change our brand color to a completely different shade, we only change line 39 in `index.css`.

*Lines 38-41 in `src/index.css`:*
```css
  /* Custom Accents mentioned in the design doc */
  --color-now-accent: #8069bf;
  --color-soon-accent: #7c7296;
  --color-later-accent: #cbc4d2;
```

Another example is the reusable `Button` component being used multiple times inside `AddTaskForm.tsx` instead of rewriting `<button className="...">` over and over.

*Lines 45-51 in `src/features/tasks/AddTaskForm.tsx`:*
```typescript
      <div className={styles.actions}>
        <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="sm" disabled={!title.trim()}>
          Save
        </Button>
      </div>
```

## 3. Immutability

**What it means in plain words:**
Instead of changing or breaking an existing object, you make a brand new copy of it with your modifications. Think of it like a printed document: instead of scribbling over the original with a pen, you print a fresh copy with the new words added. This prevents accidental bugs and makes it easy for the computer to track changes.

**Where it appears in our code:**
When we update a task's status or delete a task, we do not mutate (change) the existing array. We use `.map()` or `.filter()` to create and return a brand-new array.

*Lines 33-39 in `src/hooks/useTaskStore.ts`:*
```typescript
  const updateTaskStatus = useCallback((id: string, newStatus: ColumnId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task,
      ),
    );
  }, []);
```
Notice the `{ ...task, status: newStatus }`? We are taking the old task, making a clone of it using the spread (`...`) operator, and just overwriting the `status` property.

## 4. Separation of Concerns (SoC)

**What it means in plain words:**
Similar to SRP, this principle dictates that an application should be separated into distinct sections, where each section handles a specific part of the application's overall behavior. We separate Data (State), Presentation (UI Layout), and Styling (Visuals).

**Where it appears in our code:**
Look at how a Column is built. The logic and HTML markup are in `Column.tsx`, while the visual styling is completely separated into `Column.module.css`.

*Lines 25-28 in `src/features/tasks/Column.tsx`:*
```typescript
  const columnClass = `${styles.column} ${styles[id]} ${isOver ? styles.isOver : ''}`;

  return (
    <div className={columnClass} ref={setNodeRef}>
```
The React file doesn't know *what* color the border is or how wide the column should be, it just knows to ask the CSS module for `styles.column`.

## 5. Encapsulation (Information Hiding)

**What it means in plain words:**
Hiding the complex, messy details of how something works behind a simple interface. When you drive a car, you just turn the steering wheel and press the pedals; you don't need to know how the gears, axles, and engine block interact to make the car move.

**Where it appears in our code:**
The `Board.tsx` component needs to save tasks so they aren't lost when the user refreshes the page. However, `Board.tsx` doesn't know *anything* about `window.localStorage` or `JSON.stringify`. All of that complex logic is hidden (encapsulated) inside `useTaskStore`.

*Lines 19-21 in `src/hooks/useTaskStore.ts` (The Hidden Engine):*
```typescript
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);
```

*Line 27 in `src/features/tasks/Board.tsx` (The Steering Wheel):*
```typescript
  const { tasks, addTask, updateTaskStatus, deleteTask, reorderTasks } = useTaskStore();
```
The Board simply asks the store for `tasks` and gets them, completely unaware of the localStorage magic happening behind the scenes.
