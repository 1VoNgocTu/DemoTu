const express = require('express');
const router = express.Router();

// Gọi dashboard_controllers
const dashboard_controllers = require('./dashboard_controllers');
router.use('/admin/dashboard', dashboard_controllers);

// Gọi user_controllers
const user_controllers = require('./user_controllers');
router.use('/admin/user', user_controllers);

module.exports = router;