const jwt = require('jsonwebtoken');
const { isEmail } = require('../utils/helpers');
const database = require('../services/database');
const User = require('../models/user.model');
const { ERROR_MESSAGE, HTTP_STATUS_CODE } = require('../configs/constants');
const bcrypt = require('bcryptjs');

const register = async (request, response) => {
  try {
    const { username, email, phone, password, role } = request.body;
    // GENERATE HASH
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const user = {
      username,
      email,
      phone,
      password: passwordHash,
      role: role || 'patient',
    };

    const newUser = await database.user.addUser(user);

    // JWT
    const jws = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role,
      },
      process.env.JWT_SECRET
    );

    const data = {
      success: true,
      message: 'Registeration Successfully!',
      token: jws,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    };

    return response.status(HTTP_STATUS_CODE.CREATED).json(data);
  } catch (error) {
    console.error('Registration Failed: ', error);
    return response.status(HTTP_STATUS_CODE.INTERNAL_SERVER).json({
      success: false,
      message: error,
    });
  }
};

const login = async (request, response) => {
  try {
    if (request.body.type == 'guest') {
      let randomUsername = (Math.random() + 1).toString(36).substring(7);
      const token = jwt.sign(
        { role: 'guest', user: randomUsername },
        process.env.JWT_SECRET
      );
      const data = {
        token,
        user: {
          username: randomUsername,
          role: 'guest',
        },
      };
      return response
        .status(HTTP_STATUS_CODE.CREATED)
        .json({ success: true, message: 'Successfully logged in', data });
    }
    const { username, email, password } = request.body;
    let user = await database.user.getUserForLogin(username, email);
    if (user) {
      const authenticated = await bcrypt.compare(password, user.password);
      // if (!authenticated) throw 'Password is incorrect!';
      if (!authenticated)
        return response
          .status(HTTP_STATUS_CODE.BAD_REQUEST)
          .json({ success: false, message: ERROR_MESSAGE.INCORRECT_PASSWORD });
      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
          username: user.username,
          email: user.email,
          phone: user.phone,
        },
        process.env.JWT_SECRET
      );
      const data = {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      };
      return response
        .status(HTTP_STATUS_CODE.CREATED)
        .json({ success: true, message: 'Successfully logged in', data });
    } else {
      return response
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json(ERROR_MESSAGE.ACCOUNT_DOES_NOT_EXIST);
    }
  } catch (err) {
    console.error('Login Failed: ', err);
    return response
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json(ERROR_MESSAGE.LOGIN_FAIL + ', ' + err);
  }
};

const auth = async (request, response) => {
  try {
    const { id } = request.user;

    // @todo - move to middleware
    const user = await database.user.getUserById(id, {
      email: 1,
      _id: 0,
    });

    const jws = jwt.sign(
      { id: user._id, role: 'user' },
      process.env.JWT_SECRET
    );

    let data = {
      token: jws,
      user: {
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    };

    if (user) return response.status(HTTP_STATUS_CODE.OK).json(data);

    return response
      .status(HTTP_STATUS_CODE.BAD_REQUEST)
      .json(ERROR_MESSAGE.USER_NOT_EXIST);
  } catch (error) {
    console.error('Authentication Failed: ', error);
    return response
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json(ERROR_MESSAGE.AUTH_FAIL);
  }
};

const updateUser = async (request, response) => {
  try {
    // const token = request.header('x-auth-token');
    // const userId = jwt.verify(token, process.env.JWT_SECRET).id;
    const { _id, username, email, phone, role } = request.body;

    // Check email or username provided
    if (!email || !username || !_id) {
      return response.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: ERROR_MESSAGE.REQUIRED_PARAMETERS_MISSING,
      });
    }
    // Check if user does exist in the database
    const user = await database.user.getUserById(_id);
    console.log('user---->', user);
    if (!user) {
      return response.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: ERROR_MESSAGE.USER_NOT_EXIST,
      });
    }

    // TODO: We need a way to verify if user is authorised to make this hcange
    // Previously we were asking user to give the password, that is no more the case
    const updatedUserData = {
      username: username || user.username,
      email: email || user.email,
      phone: phone || user.phone,
      role: role || user.role,
    };
    await database.user.updateUser(_id, updatedUserData);
    const updatedUser = await database.user.getUserById(_id);

    const data = {
      success: true,
      message: 'User updated successfully!',
      user: updatedUser,
    };
    return response.status(HTTP_STATUS_CODE.CREATED).json(data);
  } catch (error) {
    console.error('Update User failed: ', error);
    return response
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json({ success: false, message: ERROR_MESSAGE.UPDATE_USER_FAILED });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      const error_messgae = {
        success: false,
        message: "User with given email doesn't exist",
      };
      return res.status(400).send(error_messgae);
    }
  } catch (error) {
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER).json({
      success: false,
      message: error,
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { password, confirmPassword, userId } = req.body;
    const user = await User.findOne({ _id: userId });
    console.log(user);
    if (!user) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: 'User Not found',
      });
    }

    if (password == confirmPassword) {
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password, salt);
      const updatedUser = await User.updateOne(
        { _id: userId },
        { $set: { password: passwordHash } },
        { new: true }
      );

      if (updatedUser) {
        return res.status(HTTP_STATUS_CODE.OK).json({
          success: true,
          message: `Password updated successfully!`,
          data: {
            userId: user._id,
          },
        });
      }
    } else {
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER).json({
        success: false,
        message: "Password doesn't match",
      });
    }
  } catch (error) {
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER).json({
      success: false,
      message: error,
    });
  }
};

const updateUserDetails = async (req, res) => {
  const { id } = req.userInfo;
  console.log(id);

  User.findByIdAndUpdate(
    id,
    { ...req.body },
    { useFindAndModify: false, new: true }
  )
    .then((dataVar) => {
      if (!dataVar) {
        res.status(404).send({
          success: false,
          message: `Cannot update!`,
        });
      } else
        res.send({
          success: true,
          message: 'updated successfully.',
          data: dataVar,
        });
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: 'Error updating with id=' + id,
      });
    });
};

const fetchAllUsers = async (request, response) => {
  try {
    const users = await User.find();
    return response.status(HTTP_STATUS_CODE.OK).json({
      message: 'Fetch users successfully!',
      users,
    });
  } catch (error) {
    console.error('API Failed: ', error);
    return response
      .status(HTTP_STATUS_CODE.NOT_FOUND)
      .json(ERROR_MESSAGE.DATA_NOT_FOUND);
  }
};

const deleteUser = async (Id) => {
  await User.deleteOne({ _id: Id });
  return true;
};

module.exports = {
  register,
  login,
  auth,
  updateUser,
  forgotPassword,
  updatePassword,
  updateUserDetails,
  deleteUser,
  fetchAllUsers,
  deleteUser,
};
