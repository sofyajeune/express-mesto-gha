const router = require('express').Router();

router.use('/signup', require('./singup'));
router.use('/signin', require('./singin'));
router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

module.exports = router;
