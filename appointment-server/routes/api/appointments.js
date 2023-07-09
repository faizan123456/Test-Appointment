const router = require('express').Router();
const controller = require('../../controllers/appointments');
const AuthMiddleware = require('../../middlewares/auth');
const {
  appointmentValidations,
  validator,
} = require('../../middlewares/validations');

router.post(
  '/createAppointment',
  appointmentValidations,
  validator,
  controller.createAppointment
);

router.put('/updateStatus', controller.updateAppointment);

router.get('/myAppointments/:userId', controller.fetchMyAllAppointments);

router.get('/appointments', controller.fetchAllAppointments);

// API to authenticatte token
router.post('/auth', [AuthMiddleware.userAuth], controller.auth);

module.exports = router;
