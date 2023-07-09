const router = require('express').Router();
const controller = require('../../controllers/user');
const { userAuth } = require('../../middlewares/auth');
const { authenticateToken } = require('../../middlewares/authenticate');

const {
  registerValidations,
  loginValidations,
  validatePassword,
  validateEmail,
  validator,
} = require('../../middlewares/validations');

router.post('/register', registerValidations, validator, controller.register);

router.post('/login', loginValidations, validator, controller.login);

router.put('/updateUser', [userAuth], controller.updateUser);
router.get('/allUsers', controller.fetchAllUsers);
router.delete('/delete', controller.deleteUser);

router.post(
  '/forgot-password',
  validateEmail,
  validator,
  controller.forgotPassword
);

router.post(
  '/update-password',
  validatePassword,
  validator,
  controller.updatePassword
);

// API to Authenticate
router.post('/auth', [userAuth], controller.auth);

// router.put('/update', authenticateToken, controller.updateUserDetails);

module.exports = router;
