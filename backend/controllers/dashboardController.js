import Project from '../models/Project.js';
import Task from '../models/Task.js';

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const role = req.user.role;
    const userId = req.user._id;

    // Filters based on role
    const projectFilter = role === 'Admin' ? {} : { teamMembers: userId };
    const taskFilter = role === 'Admin' ? {} : { assignedTo: userId };

    // Basic counts
    const totalProjects = await Project.countDocuments(projectFilter);
    const totalTasks = await Task.countDocuments(taskFilter);
    
    const completedTasks = await Task.countDocuments({ ...taskFilter, status: 'Done' });
    const pendingTasks = await Task.countDocuments({ 
      ...taskFilter, 
      status: { $in: ['Todo', 'In Progress'] } 
    });

    // Overdue logic: dueDate < current date AND status != Done
    const currentDate = new Date();
    const overdueTasks = await Task.countDocuments({
      ...taskFilter,
      dueDate: { $lt: currentDate },
      status: { $ne: 'Done' }
    });

    // MongoDB Aggregation for Status
    const tasksByStatus = await Task.aggregate([
      { $match: taskFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // MongoDB Aggregation for Priority
    const tasksByPriority = await Task.aggregate([
      { $match: taskFilter },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      tasksByStatus,
      tasksByPriority
    });
  } catch (error) {
    next(error);
  }
};

export { getDashboardStats };
