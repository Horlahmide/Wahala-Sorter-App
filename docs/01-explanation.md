# How Wahala Sorter Works (Explained for a 7-Year-Old!)

Imagine you are building a giant LEGO castle. You have a lot of pieces and you need a system to organize them. The **Wahala Sorter** codebase is like a set of instructions for building a magic sorting table for your chores and homework!

Here is how every single piece of our magic table works, file by file:

## 1. The Rules and Labels (`src/types/index.ts`)
Before we play a game, we need rules and labels.

*   `ColumnId`: This is a strict rule saying, "We only have three buckets for our toys: 'now', 'soon', and 'later'." You can't put a toy in a bucket called 'maybe'.
*   `Task`: This is a label we stick on every single chore. It says:
    *   `id`: A secret spy code so we never confuse two chores that have the same name.
    *   `title`: The name of the chore (like "Clean my room").
    *   `status`: Which bucket it is inside right now.
    *   `createdAt`: The exact time and date we wrote the chore down.

## 2. The Brain and Memory (`src/hooks/useTaskStore.ts`)
This is the brain of our app. It remembers everything, even if you close the magic table and come back tomorrow!

*   `useState(tasks)`: This is the brain's short-term memory. It holds all the tasks you are looking at right now.
*   `window.localStorage.getItem / setItem`: This is the brain's secret diary. Every time you change a task, it writes it down in this diary (`localStorage`) so it doesn't forget when you turn off the computer.
*   `useEffect`: This is a little robot that watches your tasks. Whenever a task changes, it tells the diary robot to write it down.
*   `addTask`: A magic spell to create a brand new task. It gives the task a secret spy code (`uuidv4()`), writes down the time, and drops it into a bucket.
*   `updateTaskStatus`: A spell to move a task from one bucket to another (like from "Soon" to "Now").
*   `deleteTask`: A spell that makes a task go *poof* and disappear forever!
*   `reorderTasks`: A spell that lets you shuffle the tasks inside the same bucket, like rearranging your toy cars in a line.

## 3. The Building Blocks (UI Primitives)
These are your basic LEGO bricks. You use them everywhere!

### The Button (`src/components/ui/Button.tsx`)
*   `interface ButtonProps`: This is the instruction manual for the button. It says you can change its color (`variant`) or its size.
*   `forwardRef`: A tricky way to let other parts of the app point a laser pointer exactly at this button.
*   `className`: This changes the paint on the button depending on if you want it to be "primary" (bright and colorful) or "ghost" (invisible until you touch it).
*   `<button>`: The actual HTML LEGO piece that you can click with your mouse!

### The Text Box (`src/components/ui/Input.tsx`)
*   This is just a blank piece of paper where you can type words. It also has an instruction manual (`InputProps`) that lets us make it super wide (`fullWidth`) if we need to type a really long sentence.

## 4. The Magic Parts of the Board

### The Task Card (`src/features/tasks/TaskCard.tsx`)
This is a sticky note with your chore written on it. But it's magical—you can pick it up!
*   `useSortable`: This is a superpower from our magic toolkit (`dnd-kit`). It gives the sticky note the ability to be grabbed and dragged around the screen!
*   `isDragging`: This asks, "Is someone holding me right now?" If yes, the sticky note becomes a little ghost (transparent) so you can see where you are dropping it.
*   `onDelete`: The tiny trash can button. If you click it, it shouts to the Brain, "Hey, delete me!"
*   `dragHandle`: A tiny spot with dots on the card. This is where you have to pinch the sticky note to pick it up.

### The Add Task Form (`src/features/tasks/AddTaskForm.tsx`)
This is a magic button that turns into a typing box.
*   `isExpanded`: This is a light switch. If it's OFF (false), you just see a button that says "Add Task". If you click it, the switch turns ON (true), and the button transforms into a text box!
*   `handleSubmit`: When you press "Save", this checks if you actually typed something. If you did, it sends the words to the Brain to create a new task, and then turns the switch back OFF.
*   `handleCancel`: If you change your mind, this turns the switch OFF and forgets what you were typing.

### The Bucket (`src/features/tasks/Column.tsx`)
This is one of the three buckets ("Now", "Soon", "Later").
*   `useDroppable`: Another superpower! It tells the computer, "Hey, I am a bucket! You can drop sticky notes inside me!"
*   `isOver`: This asks, "Is a sticky note hovering right above me?" If yes, the bucket lights up a little bit to say, "Drop it here!"
*   `SortableContext`: This is a rulebook for the bucket. It tells the bucket how to keep its sticky notes in a neat, straight vertical line.
*   `tasks.map(...)`: This is a factory machine. It takes a list of tasks and prints out a magic `TaskCard` for every single one.

### The Big Table (`src/features/tasks/Board.tsx`)
This is the giant wooden table where you place your three buckets.
*   `DndContext`: This is the gravity and physics of our magic table. It controls everything about dragging and dropping. Without this, the sticky notes would just be glued to the table.
*   `sensors`: These are the eyes of the table. They watch your mouse pointer or your keyboard to see if you are trying to pick something up.
*   `handleDragStart`: When you first pick up a sticky note, the table remembers *which* sticky note you are holding (`setActiveTask`).
*   `handleDragOver`: While you are flying the sticky note through the air, the table watches to see if you cross into a new bucket. If you do, it automatically updates the sticky note's label to match the new bucket!
*   `handleDragEnd`: When you let go of the mouse button, the table checks exactly where you dropped it, locks it into place, and forgets that you were holding it.
*   `DragOverlay`: This is a cool trick. When you pick up a card, the original card stays in its place as a ghost, and the table creates a *clone* of the card that follows your mouse around so it looks like you are carrying it!

## 5. The Front Door (`src/App.tsx` and `src/main.tsx`)
*   `App.tsx`: This is the room where the giant wooden table (`Board`) lives.
*   `main.tsx`: This is the front door to the house. It's the very first thing the computer reads. It unlocks the door, walks into the room, and puts the `App` on your computer screen so you can play with it!
