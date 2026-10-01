import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import './Home.scss';
import FaceExpression from '../../expressions/expressions.jsx';
import { useAuth } from '../../auth/hooks/useAuth.jsx';
import { getMoodRecommendations } from '../../../services/itunes.api.js';
import { saveMoodHistory } from '../../../services/mood.api.js';
import { getUserPreferences, saveUserPreferences } from '../../../services/user.api.js';
import MoodHistory from '../components/MoodHistory.jsx';
import AudioPlayer from '../components/AudioPlayer.jsx';
import PreferencesModal from '../components/PreferencesModal.jsx';

// Mock local tracks for offline mode
const mockLocalTracks = {
    neutral: [
        { id: 'l1', title: 'Marco Teaser Theme', artist: 'Ravi Basrur', src: '/music/neutral/song1.mp3', mood: 'Neutral' },
        { id: 'l2', title: 'Chill Vibes', artist: 'Local Artist', src: '/music/neutral/song2.mp3', mood: 'Neutral' }
    ],
    happy: [
        { id: 'l3', title: 'Happy Day', artist: 'Local Artist', src: '/music/happy/song1.mp3', mood: 'Happy' },
        { id: 'l4', title: 'Sunny Walk', artist: 'Local Artist', src: '/music/happy/song2.mp3', mood: 'Happy' }
    ],
    sad: [
        { id: 'l5', title: 'Rainy Night', artist: 'Local Artist', src: '/music/sad/song1.mp3', mood: 'Sad' }
    ],
    angry: [
        { id: 'l6', title: 'Rage Mode', artist: 'Local Artist', src: '/music/angry/song1.mp3', mood: 'Angry' }
    ],
    surprised: [
        { id: 'l7', title: 'Unexpected Drop', artist: 'Local Artist', src: '/music/surprised/song1.mp3', mood: 'Surprised' }
    ]
};

const emojiMap = {
    happy: '😀',
    sad: '😢',
    angry: '😡',
    surprised: '😲',
    neutral: '😐'
};

const Home = () => {
    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();

    const [currentMood, setCurrentMood] = useState("");
    const [songs, setSongs] = useState([]);
    const [loadingSongs, setLoadingSongs] = useState(false);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const [playingTrack, setPlayingTrack] = useState(null);

    const [userUploadedTracks, setUserUploadedTracks] = useState([]);
    const [showPreferencesModal, setShowPreferencesModal] = useState(false);
    const [userPreferences, setUserPreferences] = useState(null);
    const [isMoodLocked, setIsMoodLocked] = useState(false);

    useEffect(() => {
        if (!user) return;
        getUserPreferences().then(prefs => {
            if (!prefs || !prefs.happy) {
                setShowPreferencesModal(true);
            } else {
                setUserPreferences(prefs);
            }
        }).catch(err => {
            console.error("Could not fetch preferences:", err);
            setShowPreferencesModal(true); // Fallback to show modal if error
        });
    }, [user]);

    // Online/Offline Listeners
    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    async function isLogout() {
        const success = await handleLogout();
        if (success) {
            navigate('/login');
        }
    }

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        const newTracks = files.map(file => ({
            id: URL.createObjectURL(file),
            title: file.name.replace(/\.[^/.]+$/, ""), // remove extension
            artist: 'Local Upload',
            src: URL.createObjectURL(file),
            mood: 'Any',
            isSpotify: false
        }));

        setUserUploadedTracks(prev => [...prev, ...newTracks]);
        
        // If we are currently offline, immediately show the uploaded tracks
        if (isOffline) {
            setSongs(prev => {
                const combined = [...prev, ...newTracks];
                if (!playingTrack && combined.length > 0) setPlayingTrack(combined[0]);
                return combined;
            });
        }
    };

    const handleSavePreferences = async (newPrefs) => {
        try {
            await saveUserPreferences(newPrefs);
            setUserPreferences(newPrefs);
            setShowPreferencesModal(false);
        } catch (err) {
            console.error("Failed to save preferences", err);
        }
    };

    const handleLockMood = async () => {
        if (!currentMood) return;
        setIsMoodLocked(true);
        setLoadingSongs(true);

        if (user) {
            try {
                await saveMoodHistory(currentMood);
            } catch (err) {
                console.error("Failed to save mood history", err);
            }
        }

        const moodKey = currentMood.toLowerCase().replace(/[^a-z]/g, '') || 'neutral';

        if (isOffline) {
            const localList = mockLocalTracks[moodKey] || mockLocalTracks['neutral'];
            const combinedList = [...localList, ...userUploadedTracks];
            
            setSongs(combinedList);
            if (combinedList.length > 0) {
                setPlayingTrack(combinedList[0]);
            } else {
                setPlayingTrack(null);
            }
            setLoadingSongs(false);
        } else {
            const genre = userPreferences ? userPreferences[moodKey] : '';
            try {
                const tracks = await getMoodRecommendations(currentMood, genre);
                const formattedTracks = tracks.map(t => ({
                    id: t.id,
                    title: t.title || t.name,
                    artist: t.artist || 'Unknown Artist',
                    src: t.src,
                    albumArt: t.albumArt,
                    isiTunes: true
                }));
                setSongs(formattedTracks);
                if (formattedTracks.length > 0) {
                    setPlayingTrack(formattedTracks[0]);
                } else {
                    setPlayingTrack(null);
                }
            } catch (error) {
                console.error("Failed to load songs");
                setSongs([]);
            } finally {
                setLoadingSongs(false);
            }
        }
    };

    const handleMoodDetected = (detectedMood) => {
        if (!detectedMood || isMoodLocked) return;

        if (detectedMood !== currentMood) {
            setCurrentMood(detectedMood);
        }
    };

    const handleTrackSelect = (track) => {
        setPlayingTrack(track);
    };

    return (
        <div className="home-dashboard">
            {showPreferencesModal && (
                <PreferencesModal onSave={handleSavePreferences} />
            )}

            {/* Top Navigation */}
            <header className="dashboard-header">
                <div className="logo">
                    <span className="icon">📊</span> MooDify
                </div>
                {isOffline && <div className="offline-badge">OFFLINE MODE</div>}
                <div className="user-profile">
                    {user ? (
                        <div className="user-info">
                            <span className="username">{user.username}</span>
                            <button onClick={isLogout} className="logout-btn">
                                <span className="logout-icon">⏻</span> Logout
                            </button>
                            <div className="avatar"><img src="https://ui-avatars.com/api/?name=U&background=random" alt="Avatar"/></div>
                        </div>
                    ) : (
                        <div className="auth-links">
                            <Link to="/login">Log In</Link>
                            <Link to="/register" className="signup">Sign Up</Link>
                        </div>
                    )}
                </div>
            </header>

            {/* Three Column Layout */}
            <main className="dashboard-content">
                
                {/* Left Panel: Expression Capture */}
                <section className="panel left-panel">
                    <div className="capture-card">
                        <span className="subtitle">MOODIFY</span>
                        <h2>Expression Capture</h2>
                        
                        <div className="camera-container">
                            <FaceExpression onMoodDetected={handleMoodDetected} />
                        </div>
                        
                        <div className="detected-result">
                            <span className="emoji">{emojiMap[currentMood?.toLowerCase()] || '😐'}</span>
                            <span className="label">MOOD DETECTED</span>
                            <h3 className={`mood-name ${currentMood?.toLowerCase() || 'neutral'}`}>
                                {currentMood ? currentMood.charAt(0).toUpperCase() + currentMood.slice(1) : 'Neutral'}
                            </h3>
                        </div>

                        {isMoodLocked ? (
                            <button className="action-btn" onClick={() => { setIsMoodLocked(false); setSongs([]); }} style={{backgroundColor: '#ff3b30'}}>Unlock Mood</button>
                        ) : (
                            <button className="action-btn" onClick={handleLockMood}>Lock Mood</button>
                        )}
                    </div>
                </section>

                {/* Middle Panel: Analysis, History, Player */}
                <section className="panel middle-panel">
                    {/* Current Mood Analysis */}
                    <div className="analysis-card solid-panel">
                        <div className="details">
                            <span className="subtitle">CURRENT MOOD ANALYSIS</span>
                            <h1 className="main-mood">
                                {currentMood ? currentMood.charAt(0).toUpperCase() + currentMood.slice(1) : 'Neutral'}
                            </h1>
                        </div>
                        <div className="large-emoji">
                            {emojiMap[currentMood?.toLowerCase()] || '😐'}
                        </div>
                    </div>

                    {/* Mood History Timeline */}
                    <MoodHistory currentMood={currentMood} />

                </section>

                {/* Right Panel: Playlist */}
                <section className="panel right-panel solid-panel">
                    <div className="playlist-header">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h3 style={{ margin: 0 }}>✨ {isOffline ? 'Local Offline Playlist' : 'AI Recommended Playlist for you'}</h3>
                            {isOffline && (
                                <label className="upload-btn" style={{
                                    backgroundColor: 'var(--accent-cyan)',
                                    color: 'black',
                                    padding: '5px 10px',
                                    borderRadius: '5px',
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}>
                                    + Upload Music
                                    <input 
                                        type="file" 
                                        accept="audio/*" 
                                        multiple 
                                        style={{ display: 'none' }} 
                                        onChange={handleFileUpload}
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="playlist-list">
                        {loadingSongs ? (
                            <p className="loading-msg">Loading tracks...</p>
                        ) : songs.length > 0 ? (
                            songs.map((song, idx) => (
                                <div 
                                    key={song.id} 
                                    className={`playlist-item ${playingTrack?.id === song.id ? 'active' : ''}`}
                                    onClick={() => handleTrackSelect(song)}
                                >
                                    <span className="index">{idx + 1}</span>
                                    <div className="thumb">
                                        <img src={song.albumArt || `https://placehold.co/40x40/2a2a4a/ffffff?text=${song.title.charAt(0)}`} alt="" />
                                    </div>
                                    <div className="info">
                                        <p className="title">{song.title}</p>
                                        <p className="artist">{song.artist}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="empty-msg">No tracks found. Detect a mood to get started.</p>
                        )}
                    </div>
                </section>
            </main>

            {/* Global Bottom Player */}
            {playingTrack && (
                <div className="global-player-section">
                    <AudioPlayer 
                        currentTrack={playingTrack} 
                        onNext={() => {
                            const idx = songs.findIndex(s => s.id === playingTrack.id);
                            if(idx !== -1 && idx < songs.length - 1) {
                                setPlayingTrack(songs[idx+1]);
                            }
                        }} 
                        onPrev={() => {
                            const idx = songs.findIndex(s => s.id === playingTrack.id);
                            if(idx > 0) {
                                setPlayingTrack(songs[idx-1]);
                            }
                        }} 
                    />
                </div>
            )}
        </div>
    );
};

export default Home;
