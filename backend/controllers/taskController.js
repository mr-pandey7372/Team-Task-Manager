import Task from '../models/Task.js';

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private/Admin
const createTask = async (req, res, next) => {
  try {
    const { title, description, projectId, assignedTo, status, priority, dueDate } = req.body;

    if (!title || !description || !projectId || !dueDate) {
      res.status(400);
      throw new Error('Please add title, description, projectId, and due date');
    }

    // 1 active task per member validation
    if (assignedTo) {
      const activeTask = await Task.findOne({ assignedTo, status: { $ne: 'Done' } });
      if (activeTask) {
        res.status(400);
        throw new Error('This member already has an active task and cannot be assigned another until it is completed.');
      }
    }

    const task = await Task.create({
      title,
      description,
      projectId,
      assignedTo,
      assignedBy: req.user._id,
      status: status || 'Todo',
      priority: priority || 'Medium',
      dueDate,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks (with filtering and search)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, projectId, search } = req.query;
    
    // Base query logic
    let query = {};

    // 1. Role-based constraints
    if (req.user.role !== 'Admin') {
      // Members only see their assigned tasks
      query.assignedTo = req.user._id;
    }

    // 2. Filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (projectId) query.projectId = projectId;

    // 3. Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tasks = await Task.find(query)
      .populate('projectId', 'name')
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single task
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('projectId', 'name')
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email');

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Role check for members
    if (req.user.role !== 'Admin' && task.assignedTo?._id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to view this task');
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Role-based logic
    if (req.user.role !== 'Admin') {
      // Member rules: must be assigned to them, and can ONLY update 'status'
      if (task.assignedTo?.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this task');
      }
      
      const { status } = req.body;
      if (!status) {
        res.status(400);
        throw new Error('Members can only update the status field');
      }

      task.status = status;
      await task.save();
    } else {
      // Admin rules: can update anything
      task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    // Populate before sending response
    const updatedTask = await Task.findById(task._id)
      .populate('projectId', 'name')
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email');

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    await task.deleteOne();

    res.status(200).json({ id: req.params.id, message: 'Task removed' });
  } catch (error) {
    next(error);
  }
};

export { createTask, getTasks, getTaskById, updateTask, deleteTask };
