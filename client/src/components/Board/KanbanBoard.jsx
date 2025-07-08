import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskCard from '../Card/TaskCard.jsx';
import { tasksAPI } from '../../api/axios.js';
import './KanbanBoard.css';

const COLUMNS = {
    'Todo': {
        name: 'Todo',
        color: '#e74c3c',
        icon: '📋'
    },
    'In Progress': {
        name: 'In Progress',
        color: '#f39c12',
        icon: '⚡'
    },
    'Done': {
        name: 'Done',
        color: '#27ae60',
        icon: '✅'
    }
};

const KanbanBoard = ({ 
  tasks, 
  users, 
  onEditTask, 
  onDeleteTask, 
  onSmartAssign, 
  onTaskUpdate 
}) => {

  const [columns, setColumns] = useState({});
  const [draggedTask, setDraggedTask] = useState(null);

    useEffect(() => {
        // Organize tasks by status
        const organizedColumns = Object.keys(COLUMNS).reduce((acc, columnId) => {
        acc[columnId] = {
            ...COLUMNS[columnId],
            tasks: tasks.filter(task => task.status === columnId)
        };
        return acc;
        }, {});

        setColumns(organizedColumns);
    }, [tasks]);

    const onDragStart = (start) => {
        const task = tasks.find(task => task._id === start.draggableId);
        setDraggedTask(task);
        
        // Add visual feedback
        document.body.style.cursor = 'grabbing';
    };

    const onDragEnd = async (result) => {
        document.body.style.cursor = 'default';
        setDraggedTask(null);

        const { destination, source, draggableId } = result;

        // If no destination, return
        if (!destination) {
            return;
        }

        // If dropped in the same position, return
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const task = tasks.find(task => task._id === draggableId);
        const newStatus = destination.droppableId;

        try {
            // Update task status
            const updatedTask = { ...task, status: newStatus };
            await tasksAPI.updateTask(task._id, { status: newStatus });
            onTaskUpdate(updatedTask);
        } catch (error) {
            console.error('Failed to update task status:', error);
        }
    };

    const getTaskCounts = () => {
        return Object.keys(COLUMNS).reduce((acc, status) => {
            acc[status] = Array.isArray(tasks)
            ? tasks.filter(task => task.status === status).length
            : 0;
            return acc;
        }, {});
    };

    const taskCounts = getTaskCounts();

    return (
        <div className="kanban-board">
            <div className="board-header">
                <h2>Project Board</h2>
                <div className="board-stats">
                    <span className="stat-item">
                        Total Tasks: <strong>{tasks.length}</strong>
                    </span>
                    <span className="stat-item">
                        In Progress: <strong>{taskCounts['In Progress']}</strong>
                    </span>
                    <span className="stat-item">
                        Completed: <strong>{taskCounts['Done']}</strong>
                    </span>
                </div>
            </div>

            <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
                <div className="board-columns">
                    {Object.entries(columns).map(([columnId, column]) => (
                        <div key={columnId} className="column">
                            <div 
                            className="column-header"
                            style={{ borderTopColor: column.color }}
                            >
                                <div className="column-title">
                                    <span className="column-icon">{column.icon}</span>
                                    <h3>{column.name}</h3>
                                    <span className="task-count">{column.tasks.length}</span>
                                </div>
                            </div>

                            <Droppable droppableId={columnId} isDropDisabled={false}>
                                {(provided, snapshot) => (
                                    <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`column-content ${
                                    snapshot.isDraggingOver ? 'dragging-over' : ''
                                    }`}
                                    >
                                        {column.tasks.map((task, index) => (
                                            <Draggable
                                            key={task._id}
                                            draggableId={task._id}
                                            index={index}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`task-wrapper ${
                                                    snapshot.isDragging ? 'dragging' : ''
                                                    }`}
                                                    >
                                                        <TaskCard
                                                        task={task}
                                                        users={users}
                                                        onEdit={() => onEditTask(task)}
                                                        onDelete={() => onDeleteTask(task._id)}
                                                        onSmartAssign={() => onSmartAssign(task._id)}
                                                        isDragging={snapshot.isDragging}
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                        
                                        {column.tasks.length === 0 && (
                                            <div className="empty-column">
                                                <p>No tasks in {column.name}</p>
                                                <small>Drag tasks here or create new ones</small>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>

            {draggedTask && (
                <div className="drag-overlay">
                    <div className="drag-preview">
                        Moving "{draggedTask.title}"
                    </div>
                </div>
            )}
        </div>
    );
};

export default KanbanBoard;