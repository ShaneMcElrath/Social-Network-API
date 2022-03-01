const router = require('express').Router();
const {
  getAllThought,
  createThought
} = require('../../controllers/thought-controller');

router
  .route('/')
  .get(getAllThought)
  
router
  .route('/:userId')
  .post(createThought);

module.exports = router;