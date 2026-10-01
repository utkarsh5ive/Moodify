import axios from "axios";

const API_URL = "http://localhost:3000/api/mood";

export const saveMoodHistory = async (mood) => {
    try {
        const response = await axios.post(`${API_URL}/save`, { mood }, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error saving mood:", error);
        throw error;
    }
};

export const getMoodHistory = async () => {
    try {
        const response = await axios.get(`${API_URL}/history`, {
            withCredentials: true
        });
        return response.data.data;
    } catch (error) {
        console.error("Error fetching mood history:", error);
        throw error;
    }
};
