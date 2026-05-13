# Codebase Audit: Finding the Cracks in Our Foundation

Hello again! Building software is a lot like building a house. At first glance, everything might look sturdy, the paint is fresh, and the doors open smoothly. But a true master builder knows they need to inspect the foundation, the plumbing, and the electrical wiring to ensure the house stands the test of time. 

Today, we are going to put on our inspector hats and audit the Wahala Sorter codebase. We'll look for security holes, performance traps, accessibility blind spots, and architectural shortcuts we took. Then, we'll learn exactly how to fix them!

---

## 1. Vulnerabilities (Security & Stability)

### The Trap: Local Storage Overflow (Local DoS)
In `AddTaskForm.tsx`, we accept whatever the user types into the input box:
```tsx
const handleSubmit = (e: FormEvent) => {
  if (title.trim()) {
    onAdd(title.trim());
  }
};
```
**Why it's a problem:** We aren't limiting the length of the task title! A user (or a malicious script) could paste a 50-megabyte book into the input. Since `useTaskStore` blindly saves this to `window.localStorage`, and browsers only allow around 5MB of local storage, the app will crash and throw a `QuotaExceededError`, completely breaking the app for the user.

**The Fix:** 
We need to enforce validation and bounds checking on user input.
```tsx
// Inside AddTaskForm.tsx
const handleSubmit = (e: FormEvent) => {
  e.preventDefault();
  const trimmedTitle = title.trim();
  
  if (trimmedTitle.length > 200) {
    alert("Whoa there! Keep it under 200 characters.");
    return;
  }
  
  if (trimmedTitle) {
    onAdd(trimmedTitle);
    // ...
  }
};
```
*Why this works:* We are acting as a bouncer at the door, ensuring that only reasonably sized data enters our application's "brain," protecting our storage limits.

---

## 2. Performance Traps

### The Trap: Synchronous, Heavy I/O on the Main Thread
Take a look at how we save data in `useTaskStore.ts`:
```typescript
useEffect(() => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}, [tasks]);
```
**Why it's a problem:** `JSON.stringify` and `localStorage.setItem` are *synchronous* operations. This means the browser literally freezes everything else (animations, scrolling, typing) until it finishes saving. If the user has 1,000 tasks, and they drag a card (updating the state 60 times a second), the browser will stutter terribly because it's trying to rewrite a massive JSON string to the hard drive on every frame.

**The Fix:**
We should **debounce** the save operation. Debouncing means saying, "Wait until the user stops making changes for 500 milliseconds, and *then* save."

```typescript
useEffect(() => {
  const timeoutId = setTimeout(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, 500); // Wait half a second

  return () => clearTimeout(timeoutId); // Cancel the save if they drag again!
}, [tasks]);
```
*Why this works:* By clearing the timeout if `tasks` changes rapidly, we only perform the heavy lifting once the user takes a breath, keeping our drag-and-drop animations buttery smooth at 60FPS.

---

## 3. Accessibility (a11y) Misses

### The Trap: Ambiguous Screen Reader Labels
In `TaskCard.tsx`, we added an `aria-label` to the delete button:
```tsx
<button aria-label="Delete task" onClick={() => onDelete(task.id)}>
```
**Why it's a problem:** Imagine a user who relies on a screen reader (a tool that reads the screen out loud for visually impaired users) tabbing through a column of 10 tasks. They will hear: *"Button, Delete task. Button, Delete task. Button, Delete task."* They have no idea *which* task they are about to delete!

**The Fix:**
Make the labels dynamic and descriptive.
```tsx
<button aria-label={`Delete task: ${task.title}`} onClick={() => onDelete(task.id)}>
```
*Why this works:* Now the screen reader will announce: *"Button, Delete task: Clean my room."* giving the user complete confidence and context about what action they are taking.

---

## 4. Software Engineering Principles Violated

### The Violation: Dependency Inversion Principle (DIP)
*(The 'D' in the famous SOLID principles)*

**The Rule:** High-level logic (like our task manager) shouldn't depend on low-level details (like the browser's hard drive). They should both depend on abstractions.

**Where we broke it:**
In `useTaskStore.ts`, we directly hardcoded `window.localStorage`.
```typescript
const item = window.localStorage.getItem(STORAGE_KEY);
```
**Why it's a problem:** What if we want to run automated tests on our hook? Node.js doesn't have `window.localStorage`, so our tests will crash! What if next month our boss says, "We need to save tasks to a cloud database instead of the browser"? We'd have to rip open `useTaskStore.ts` and rewrite the core logic. Our code is rigidly glued to the browser.

**The Fix:**
We should inject the storage mechanism as a dependency.
```typescript
// Define an abstraction (a contract)
interface StorageAdapter {
  get: (key: string) => string | null;
  set: (key: string, value: string) => void;
}

// Our hook now accepts any storage adapter that follows the contract!
export function useTaskStore(storage: StorageAdapter = window.localStorage) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const item = storage.get(STORAGE_KEY);
    // ...
  });
  
  useEffect(() => {
    storage.set(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, storage]);
}
```
*Why this works:* We have decoupled our logic from the browser! Now, if we want to test our hook, we can pass it a fake `MockStorage`. If we want to move to the cloud, we pass it an `ApiStorageAdapter`. The hook doesn't care *where* the data goes, as long as the adapter knows how to `get` and `set`. This makes our code infinitely more flexible and testable!
