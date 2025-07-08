import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import KanbanBoard from '../../components/Board/KanbanBoard.jsx';
import ActivityLog from '../../components/Log/ActivityLog.jsx';
import Header from '../../components/Header/Header.jsx';
import TaskModal from '../../components/Modal/TaskModal.jsx';
import { tasksAPI, authAPI } from '../../api/axios.js';
import socketService from '../../hooks/socket.js';
import './Dashboard.css';

const DashboardPage = () => {

    const { user, logout } = useAuth();

    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadData();
        setupSocketListeners();

        return () => {
            // Cleanup socket listeners
            const socket = socketService.getSocket();
            if (socket) {
                socket.off('task_created');
                socket.off('task_updated');
                socket.off('task_deleted');
            }
        };
    }, []);

    const loadData = async () => {
        try {
            const [tasksResponse, usersResponse] = await Promise.all([
                tasksAPI.getTasks(),
                authAPI.getUsers(),
            ]);
            
            setTasks(tasksResponse.data);
            setUsers(usersResponse.data);
        } catch (error) {
            setError('Failed to load data');
            console.error('Load data error:', error);
        } finally {
            setLoading(false);
        }
    };

    const setupSocketListeners = () => {
        const socket = socketService.getSocket();
        if (!socket) return;

        socket.on('task_created', (task) => {
            setTasks(prev => [...prev, task]);
        });

        socket.on('task_updated', (updatedTask) => {
            setTasks(prev => prev.map(task => 
                task._id === updatedTask._id ? updatedTask : task
            ));
        });

        socket.on('task_deleted', (taskId) => {
            setTasks(prev => prev.filter(task => task._id !== taskId));
        });
    };

    const handleCreateTask = () => {
        setEditingTask(null);
        setShowTaskModal(true);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setShowTaskModal(true);
    };

    const handleCloseModal = () => {
        setShowTaskModal(false);
        setEditingTask(null);
    };

    const handleTaskSubmit = async (taskData) => {
        try {
            if (editingTask) {
                // Update existing task
                const response = await tasksAPI.updateTask(editingTask._id, taskData);
                setTasks(prev => prev.map(task => 
                    task._id === editingTask._id ? response.data : task
                ));
                
                // Emit socket event
                socketService.emit('task_updated', response.data);
            } else {
                // Create new task
                const response = await tasksAPI.createTask(taskData);
                setTasks(prev => [...prev, response.data]);
                
                // Emit socket event
                socketService.emit('task_created', response.data);
            }
            
            handleCloseModal();
        } catch (error) {
            console.error('Task submit error:', error);
            setError(error.response?.data?.error || 'Failed to save task');
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) {
            return;
        }

        try {
            await tasksAPI.deleteTask(taskId);
            setTasks(prev => prev.filter(task => task._id !== taskId));
            
            // Emit socket event
            socketService.emit('task_deleted', taskId);
        } catch (error) {
            console.error('Delete task error:', error);
            setError('Failed to delete task');
        }
    };

    const handleSmartAssign = async (taskId) => {
        try {
            const response = await tasksAPI.smartAssign(taskId);
            setTasks(prev => prev.map(task => 
                task._id === taskId ? response.data : task
            ));
            
            // Emit socket event
            socketService.emit('task_updated', response.data);
        } catch (error) {
            console.error('Smart assign error:', error);
            setError('Failed to smart assign task');
        }
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <Header 
            user={user} 
            onLogout={logout}
            onCreateTask={handleCreateTask}
            />
      
            {error && (
                <div className="error-banner">
                    {error}
                    <button onClick={() => setError('')} className="error-close">×</button>
                </div>
            )}

            <div className="dashboard-content">
                <div className="main-content">
                    <KanbanBoard
                    tasks={Array.isArray(tasks) ? tasks : []}
                    users={users}
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTask}
                    onSmartAssign={handleSmartAssign}
                    onTaskUpdate={(updatedTask) => {
                        setTasks(prev => prev.map(task =>
                        task._id === updatedTask._id ? updatedTask : task
                        ));
                        socketService.emit('task_updated', updatedTask);
                    }}
                    />
                </div>
        
                <div className="sidebar">
                    <ActivityLog />
                </div>
            </div>

            {showTaskModal && (
                <TaskModal
                task={editingTask}
                users={users}
                onSubmit={handleTaskSubmit}
                onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default DashboardPage;