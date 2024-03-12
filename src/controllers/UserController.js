const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registration = async (req, res) => {
  console.log(req.body);
  try {
    const { username, email, password } = req.body;
    const existingUser = await UserModel.findOne({ email: email });

    if (existingUser) {
      return res.status(200).json({
        message: 'User email already registered',
      });
    }

    const userDetails = req.body;
    const user = await UserModel.create(userDetails);
    res.status(201).json({
      message: 'User registration successful',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        message: 'Invalid user credentials',
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({
        message: 'Invalid password',
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '24h',
      }
    );

    res.cookie('token', token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
    });
    res.status(200).json({
      message: 'Login successful',
      token: token,
    });
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
    });
  }
};
const userProfileDetails = async (req, res) => {
  try {
    const { email, id } = req.user;
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    res.status(200).json({
      message: 'User Profile details',
      data: user,
    });
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
    });
  }
};
const userProfileDetailsUpdate = async (req, res) => {
  try {
    const { email, id } = req.user;
    const userDetails = req.body;
    const updatedUser = await UserModel.findByIdAndUpdate(
      { _id: id },
      {
        $set: userDetails,
      },
      {
        new: true,
      }
    );
    if (!updatedUser) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    res.status(200).json({
      message: 'User Profile details updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
    });
  }
};



module.exports = {
  registration,
  Login,
  userProfileDetails,
  userProfileDetailsUpdate,
};
