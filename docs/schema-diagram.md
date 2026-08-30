# CollabBoard Database Schema

```text
+---------------------------+
|           User            |
+---------------------------+
| name: String              |
| email: String             |
| passwordHash: String      |
| createdAt: Date           |
| updatedAt: Date           |
+---------------------------+
          ▲           ▲
          │           │
          │           │ assignedTo
          │           │
    createdBy         │
          │           │
          │     +---------------------------+
          │     |           Task            |
          │     +---------------------------+
          │     | title: String             |
          │     | columnId: String          |
          │     | boardId: ObjectId         |
          │     | assignedTo: ObjectId      |
          │     | version: Number            |
          │     | createdAt: Date            |
          │     | updatedAt: Date            |
          │     +---------------------------+
          │                │
          │                │ boardId
          │                ▼
+---------------------------+
|           Board           |
+---------------------------+
| title: String             |
| columns: Array            |
|   ├─ id: String           |
|   └─ title: String        |
| createdBy: ObjectId       |
| createdAt: Date            |
| updatedAt: Date            |
+---------------------------+