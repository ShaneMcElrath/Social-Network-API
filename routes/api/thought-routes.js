const router = require('express').Router();
const {
  getAllThought,
  createThought,
  getThoughtById,
  updateThought,
  deleteThought,
  createReaction,
  deleteReaction
} = require('../../controllers/thought-controller');

router
  .route('/')
  .get(getAllThought)

router
  .route('/:thoughtId')
  .get(getThoughtById)
  .put(updateThought)
  .delete(deleteThought);
  
router
  .route('/:userId')
  .post(createThought);

router
  .route('/:userId/:thoughtId')
  .post(createReaction);

router
  .route('/:thoughtId/:reactionId')
  .delete(deleteReaction);

module.exports = router;