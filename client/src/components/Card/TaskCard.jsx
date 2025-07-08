import React, { useState } from 'react';
import './TaskCard.css';

const TaskCard = ({ 
  task, 
  users, 
  onEdit, 
  onDelete, 
  onSmartAssign, 
  isDragging 
}) => {

    const [isFlipped, setIsFlipped] = useState(false);
    const [showActions, setShowActions] = useState(false);

    const assignedUser =
        typeof task.assignedTo === 'object' && task.assignedTo !== null
        ? task.assignedTo
        : users.find(user => user._id === task.assignedTo);

    const createdBy =
        typeof task.createdBy === 'object' && task.createdBy !== null
        ? task.createdBy
        : users.find(user => user._id === task.createdBy);

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return '#e74c3c';
            case 'Medium': return '#f39c12';
            case 'Low': return '#27ae60';
            default: return '#6c757d';
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'High': return '🔥';
            case 'Medium': return '⚡';
            case 'Low': return '🍃';
            default: return '📝';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleCardClick = () => {
        setIsFlipped(!isFlipped);
    };

    const handleActionClick = (e, action) => {
        e.stopPropagation();
        action();
    };

    return (
        <div 
        className={`task-card ${isDragging ? 'dragging' : ''} ${isFlipped ? 'flipped' : ''}`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
        >
            <div className="card-inner">
                {/* Front of card */}
                <div className="card-front">
                    <div className="card-header">
                        <div className="priority-badge" style={{ backgroundColor: getPriorityColor(task.priority) }}>
                            <span className="priority-icon">{getPriorityIcon(task.priority)}</span>
                            <span className="priority-text">{task.priority}</span>
                        </div>
                        
                        {showActions && (
                            <div className="card-actions">
                                <button
                                className="action-btn edit-btn"
                                onClick={(e) => handleActionClick(e, onEdit)}
                                title="Edit Task"
                                >
                                    ✏️
                                </button>
                                <button
                                className="action-btn smart-assign-btn"
                                onClick={(e) => handleActionClick(e, onSmartAssign)}
                                title="Smart Assign"
                                >
                                    🎯
                                </button>
                                <button
                                className="action-btn delete-btn"
                                onClick={(e) => handleActionClick(e, onDelete)}
                                title="Delete Task"
                                >
                                    🗑️
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="card-content" onClick={handleCardClick}>
                        <h4 className="task-title">{task.title}</h4>
                        {task.description && (
                            <p className="task-description">
                                {task.description.length > 100 
                                ? `${task.description.substring(0, 100)}...` 
                                : task.description
                                }
                            </p>
                        )}
                    </div>

                    <div className="card-footer">
                        <div className="assigned-user">
                            <div className="user-avatar">
                                {assignedUser?.username?.charAt(0).toUpperCase()}
                            </div>
                            <span className="user-name">{assignedUser?.username || 'Unassigned'}</span>
                        </div>
                    
                        <div className="flip-back-btn" onClick={handleCardClick}>
                            <span>↩️</span>
                        </div>
                    </div>
                </div>

                {/* Back of card */}
                <div className="card-back">
                    <div className="card-back-header">
                        <h4>Task Details</h4>
                        <button 
                        className="flip-back-btn"
                        onClick={handleCardClick}
                        >
                            ↩️
                        </button>
                    </div>
                    
                    <div className="card-back-content">
                        <div className="detail-item">
                            <strong>Created by:</strong>
                            <span>{createdBy?.username || 'Unknown'}</span>
                        </div>
                        
                        <div className="detail-item">
                            <strong>Created:</strong>
                            <span>{formatDate(task.createdAt)}</span>
                        </div>
                        
                        <div className="detail-item">
                            <strong>Last updated:</strong>
                            <span>{formatDate(task.updatedAt)}</span>
                        </div>
                        
                        {task.description && (
                            <div className="detail-item description-full">
                                <strong>Description:</strong>
                                <p>{task.description}</p>
                            </div>
                        )}
                        
                        <div className="detail-item">
                            <strong>Status:</strong>
                            <span className={`status-badge status-${task.status.toLowerCase().replace(' ', '-')}`}>
                                {task.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;