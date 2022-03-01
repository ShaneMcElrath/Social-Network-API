const { User } = require('../models');
const userController = {

  // get all users
  getAllUser(req, res) {
    User.find({})
      .populate({
        path: 'thoughts',
        select: '-__v'
      })
      .select('-__v')
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.status(400).json(err));
  },

  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
    .populate({
      path: 'thoughts',
      select: '-__v'
    })
    .select('-__v')
    .then(dbUserData => {
      if (!dbUserData) {
        throw ({ 
          status: 404,
          message: 'No user found with this id!'
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

  createUser({ body }, res) {
    User.create(body)
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.status(400).json(err));
  },

  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
    .then(dbUserData => {
      if (!dbUserData) {
        throw ({
          'status': 404,
          'message': 'No user found with this id!'
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
    })
  },

  deleteUser( { params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then(dbUserData => {
        if (!dbUserData) {
          throw ({
            'status': 404,
            'message': 'No user found with this id!'
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
  }
}

module.exports = userController;