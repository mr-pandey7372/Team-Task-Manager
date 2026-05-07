import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import dashboardService from '../services/dashboardService';
import taskService from '../services/taskService';
import Spinner from '../components/Spinner';
import StatusBadge from '../components/StatusBadge';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { FolderKanban, CheckSquare, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DashboardCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center space-x-4">
    <div className={`p-3 rounded-lg ${colorClass}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardData, tasksData] = await Promise.all([
          dashboardService.getDashboardStats(),
          taskService.getTasks()
        ]);
        setStats(dashboardData);
        setRecentTasks(tasksData.slice(0, 5)); // Get top 5 recent tasks
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <Spinner />;
  if (!stats) return null;

  // Format data for Recharts
  const statusData = stats.tasksByStatus.map(item => ({
    name: item._id,
    value: item.count
  }));

  const priorityData = stats.tasksByPriority.map(item => ({
    name: item._id,
    count: item.count
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-500">Here's what's happening with your projects today.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <DashboardCard 
          title="Total Projects" 
          value={stats.totalProjects} 
          icon={FolderKanban} 
          colorClass="bg-blue-500" 
        />
        <DashboardCard 
          title="Total Tasks" 
          value={stats.totalTasks} 
          icon={CheckSquare} 
          colorClass="bg-indigo-500" 
        />
        <DashboardCard 
          title="Completed Tasks" 
          value={stats.completedTasks} 
          icon={CheckCircle2} 
          colorClass="bg-emerald-500" 
        />
        <DashboardCard 
          title="Pending Tasks" 
          value={stats.pendingTasks} 
          icon={Clock} 
          colorClass="bg-amber-500" 
        />
        <DashboardCard 
          title="Overdue Tasks" 
          value={stats.overdueTasks} 
          icon={AlertTriangle} 
          colorClass="bg-red-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Charts */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tasks by Priority</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <RechartsTooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tasks by Status</h3>
          <div className="h-64 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity / Assigned Tasks */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            {user?.role === 'Admin' ? 'Recent Activity' : 'Your Assigned Tasks'}
          </h3>
          <Link to="/tasks" className="text-sm font-medium text-blue-600 hover:text-blue-800">
            View all
          </Link>
        </div>
        <div className="divide-y divide-gray-200">
          {recentTasks.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No tasks found.</div>
          ) : (
            recentTasks.map((task) => (
              <div key={task._id} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
                <div>
                  <Link to={`/tasks/${task._id}`} className="text-sm font-medium text-blue-600 hover:underline">
                    {task.title}
                  </Link>
                  <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
                    <span>Project: {task.projectId?.name || 'N/A'}</span>
                    <span>•</span>
                    <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'None'}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                    task.priority === 'High' ? 'bg-red-100 text-red-700' :
                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {task.priority}
                  </span>
                  <StatusBadge status={task.status} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
