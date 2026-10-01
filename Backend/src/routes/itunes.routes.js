const express = require('express');
const axios = require('axios');
const router = express.Router();

const moodToSearchTerms = {
    'happy': 'Happy Hits',
    'sad': 'Sad Melodies',
    'angry': 'Rock',
    'surprised': 'Party Dance',
    'neutral': 'Chill Lo-Fi'
};

router.get('/recommendations', async (req, res) => {
    try {
        const mood = req.query.mood || 'neutral';
        const genre = req.query.genre || ''; 
        const moodKey = mood.toLowerCase().replace(/[^a-z]/g, '') || 'neutral';

        let searchTerm = moodToSearchTerms[moodKey] || moodToSearchTerms['neutral'];
        
        // If a specific genre was passed (e.g. from user prefs), prioritize it
        let query = genre ? `${searchTerm} ${genre}` : searchTerm;

        const response = await axios.get(`https://itunes.apple.com/search?term=${encodeURIComponent(query + ' Bollywood')}&country=IN&entity=song&limit=20`);
        
        const results = response.data?.results || [];
        
        const tracks = results.map(track => {
            return {
                id: track.trackId?.toString() || Math.random().toString(),
                title: track.trackName,
                artist: track.artistName || 'Unknown Artist',
                src: track.previewUrl,
                albumArt: track.artworkUrl100,
                isiTunes: true
            };
        });

        res.json({ tracks });

    } catch (error) {
        console.error('Error fetching tracks from iTunes:', error.message);
        res.status(500).json({ message: 'Failed to fetch tracks' });
    }
});

module.exports = router;
