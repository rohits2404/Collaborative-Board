import React, { useState, useEffect } from 'react';
import { actionsAPI } from '../../api/axios.js';
import socketService from '../../hooks/socket.js';
import './ActivityLog.css';

const ActivityLog = () => {

    const [actions, setActions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadActions();
        const socket = socketService.getSocket();

        if (socket) {
            socket.on('action_logged', handleNewAction);
        }

        console.log('👂 Socket from service:', socket);
        if (!socket || !socket.connected) {
            console.warn('⚠️ Socket not connected');
        }


        return () => {
            if (socket) {
                socket.off('action_logged', handleNewAction);
            }
        };
    }, []);

    const loadActions = async () => {
        try {
            const response = await actionsAPI.getActions();
            const data = Array.isArray(response.data)
                ? response.data
                : response.data?.actions || [];

            setActions(data.slice(0, 20)); // Max 20
        } catch (err) {
            console.error('Load actions error:', err);
            setError('Failed to load activity log');
            setActions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleNewAction = (action) => {
        setActions(prev => {
            const updated = [action, ...prev];
            return updated.slice(0, 20); // Keep max 20
        });
    };

    const getActionIcon = (type) => {
        switch (type) {
            case 'create': return '➕';
            case 'update': return '✏️';
            case 'delete': return '🗑️';
            case 'assign': return '👤';
            case 'move': return '↔️';
            default: return '📝';
        }
    };

    const getActionDescription = (log) => {
        const user = log.userId?.username || 'Unknown user';
        const task = log.taskId?.title || 'Unnamed task';

        switch (log.action) {
            case 'create': return `${user} created "${task}"`;
            case 'update': return `${user} updated "${task}"`;
            case 'delete': return `${user} deleted "${task}"`;
            case 'assign': return `${user} reassigned "${task}"`;
            case 'move': return `${user} moved "${task}"`;
            default: return `${user} did something on "${task}"`;
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 60_000) return 'just now';
        if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
        if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="activity-log">
                <div className="activity-header"><h3>Activity Log</h3></div>
                <div className="loading-container">
                    <div className="loading-spinner" />
                    <p>Loading activities...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="activity-log">
            <div className="activity-header">
                <h3>📊 Activity Log</h3>
                <span className="activity-count">{actions.length} recent actions</span>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="activity-list">
                {actions.length === 0 ? (
                    <div className="empty-activity">
                        <p>No recent activity</p>
                        <small>Actions will appear here in real-time</small>
                    </div>
                ) : (
                    actions.map((action, index) => (
                        <div
                        key={action._id || index}
                        className={`activity-item ${index === 0 ? 'latest' : ''}`}
                        >
                            <div className="activity-icon">{getActionIcon(action.action)}</div>
                            <div className="activity-content">
                                <div className="activity-description">{getActionDescription(action)}</div>
                                <div className="activity-timestamp">{formatTimestamp(action.timestamp)}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="activity-footer">
                <small>Showing last 20 actions • Updates in real-time</small>
            </div>
        </div>
    );
};

export default ActivityLog;