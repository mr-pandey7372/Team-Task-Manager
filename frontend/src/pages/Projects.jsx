import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import projectService from '../services/projectService';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import ProjectForm from '../components/ProjectForm';
import ConfirmModal from '../components/ConfirmModal';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';

const Projects = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  
  // State for confirm modal
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const isAdmin = user?.role === 'Admin';

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setProjectToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    try {
      await projectService.deleteProject(projectToDelete);
      setProjects(projects.filter((p) => p._id !== projectToDelete));
      toast.success('Project deleted successfully');
    } catch (error) {
      console.error('Failed to delete project', error);
      toast.error('Failed to delete project');
    } finally {
      setIsConfirmOpen(false);
      setProjectToDelete(null);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingProject) {
        await projectService.updateProject(editingProject._id, formData);
        toast.success('Project updated successfully');
      } else {
        await projectService.createProject(formData);
        toast.success('Project created successfully');
      }
      setIsModalOpen(false);
      fetchProjects(); // Refresh the list
    } catch (error) {
      console.error('Failed to save project', error);
      toast.error('Failed to save project');
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          {isAdmin && (
            <button
              onClick={handleCreate}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition font-medium"
            >
              + New Project
            </button>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-500 text-lg">No projects found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                isAdmin={isAdmin}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </div>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Create New Project'}
      >
        <ProjectForm
          initialData={editingProject}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </ProjectModal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project? All associated data might be lost. This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default Projects;
