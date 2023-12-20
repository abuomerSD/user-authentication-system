const express = require('express');
const router = express.Router();
const { getAllUsers, createUser, updateUser, deleteUser , login} = require('../controllers/usersController');

// router.get('/', getAllUsers);
// router.post('/', createUser);
// router.put('/:id', updateUser);
// router.delete('/:id', deleteUser);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').put(updateUser).delete(deleteUser);
router.route('/login').post(login);


module.exports = router;