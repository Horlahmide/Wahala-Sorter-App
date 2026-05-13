# Lie Detector: How I Identified the False Statement

## The Challenge

Given five statements about the Wahala Sorter codebase, identify which one is a lie.

---

## The Five Statements

Here are the five statements you need to evaluate. Four are true, one is a lie:

1. **The AddTaskForm component has no client-side validation limiting task title length, making it vulnerable to localStorage overflow attacks.**

2. **The useTaskStore hook saves to localStorage on every state change without debouncing, which can cause performance issues with large task lists.**

3. **Task objects store a unique `timestamp` field that updates every time a task is moved between columns.**

4. **The drag handle in TaskCard.tsx is implemented as a `<div>` element with an aria-label, making it inaccessible to keyboard users.**

5. **The app initializes by reading from localStorage with a try-catch block, gracefully falling back to an empty array if parsing fails.**

---

## My Deduction Process

### Statement #1: ✅ **TRUE**

**Claim**: "The AddTaskForm component has no client-side validation limiting task title length, making it vulnerable to localStorage overflow attacks."

**My Evidence**:

- From the audit I conducted in [03-audit.md](../docs/03-audit.md), I identified this exact vulnerability under "Security & Stability"
- Cross-referenced with [AddTaskForm.tsx](../src/features/tasks/AddTaskForm.tsx#L20-L28)
- Confirmed: There is no `maxLength` attribute and no length check before calling `onAdd()`
- **Verdict: TRUE** ✓

---

### Statement #2: ✅ **TRUE**

**Claim**: "The useTaskStore hook saves to localStorage on every state change without debouncing, which can cause performance issues with large task lists."

**My Evidence**:

- From the audit in [03-audit.md](../docs/03-audit.md), I identified this as a "Performance Trap"
- The audit specifically mentions: "JSON.stringify and localStorage.setItem are synchronous operations"
- Cross-referenced with [useTaskStore.ts](../src/hooks/useTaskStore.ts#L18-L20):
  ```typescript
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);
  ```
- Confirmed: No debouncing delay; saves on every `tasks` state change
- **Verdict: TRUE** ✓

---

### Statement #3: ❌ **LIE** (The Answer)

**Claim**: "Task objects store a unique `timestamp` field that updates every time a task is moved between columns."

**My Evidence**:

- Checked the Task interface in [src/types/index.ts](../src/types/index.ts):
  ```typescript
  export interface Task {
    id: string;
    title: string;
    status: ColumnId;
    createdAt: number;
  }
  ```
- **Red Flag #1**: No `timestamp` field exists. Only `createdAt` field exists.
- **Red Flag #2**: `createdAt` is set once during task creation in [useTaskStore.ts](../src/hooks/useTaskStore.ts#L36-L40) and **never modified**
- **Red Flag #3**: When tasks move between columns, only the `status` field changes via `updateTaskStatus()`, not any time-related fields
- **Verdict: LIE** ✗

This statement is fabricated. There is no timestamp field, and the only time data (createdAt) is static, not dynamic.

---

### Statement #4: ✅ **TRUE**

**Claim**: "The drag handle in TaskCard.tsx is implemented as a `<div>` element with an aria-label, making it inaccessible to keyboard users."

**My Evidence**:

- From the audit in [03-audit.md](../docs/03-audit.md), I identified this as an accessibility miss under "Additional Issues"
- Cross-referenced with [TaskCard.tsx](../src/features/tasks/TaskCard.tsx#L69-L73):
  ```tsx
  <div
    className={styles.dragHandle}
    {...attributes}
    {...listeners}
    aria-label="Drag task"
  >
    <GripVertical size={16} />
  </div>
  ```
- Confirmed: It's a `<div>`, not a `<button>`. Keyboard users cannot tab to it.
- **Verdict: TRUE** ✓

---

### Statement #5: ✅ **TRUE**

**Claim**: "The app initializes by reading from localStorage with a try-catch block, gracefully falling back to an empty array if parsing fails."

**My Evidence**:

- Cross-referenced [useTaskStore.ts](../src/hooks/useTaskStore.ts#L8-L17):
  ```typescript
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  });
  ```
- Confirmed: Try-catch block present
- Confirmed: Falls back to empty array `[]` on parse error
- Confirmed: Error is logged to console
- **Verdict: TRUE** ✓

---

## My Lie Detection Strategy

### The Method:

1. **Cross-reference with audit findings** - Statements #1, #2, and #4 were directly from my audit work
2. **Verify against actual code** - Read the source files to confirm each claim
3. **Look for red flags in the wording** - Statement #3 was suspiciously specific about a field that seemed plausible but not standard
4. **Check the data model** - Task interface only has 4 fields; `timestamp` wasn't one of them

### The Key Insight:

The lie was **subtle but detectable** because it was inconsistent with the Task interface. The audit gave me the foundation to recognize domain-specific details, and code review confirmed what's actually there.

---

## Final Answer

| Statement | Verdict    | Why                                                      |
| --------- | ---------- | -------------------------------------------------------- |
| #1        | ✅ TRUE    | No validation; verified in AddTaskForm                   |
| #2        | ✅ TRUE    | No debouncing; verified in useTaskStore                  |
| #3        | ❌ **LIE** | No timestamp field exists; only static createdAt         |
| #4        | ✅ TRUE    | Drag handle is div, not button; verified in TaskCard     |
| #5        | ✅ TRUE    | Try-catch present; verified in useTaskStore (lines 8-17) |

**The Lie: Statement #3**

---

## What This Taught Me

✨ **Key Learning**: The best way to spot lies in code is to:

- **Know the domain** (audit work gave me this)
- **Read the source of truth** (code never lies)
- **Trust patterns** (Task interface is the source of truth for what fields exist)
- **Cross-reference** (audit + code + types = confident conclusion)

This exercise reinforced that **audits + code reading + type checking = reliable truth detection**.
