import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Search, 
  Filter, 
  FolderOpen, 
  Calendar,
  User,
  Code2,
  Github,
  FileText,
  Presentation,
  Globe,
  X,
  Save,
  Eye,
  Tag
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import apiService from '../services/api';
import type { DeveloperProject, CreateProjectRequest, Developer, ProjectCategory } from '../types/api';

interface ProjectDetailsModalProps {
  isOpen: boolean;
  projectId?: number;
  onClose: () => void;
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ isOpen, projectId, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [project, setProject] = useState<any>(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!isOpen || !projectId) return;
      setIsLoading(true);
      try {
        const response = await apiService.getDeveloperProject(projectId);
        setProject(response.data);
      } catch (error) {
        console.error('Error fetching project details:', error);
        toast.error('Failed to load project details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjectDetails();
  }, [isOpen, projectId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-slate-700"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 p-6">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          {isLoading ? (
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl animate-pulse" />
              <div className="space-y-2">
                <div className="h-6 w-48 bg-white/20 rounded animate-pulse" />
                <div className="h-4 w-32 bg-white/20 rounded animate-pulse" />
              </div>
            </div>
          ) : project ? (
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                <FolderOpen className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">{project.name}</h2>
                <p className="text-white/80 text-lg">{project.project_origin}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-white/20 text-white border border-white/30">
                    Project ID: {project.id}
                  </span>
                  {project.developer_name && (
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-white/20 text-white border border-white/30">
                      Developer: {project.developer_name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-3 border-slate-600/30 border-t-blue-500 rounded-full animate-spin mb-4 mx-auto" />
                <p className="text-slate-400">Loading project details...</p>
              </div>
            </div>
          ) : project ? (
            <div className="space-y-6">
              {/* Description */}
              {project.description && (
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-blue-400" />
                    Project Description
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              )}

              {/* Tech Stack */}
              {project.tech_stack && project.tech_stack.length > 0 && (
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Code2 className="w-5 h-5 mr-2 text-violet-400" />
                    Technology Stack
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {project.tech_stack.map((tech: string, idx: number) => (
                      <span 
                        key={idx} 
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-slate-600 to-slate-700 text-slate-200 border border-slate-600/50 hover:scale-105 transition-transform"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Used */}
              {project.skills && project.skills.length > 0 && (
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Tag className="w-5 h-5 mr-2 text-amber-400" />
                    Skills Used in Project
                  </h3>
                  <div className="space-y-4">
                    {project.skills.map((area: any) => (
                      <div key={area.skill_area_id} className="border border-slate-700/30 rounded-lg p-4 bg-slate-700/20">
                        <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                          <Tag className="w-4 h-4 mr-2 text-amber-400" />
                          {area.skill_area_name}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {area.skills.map((skill: any) => (
                            <span 
                              key={skill.skill_id} 
                              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-amber-600 to-amber-700 text-amber-100 border border-amber-500/50 hover:scale-105 transition-transform"
                            >
                              {skill.skill_name.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Links */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <FolderOpen className="w-5 h-5 mr-2 text-emerald-400" />
                  Project Links
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.repo_link && (
                    <a 
                      href={project.repo_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg hover:bg-slate-600/50 transition-colors"
                    >
                      <Github className="w-5 h-5 mr-3 text-blue-400" />
                      <div>
                        <p className="text-white font-medium">Repository</p>
                        <p className="text-slate-400 text-sm">View source code</p>
                      </div>
                    </a>
                  )}
                  {project.live_link && (
                    <a 
                      href={project.live_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg hover:bg-slate-600/50 transition-colors"
                    >
                      <Globe className="w-5 h-5 mr-3 text-emerald-400" />
                      <div>
                        <p className="text-white font-medium">Live Demo</p>
                        <p className="text-slate-400 text-sm">View live project</p>
                      </div>
                    </a>
                  )}
                  {project.doc_link && (
                    <a 
                      href={project.doc_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg hover:bg-slate-600/50 transition-colors"
                    >
                      <FileText className="w-5 h-5 mr-3 text-violet-400" />
                      <div>
                        <p className="text-white font-medium">Documentation</p>
                        <p className="text-slate-400 text-sm">View docs</p>
                      </div>
                    </a>
                  )}
                  {project.presentation_link && (
                    <a 
                      href={project.presentation_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg hover:bg-slate-600/50 transition-colors"
                    >
                      <Presentation className="w-5 h-5 mr-3 text-amber-400" />
                      <div>
                        <p className="text-white font-medium">Presentation</p>
                        <p className="text-slate-400 text-sm">View presentation</p>
                      </div>
                    </a>
                  )}
                </div>
                {!project.repo_link && !project.live_link && !project.doc_link && !project.presentation_link && (
                  <div className="text-center py-8 text-slate-400">
                    <FolderOpen className="w-12 h-12 mx-auto mb-3 text-slate-500" />
                    <p className="text-lg">No project links available</p>
                  </div>
                )}
              </div>

              {/* Project Categories */}
              {project.project_categories && project.project_categories.length > 0 && (
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <FolderOpen className="w-5 h-5 mr-2 text-purple-400" />
                    Project Categories
                  </h3>
                  <div className="space-y-4">
                    {project.project_categories.map((category: any) => (
                      <div key={category.id} className="border border-slate-700/30 rounded-lg p-4 bg-slate-700/20">
                        <h4 className="text-lg font-semibold text-white mb-2">{category.name}</h4>
                        {category.description && (
                          <p className="text-slate-300 text-sm leading-relaxed">{category.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Metadata */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                  Project Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-1">Created Date</label>
                    <div className="flex items-center text-white">
                      <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                      {project.created_at ? new Date(project.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : 'Not specified'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-1">Project Origin</label>
                    <div className="flex items-center text-white">
                      <Tag className="w-4 h-4 mr-2 text-slate-400" />
                      {project.project_origin}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <p className="text-lg">No project data available</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: DeveloperProject;
  onSave: (project: DeveloperProject) => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, project, onSave }) => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateProjectRequest>();
  const [isLoading, setIsLoading] = useState(false);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [techStack, setTechStack] = useState<string[]>([]);
  const [newTech, setNewTech] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchDevelopers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (project) {
      reset({
        ...project,
        project_categories: project.project_categories || [],
        skills: project.skills || []
      });
      setTechStack(project.tech_stack || []);
    } else {
      reset({
        developer: 0,
        name: '',
        description: '',
        project_categories: [],
        tech_stack: [],
        project_origin: '',
        skills: [],
        repo_link: '',
        doc_link: '',
        presentation_link: '',
        live_link: ''
      });
      setTechStack([]);
    }
  }, [project, reset]);

  const fetchDevelopers = async () => {
    try {
      const response = await apiService.getDevelopers();
      setDevelopers(response.data);
    } catch (error) {
      console.error('Error fetching developers:', error);
    }
  };


  const addTech = () => {
    if (newTech.trim() && !techStack.includes(newTech.trim())) {
      const updatedStack = [...techStack, newTech.trim()];
      setTechStack(updatedStack);
      setValue('tech_stack', updatedStack);
      setNewTech('');
    }
  };

  const removeTech = (tech: string) => {
    const updatedStack = techStack.filter(t => t !== tech);
    setTechStack(updatedStack);
    setValue('tech_stack', updatedStack);
  };

  const onSubmit = async (data: CreateProjectRequest) => {
    setIsLoading(true);
    try {
      const projectData = { ...data, tech_stack: techStack };
      let result;
      if (project) {
        result = await apiService.updateDeveloperProject(project.id, projectData);
      } else {
        result = await apiService.createDeveloperProject(projectData);
      }
      
      toast.success(project ? 'Project updated successfully!' : 'Project created successfully!');
      onSave(result.data);
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-700"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Add New Project
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-300" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Project Name</label>
                <input
                  {...register('name', { required: 'Project name is required' })}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-sm"
                  placeholder="Enter project name"
                />
                {errors.name && <p className="text-red-400 text-sm mt-2">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Developer</label>
                <select
                  {...register('developer', { required: 'Developer is required' })}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-sm"
                >
                  <option value="" className="bg-slate-700">Select Developer</option>
                  {developers.map((dev) => (
                    <option key={dev.id} value={dev.id} className="bg-slate-700">{dev.name}</option>
                  ))}
                </select>
                {errors.developer && <p className="text-red-400 text-sm mt-2">{errors.developer.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">Description</label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-sm"
                placeholder="Enter project description"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">Project Origin</label>
              <input
                {...register('project_origin', { required: 'Project origin is required' })}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-sm"
                placeholder="e.g., Personal Project, Client Work, Open Source"
              />
              {errors.project_origin && <p className="text-red-400 text-sm mt-2">{errors.project_origin.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">Tech Stack</label>
              <div className="flex space-x-2 mb-2">
                <input
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                  className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-sm"
                  placeholder="Add technology"
                />
                <button
                  type="button"
                  onClick={addTech}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 text-sm font-semibold"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-sm"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTech(tech)}
                      className="ml-2 text-blue-300 hover:text-blue-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Repository Link</label>
                <input
                  type="url"
                  {...register('repo_link')}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-sm"
                  placeholder="https://github.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Live Link</label>
                <input
                  type="url"
                  {...register('live_link')}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-sm"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Documentation Link</label>
                <input
                  type="url"
                  {...register('doc_link')}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-sm"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Presentation Link</label>
                <input
                  type="url"
                  {...register('presentation_link')}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-sm"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700 transition-all duration-200 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center text-sm font-semibold"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

const ProjectCard: React.FC<{ 
  project: DeveloperProject; 
  onDelete: (id: number) => void;
  onView: (project: DeveloperProject) => void;
}> = ({ project, onDelete, onView }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 hover:bg-slate-700/50 transition-all duration-300 group cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
            <FolderOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">{project.name}</h3>
            <p className="text-slate-400 text-sm">{project.project_origin}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onView(project)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-600/50 rounded-lg transition-all duration-200"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(project.id)}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {project.developer_name && (
          <div className="flex items-center text-slate-300 text-sm">
            <User className="w-4 h-4 mr-2 text-slate-400" />
            {project.developer_name}
          </div>
        )}
        {project.description && (
          <p className="text-slate-300 text-sm line-clamp-2 leading-relaxed">{project.description}</p>
        )}
      </div>

      {/* Tech Stack */}
      {project.tech_stack && project.tech_stack.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center px-2 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded text-xs font-medium"
              >
                <Code2 className="w-3 h-3 mr-1" />
                {tech}
              </span>
            ))}
            {project.tech_stack.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 bg-slate-600/50 text-slate-400 border border-slate-600/50 rounded text-xs font-medium">
                +{project.tech_stack.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Links */}
      <div className="flex items-center space-x-2">
        {project.repo_link && (
          <a
            href={project.repo_link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-600/50 rounded-lg transition-all duration-200"
            title="Repository"
          >
            <Github className="w-4 h-4" />
          </a>
        )}
        {project.live_link && (
          <a
            href={project.live_link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-600/50 rounded-lg transition-all duration-200"
            title="Live Demo"
          >
            <Globe className="w-4 h-4" />
          </a>
        )}
        {project.doc_link && (
          <a
            href={project.doc_link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-600/50 rounded-lg transition-all duration-200"
            title="Documentation"
          >
            <FileText className="w-4 h-4" />
          </a>
        )}
        {project.presentation_link && (
          <a
            href={project.presentation_link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-600/50 rounded-lg transition-all duration-200"
            title="Presentation"
          >
            <Presentation className="w-4 h-4" />
          </a>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-slate-500 text-xs font-medium">
          ID: {project.id}
        </div>
        {project.created_at && (
          <div className="text-slate-500 text-xs font-medium">
            Created {new Date(project.created_at).toLocaleDateString()}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ProjectsManagement: React.FC = () => {
  const [projects, setProjects] = useState<DeveloperProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<DeveloperProject | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [developerFilter, setDeveloperFilter] = useState('');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [viewProjectId, setViewProjectId] = useState<number | undefined>(undefined);

  useEffect(() => {
    fetchProjects();
  }, [currentPage, developerFilter]);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getDeveloperProjects(currentPage, developerFilter);
      setProjects(response.data);
      if (response.pagination) {
        setTotalPages(Math.ceil(response.pagination.count / response.pagination.page_size));
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to fetch projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = () => {
    setSelectedProject(undefined);
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        setProjects(prev => prev.filter(proj => proj.id !== id));
        toast.success('Project deleted successfully!');
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('Failed to delete project');
      }
    }
  };

  const handleViewProject = (project: DeveloperProject) => {
    setViewProjectId(project.id);
    setIsDetailsOpen(true);
  };

  const handleSaveProject = (project: DeveloperProject) => {
    if (selectedProject) {
      setProjects(prev => prev.map(proj => proj.id === project.id ? project : proj));
    } else {
      setProjects(prev => [...prev, project]);
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (project.developer_name && project.developer_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-8 md:p-12 space-y-12 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">Projects Management</h1>
          <p className="text-slate-400 text-lg">Manage development projects and assignments</p>
        </div>
        <motion.button
          onClick={handleCreateProject}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>Add Project</span>
        </motion.button>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects by name, description, or developer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
            />
          </div>
          <input
            type="text"
            placeholder="Filter by developer..."
            value={developerFilter}
            onChange={(e) => setDeveloperFilter(e.target.value)}
            className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
          />
          <button className="flex items-center space-x-2 bg-slate-700/50 hover:bg-slate-600/50 text-white px-4 py-3 rounded-lg transition-colors font-medium">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4 mx-auto" />
            <p className="text-white/70">Loading projects...</p>
          </div>
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8"
          >
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDelete={handleDeleteProject}
                  onView={handleViewProject}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredProjects.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-700/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No projects found</h3>
              <p className="text-slate-400 mb-4 max-w-md mx-auto text-sm">
                {searchTerm ? 'No projects match your search criteria. Try adjusting your search terms.' : 'Get started by adding your first project to the development portal.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleCreateProject}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                >
                  Add First Project
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-slate-700/50 text-white rounded-lg disabled:opacity-50 hover:bg-slate-600/50 transition-all duration-200 text-sm font-medium disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-white text-sm font-medium px-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-slate-700/50 text-white rounded-lg disabled:opacity-50 hover:bg-slate-600/50 transition-all duration-200 text-sm font-medium disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={selectedProject}
        onSave={handleSaveProject}
      />

      {/* Project Details Modal */}
      <ProjectDetailsModal
        isOpen={isDetailsOpen}
        projectId={viewProjectId}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
};

export default ProjectsManagement;
