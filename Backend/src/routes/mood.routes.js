const express = require('express');
const router = express.Router();
const moodController = require('../controllers/mood.controller');
const { authUser } = require('../middlewares/auth.middleware');

router.post('/save', authUser, moodController.saveMood);
router.get('/history', authUser, moodController.getHistory);

module.exports = router;
