import React, { useState, useEffect } from 'react';
import './TaskModal.css';

const TaskModal = ({ task, users, onSubmit, onClose }) => {

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assignedTo: '',
        priority: 'Medium',
        status: 'Todo'
    });

    const [error, setError] = useState('');

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description || '',
                assignedTo: task.assignedTo || '',
                priority: task.priority || 'Medium',
                status: task.status || 'Todo'
            });
        }
    }, [task]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title.trim()) {
            setError('Title is required');
            return;
        }

        await onSubmit(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="task-modal">
                <button className="close-btn" onClick={onClose}>×</button>
                <h2>{task ? 'Edit Task' : 'Create Task'}</h2>
        
                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="assignedTo">Assign to</label>
                        <select
                        id="assignedTo"
                        name="assignedTo"
                        value={formData.assignedTo}
                        onChange={handleChange}
                        >
                            <option value="">Unassigned</option>
                            {users.map(user => (
                                <option key={user._id} value={user._id}>{user.username}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="priority">Priority</label>
                        <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    {task && (
                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            >
                                <option value="Todo">Todo</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>
                    )}

                    <button type="submit" className="submit-btn">
                        {task ? 'Update Task' : 'Create Task'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;