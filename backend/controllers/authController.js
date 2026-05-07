import User from '../models/User.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please add all fields');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'Member',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please add email and password');
    }

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const { action, projectId } = req.query;
    
    let users = await User.find({}).select('-password');

    // 1 member = 1 project
    if (action === 'createProject') {
      // Find all users who are currently in ANY project
      const allProjects = await Project.find({});
      const busyUserIds = new Set();
      allProjects.forEach(p => {
        p.teamMembers.forEach(memberId => busyUserIds.add(memberId.toString()));
      });

      // Filter out busy members (Admins can be added to multiple, but let's strictly restrict Members)
      users = users.filter(user => user.role === 'Admin' || !busyUserIds.has(user._id.toString()));
    }

    // 1 member = 1 active task
    if (action === 'createTask' && projectId) {
      // Find the project to get its team members
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      const teamMemberIds = project.teamMembers.map(id => id.toString());

      // Find all tasks that are active (not Done)
      const activeTasks = await Task.find({ status: { $ne: 'Done' } });
      const busyUserIds = new Set(activeTasks.map(t => t.assignedTo?.toString()));

      // Filter users: must be in the project, AND not busy (Admins are exempt from "busy" check? The prompt says "don't reflect profile of member who already have task". Admins aren't technically assigned tasks usually, but if they are, hide them too.)
      users = users.filter(user => {
        const isTeamMember = teamMemberIds.includes(user._id.toString());
        const isBusy = busyUserIds.has(user._id.toString());
        return isTeamMember && !isBusy;
      });
    }

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export { registerUser, loginUser, getMe, getUsers };
