import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    status: {
        type: String,
        enum: ['Todo', 'In Progress', 'Done'],
        default: 'Todo'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    position: {
        type: Number,
        default: 0
    },
    isBeingEdited: {
        type: Boolean,
        default: false
    },
    editedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    editStartTime: {
        type: Date,
        default: null
    },
    lastModified: {
        type: Date,
        default: Date.now
    },
    modifiedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Index for unique titles
taskSchema.index({ title: 1 }, { unique: true });

// Update lastModified on save
taskSchema.pre('save', function(next) {
    this.lastModified = new Date();
    next();
});

const Task = mongoose.model("Task",taskSchema);

export default Task;