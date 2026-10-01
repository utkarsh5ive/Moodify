const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authUser } = require('../middlewares/auth.middleware');

router.post('/preferences', authUser, userController.updatePreferences);
router.get('/preferences', authUser, userController.getPreferences);

module.exports = router;
