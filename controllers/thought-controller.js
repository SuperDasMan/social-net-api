const { Thought, User } = require('../models');

const thoughtController = {
  // Get all Thought
  getAllThought(req, res) {
    // console.log(req);
    Thought.find({})
      .populate({ path: 'reactions', select: '-__v' })
      .populate({
        path: 'username',
        select: '-__v',
      })
      .select('-__v')
      // .sort({ _id: -1 })
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        // console.log(err);
        res.status(500).json(err);
      });
  },

  // Get a thought by ID
  getThoughtById({ params }, res) {
    // console.log(params);
    // console.log(params.id);
    Thought.findOne({ _id: params.id })
      .populate({ path: 'reactions', select: '-__v' })
      .select('-__v')
      .then((dbThoughtData) => {
        // console.log(dbThoughtData);
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thoughts found with this id!' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        // console.log(err);
        res.sendStatus(400).json(err);
      });
  },

  // add thought to user
  addThought({ params, body }, res) {
    // console.log(body);
    Thought.create(body)
      .then(({ _id, thoughtText }) => {
        // console.log(_id);
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thoughts: _id, thoughtText: thoughtText } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        // console.log(dbUserData);
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  // add reaction to thought
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },

  // Update a thought by ID
  updateThought({ params, body }, res) {
    // console.log(params.id);
    // console.log(params);
    Thought.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .populate({ path: 'reactions', select: '-__v' })
      .select('-___v')
      .then((dbThoughtData) => {
        // console.log(dbThoughtData);
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thoughts found with this id!' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },

  // remove thought
  removeThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res
            .status(404)
            .json({ message: 'No thoughts found with this id!' });
        }
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { thoughts: params.thoughtId } },
          { new: true }
        );
      })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res
            .status(404)
            .json({ message: 'No thought found for this user!' });
        }
        return res.json({
          dbThoughtData,
          message: 'Thought has been removed from the user!',
        });
      })
      .catch((err) => res.json(err));
  },

  // remove reaction
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'Reaction not found!' });
        }
        return res.json({
          dbThoughtData,
          message: 'Reaction has been removed!',
        });
      })
      .catch((err) => res.json(err));
  },
};

module.exports = thoughtController;
