const express=require('express')
const router=express.Router();
const {authenticateToken} = require('../middlewares/authmiddlewares');
const taskController = require('../controllers/taskControllers');

// Create task route
router.post('/create',authenticateToken, taskController.createatask);

// Get all tasks
router.get('/getall',authenticateToken, taskController.getalltasks);

module.exports = router;