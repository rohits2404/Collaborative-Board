import Log from '../models/Log.js';

export const getRecentActions = async (req, res) => {
    try {
        const actions = await Log.find({})
        .sort({ timestamp: -1 })
        .limit(20)
        .populate('userId', 'username')
        .populate('taskId', 'title');

        res.json(actions);
    } catch (error) {
        console.error('Fetch actions error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getTaskActions = async (req, res) => {
    try {
        const { taskId } = req.params;

        const actions = await Log.find({ taskId })
        .sort({ timestamp: -1 })
        .populate('userId', 'username')
        .populate('taskId', 'title');

        res.json(actions);
    } catch (error) {
        console.error('Fetch task actions error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};