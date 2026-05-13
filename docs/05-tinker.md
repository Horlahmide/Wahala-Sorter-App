# Tinkering Log: The Mystery of useCallback

## The Hypothesis: What Will Break?

**Line selected**: `useCallback` wrapper around `addTask` in [useTaskStore.ts](../src/hooks/useTaskStore.ts#L24)

```typescript
const addTask = useCallback((title: string, status: ColumnId = "soon") => {
  // ...
}, []);
```

**Prediction**: If I remove `useCallback` and make `addTask` a plain function instead, the app will likely still work because the function will still execute correctly. However, I suspected there might be subtle performance issues or potential re-render loops that only become visible under specific conditions (many tasks, rapid clicks, or extensive debugging).

**Expected break points**:

- ❓ Potential unnecessary re-renders of components using `addTask`
- ❓ Possible memory bloat if functions are constantly recreated
- ❓ Maybe dependency arrays in child components start breaking?
- ❓ Or maybe nothing breaks at all (worst case: I learn nothing)

---

## The Experiment: The Change

**What I changed**:
Removed the `useCallback` wrapper and converted `addTask` to a plain, inline function:

```typescript
// BEFORE (with useCallback):
const addTask = useCallback((title: string, status: ColumnId = "soon") => {
  const newTask: Task = {
    id: uuidv4(),
    title,
    status,
    createdAt: Date.now(),
  };
  setTasks((prev) => [...prev, newTask]);
}, []);

// AFTER (without useCallback):
const addTask = (title: string, status: ColumnId = "soon") => {
  const newTask: Task = {
    id: uuidv4(),
    title,
    status,
    createdAt: Date.now(),
  };
  setTasks((prev) => [...prev, newTask]);
};
```

**Scope of change**: Removed `useCallback` wrapper only; kept the function logic identical.

---

## The Observation: What Actually Happened

**Result**: ✅ **Nothing broke. The app worked exactly as before.**

**Testing steps**:

1. Ran the app in dev mode
2. Added multiple tasks
3. Moved tasks between columns
4. Deleted tasks
5. Refreshed the page to verify persistence
6. Tried rapid clicking to add tasks

**Outcome**: All functionality worked flawlessly. No console errors, no re-render loops, no visual glitches, no crashes.

**What I expected to see**: Some kind of performance degradation or broken behavior  
**What I actually saw**: Complete normalcy

---

## The Investigation: What Did I Learn?

After this surprising result, I consulted AI about the purpose of `useCallback` and discovered the hidden performance mechanics at play.

### The Real Problem `useCallback` Solves

**Without `useCallback`:**

- Every time `useTaskStore` executes (which can happen on ANY parent re-render, not just when `tasks` changes)
- A **new, different function object** is created in memory for `addTask`
- This new function has a different identity in JavaScript (different reference)
- If `addTask` is passed as a prop to child components, React sees it as a "new prop"
- Child components might unnecessarily re-render thinking their props changed

**With `useCallback`:**

- The function is created once and cached
- On subsequent renders, as long as the dependency array `[]` hasn't changed, React returns the **same cached function**
- Same function reference = child components see "same props" = no unnecessary re-renders
- Performance stays smooth even with many tasks or rapid updates

### Why It Didn't Break Visibly

The app doesn't currently pass `addTask` as a prop to memoized child components with dependency arrays that would react to function identity changes. The three functions that ARE memoized (`updateTaskStatus`, `deleteTask`, `reorderTasks`) are used directly within the same component, so the reference change doesn't trigger problematic re-renders.

**In other words**: We got lucky. The architecture doesn't yet _require_ `useCallback` to work correctly. But it's a "code smell" - a warning that we're not following React best practices, and the app would break the moment we:

- Pass `addTask` to a memoized child component
- Use `addTask` in a dependency array of `useMemo` or `useEffect`
- Add performance monitoring and notice frame drops with 1000+ tasks

---

## The Gap & The Insight

| Aspect                 | Expected                       | Actual                                                | Lesson                                                              |
| ---------------------- | ------------------------------ | ----------------------------------------------------- | ------------------------------------------------------------------- |
| **Immediate breakage** | High chance                    | Zero chance                                           | React's design is forgiving; performance issues are often invisible |
| **When it matters**    | Unclear to me                  | When memoized children depend on function identity    | `useCallback` is preventative, not curative                         |
| **Visibility**         | Expected to see errors         | Worked perfectly fine                                 | Performance problems hide until you have scale                      |
| **Rule of thumb**      | "Don't use hooks I don't need" | "Use `useCallback` for all functions passed as props" | React hooks are cheap insurance, not optimization overhead          |

### What the Gap Taught Me

1. **React's abstraction is really good** - Removing `useCallback` from a function that isn't passed to memoized children causes zero visible issues. This is intentional design.

2. **Performance problems are silent** - The app felt fast with or without the hook. I would never have known there was "unnecessary function recreation" unless I inspected the code or profiled with DevTools. This is dangerous because it leads to "premature optimization" debates.

3. **The real value of `useCallback`**: It's not about this specific function working right now. It's about:
   - **Preventing future bugs** when code is refactored
   - **Protecting against unexpected dependencies** (if another developer passes this to a memo'd component)
   - **Scaling gracefully** when task count hits 500+

4. **Why my prediction was wrong**: I assumed "if it breaks, I'll see it immediately." But performance is a _spectrum_, not a binary on/off. The app was always slow, I just couldn't see it.

---

## The Technical Underneath

Here's what actually happens microscopically:

**Without `useCallback`** - Every render cycle:

```
1. useTaskStore() executes
2. Creates NEW function addTask_v1
3. Returns { addTask: addTask_v1 }
4. Board component receives addTask_v1
5. Board passes to AddTaskForm
6. If AddTaskForm is memo'd and checks props.addTask...
   → Sees "new" function → re-renders unnecessarily
7. Next render:
   → Creates NEW function addTask_v2 (different reference!)
   → Child sees "changed prop" → re-renders again
```

**With `useCallback`** - Every render cycle:

```
1. useTaskStore() executes
2. Checks: "Did the dependency array [] change?"
3. Nope → return cached addTask from last time
4. Returns { addTask: SAME_CACHED_FUNCTION }
5. Board component receives same function reference
6. Child components see "same prop" → no re-render
```

---

## Conclusion: The Wisdom Gained

**My original prediction was incomplete.** I expected to see a crash or obvious bug. What I learned instead is that:

- ✅ `useCallback` is a **best practice**, not a bug fix
- ✅ Missing it doesn't break code; it wastes CPU cycles invisibly
- ✅ The performance impact is proportional to complexity (more memoized children = bigger impact)
- ✅ It's cheap to add preventatively; expensive to debug why a suddenly-slow app has re-render storms

**In the Wahala Sorter app specifically**: Right now, removing `useCallback` causes zero user-facing issues. But when we scale to 1,000+ tasks or add memoized components, we'll wonder why the drag-and-drop feels sluggish. The answer will be in code we changed today.

**The lesson**: Some bugs aren't about breaking functionality—they're about breaking **efficiency**. And those are the hardest to spot, which is exactly why tools like `useCallback` exist.

---

## Code Reversion

**Decision**: Put `useCallback` back. It's a $0 performance insurance policy.

```typescript
const addTask = useCallback((title: string, status: ColumnId = "soon") => {
  const newTask: Task = {
    id: uuidv4(),
    title,
    status,
    createdAt: Date.now(),
  };
  setTasks((prev) => [...prev, newTask]);
}, []);
```

This tinker taught me that **invisible performance problems are the most dangerous kind**.
