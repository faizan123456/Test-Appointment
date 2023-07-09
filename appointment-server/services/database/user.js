const { ObjectId } = require('mongoose').Types;
const User = require('../../models/user.model');
const axios = require('axios');

const getUserById = async (_id, selectedOpts = {}) => {
  return User.findById(_id).select(selectedOpts);
};

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const getUserForLogin = async (username, email) => {
  if (username) {
    return User.findOne({ username });
  }
  if (email) {
    return User.findOne({ email });
  }
};

const getUserByUsername = async (username) => {
  return User.findOne({ username });
};

const addUser = async (user) => {
  const newUser = new User(user);
  return newUser.save();
};

const getAllUsers = async () => {
  try {
    const populateObj = [
      {
        path: 'mints',
        select: {
          name: 1,
          tokenId: 1,
        },
      },
    ];
    const userFields =
      'username email fullName address metaMaskAddress arkaneWalletAddress verified';
    return User.find().select(userFields).populate(populateObj).exec();
  } catch (err) {
    console.error(err);
    return err;
  }
};

const updateUser = (_id, user) => {
  return User.findOneAndUpdate({ _id }, user);
};

module.exports = {
  addUser,
  getUserByEmail,
  getUserByUsername,
  getUserById,
  getUserForLogin,
  getAllUsers,
  updateUser,
};
