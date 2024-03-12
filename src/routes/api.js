const express = require('express');
const {
  registration,
  Login,
  userProfileDetails,
  userProfileDetailsUpdate,
} = require('../controllers/UserController');
const auth = require('../middleware/AuthMiddleware');
const {
  createTask,
  getAllTask,
  updateTask,
  deleteTask,
} = require('../controllers/TaskController');
const router = express.Router();

router.post('/registration', registration);
router.post('/login', Login);
router.get('/profile-details', auth, userProfileDetails);
router.patch('/profile-details-update', auth, userProfileDetailsUpdate);
router.post('/createTask', auth, createTask);
router.get('/getAllTask', auth, getAllTask);
router.patch('/updateTask/:id', auth, updateTask);
router.delete('/deleteTask/:id', auth, deleteTask);
module.exports = router;
