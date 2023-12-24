const express = require('express');
const router = express.Router();
const { adminAuth, userAuth } = require('../middleware/auth');
const { getAllUsers,
        createUser,
        updateUser,
        deleteUser,
        login,
        register,
        getAdmin,
        getBasicUser, } = require('../controllers/usersController');


router.route('/').get(getAllUsers).post(register);
router.route('/:id').put(updateUser).delete(deleteUser);
router.route('/login').post(login);
router.route('/admin').get(adminAuth, getAdmin);
router.route('/basic').get(userAuth, getBasicUser);


module.exports = router;