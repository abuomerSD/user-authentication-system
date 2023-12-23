const express = require('express');
const router = express.Router();
const { getAllUsers,
        createUser,
        updateUser,
        deleteUser,
        login } = require('../controllers/usersController');


router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').put(updateUser).delete(deleteUser);
router.route('/login').post(login);


module.exports = router;