const router = require('express').Router();

router.use('/user', require('./user'));
router.use('/appointment', require('./appointments'));

module.exports = router;
