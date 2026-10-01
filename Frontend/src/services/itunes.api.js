import axios from 'axios';

const API_URL = 'http://localhost:3000/api/itunes';

export const getMoodRecommendations = async (mood, genre = '') => {
    try {
        const response = await axios.get(`${API_URL}/recommendations`, {
            params: { mood, genre },
            withCredentials: true
        });
        return response.data.tracks;
    } catch (error) {
        console.error('Error fetching iTunes recommendations:', error);
        throw error;
    }
};
