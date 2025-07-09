import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Task from '../models/Task.js';
import Log from '../models/Log.js';
import User from '../models/User.js';

export const logAction = async ({ action, task, userId, previousState = null, details = {} }) => {
    const rawLog = await new Log({
        action,
        taskId: task._id,
        userId,
        previousState,
        newState: task,
        details
    }).save();

    if (global.io) {
        const populatedLog = await Log.findById(rawLog._id)
        .populate('userId', 'username')
        .populate('taskId', 'title');

        console.log('🔁 Emitting action_logged:', populatedLog);
        global.io.emit('action_logged', populatedLog); // 🌍 Broadcast to all
    }
};


// Validation middleware
export const validateCreateTask = [
    body('title').isLength({ max: 100 }).trim(),
    body('description').isLength({ max: 500 }).trim(),
    body('assignedTo').isMongoId(),
    body('priority').isIn(['Low', 'Medium', 'High'])
];

export const validateUpdateTask = [
    body('title').optional().isLength({ max: 100 }).trim(),
    body('description').optional().isLength({ max: 500 }).trim(),
    body('status').optional().isIn(['Todo', 'In Progress', 'Done']),
    body('priority').optional().isIn(['Low', 'Medium', 'High']),
    body('assignedTo').optional().isMongoId()
];

export const createTask = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { title, description, assignedTo, priority } = req.body;

        const exists = await Task.findOne({ title });
        if (exists) return res.status(400).json({ error: 'Title already exists' });

        const task = new Task({
            title,
            description,
            assignedTo,
            priority,
            createdBy: req.user._id
        });

        await task.save();

        await logAction({
            action: 'create',
            task,
            userId: req.user._id,
            details: { assignedTo }
        });

        res.status(201).json(task);
    } catch (err) {
        console.error('Create task error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({})
        .populate('assignedTo', 'username')
        .populate('createdBy', 'username');
        res.json(tasks);
    } catch (err) {
        console.error('Fetch tasks error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

export const updateTask = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { id } = req.params;
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        const previousState = { ...task._doc };

        Object.keys(req.body).forEach(field => {
            task[field] = req.body[field];
        });

        await task.save();

        await logAction({
            action: 'update',
            task,
            userId: req.user._id,
            previousState
        });

        res.json(task);
    } catch (err) {
        console.error('Update task error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByIdAndDelete(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        await logAction({
            action: 'delete',
            task,
            userId: req.user._id,
            previousState: task
        });

        res.json({ message: 'Task deleted' });
    } catch (err) {
        console.error('Delete task error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

export const smartAssignTask = async (req, res) => {
    try {
        const { id } = req.params;

        // Step 1: Get all users
        const users = await User.find({});
        if (users.length === 0) {
            return res.status(500).json({ error: 'No users available for assignment' });
        }

        // Step 2: Get all active tasks (not Done)
        const tasks = await Task.find({ status: { $ne: 'Done' } });

        // Step 3: Count tasks assigned to each user
        const taskCounts = users.reduce((acc, user) => {
            acc[user._id] = tasks.filter(
                t => t.assignedTo?.toString() === user._id.toString()
            ).length;
            return acc;
        }, {});

        // Step 4: Sort users by task load
        const sortedEntries = Object.entries(taskCounts).sort((a, b) => a[1] - b[1]);
        if (sortedEntries.length === 0) {
            return res.status(500).json({ error: 'No assignable users found' });
        }

        const [userIdWithFewestTasks] = sortedEntries[0];

        // Step 5: Find task to assign
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Step 6: Assign user to task
        task.assignedTo = new mongoose.Types.ObjectId(userIdWithFewestTasks);
        await task.save();

        // Step 7: Log the action
        await logAction({
            action: 'assign',
            task,
            userId: req.user._id,
            details: { assignedTo: userIdWithFewestTasks }
        });

        // Step 8: Return updated task
        res.json(task);
    } catch (err) {
        console.error('Smart assign error:', err.message, err.stack);
        res.status(500).json({ error: 'Smart assign failed' });
    }
};
