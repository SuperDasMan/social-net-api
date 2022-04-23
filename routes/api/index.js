const router = require('express').Router();

const userRoutes = require('./userRoutes');
const thoughtRoutes = require('./thoughtRoutes');

router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);

router.use((req, res) => {
  res.status(404).send('Bad request 2. Please try again.');
});

module.exports = router;
