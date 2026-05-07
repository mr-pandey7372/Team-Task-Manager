import Project from '../models/Project.js';

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res, next) => {
  try {
    const { name, description, teamMembers } = req.body;

    if (!name || !description) {
      res.status(400);
      throw new Error('Please add name and description');
    }

    const project = await Project.create({
      name,
      description,
      teamMembers: teamMembers || [],
      createdBy: req.user._id,
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    let projects;

    if (req.user.role === 'Admin') {
      // Admin sees all projects
      projects = await Project.find().populate('createdBy', 'name email').populate('teamMembers', 'name email');
    } else {
      // Members only see projects they are assigned to
      projects = await Project.find({ teamMembers: req.user._id })
        .populate('createdBy', 'name email')
        .populate('teamMembers', 'name email');
    }

    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('teamMembers', 'name email');

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // If user is Member, check if they are part of the team
    if (
      req.user.role !== 'Admin' &&
      !project.teamMembers.some((member) => member._id.toString() === req.user._id.toString())
    ) {
      res.status(403);
      throw new Error('Not authorized to view this project');
    }

    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('createdBy', 'name email').populate('teamMembers', 'name email');

    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    await project.deleteOne();

    res.status(200).json({ id: req.params.id, message: 'Project removed' });
  } catch (error) {
    next(error);
  }
};

export { createProject, getProjects, getProjectById, updateProject, deleteProject };
