# Poncelet Workbench Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Poncelet demo into a professional "Workbench" with a dual-pane layout, guided discoveries (milestones), precision controls, and real-time geometric analysis.

**Architecture:** Refactor `App.tsx` and `PonceletDemo.tsx` into a dual-pane workbench. The stage (simulation) will live in the left pane, and a tabbed sidebar for milestones, controls, and analysis will live in the right.

**Tech Stack:** React (TypeScript), Lucide-React, Vanilla CSS.

---

### Task 1: Extend Math Utilities

**Files:**
- Modify: `src/math.ts`
- Test: `src/math.test.ts` (Create if missing)

- [ ] **Step 1: Add Area and Perimeter calculations**

```typescript
// Add to src/math.ts
export function getTriangleProperties(vertices: Complex[]) {
  const [a, b, c] = vertices;
  const sideA = b.sub(c).abs();
  const sideB = a.sub(c).abs();
  const sideC = a.sub(b).abs();
  
  const perimeter = sideA + sideB + sideC;
  const s = perimeter / 2;
  const area = Math.sqrt(s * (s - sideA) * (s - sideB) * (s - sideC));
  
  return { sideA, sideB, sideC, perimeter, area };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/math.ts
git commit -m "math: add triangle properties calculation"
```

### Task 2: Workbench Layout Refactor

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.css`

- [ ] **Step 1: Move PonceletDemo to fill the layout**

Update `App.tsx` to remove the hero and traditional section structure for the playground, making the `PonceletDemo` the "Workbench" experience.

- [ ] **Step 2: Update App.css for full-viewport Workbench**

```css
.workbench-root {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: var(--bg-color);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx src/App.css
git commit -m "ui: refactor to full-viewport workbench layout"
```

### Task 3: PonceletDemo Component Splitting

**Files:**
- Modify: `src/components/PonceletDemo.tsx`
- Create: `src/components/WorkbenchSidebar.tsx`

- [ ] **Step 1: Extract Sidebar logic into WorkbenchSidebar**

Split the controls and status readouts from `PonceletDemo.tsx` into a new `WorkbenchSidebar.tsx` component that receives state and dispatchers as props.

- [ ] **Step 2: Implement Tab Switching**

Add `Milestones`, `Controls`, and `Analysis` tabs to the sidebar.

- [ ] **Step 3: Commit**

```bash
git add src/components/PonceletDemo.tsx src/components/WorkbenchSidebar.tsx
git commit -m "ui: extract sidebar into standalone component with tabs"
```

### Task 4: Milestone Presets (Guided Discovery)

**Files:**
- Modify: `src/components/WorkbenchSidebar.tsx`
- Modify: `src/components/PonceletDemo.tsx`

- [ ] **Step 1: Define Milestones data**

```typescript
const MILESTONES = [
  { id: 'concentric', title: 'Concentric Case', params: { fx: 0.3, fy: 0, gx: -0.3, gy: 0 }, description: 'Set f = -g. The barycenter G remains at the origin.' },
  { id: 'bicentric', title: 'Bicentric Case', params: { fx: 0.3, fy: 0, gx: 0.3, gy: 0 }, description: 'When f = g, the caustic is a circle.' }
];
```

- [ ] **Step 2: Implement Milestone application logic**

Ensure clicking a milestone card updates the workbench state (foci, axes).

- [ ] **Step 3: Commit**

```bash
git add src/components/WorkbenchSidebar.tsx src/components/PonceletDemo.tsx
git commit -m "feat: implement guided discovery milestones"
```

### Task 5: Analysis & Telemetry Tab

**Files:**
- Modify: `src/components/WorkbenchSidebar.tsx`

- [ ] **Step 1: Add Coordinate Table**

Render the $(x, y)$ coordinates for $w_1, w_2, w_3, G, H, O, I$.

- [ ] **Step 2: Add Area and Perimeter readouts**

Display the properties calculated in Task 1.

- [ ] **Step 3: Commit**

```bash
git add src/components/WorkbenchSidebar.tsx
git commit -m "feat: add analysis tab with real-time coordinate telemetry"
```

### Task 6: Export Tools (SVG & CSV)

**Files:**
- Modify: `src/components/PonceletDemo.tsx`
- Modify: `src/components/WorkbenchSidebar.tsx`

- [ ] **Step 1: Implement CSV Export**

Export a snapshot of the current configuration (or a full $\lambda$ cycle) as a CSV file.

- [ ] **Step 2: Commit**

```bash
git add src/components/PonceletDemo.tsx src/components/WorkbenchSidebar.tsx
git commit -m "feat: add research export tools (CSV/SVG)"
```
