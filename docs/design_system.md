---
name: Wahala Sorter
colors:
  surface: "#fdf8ff"
  surface-dim: "#ddd8e0"
  surface-bright: "#fdf8ff"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#f7f2fa"
  surface-container: "#f1ecf4"
  surface-container-high: "#ebe6ee"
  surface-container-highest: "#e6e1e9"
  on-surface: "#1c1b20"
  on-surface-variant: "#494551"
  inverse-surface: "#312f35"
  inverse-on-surface: "#f4eff7"
  outline: "#7a7582"
  outline-variant: "#cbc4d2"
  surface-tint: "#6750a4"
  primary: "#4f388a"
  on-primary: "#ffffff"
  primary-container: "#6750a4"
  on-primary-container: "#e0d2ff"
  inverse-primary: "#cfbdff"
  secondary: "#63597c"
  on-secondary: "#ffffff"
  secondary-container: "#e0d4fd"
  on-secondary-container: "#635a7c"
  tertiary: "#765b00"
  on-tertiary: "#ffffff"
  tertiary-container: "#c9a74d"
  on-tertiary-container: "#503d00"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#e9ddff"
  primary-fixed-dim: "#cfbdff"
  on-primary-fixed: "#22005d"
  on-primary-fixed-variant: "#4e378a"
  secondary-fixed: "#e8ddff"
  secondary-fixed-dim: "#cdc0e8"
  on-secondary-fixed: "#1e1635"
  on-secondary-fixed-variant: "#4a4263"
  tertiary-fixed: "#ffdf93"
  tertiary-fixed-dim: "#e7c365"
  on-tertiary-fixed: "#241a00"
  on-tertiary-fixed-variant: "#594400"
  background: "#fdf8ff"
  on-background: "#1c1b20"
  surface-variant: "#e6e1e9"
typography:
  display:
    fontSize: 32px
    fontWeight: "600"
    lineHeight: "1.2"
    letterSpacing: -0.02em
  h1:
    fontSize: 24px
    fontWeight: "600"
    lineHeight: "1.3"
    letterSpacing: -0.01em
  h2:
    fontSize: 20px
    fontWeight: "600"
    lineHeight: "1.4"
  body-lg:
    fontSize: 16px
    fontWeight: "400"
    lineHeight: "1.6"
  body-md:
    fontSize: 14px
    fontWeight: "400"
    lineHeight: "1.5"
  body-sm:
    fontSize: 13px
    fontWeight: "400"
    lineHeight: "1.5"
  label-md:
    fontSize: 12px
    fontWeight: "500"
    lineHeight: "1.2"
    letterSpacing: 0.05em
  code:
    fontFamily: Geist Mono
    fontSize: 13px
    fontWeight: "400"
    lineHeight: "1.4"
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
---

## Brand & Style

This design system is built to provide mental respite in a high-velocity environment. It prioritizes clarity over decoration, using a "Warm Minimalism" approach to reduce cognitive load. The aesthetic avoids the coldness of traditional enterprise software by introducing organic, earthy undertones that feel human and approachable.

The visual language is flat and modern, utilizing structural integrity and intentional whitespace to create a sense of order. By focusing on soft transitions and a grounded color palette, the system transforms chaotic task lists into a manageable, linear flow.

## Colors

The palette departs from standard "SaaS Blue" in favor of a warm indigo primary and a canvas of off-whites and bone-greys. This creates a high-readability environment that is easy on the eyes during long coding or study sessions.

- **Background & Surface:** Use the off-white surface colors for the main app background to reduce glare. Pure white is reserved for elevated containers and active input fields.
- **Primary Accent:** A refined indigo (`#8069bf`) is used for primary actions and the "Now" state, providing a clear focal point without being aggressive.
- **Secondary & Tertiary:** Muted lavender-greys (`#7c7296`) and golden-ochre tones (`#c9a74d`) provide functional variety for secondary actions and highlighting specific categories without breaking the calm atmosphere.
- **Semantic Colors:** Success, Warning, and Error tones are slightly desaturated to maintain the calm atmosphere while still conveying necessary urgency.

## Typography

This design system utilizes **Geist** for its technical precision and clean, developer-friendly aesthetic. The typeface's geometric clarity ensures that even dense task lists remain legible.

Hierarchy is established through weight and color rather than drastic size changes. Use `body-md` for the majority of UI text to maximize information density without clutter. Labels use a slight tracking (letter-spacing) increase and medium weight to distinguish them from interactive body text.

## Layout & Spacing

The spacing system relies on an 8px rhythmic grid. This ensures a mathematical harmony across the dashboard.

- **Board Layout:** A horizontal-scroll fluid grid for task columns. Each column has a fixed width on desktop (320px - 360px) to maintain focus, but expands to fill the viewport on mobile devices.
- **Rhythm:** Use `lg` (24px) padding for board containers and `md` (16px) for internal card padding. This "outside-in" reduction in spacing guides the eye toward the content.

## Elevation & Depth

To maintain a flat modern aesthetic, depth is communicated through subtle tonal changes and soft, expansive shadows rather than heavy borders or gradients.

- **Level 0 (Floor):** The background surface. No shadow.
- **Level 1 (Cards/Columns):** White surfaces with a very soft `0px 2px 4px rgba(0,0,0,0.04)` shadow.
- **Level 2 (Active/Drag):** When a task card is picked up, it gains a `0px 12px 24px rgba(0,0,0,0.08)` shadow and a slight 2-degree tilt to simulate physical lifting.
- **Outlines:** Use a 1px border of `outline-variant` for all cards to maintain definition against the off-white background.

## Shapes

The shape language is "Rounded." A consistent corner radius of 0.5rem (default) is applied to task cards and buttons to create a balanced, modern interface. Larger containers, such as the board columns themselves, use 1rem (lg) to create a nested containment feel.

- **Buttons:** 0.5rem radius for a sharp yet accessible look.
- **Cards:** 0.5rem radius for structural stability with a defined edge.
- **Search Inputs:** 0.5rem radius to match the primary component language.
- **Status Pills:** Use "full" (pill-shaped) radius to distinguish metadata from structural components.

## Components

### Task Cards

Cards are the primary unit of the design system. They must feature a 1px border and a Level 1 shadow. Headers within cards use `body-md` bold, and metadata (tags, due dates) use `body-sm`.

### Drag & Drop States

- **Source:** The original slot of the card should show a dashed border of `outline` with a transparent center.
- **Preview:** The card being dragged should be slightly opaque (90%) and scaled up by 2% to indicate it is "above" the UI.
- **Drop Target:** Columns should highlight with a subtle `surface-container` background when a card is hovered over them.

### Board Columns (Now, Soon, Later)

- **Now:** Header uses the `primary` indigo for the title and a vibrant top-border (3px) to indicate immediate priority.
- **Soon:** Header uses `secondary` lavender-grey with a standard 1px border.
- **Later:** Header and content use `on-surface-variant` to visually de-prioritize the column.

### Buttons

- **Primary:** Warm indigo background, white text, no shadow. Hover state: 10% darker indigo.
- **Secondary:** Surface-colored background, 1px border, `on-surface` text.
- **Ghost:** No background or border, `on-surface-variant` text. Used for "Add Task" actions at the bottom of columns.

### Input Fields

Inputs should use the `surface` color with a 1px border. On focus, the border transitions to `primary` with a soft 2px glow of the same color (20% opacity).
