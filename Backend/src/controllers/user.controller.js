const userModel = require('../models/user.model');

module.exports.updatePreferences = async (req, res) => {
    try {
        const { preferences } = req.body;
        
        if (!preferences) {
            return res.status(400).json({ message: "Preferences are required" });
        }

        const user = await userModel.findByIdAndUpdate(
            req.user.id,
            { preferences },
            { returnDocument: 'after' }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Preferences updated", data: user.preferences });
    } catch (error) {
        console.error("Error updating preferences:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.getPreferences = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ data: user.preferences });
    } catch (error) {
        console.error("Error fetching preferences:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
