import React from 'react';
import './Header.css';

const Header = ({ user, onLogout, onCreateTask }) => {
    return (
        <header className="header">
            <div className="header-left">
                <h1 className="header-title">
                <span className="header-icon">📋</span>
                    Todo Board
                </h1>
            </div>
            
            <div className="header-center">
                <button 
                onClick={onCreateTask}
                className="create-task-btn"
                >
                    <span className="btn-icon">+</span>
                    New Task
                </button>
            </div>
            
            <div className="header-right">
                <div className="user-info">
                    <span className="user-avatar">
                        {user?.username?.charAt(0).toUpperCase()}
                    </span>
                    <span className="user-name">{user?.username}</span>
                    <div className="user-dropdown">
                        <button 
                        onClick={onLogout}
                        className="logout-btn"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;