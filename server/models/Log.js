import mongoose from 'mongoose';

const actionLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        enum: ['create', 'update', 'delete', 'assign', 'move', 'edit_start', 'edit_end']
    },
    taskId: {
        type: Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    details: {
        type: Object,
        default: {}
    },
    previousState: {
        type: Object,
        default: {}
    },
    newState: {
        type: Object,
        default: {}
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for efficient querying
actionLogSchema.index({ timestamp: -1 });
actionLogSchema.index({ taskId: 1, timestamp: -1 });

const Log = mongoose.model('Log', actionLogSchema);

export default Log;