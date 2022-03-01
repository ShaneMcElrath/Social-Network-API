const { Thought, User} = require('../models');

const thoughtController = {

  getAllThought(req, res) {
    Thought.find({})
      .select('-__v')
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => res.status(400).json(err));
  },

  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.thoughId })
      .select('-__v')
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          throw ({
            status: 404,
            message: 'No thought found with this id!'
          });
        }
        res.json(dbThoughtData)
      })
      .catch(err => {
        if (err.status) {
          res.status(err.status).json({ 'Error': err.message });
          return;
        }
  
        res.status(400).json(err);
      });
  },

  createThought({ params, body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then(dbUserData => {
        if (!dbUserData) {
          throw ({
            status: 404,
            message: 'No thought found with this id!'
          });
        }

        res.json(dbUserData)
      })
      .catch(err => {
        if (err.status) {
          res.status(err.status).json({ 'Error': err.message });
          return;
        }
  
        res.status(400).json(err);
      });
  }
}

module.exports = thoughtController;