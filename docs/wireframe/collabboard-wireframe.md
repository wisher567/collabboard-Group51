# CollabBoard Wireframe

## Overview

CollabBoard is a web-based Kanban task management application designed to help teams organize and track tasks visually.

## Main Layout

The CollabBoard interface consists of three main areas:

1. Header
2. Kanban Board
3. Task Cards

## Header

The header is placed at the top of the page.

It contains:

- CollabBoard logo/name on the left
- Add Task button on the right
- User profile icon on the right

## Kanban Board

The main board contains three columns arranged side by side:

### 1. To Do

Contains tasks that have not been started yet.

### 2. Doing

Contains tasks that are currently being worked on.

### 3. Done

Contains completed tasks.

## Task Cards

Task cards are displayed vertically inside each column.

Each task card contains:

- Task title
- Assignee
- Priority

## Wireframe Structure

```text
+-----------------------------------------------------------+
| CollabBoard                         + Add Task      User  |
+-----------------------------------------------------------+
|                                                           |
|    TO DO                DOING                DONE          |
|                                                           |
|  +------------+      +------------+      +------------+  |
|  | Task Card  |      | Task Card  |      | Task Card  |  |
|  | Title      |      | Title      |      | Title      |  |
|  | Assignee   |      | Assignee   |      | Assignee   |  |
|  +------------+      +------------+      +------------+  |
|                                                           |
|  +------------+      +------------+      +------------+  |
|  | Task Card  |      | Task Card  |      | Task Card  |  |
|  | Title      |      | Assignee   |      | Assignee   |  |
|  +------------+      +------------+      +------------+  |
|                                                           |
+-----------------------------------------------------------+