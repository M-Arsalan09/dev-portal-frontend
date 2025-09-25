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
  CheckCircle,
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
import type { DeveloperProject, CreateProjectRequest, Developer } from '../types/api';

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
  onNext: (projectData: any) => void;
  showCategoryModal: boolean;
  setShowCategoryModal: (show: boolean) => void;
  onCategoryCreated: (category: any) => void;
}

interface ProjectSkillsSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectData: any;
  onSave: (project: DeveloperProject) => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, project, onSave, onNext, showCategoryModal, setShowCategoryModal, onCategoryCreated }) => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateProjectRequest>();
  const [isLoading, setIsLoading] = useState(false);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [projectCategories, setProjectCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [techStack, setTechStack] = useState<string[]>([]);
  const [newTech, setNewTech] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchDevelopers();
      fetchProjectCategories();
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

  const fetchProjectCategories = async () => {
    try {
      const response = await apiService.getProjectCategories();
      setProjectCategories(response.data);
    } catch (error) {
      console.error('Error fetching project categories:', error);
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

  const toggleCategorySelection = (categoryId: number) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCategoryCreated = (newCategory: any) => {
    setProjectCategories(prev => [...prev, newCategory]);
    setSelectedCategories(prev => [...prev, newCategory.id]);
    onCategoryCreated(newCategory);
  };

  const onSubmit = async (data: CreateProjectRequest) => {
    setIsLoading(true);
    try {
      const projectData = { 
        ...data, 
        tech_stack: techStack,
        project_categories: selectedCategories
      };
      
      if (project) {
        // For editing existing projects, create directly
        const result = await apiService.updateDeveloperProject(project.id, projectData);
        toast.success('Project updated successfully!');
        onSave(result.data);
        onClose();
      } else {
        // For new projects, go to skills selection step
        onNext(projectData);
        onClose();
      }
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
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-white">Project Categories</label>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(true)}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center space-x-1 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-32 overflow-y-auto">
                {projectCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleCategorySelection(category.id)}
                    className={`p-3 rounded-lg border transition-all text-left ${
                      selectedCategories.includes(category.id)
                        ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                        : 'bg-slate-700/30 border-slate-600/30 text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        selectedCategories.includes(category.id)
                          ? 'bg-purple-500 border-purple-500'
                          : 'border-slate-400'
                      }`}>
                        {selectedCategories.includes(category.id) && (
                          <X className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{category.name}</h4>
                        {category.description && (
                          <p className="text-xs text-gray-400 line-clamp-1">{category.description}</p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {selectedCategories.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-slate-400 mb-1">Selected categories:</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedCategories.map((categoryId) => {
                      const category = projectCategories.find(c => c.id === categoryId);
                      return category ? (
                        <span
                          key={categoryId}
                          className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs border border-purple-500/30"
                        >
                          {category.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
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
                    {project ? 'Update' : 'Next: Select Skills'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Project Category Modal */}
      <ProjectCategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onCategoryCreated={handleCategoryCreated}
      />
    </div>
  );
};

interface ProjectCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryCreated: (category: any) => void;
}

const ProjectCategoryModal: React.FC<ProjectCategoryModalProps> = ({ isOpen, onClose, onCategoryCreated }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isCreating, setIsCreating] = useState(false);
  const [useCases, setUseCases] = useState<string[]>([]);
  const [newUseCase, setNewUseCase] = useState('');

  useEffect(() => {
    if (!isOpen) {
      reset();
      setUseCases([]);
      setNewUseCase('');
    }
  }, [isOpen, reset]);

  const addUseCase = () => {
    if (newUseCase.trim() && !useCases.includes(newUseCase.trim())) {
      setUseCases(prev => [...prev, newUseCase.trim()]);
      setNewUseCase('');
    }
  };

  const removeUseCase = (useCase: string) => {
    setUseCases(prev => prev.filter(uc => uc !== useCase));
  };

  const onSubmit = async (data: any) => {
    if (useCases.length === 0) {
      toast.error('Please add at least one use case');
      return;
    }

    setIsCreating(true);
    try {
      const categoryData = {
        ...data,
        use_cases: useCases
      };

      const result = await apiService.createProjectCategory(categoryData);
      toast.success('Project category created successfully!');
      onCategoryCreated(result.data);
    } catch (error) {
      console.error('Error creating project category:', error);
      toast.error('Failed to create project category');
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Create Project Category</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-300" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Category Name
              </label>
              <input
                {...register('name', { required: 'Category name is required' })}
                placeholder="e.g., Automation, Web Development"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{String(errors.name.message)}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description
              </label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                placeholder="Describe what this project category involves..."
                rows={3}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.description && <p className="text-red-400 text-sm mt-1">{String(errors.description.message)}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Use Cases
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  value={newUseCase}
                  onChange={(e) => setNewUseCase(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addUseCase())}
                  placeholder="Add a use case..."
                  className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addUseCase}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {useCases.map((useCase, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg">
                    <span className="text-slate-300 text-sm">{useCase}</span>
                    <button
                      type="button"
                      onClick={() => removeUseCase(useCase)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating || useCases.length === 0}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center justify-center"
              >
                {isCreating ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Category
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

const ProjectSkillsSelectionModal: React.FC<ProjectSkillsSelectionModalProps> = ({ isOpen, onClose, projectData, onSave }) => {
  const [skillAreas, setSkillAreas] = useState<any[]>([]);
  const [selectedSkillArea, setSelectedSkillArea] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSkillAreas();
    }
  }, [isOpen]);

  const fetchSkillAreas = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getSkillAreas();
      setSkillAreas(response.data);
    } catch (error) {
      console.error('Error fetching skill areas:', error);
      toast.error('Failed to fetch skill areas');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSkillsForArea = async (skillAreaId: number) => {
    setIsLoadingSkills(true);
    try {
      const response = await apiService.getSkillArea(skillAreaId);
      setSkills(response.data.skills || []);
      setSelectedSkillArea(response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast.error('Failed to fetch skills');
    } finally {
      setIsLoadingSkills(false);
    }
  };

  const toggleSkillSelection = (skillId: number) => {
    setSelectedSkills(prev => 
      prev.includes(skillId) 
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  const handleCreateProject = async () => {
    if (selectedSkills.length === 0) {
      toast.error('Please select at least one skill');
      return;
    }

    setIsCreating(true);
    try {
      const finalProjectData = {
        ...projectData,
        skills: selectedSkills
      };

      const result = await apiService.createDeveloperProject(finalProjectData);
      toast.success('Project created successfully!');
      onSave(result.data);
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    } finally {
      setIsCreating(false);
    }
  };

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
          
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
              <Tag className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">Select Project Skills</h2>
              <p className="text-white/80 text-lg">Choose skills used in "{projectData.name}"</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-3 border-slate-600/30 border-t-emerald-500 rounded-full animate-spin mb-4 mx-auto" />
                <p className="text-slate-400">Loading skill areas...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Skill Areas Selection */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-400" />
                  Select Skill Area
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {skillAreas.map((area) => (
                    <button
                      key={area.id}
                      onClick={() => fetchSkillsForArea(area.id)}
                      className={`p-4 rounded-lg border transition-all ${
                        selectedSkillArea?.id === area.id
                          ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                          : 'bg-slate-700/30 border-slate-600/30 text-slate-300 hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <Tag className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                          <h4 className="font-semibold">{area.name}</h4>
                          <p className="text-sm text-gray-400 opacity-70">
                            {area.skills_count || 0} skills
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Skills Selection */}
              {selectedSkillArea && (
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <Tag className="w-5 h-5 mr-2 text-violet-400" />
                      Select Skills
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          const allSkillIds = skills.map(skill => skill.id);
                          setSelectedSkills(prev => {
                            const newSelection = [...prev];
                            allSkillIds.forEach(id => {
                              if (!newSelection.includes(id)) {
                                newSelection.push(id);
                              }
                            });
                            return newSelection;
                          });
                        }}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-1 text-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Select All</span>
                      </button>
                      <button
                        onClick={() => setShowAddSkillModal(true)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New Skill</span>
                      </button>
                    </div>
                  </div>

                  {isLoadingSkills ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-8 h-8 border-2 border-slate-600/30 border-t-violet-500 rounded-full animate-spin" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {skills.map((skill) => (
                        <button
                          key={skill.id}
                          onClick={() => toggleSkillSelection(skill.id)}
                          className={`p-3 rounded-lg border transition-all flex items-center space-x-3 ${
                            selectedSkills.includes(skill.id)
                              ? 'bg-violet-500/20 border-violet-500 text-violet-300'
                              : 'bg-slate-700/30 border-slate-600/30 text-slate-300 hover:bg-slate-700/50'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                            selectedSkills.includes(skill.id)
                              ? 'bg-violet-500 border-violet-500'
                              : 'border-slate-400'
                          }`}>
                            {selectedSkills.includes(skill.id) && (
                              <X className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <span className="font-medium">{skill.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Selected Skills Summary */}
              {selectedSkills.length > 0 && (
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Tag className="w-5 h-5 mr-2 text-emerald-400" />
                    Selected Skills ({selectedSkills.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map((skillId) => {
                      const skill = skills.find(s => s.id === skillId);
                      return skill ? (
                        <span
                          key={skillId}
                          className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm border border-emerald-500/30"
                        >
                          {skill.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-slate-700">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateProject}
            disabled={selectedSkills.length === 0 || isCreating}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            {isCreating ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Create Project</span>
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Add Skill Modal */}
      <AddSkillModal
        isOpen={showAddSkillModal}
        onClose={() => setShowAddSkillModal(false)}
        onSkillAdded={() => {
          setShowAddSkillModal(false);
          if (selectedSkillArea) {
            fetchSkillsForArea(selectedSkillArea.id);
          }
        }}
      />
    </div>
  );
};

const AddSkillModal: React.FC<{ isOpen: boolean; onClose: () => void; onSkillAdded: () => void }> = ({ isOpen, onClose, onSkillAdded }) => {
  const [skillAreas, setSkillAreas] = useState<any[]>([]);
  const [selectedSkillAreaId, setSelectedSkillAreaId] = useState<number | null>(null);
  const [newSkillArea, setNewSkillArea] = useState<string>('');
  const [skills, setSkills] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSkillAreas();
    } else {
      // Reset form when modal closes
      setSelectedSkillAreaId(null);
      setNewSkillArea('');
      setSkills('');
    }
  }, [isOpen]);

  const fetchSkillAreas = async () => {
    try {
      const response = await apiService.getSkillAreas();
      setSkillAreas(response.data);
    } catch (error) {
      console.error('Error fetching skill areas:', error);
      toast.error('Failed to fetch skill areas');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skills.trim()) {
      toast.error('Please enter at least one skill');
      return;
    }

    if (!selectedSkillAreaId && !newSkillArea.trim()) {
      toast.error('Please select an existing skill area or create a new one');
      return;
    }

    setIsCreating(true);
    try {
      const requestData: any = {
        skills: skills
      };

      if (selectedSkillAreaId) {
        // If user selected an existing skill area, send the skill_id
        requestData.skill_id = selectedSkillAreaId;
      } else {
        // If user is creating a new skill area, send the skill_area name
        requestData.skill_area = newSkillArea;
      }

      await apiService.addSkillsToSkillArea(requestData);
      toast.success('Skills added successfully!');
      
      // Refresh skill areas data to get updated counts
      await fetchSkillAreas();
      
      // Reset the selected skill area so user can see fresh data
      setSelectedSkillAreaId(null);
      setNewSkillArea('');
      setSkills('');
      
      toast.success('Skill areas data refreshed!');
      onSkillAdded();
    } catch (error) {
      console.error('Error adding skills:', error);
      toast.error('Failed to add skills');
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Add New Skills</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-300" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Select Existing Skill Area
              </label>
              <select
                value={selectedSkillAreaId || ''}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : null;
                  setSelectedSkillAreaId(value);
                  if (value) {
                    setNewSkillArea(''); // Clear new skill area if existing one is selected
                  }
                }}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Choose a skill area...</option>
                {skillAreas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-center text-slate-400">OR</div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Create New Skill Area
              </label>
              <input
                type="text"
                value={newSkillArea}
                onChange={(e) => {
                  setNewSkillArea(e.target.value);
                  if (e.target.value.trim()) {
                    setSelectedSkillAreaId(null); // Clear existing selection if new one is entered
                  }
                }}
                placeholder="Enter new skill area name"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Skills (comma-separated)
              </label>
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g., React, Node.js, Python"
                rows={3}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating || (!selectedSkillAreaId && !newSkillArea.trim())}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center justify-center"
              >
                {isCreating ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skills
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
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<DeveloperProject | undefined>();
  const [projectData, setProjectData] = useState<any>(null);
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

  const handleNextToSkills = (data: any) => {
    setProjectData(data);
    setIsSkillsModalOpen(true);
  };

  const handleCategoryCreated = () => {
    setShowCategoryModal(false);
    // The ProjectModal will handle updating its own state
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
        onNext={handleNextToSkills}
        showCategoryModal={showCategoryModal}
        setShowCategoryModal={setShowCategoryModal}
        onCategoryCreated={handleCategoryCreated}
      />

      {/* Project Skills Selection Modal */}
      <ProjectSkillsSelectionModal
        isOpen={isSkillsModalOpen}
        onClose={() => setIsSkillsModalOpen(false)}
        projectData={projectData}
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
