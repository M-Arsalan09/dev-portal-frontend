import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {  
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Users, 
  Mail, 
  Calendar,
  Briefcase,
  CheckCircle,
  X,
  Save,
  Eye,
  UserPlus,
  Code2,
  Tags,
  FolderOpen,
  Plus
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import apiService from '../services/api';
import type { Developer, CreateDeveloperRequest } from '../types/api';

interface DeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
  developerId?: number;
  onSave: (developer: Developer) => void;
}

const DeveloperModal: React.FC<DeveloperModalProps> = ({ isOpen, onClose, developerId, onSave }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateDeveloperRequest>();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [originalData, setOriginalData] = useState<CreateDeveloperRequest | null>(null);
  const [,setDeveloperData] = useState<Developer | null>(null);

  useEffect(() => {
    const fetchDeveloperDetails = async () => {
      if (isOpen && developerId) {
        setIsFetchingDetails(true);
        try {
          const response = await apiService.getDeveloper(developerId);
          const developer = response.data;
          setDeveloperData(developer);
          
          const formData = {
            name: developer.name || '',
            email: developer.email || '',
            role: developer.role || '',
            graduation_date: developer.graduation_date || '',
            industry_experience: developer.industry_experience || 0,
            employment_start_date: developer.employment_start_date || '',
            is_available: developer.is_available ?? true
          };
          reset(formData);
          setOriginalData(formData);
        } catch (error) {
          console.error('Error fetching developer details:', error);
          toast.error('Failed to load developer details');
        } finally {
          setIsFetchingDetails(false);
        }
      } else if (isOpen && !developerId) {
        // Creating new developer
        const defaultData = {
          name: '',
          email: '',
          role: '',
          graduation_date: '',
          industry_experience: 0,
          employment_start_date: '',
          is_available: true
        };
        reset(defaultData);
        setOriginalData(null);
        setDeveloperData(null);
      }
    };

    fetchDeveloperDetails();
  }, [isOpen, developerId, reset]);

  const onSubmit = async (data: CreateDeveloperRequest) => {
    setIsLoading(true);
    try {
      let result;
      if (developerId && originalData) {
        // Only send changed fields for update
        const changedData: Partial<CreateDeveloperRequest> = {};
        Object.keys(data).forEach((key) => {
          const fieldKey = key as keyof CreateDeveloperRequest;
          if (data[fieldKey] !== originalData[fieldKey]) {
            (changedData as any)[fieldKey] = data[fieldKey];
          }
        });
        
        // If no changes, show message and return
        if (Object.keys(changedData).length === 0) {
          toast('No changes were made.');
          onClose();
          return;
        }
        
        result = await apiService.updateDeveloper(developerId, changedData);
      } else {
        result = await apiService.createDeveloper(data);
      }
      
      toast.success(developerId ? 'Developer updated successfully!' : 'Developer created successfully!');
      onSave(result.data);
      onClose();
    } catch (error) {
      console.error('Error saving developer:', error);
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
        className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-slate-700"
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">
              {developerId ? 'Edit Developer' : 'Add New Developer'}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-slate-300" />
            </button>
          </div>

          {isFetchingDetails && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-slate-600/30 border-t-blue-500 rounded-full animate-spin mb-2 mx-auto" />
                <p className="text-slate-400 text-sm">Loading developer details...</p>
              </div>
            </div>
          )}

          {!isFetchingDetails && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Name</label>
                <input
                  {...register('name')}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-sm"
                  placeholder="Enter developer name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Email</label>
                <input
                  type="email"
                  {...register('email', { 
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-sm"
                  placeholder="Enter email address"
                />
                {errors.email && <p className="text-red-400 text-sm mt-2">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Role</label>
                <input
                  {...register('role')}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-sm"
                  placeholder="Enter role/position"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Graduation Date</label>
                <input
                  type="date"
                  {...register('graduation_date')}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Industry Experience (years)</label>
                <input
                  type="number"
                  min="0"
                  {...register('industry_experience', { 
                    min: { value: 0, message: 'Experience cannot be negative' }
                  })}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-sm"
                  placeholder="Enter years of experience"
                />
                {errors.industry_experience && <p className="text-red-400 text-sm mt-2">{errors.industry_experience.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Employment Start Date</label>
                <input
                  type="date"
                  {...register('employment_start_date')}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-sm"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  {...register('is_available')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600 rounded bg-slate-700"
                />
                <label className="block text-sm font-semibold text-white">Available for projects</label>
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
                      <Save className="w-4 h-4 mr-1.5" />
                      {developerId ? 'Update' : 'Create'}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

interface DeveloperDetailsModalProps {
  isOpen: boolean;
  developerId?: number;
  onClose: () => void;
}

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
        className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-slate-700"
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
                    <Tags className="w-5 h-5 mr-2 text-amber-400" />
                    Skills Used in Project
                  </h3>
                  <div className="space-y-4">
                    {project.skills.map((area: any) => (
                      <div key={area.skill_area_id} className="border border-slate-700/30 rounded-lg p-4 bg-slate-700/20">
                        <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                          <Tags className="w-4 h-4 mr-2 text-amber-400" />
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
                    <Code2 className="w-5 h-5 mr-3 text-blue-400" />
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
                    <Eye className="w-5 h-5 mr-3 text-emerald-400" />
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
                    <FolderOpen className="w-5 h-5 mr-3 text-violet-400" />
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
                    <Eye className="w-5 h-5 mr-3 text-amber-400" />
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
                      <Tags className="w-4 h-4 mr-2 text-slate-400" />
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

const DeveloperDetailsModal: React.FC<DeveloperDetailsModalProps> = ({ isOpen, developerId, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [developer, setDeveloper] = useState<Developer | undefined>();
  const [selectedProjectId, setSelectedProjectId] = useState<number | undefined>(undefined);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!isOpen || !developerId) return;
      setIsLoading(true);
      try {
        const res = await apiService.getDeveloper(developerId);
        setDeveloper(res.data);
      } catch (err) {
        toast.error('Failed to load developer details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [isOpen, developerId]);

  const calculateEmploymentDuration = (startDate: string) => {
    if (!startDate) return 'Not specified';
    
    const start = new Date(startDate);
    const now = new Date();
    
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    if (years === 0) {
      return months === 1 ? '1 month' : `${months} months`;
    } else if (months === 0) {
      return years === 1 ? '1 year' : `${years} years`;
    } else {
      const yearText = years === 1 ? '1 year' : `${years} years`;
      const monthText = months === 1 ? '1 month' : `${months} months`;
      return `${yearText}, ${monthText}`;
    }
  };

  const handleProjectClick = (project: any) => {
    setSelectedProjectId(project.id || project.project_id);
    setIsProjectModalOpen(true);
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
        <div className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6">
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
        ) : developer ? (
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                <span className="text-white font-bold text-xl">
                    {developer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">{developer.name}</h2>
                <p className="text-white/80 text-lg">{developer.role}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                    developer.is_available 
                      ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-300/30' 
                      : 'bg-red-500/20 text-red-200 border border-red-300/30'
                  }`}>
                    <CheckCircle className="w-4 h-4 mr-1.5" />
                {developer.is_available ? 'Available' : 'Busy'}
              </span>
                  <span className="text-white/60 text-sm">ID: {developerId}</span>
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
                <p className="text-slate-400">Loading developer details...</p>
              </div>
            </div>
          ) : developer ? (
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-400" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-400 mb-1">Email Address</label>
                      <div className="flex items-center text-white">
                        <Mail className="w-4 h-4 mr-2 text-slate-400" />
                        {developer.email}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-400 mb-1">Industry Experience</label>
                      <div className="flex items-center text-white">
                        <Briefcase className="w-4 h-4 mr-2 text-slate-400" />
                        {developer.industry_experience} years
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-400 mb-1">Employment Duration</label>
                      <div className="flex items-center text-white">
                        <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                        {calculateEmploymentDuration(developer.employment_start_date)}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-400 mb-1">Employment Start Date</label>
                      <div className="flex items-center text-white">
                        <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                        {developer.employment_start_date ? new Date(developer.employment_start_date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }) : 'Not specified'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-400 mb-1">Graduation Date</label>
                      <div className="flex items-center text-white">
                        <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                        {developer.graduation_date ? new Date(developer.graduation_date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }) : 'Not specified'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Code2 className="w-5 h-5 mr-2 text-violet-400" />
                  Skills & Expertise
                </h3>
                {developer.skills && developer.skills.length > 0 ? (
                  <div className="space-y-6">
                    {developer.skills.map((area) => (
                      <div key={area.id} className="border border-slate-700/30 rounded-lg p-4 bg-slate-700/20">
                        <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                          <Tags className="w-4 h-4 mr-2 text-amber-400" />
                          {area.name}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {(area.skills || []).map((skill) => (
                            <span 
                              key={skill.id} 
                              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-slate-600 to-slate-700 text-slate-200 border border-slate-600/50 hover:scale-105 transition-transform"
                            >
                              {skill.name?.trim() || 'Unknown Skill'}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <Tags className="w-12 h-12 mx-auto mb-3 text-slate-500" />
                    <p className="text-lg">No skills added yet</p>
                    <p className="text-sm">Skills will appear here once they are added to this developer's profile.</p>
                  </div>
                )}
            </div>

              {/* Projects Section */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <FolderOpen className="w-5 h-5 mr-2 text-emerald-400" />
                  Projects Portfolio
                </h3>
              {developer.projects && developer.projects.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {developer.projects.map((project) => (
                      <div 
                        key={project.id} 
                        onClick={() => handleProjectClick(project)}
                        className="border border-slate-700/50 rounded-lg p-5 bg-slate-700/30 hover:bg-slate-700/40 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">{project.name}</h4>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 rounded-md text-xs font-medium bg-slate-600/50 text-slate-300 border border-slate-600/50">
                              {project.project_origin}
                            </span>
                            <div className="text-slate-400 group-hover:text-white transition-colors">
                              <Eye className="w-4 h-4" />
                      </div>
                          </div>
                        </div>
                        {project.description && (
                          <p className="text-slate-300 text-sm mb-4 leading-relaxed line-clamp-2">{project.description}</p>
                        )}
                        {project.tech_stack && project.tech_stack.length > 0 && (
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-2">Tech Stack</label>
                      <div className="flex flex-wrap gap-1.5">
                              {project.tech_stack.slice(0, 4).map((tech, idx) => (
                                <span 
                                  key={idx} 
                                  className="px-2 py-1 rounded-md text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                >
                                  {tech}
                                </span>
                              ))}
                              {project.tech_stack.length > 4 && (
                                <span className="px-2 py-1 rounded-md text-xs font-medium bg-slate-600/50 text-slate-400 border border-slate-600/50">
                                  +{project.tech_stack.length - 4} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        <div className="mt-3 pt-3 border-t border-slate-600/30">
                          <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                            Click to view project details
                          </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                  <div className="text-center py-8 text-slate-400">
                    <FolderOpen className="w-12 h-12 mx-auto mb-3 text-slate-500" />
                    <p className="text-lg">No projects found</p>
                    <p className="text-sm">Projects will appear here once they are added to this developer's profile.</p>
                  </div>
              )}
            </div>
          </div>
        ) : (
            <div className="text-center py-12 text-slate-400">
              <p className="text-lg">No developer data available</p>
            </div>
        )}
        </div>
      </motion.div>
      
      {/* Project Details Modal */}
      <ProjectDetailsModal
        isOpen={isProjectModalOpen}
        projectId={selectedProjectId}
        onClose={() => setIsProjectModalOpen(false)}
      />
    </div>
  );
};

interface DeveloperSkillsModalProps {
  isOpen: boolean;
  developer: Developer | null;
  onClose: () => void;
  onSkillsAdded: () => void;
}

const DeveloperSkillsModal: React.FC<DeveloperSkillsModalProps> = ({ isOpen, developer, onClose, onSkillsAdded }) => {
  const [skillAreas, setSkillAreas] = useState<any[]>([]);
  const [selectedSkillArea, setSelectedSkillArea] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSkillAreas();
    } else {
      // Reset state when modal closes
      setSelectedSkillArea(null);
      setSkills([]);
      setSelectedSkills([]);
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

  const handleAddSkills = async () => {
    if (!developer || selectedSkills.length === 0) {
      toast.error('Please select at least one skill');
      return;
    }

    setIsAdding(true);
    try {
      await apiService.addDeveloperSkills({
        dev_id: developer.id,
        skill_ids: selectedSkills
      });
      
      toast.success('Skills added successfully!');
      onSkillsAdded();
      onClose();
    } catch (error) {
      console.error('Error adding skills:', error);
      toast.error('Failed to add skills');
    } finally {
      setIsAdding(false);
    }
  };

  if (!isOpen || !developer) return null;

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
              <span className="text-white font-bold text-xl">
                {developer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">Add Skills to {developer.name}</h2>
              <p className="text-white/80 text-lg">Select skills to add to this developer's profile</p>
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
                  <Users className="w-5 h-5 mr-2 text-blue-400" />
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
                          <Tags className="w-5 h-5 text-white" />
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
                      <Tags className="w-5 h-5 mr-2 text-violet-400" />
                      Skills in {selectedSkillArea.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          const allSkillIds = skills.map(skill => skill.skill_id);
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
                          onClick={() => toggleSkillSelection(skill.skill_id)}
                          className={`p-3 rounded-lg border transition-all flex items-center space-x-3 ${
                            selectedSkills.includes(skill.skill_id)
                              ? 'bg-violet-500/20 border-violet-500 text-violet-300'
                              : 'bg-slate-700/30 border-slate-600/30 text-slate-300 hover:bg-slate-700/50'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                            selectedSkills.includes(skill.skill_id)
                              ? 'bg-violet-500 border-violet-500'
                              : 'border-slate-400'
                          }`}>
                            {selectedSkills.includes(skill.skill_id) && (
                              <X className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <span className="font-medium">{skill.skill_name}</span>
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
                    <Tags className="w-5 h-5 mr-2 text-emerald-400" />
                    Selected Skills ({selectedSkills.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map((skillId) => {
                      const skill = skills.find(s => s.skill_id === skillId);
                      return skill ? (
                        <span
                          key={skillId}
                          className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm border border-emerald-500/30"
                        >
                          {skill.skill_name}
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
            onClick={handleAddSkills}
            disabled={selectedSkills.length === 0 || isAdding}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            {isAdding ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Add Skills</span>
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

const DeveloperCard: React.FC<{ 
  developer: Developer; 
  onEdit: (developer: Developer) => void;
  onDelete: (id: number) => void;
  onView: (developer: Developer) => void;
  onAddSkills: (developer: Developer) => void;
}> = ({ developer, onEdit, onDelete, onView, onAddSkills }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 border border-slate-700/50 hover:bg-slate-700/50 transition-all duration-300 group cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <span className="text-white font-bold">
              {developer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-white mb-1">{developer.name}</h3>
            <p className="text-slate-400 text-sm font-medium">{developer.role}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => onView(developer)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-600/50 rounded-lg transition-all duration-200"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onAddSkills(developer)}
            className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-all duration-200"
            title="Add Skills"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(developer)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-600/50 rounded-lg transition-all duration-200"
            title="Edit Developer"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(developer.id)}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
            title="Delete Developer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2.5 mb-4">
        <div className="flex items-center text-slate-300 text-sm">
          <Mail className="w-4 h-4 mr-2.5 text-slate-400" />
          {developer.email}
        </div>
        <div className="flex items-center text-slate-300 text-sm">
          <Briefcase className="w-4 h-4 mr-2.5 text-slate-400" />
          {developer.industry_experience} years experience
        </div>
        {developer.employment_start_date && (
        <div className="flex items-center text-slate-300 text-sm">
          <Calendar className="w-4 h-4 mr-2.5 text-slate-400" />
          Started {new Date(developer.employment_start_date).toLocaleDateString()}
        </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${
          developer.is_available
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
          {developer.is_available ? 'Available' : 'Busy'}
        </span>
        <div className="text-slate-500 text-xs font-medium">
          ID: {developer.id}
        </div>
      </div>
    </motion.div>
  );
};

const DevelopersManagement: React.FC = () => {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeveloperId, setSelectedDeveloperId] = useState<number | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [viewDeveloperId, setViewDeveloperId] = useState<number | undefined>(undefined);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null);

  useEffect(() => {
    fetchDevelopers();
  }, [currentPage]);

  const fetchDevelopers = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getDevelopers(currentPage);
      setDevelopers(response.data);
      if (response.pagination) {
        setTotalPages(Math.ceil(response.pagination.count / response.pagination.page_size));
      }
    } catch (error) {
      console.error('Error fetching developers:', error);
      toast.error('Failed to fetch developers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDeveloper = () => {
    setSelectedDeveloperId(undefined);
    setIsModalOpen(true);
  };

  const handleEditDeveloper = (developer: Developer) => {
    setSelectedDeveloperId(developer.id);
    setIsModalOpen(true);
  };

  const handleDeleteDeveloper = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this developer?')) {
      try {
        // Note: Delete endpoint not mentioned in API guide, so we'll just remove from state
        setDevelopers(prev => prev.filter(dev => dev.id !== id));
        toast.success('Developer deleted successfully!');
      } catch (error) {
        console.error('Error deleting developer:', error);
        toast.error('Failed to delete developer');
      }
    }
  };

  const handleViewDeveloper = (developer: Developer) => {
    setViewDeveloperId(developer.id);
    setIsDetailsOpen(true);
  };

  const handleAddSkills = (developer: Developer) => {
    setSelectedDeveloper(developer);
    setIsSkillsModalOpen(true);
  };

  const handleSkillsAdded = async () => {
    // Refresh the developers list to get updated skill data
    await fetchDevelopers();
  };

  const handleSaveDeveloper = async (developer: Developer) => {
    if (selectedDeveloperId) {
      // For updates, refresh the entire list to get the latest data
      await fetchDevelopers();
    } else {
      // For new developers, add to the current list
      setDevelopers(prev => [...prev, developer]);
    }
  };

  const filteredDevelopers = developers.filter(developer =>
    developer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    developer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    developer.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-6 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1.5 tracking-tight">Developers Management</h1>
          <p className="text-slate-400 text-sm md:text-base">Manage your development team members and their profiles</p>
        </div>
        <motion.button
          onClick={handleCreateDeveloper}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Developer</span>
        </motion.button>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 border border-slate-700/50 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search developers by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-sm"
            />
          </div>
          <button className="flex items-center space-x-2 bg-slate-700/50 hover:bg-slate-600/50 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Developers Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-slate-600/30 border-t-blue-500 rounded-full animate-spin mb-4 mx-auto" />
            <h3 className="text-base font-semibold text-white mb-1">Loading Developers</h3>
            <p className="text-slate-400">Fetching team members...</p>
          </div>
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
          >
            <AnimatePresence>
              {filteredDevelopers.map((developer) => (
                <DeveloperCard
                  key={developer.id}
                  developer={developer}
                  onEdit={handleEditDeveloper}
                  onDelete={handleDeleteDeveloper}
                  onView={handleViewDeveloper}
                  onAddSkills={handleAddSkills}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredDevelopers.length === 0 && !isLoading && (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-slate-700/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No developers found</h3>
              <p className="text-slate-400 mb-4 max-w-md mx-auto text-sm">
                {searchTerm ? 'No developers match your search criteria. Try adjusting your search terms.' : 'Get started by adding your first team member to the development portal.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleCreateDeveloper}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                >
                  Add First Developer
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

      {/* Developer Modal */}
      <DeveloperModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        developerId={selectedDeveloperId}
        onSave={handleSaveDeveloper}
      />

      {/* Developer Details Modal */}
      <DeveloperDetailsModal
        isOpen={isDetailsOpen}
        developerId={viewDeveloperId}
        onClose={() => setIsDetailsOpen(false)}
      />

      {/* Developer Skills Modal */}
      <DeveloperSkillsModal
        isOpen={isSkillsModalOpen}
        developer={selectedDeveloper}
        onClose={() => setIsSkillsModalOpen(false)}
        onSkillsAdded={handleSkillsAdded}
      />
    </div>
  );
};

export default DevelopersManagement;
