import React, { useState } from 'react';

const genresList = [
    "Pop", "EDM", "Bollywood", "Punjabi", "90s", "Lofi", "Rock", "Acoustic", "Hip Hop", "Classical", "Jazz"
];

const modalOverlayStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(5px)'
};

const modalContentStyle = {
    backgroundColor: 'var(--panel-bg)',
    padding: '30px',
    borderRadius: '15px',
    width: '400px',
    maxWidth: '90%',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.1)'
};

const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: '10px 15px',
    borderRadius: '8px'
};

const moodLabelStyle = {
    fontWeight: 'bold',
    fontSize: '1rem'
};

const selectStyle = {
    padding: '8px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#333',
    color: 'white',
    outline: 'none',
    cursor: 'pointer'
};

const saveButtonStyle = {
    marginTop: '25px',
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'var(--primary-accent)',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'opacity 0.2s ease'
};

const PreferencesModal = ({ onSave }) => {
    const [preferences, setPreferences] = useState({
        happy: "Pop",
        sad: "Lofi",
        angry: "Rock",
        surprised: "EDM",
        neutral: "Acoustic"
    });

    const handleChange = (mood, genre) => {
        setPreferences(prev => ({
            ...prev,
            [mood]: genre
        }));
    };

    const handleSave = () => {
        onSave(preferences);
    };

    return (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <h2 style={{marginTop: 0, color: 'var(--primary-accent)'}}>Select Your Vibe</h2>
                <p style={{color: '#aaa', fontSize: '0.9rem', marginBottom: '20px'}}>
                    What type of music do you like to listen to during these moods? 
                    We'll use this to automatically suggest the perfect playlist for you.
                </p>

                <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                    {Object.keys(preferences).map((mood) => (
                        <div key={mood} style={rowStyle}>
                            <span style={moodLabelStyle}>
                                {mood.charAt(0).toUpperCase() + mood.slice(1)}
                            </span>
                            <select 
                                style={selectStyle}
                                value={preferences[mood]}
                                onChange={(e) => handleChange(mood, e.target.value)}
                            >
                                {genresList.map(g => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>

                <button style={saveButtonStyle} onClick={handleSave}>
                    Save Preferences
                </button>
            </div>
        </div>
    );
};

export default PreferencesModal;
