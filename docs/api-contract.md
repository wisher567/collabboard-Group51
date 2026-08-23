# CollabBoard — API Contract

All endpoints are prefixed with `http://localhost:5000/api`.
Routes marked 🔒 require an `Authorization: Bearer <token>` header (JWT issued at login).

## Auth

### POST /api/auth/register
Register a new user.

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "mypassword123"
}
```

**Response** `201 Created`
```json
{
  "message": "User registered successfully",
  "user": { "id": "u1", "email": "user@example.com" }
}
```

### POST /api/auth/login
Log in an existing user.

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "mypassword123"
}
```

**Response** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "u1", "email": "user@example.com" }
}
```

## Boards 🔒

### GET /api/boards/:id
Get a single board with its columns and tasks.

**Response** `200 OK`
```json
{
  "id": "b1",
  "title": "Sprint Planning",
  "columns": [
    {
      "id": "c1",
      "title": "To Do",
      "tasks": [{ "id": "t1", "title": "Design login page" }]
    }
  ]
}
```

### POST /api/boards
Create a new board.

**Request Body**
```json
{ "title": "New Project Board" }
```

**Response** `201 Created`
```json
{
  "id": "b2",
  "title": "New Project Board",
  "columns": []
}
```

### PATCH /api/boards/:id
Update a board (e.g. rename it).

**Request Body**
```json
{ "title": "Updated Board Name" }
```

**Response** `200 OK`
```json
{ "id": "b1", "title": "Updated Board Name" }
```

## Tasks 🔒

### POST /api/boards/:boardId/tasks
Create a new task on a board.

**Request Body**
```json
{ "title": "Write unit tests", "columnId": "c1" }
```

**Response** `201 Created`
```json
{
  "id": "t2",
  "title": "Write unit tests",
  "columnId": "c1",
  "boardId": "b1"
}
```

### PATCH /api/tasks/:id
Update a task, including moving it between columns.

**Request Body**
```json
{ "columnId": "c2" }
```

**Response** `200 OK`
```json
{
  "id": "t1",
  "title": "Design login page",
  "columnId": "c2",
  "boardId": "b1"
}
```

### DELETE /api/tasks/:id
Delete a task.

**Response** `204 No Content`

## Notes
- Protected routes (Boards, Tasks) require a valid JWT in the `Authorization: Bearer <token>` header.
- Missing or invalid tokens return `401 Unauthorized`.