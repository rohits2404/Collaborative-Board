# Logic_Document.md

## Smart Assign Implementation

Smart Assign is designed to automatically distribute tasks fairly among users by assigning the selected task to the user with the fewest active (non-completed) tasks.

### How It Works:
1. When a Smart Assign action is triggered for a task:
   - All users are fetched from the database.
   - All tasks with a status other than 'Done' are also fetched.
2. A count is calculated for each user, representing how many tasks they currently have assigned.
3. The user with the lowest task count is selected as the assignee.
4. The task's `assignedTo` field is updated and saved.
5. The action is logged and broadcasted via Socket.IO.

### Example:
Suppose there are 3 users:
- Alice (2 tasks)
- Bob (1 task)
- Charlie (1 task)

If Smart Assign is run, it picks either Bob or Charlie (lowest load).


## Conflict Handling Logic

Conflict handling ensures the system gracefully handles inconsistent updates caused by concurrent operations.

### Preventive Conflict Handling:
- Task is re-fetched using `findById(id)` before applying updates.
- The current task is copied to `previousState`.
- Only fields from `req.body` are updated.

### Logging Conflicts:
- Every change logs both previous and new state.
- Logs are emitted to all clients via Socket.IO.

### Real-Time Conflict Feedback:
- Dashboards listen to socket events like `task_updated`.
- UI updates immediately with the latest task version.

### Example:
1. User A and B open the same task.
2. A updates priority, B updates description.
3. Updates do not overwrite each other.
4. Both updates appear in the activity log.
