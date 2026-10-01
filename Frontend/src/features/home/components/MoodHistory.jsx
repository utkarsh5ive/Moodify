import React, { useEffect, useState } from 'react';
import { getMoodHistory } from '../../../services/mood.api';
import './MoodHistory.scss';

const emojiMap = {
    happy: '😀',
    sad: '😢',
    angry: '😡',
    surprised: '😲',
    neutral: '😐'
};

const MoodHistory = ({ currentMood }) => {
    const [history, setHistory] = useState([]);
    const [activeTab, setActiveTab] = useState('TODAY');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getMoodHistory();
                setHistory(data);
            } catch (err) {
                console.error("Could not fetch mood history:", err);
            }
        };
        fetchHistory();
    }, [currentMood]); // Refetch if currentMood changes

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="mood-history-wrapper solid-panel">
            <div className="history-header">
                <span className="title">MOOD HISTORY</span>
                <span className="live-status">● LIVE</span>
            </div>
            
            <h3 className="timeline-title">Today's Timeline</h3>
            
            <div className="tabs">
                <button 
                    className={`tab ${activeTab === 'TODAY' ? 'active' : ''}`}
                    onClick={() => setActiveTab('TODAY')}
                >
                    TODAY
                </button>
                <button 
                    className={`tab ${activeTab === '7 DAYS' ? 'active' : ''}`}
                    onClick={() => setActiveTab('7 DAYS')}
                >
                    7 DAYS
                </button>
            </div>

            <div className="history-list">
                {currentMood && (
                    <div className="history-item live">
                        <div className="left">
                            <span className="dot current"></span>
                            <span className="emoji">{emojiMap[currentMood.toLowerCase()] || '😐'}</span>
                            <span className={`mood-text ${currentMood.toLowerCase()}`}>
                                {currentMood.charAt(0).toUpperCase() + currentMood.slice(1)}
                            </span>
                        </div>
                        <span className="time">Just now</span>
                    </div>
                )}
                
                {history.length > 0 ? (
                    history.map((item, index) => (
                        <div key={item._id || index} className="history-item">
                            <div className="left">
                                <span className={`dot ${item.mood.toLowerCase()}`}></span>
                                <span className="emoji">{emojiMap[item.mood.toLowerCase()] || '😐'}</span>
                                <span className={`mood-text ${item.mood.toLowerCase()}`}>
                                    {item.mood.charAt(0).toUpperCase() + item.mood.slice(1)}
                                </span>
                            </div>
                            <span className="time">{formatTime(item.timestamp)}</span>
                        </div>
                    ))
                ) : (
                    <p className="no-data">No history found.</p>
                )}
            </div>
        </div>
    );
};

export default MoodHistory;
