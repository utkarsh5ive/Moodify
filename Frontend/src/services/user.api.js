import axios from "axios";

const API_URL = "http://localhost:3000/api/user";

export const saveUserPreferences = async (preferences) => {
    try {
        const response = await axios.post(`${API_URL}/preferences`, { preferences }, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error saving preferences:", error);
        throw error;
    }
};

export const getUserPreferences = async () => {
    try {
        const response = await axios.get(`${API_URL}/preferences`, {
            withCredentials: true
        });
        return response.data.data;
    } catch (error) {
        console.error("Error fetching preferences:", error);
        throw error;
    }
};
