const moodModel = require('../models/mood.model');

module.exports.saveMood = async (req, res) => {
    try {
        const { mood } = req.body;
        if (!mood) {
            return res.status(400).json({ message: "Mood is required" });
        }

        const newMood = await moodModel.create({
            userId: req.user.id,
            mood: mood
        });

        res.status(201).json({ message: "Mood saved successfully", data: newMood });
    } catch (error) {
        console.error("Error saving mood:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.getHistory = async (req, res) => {
    try {
        const history = await moodModel.find({ userId: req.user.id })
            .sort({ timestamp: -1 })
            .limit(20); // Get last 20 moods

        res.status(200).json({ data: history });
    } catch (error) {
        console.error("Error fetching mood history:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
