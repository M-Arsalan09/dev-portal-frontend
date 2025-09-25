import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Code2, 
  CheckCircle,
  X,
  Save,
  Eye,
  ChevronDown,
  ChevronRight,
  List,
  Target,
  Tag,
  Users,
  Check,
  ArrowRight
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import apiService from '../services/api';
import type { ProjectCategory, DetailedProjectCategory, CreateProjectCategoryRequest } from '../types/api';

interface ProjectCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: ProjectCategory;
  onSave: (category: ProjectCategory) => void;
}

interface ProjectCategoryViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: ProjectCategory;
}

interface SkillSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: number;
  onSkillsAdded: () => void;
}

interface AddSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSkillAdded: () => void;
}

const ProjectCategoryModal: React.FC<ProjectCategoryModalProps> = ({ isOpen, onClose, category, onSave }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateProjectCategoryRequest>();
  const [isLoading, setIsLoading] = useState(false);
  const [useCases, setUseCases] = useState<string[]>([]);
  const [newUseCase, setNewUseCase] = useState('');

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description || '',
        use_cases: category.use_cases || []
      });
      setUseCases(category.use_cases || []);
    } else {
      reset({
        name: '',
        description: '',
        use_cases: []
      });
      setUseCases([]);
    }
  }, [category, reset]);

  const addUseCase = () => {
    if (newUseCase.trim() && !useCases.includes(newUseCase.trim())) {
      const updatedUseCases = [...useCases, newUseCase.trim()];
      setUseCases(updatedUseCases);
      setNewUseCase('');
    }
  };

  const removeUseCase = (useCase: string) => {
    setUseCases(prev => prev.filter(uc => uc !== useCase));
  };

  const onSubmit = async (data: CreateProjectCategoryRequest) => {
    setIsLoading(true);
    try {
      const categoryData = { ...data, use_cases: useCases };
      let result;
      if (category) {
        result = await apiService.updateProjectCategory(category.id, categoryData);
      } else {
        result = await apiService.createProjectCategory(categoryData);
      }
      
      toast.success(category ? 'Category updated successfully!' : 'Category created successfully!');
      onSave(result.data);
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {category ? 'Edit Project Category' : 'Add New Project Category'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
              <input
                {...register('name', { required: 'Category name is required' })}
                className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter category name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={4}
                className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter category description"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Use Cases</label>
              <div className="flex space-x-2 mb-2">
                <input
                  value={newUseCase}
                  onChange={(e) => setNewUseCase(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addUseCase())}
                  className="flex-1 px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add use case"
                />
                <button
                  type="button"
                  onClick={addUseCase}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {useCases.map((useCase, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm text-gray-700">{useCase}</span>
                    <button
                      type="button"
                      onClick={() => removeUseCase(useCase)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Required Skills Button - Only show for existing categories */}
            {category && (
              <div className="pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    // Trigger skill selection modal
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new CustomEvent('openSkillSelection', { 
                        detail: { categoryId: category.id } 
                      }));
                    }
                  }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Tag className="w-4 h-4" />
                  <span>Add Required Skills</span>
                </button>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {category ? 'Update' : 'Create'}
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

const ProjectCategoryViewModal: React.FC<ProjectCategoryViewModalProps> = ({ isOpen, onClose, category }) => {
  const [detailedCategory, setDetailedCategory] = useState<DetailedProjectCategory | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && category) {
      fetchDetailedCategory();
    }
  }, [isOpen, category]);

  const fetchDetailedCategory = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getProjectCategory(category.id);
      setDetailedCategory(response.data);
    } catch (error) {
      console.error('Error fetching category details:', error);
      toast.error('Failed to fetch category details');
    } finally {
      setIsLoading(false);
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
        <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
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
          ) : detailedCategory ? (
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                <Code2 className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">{detailedCategory.name}</h2>
                <p className="text-white/80 text-lg">Project Category</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-white/20 text-white border border-white/30">
                    Category ID: {detailedCategory.id}
                  </span>
                  {detailedCategory.created_at && (
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-white/20 text-white border border-white/30">
                      Created: {new Date(detailedCategory.created_at).toLocaleDateString()}
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
                <div className="w-12 h-12 border-3 border-slate-600/30 border-t-indigo-500 rounded-full animate-spin mb-4 mx-auto" />
                <p className="text-slate-400">Loading category details...</p>
              </div>
            </div>
          ) : detailedCategory ? (
            <div className="space-y-6">
              {/* Description */}
              {detailedCategory.description && (
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-blue-400" />
                    Category Description
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {detailedCategory.description}
                  </p>
                </div>
              )}

              {/* Use Cases */}
              {detailedCategory.use_cases && detailedCategory.use_cases.length > 0 && (
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-emerald-400" />
                    Use Cases
                  </h3>
                  <div className="space-y-3">
                    {detailedCategory.use_cases.map((useCase, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-4 bg-slate-700/30 border border-slate-600/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                      >
                        <Target className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300">{useCase}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Required Skills */}
              {detailedCategory.skills && detailedCategory.skills.length > 0 && (
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <List className="w-5 h-5 mr-2 text-violet-400" />
                    Required Skills
                  </h3>
                  <div className="space-y-4">
                    {detailedCategory.skills.map((skillArea) => (
                      <div key={skillArea.skill_area_id} className="border border-slate-700/30 rounded-lg p-4 bg-slate-700/20">
                        <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                          <List className="w-4 h-4 mr-2 text-violet-400" />
                          {skillArea.skill_area_name}
                        </h4>
                        {skillArea.skills && skillArea.skills.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {skillArea.skills.map((skill) => (
                              <span
                                key={skill.skill_id}
                                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-violet-600 to-violet-700 text-violet-100 border border-violet-500/50 hover:scale-105 transition-transform"
                              >
                                {skill.skill_name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-slate-400 text-sm italic">No skills defined for this area</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Statistics */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Code2 className="w-5 h-5 mr-2 text-amber-400" />
                  Category Statistics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-slate-700/30 border border-slate-600/30 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-400 mb-1">
                      {detailedCategory.use_cases?.length || 0}
                    </div>
                    <div className="text-slate-300 text-sm">Use Cases</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 border border-slate-600/30 rounded-lg">
                    <div className="text-2xl font-bold text-violet-400 mb-1">
                      {detailedCategory.skills?.length || 0}
                    </div>
                    <div className="text-slate-300 text-sm">Skill Areas</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 border border-slate-600/30 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400 mb-1">
                      {detailedCategory.skills?.reduce((total, area) => total + (area.skills?.length || 0), 0) || 0}
                    </div>
                    <div className="text-slate-300 text-sm">Total Skills</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Failed to Load Details</h3>
              <p className="text-slate-400 mb-4">Unable to fetch detailed information for this category.</p>
              <button
                onClick={fetchDetailedCategory}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const SkillSelectionModal: React.FC<SkillSelectionModalProps> = ({ isOpen, onClose, categoryId, onSkillsAdded }) => {
  const [skillAreas, setSkillAreas] = useState<any[]>([]);
  const [selectedSkillArea, setSelectedSkillArea] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSkillAreas();
    }
  }, [isOpen]);

  const fetchSkillAreas = async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    try {
      const response = await apiService.getSkillAreas();
      setSkillAreas(response.data);
    } catch (error) {
      console.error('Error fetching skill areas:', error);
      toast.error('Failed to fetch skill areas');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
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
    if (selectedSkills.length === 0) {
      toast.error('Please select at least one skill');
      return;
    }

    try {
      await apiService.addRequiredSkills({
        project_category_id: categoryId,
        skill_ids: selectedSkills
      });
      toast.success('Skills added successfully!');
      onSkillsAdded();
      onClose();
    } catch (error) {
      console.error('Error adding skills:', error);
      toast.error('Failed to add skills');
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
        <div className="relative bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 p-6">
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
              <h2 className="text-2xl font-bold text-white mb-1">Add Required Skills</h2>
              <p className="text-white/80 text-lg">Select skills required for this project category</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-3 border-slate-600/30 border-t-purple-500 rounded-full animate-spin mb-4 mx-auto" />
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
                  {isRefreshing && (
                    <div className="ml-3 w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  )}
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
                      <List className="w-5 h-5 mr-2 text-violet-400" />
                      Skills in {selectedSkillArea.skill_area}
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
                              <Check className="w-4 h-4 text-white" />
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
                    <Check className="w-5 h-5 mr-2 text-emerald-400" />
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
            onClick={handleAddSkills}
            disabled={selectedSkills.length === 0}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Add {selectedSkills.length} Skills</span>
          </button>
        </div>
      </motion.div>

      {/* Add Skill Modal */}
      <AddSkillModal
        isOpen={showAddSkillModal}
        onClose={() => setShowAddSkillModal(false)}
        onSkillAdded={() => {
          setShowAddSkillModal(false);
          // Refresh skill areas data to get updated counts
          fetchSkillAreas(true);
          // Reset selected skill area to show fresh data
          setSelectedSkillArea(null);
          setSkills([]);
          setSelectedSkills([]);
        }}
      />
    </div>
  );
};

const AddSkillModal: React.FC<AddSkillModalProps> = ({ isOpen, onClose, onSkillAdded }) => {
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

const ProjectCategoryCard: React.FC<{ 
  category: ProjectCategory; 
  onEdit: (category: ProjectCategory) => void;
  onDelete: (id: number) => void;
  onView: (category: ProjectCategory) => void;
}> = ({ category, onEdit, onDelete, onView }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [detailedCategory, setDetailedCategory] = useState<DetailedProjectCategory | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDetails = async () => {
    if (isExpanded && !detailedCategory) {
      setIsLoading(true);
      try {
        const response = await apiService.getProjectCategory(category.id);
        setDetailedCategory(response.data);
      } catch (error) {
        console.error('Error fetching category details:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [isExpanded]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{category.name}</h3>
              {category.created_at && (
                <p className="text-white/70 text-sm">
                  Created {new Date(category.created_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onView(category)}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(category)}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(category.id)}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {category.description && (
          <p className="text-white/80 text-sm mb-4 line-clamp-2">{category.description}</p>
        )}

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-white/20"
            >
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Full Description */}
                  {detailedCategory?.description && (
                    <div>
                      <h4 className="text-white font-medium mb-2">Description:</h4>
                      <p className="text-white/80 text-sm">{detailedCategory.description}</p>
                    </div>
                  )}

                  {/* Use Cases */}
                  {detailedCategory?.use_cases && detailedCategory.use_cases.length > 0 ? (
                    <div>
                      <h4 className="text-white font-medium mb-3">Use Cases:</h4>
                      <div className="space-y-2">
                        {detailedCategory.use_cases.map((useCase, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-2 text-white/80 text-sm"
                          >
                            <Target className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span>{useCase}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <List className="w-8 h-8 text-white/30 mx-auto mb-2" />
                      <p className="text-white/70 text-sm">No use cases defined yet</p>
                    </div>
                  )}

                  {/* Required Skills */}
                  {detailedCategory?.skills && detailedCategory.skills.length > 0 && (
                    <div>
                      <h4 className="text-white font-medium mb-3">Required Skills:</h4>
                      <div className="space-y-2">
                        {detailedCategory.skills.map((skillArea) => (
                          <div key={skillArea.skill_area_id} className="bg-white/5 rounded-lg p-3">
                            <h5 className="text-white/90 font-medium text-sm mb-1">
                              {skillArea.skill_area_name}
                            </h5>
                            <div className="flex flex-wrap gap-1">
                              {skillArea.skills.map((skill) => (
                                <span
                                  key={skill.skill_id}
                                  className="inline-flex items-center px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs"
                                >
                                  {skill.skill_name}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-white/50 text-xs">
            ID: {category.id}
          </div>
          {category.use_cases && (
            <div className="text-white/50 text-xs">
              {category.use_cases.length} use cases
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ProjectCategoriesManagement: React.FC = () => {
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isSkillSelectionOpen, setIsSkillSelectionOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | undefined>();
  const [viewCategory, setViewCategory] = useState<ProjectCategory | undefined>();
  const [skillSelectionCategoryId, setSkillSelectionCategoryId] = useState<number | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, [currentPage]);

  useEffect(() => {
    const handleOpenSkillSelection = (event: CustomEvent) => {
      setSkillSelectionCategoryId(event.detail.categoryId);
      setIsSkillSelectionOpen(true);
    };

    window.addEventListener('openSkillSelection', handleOpenSkillSelection as EventListener);
    
    return () => {
      window.removeEventListener('openSkillSelection', handleOpenSkillSelection as EventListener);
    };
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getProjectCategories(currentPage);
      setCategories(response.data);
      if (response.pagination) {
        setTotalPages(Math.ceil(response.pagination.count / response.pagination.page_size));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCategory = () => {
    setSelectedCategory(undefined);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: ProjectCategory) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        setCategories(prev => prev.filter(cat => cat.id !== id));
        toast.success('Category deleted successfully!');
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category');
      }
    }
  };

  const handleViewCategory = (category: ProjectCategory) => {
    setViewCategory(category);
    setIsViewModalOpen(true);
  };

  const handleSaveCategory = (category: ProjectCategory) => {
    if (selectedCategory) {
      setCategories(prev => prev.map(cat => cat.id === category.id ? category : cat));
    } else {
      setCategories(prev => [...prev, category]);
      // After creating a new category, offer to add skills
      setTimeout(() => {
        if (window.confirm('Category created successfully! Would you like to add required skills now?')) {
          setSkillSelectionCategoryId(category.id);
          setIsSkillSelectionOpen(true);
        }
      }, 500);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 md:p-8 space-y-6 md:space-y-8 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Project Categories</h1>
          <p className="text-white/70">Manage project categories and their requirements</p>
        </div>
        <motion.button
          onClick={handleCreateCategory}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Add Category</span>
        </motion.button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 md:p-6 border border-white/20 mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
            <input
              type="text"
              placeholder="Search categories by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4 mx-auto" />
            <p className="text-white/70">Loading categories...</p>
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
              {filteredCategories.map((category) => (
                <ProjectCategoryCard
                  key={category.id}
                  category={category}
                  onEdit={handleEditCategory}
                  onDelete={handleDeleteCategory}
                  onView={handleViewCategory}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredCategories.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Code2 className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No categories found</h3>
              <p className="text-white/70 mb-6">
                {searchTerm ? 'No categories match your search criteria.' : 'Get started by creating your first project category.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleCreateCategory}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Create First Category
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
                className="px-4 py-2 bg-white/10 text-white rounded-lg disabled:opacity-50 hover:bg-white/20 transition-colors"
              >
                Previous
              </button>
              <span className="text-white">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white/10 text-white rounded-lg disabled:opacity-50 hover:bg-white/20 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Category Modal */}
      <ProjectCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
        onSave={handleSaveCategory}
      />

      {/* Category View Modal */}
      {viewCategory && (
        <ProjectCategoryViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          category={viewCategory}
        />
      )}

      {/* Skill Selection Modal */}
      {skillSelectionCategoryId && (
        <SkillSelectionModal
          isOpen={isSkillSelectionOpen}
          onClose={() => {
            setIsSkillSelectionOpen(false);
            setSkillSelectionCategoryId(undefined);
          }}
          categoryId={skillSelectionCategoryId}
          onSkillsAdded={() => {
            fetchCategories(); // Refresh the categories list
          }}
        />
      )}
    </div>
  );
};

export default ProjectCategoriesManagement;
