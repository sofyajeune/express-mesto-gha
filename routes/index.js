const router = require('express').Router();
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

router.use('/signup', require('./signup'));
router.use('/signin', require('./signin'));
router.use('/', auth, require('./users'));
router.use('/', auth, require('./cards'));

router.use((req, res, next) => next(new NotFoundError('Ошибка 404. Страница не найдена!')));
module.exports = router;
