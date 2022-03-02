const { Thought, User } = require('../models');

const thoughtController = {

  getAllThought(req, res) {
    Thought.find({})
      .select('-__v')
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => res.status(400).json(err));
  },

  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.thoughtId })
      .select('-__v')
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          throw ({
            status: 404,
            message: 'No Thought found with this id!'
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
    User.findOne({ _id: params.userId })
      .then(dbUserData => {

        return Thought.create({ 
          thoughtText: body.thoughtText,
          username: dbUserData.username
        })
      })
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
            message: 'No Thought found with this id!'
          });
        }

        res.json(dbUserData);
      })
      .catch(err => {
        if (err.status) {
          res.status(err.status).json({ 'Error': err.message });
          return;
        }
  
        res.status(400).json(err);
      });
  },

  createReaction({ params, body }, res) {
    User.findOne({ _id: params.userId })
      .then(dbUserData => {
        return Thought.findOneAndUpdate(
          { _id: params.thoughtId },
          { $push: { 
            reactions: {
              reactionBody: body.reactionBody,
              username: dbUserData.username
            } 
          }},
          { new: true, runValidators: true }
        );
      })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          throw ({
            status: 404,
            message: 'No Thought found with this id!'
          });
        }

        res.json(dbThoughtData);
      })
      .catch(err => {
        if (err.status) {
          res.status(err.status).json({ 'Error': err.message });
          return;
        }
  
        res.status(400).json(err);
      });
  },

  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      body,
      { new: true, runValidators: true }
    )
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          throw ({
            status: 404,
            message: 'No Thought found with this id!'
          });
        }
        res.json(dbThoughtData);
      })
      .catch(err => {
        if (err.status) {
          res.status(err.status).json({ 'Error': err.message });
          return;
        }

        res.status(400).json(err);
      });
  },

  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then(async dbThoughtData => {
        if (!dbThoughtData) {
          throw ({
            status: 404,
            message: 'No Thought found with this id!'
          });
        }
        let dbUserData = await User.findOneAndUpdate(
          { username: 'papa' },
          { $pull: { thoughts: params.thoughtId } },
          { new: true }
        );
        res.json({dbThoughtData, dbUserData});
      })
      .catch(err => {
        if (err.status) {
          res.status(err.status).json({ 'Error': err.message });
          return;
        }

        res.status(400).json(err);
      });
  },

  deleteReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          throw ({
            status: 404,
            message: 'No Thought found with this id!'
          });
        }

        res.json(dbThoughtData);
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