const { User, Thought } = require("../models");
const userController = {
  // get all users
  getAllUser(req, res) {
    User.find({})
      .select("-__v")
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(400).json(err));
  },

  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .select("-__v")
      .then((dbUserData) => {
        if (!dbUserData) {
          throw {
            status: 404,
            message: "No user found with this id!",
          };
        }

        res.json(dbUserData);
      })
      .catch((err) => {
        if (err.status) {
          res.status(err.status).json({ Error: err.message });
          return;
        }

        res.status(400).json(err);
      });
  },

  createUser({ body }, res) {
    User.create(body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(400).json(err));
  },

  // Add friend to User
  addFriend({ params }, res) {

    if (params.friendId == params.userId) {
      return res.status(400).json({ Error: "User ids are the same. User can not friend themselves" });
    }

    User.findOneAndUpdate(
      { _id: params.friendId },
      { $addToSet: { friends: params.userId } },
      { new: true }
    )
      .then(async (dbFriendData) => {
        if (!dbFriendData) {
          throw {
            status: 404,
            message: "No user found with this id!",
          };
        }

        let dbUserData = await User.findOneAndUpdate(
          { _id: params.userId },
          { $addToSet: { friends: params.friendId } },
          { new: true }
        );

        if (!dbUserData) {
          throw {
            status: 404,
            message: "No user found with this id!",
          };
        }

        res.json({ dbUserData, dbFriendData });
      })
      .catch((err) => {
        if (err.status) {
          res.status(err.status).json({ Error: err.message });
          return;
        }

        res.status(400).json(err);
      });
  },

  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbUserData) => {
        if (!dbUserData) {
          throw {
            status: 404,
            message: "No user found with this id!",
          };
        }

        res.json(dbUserData);
      })
      .catch((err) => {
        if (err.status) {
          res.status(err.status).json({ Error: err.message });
          return;
        }

        res.status(400).json(err);
      });
  },

  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then(async (dbUserData) => {
        if (!dbUserData) {
          throw {
            status: 404,
            message: "No user found with this id!",
          };
        }

        let dbThoughtData = await Thought.deleteMany({
          _id: dbUserData.thoughts,
        });

        res.json({ dbUserData, dbThoughtData });
      })
      .catch((err) => {
        if (err.status) {
          res.status(err.status).json({ Error: err.message });
          return;
        }

        res.status(400).json(err);
      });
  },

  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId, friends: params.friendId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .then(async dbUserData => {
        if (!dbUserData) {
          throw {
            status: 404,
            message: "No user found with this id and friend!",
          };
        }

        let dbFriendData = await User.findOneAndUpdate(
          { _id: params.friendId, friends: params.userId },
          { $pull: { friends: params.userId } },
          { new: true }
        );

        if (!dbFriendData) {
          throw {
            status: 404,
            message: "No user found with this id and friend!",
          };
        }

        res.json({ dbUserData, dbFriendData });
      })
      .catch((err) => {
        if (err.status) {
          res.status(err.status).json({ Error: err.message });
          return;
        }

        res.status(400).json(err);
      });
  }
};

module.exports = userController;
