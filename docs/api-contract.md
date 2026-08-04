# CollabBoard — API Contract (Draft)

| Method | Endpoint | Purpose | Request Body | Response |
|--------|----------|---------|---------------|----------|
| POST | /api/auth/register | Register a new user | TODO | TODO |
| POST | /api/auth/login | Log in an existing user | TODO | TODO |
| GET | /api/boards/:id | Get a single board with its columns and tasks | — | TODO |
| POST | /api/boards/:id/tasks | Create a new task on a board | TODO | TODO |
| PATCH | /api/tasks/:id | Update a task (including moving it between columns) | TODO | TODO |
| DELETE | /api/tasks/:id | Delete a task | — | TODO |

## Notes
- All endpoints below `/api/boards` and `/api/tasks` will require a valid JWT once auth middleware is added in M2.
- Request/response shapes are placeholders — these get finalized when the real Express routes are built in M2.
- Moving a task between columns is handled via `PATCH /api/tasks/:id`, updating its `columnId` field (exact field name TBD once the Mongoose schema is built in M3).
