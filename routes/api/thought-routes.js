const router = require('express').Router();
const {
  getAllThought,
  createThought,
  getThoughtById,
  updateThought,
  deleteThought
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

module.exports = router;