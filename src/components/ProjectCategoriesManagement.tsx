import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Code2, 
  X,
  Save,
  Eye,
  ChevronDown,
  ChevronRight,
  List,
  Target
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import apiService from '../services/api';
import type { ProjectCategory, CreateProjectCategoryRequest } from '../types/api';

interface ProjectCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: ProjectCategory;
  onSave: (category: ProjectCategory) => void;
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter category name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

const ProjectCategoryCard: React.FC<{ 
  category: ProjectCategory; 
  onEdit: (category: ProjectCategory) => void;
  onDelete: (id: number) => void;
  onView: (category: ProjectCategory) => void;
}> = ({ category, onEdit, onDelete, onView }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [detailedCategory, setDetailedCategory] = useState<ProjectCategory | null>(null);
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
                        {detailedCategory.skills?.map((skillArea: any) => (
                          <div key={skillArea.skill_area_id} className="bg-white/5 rounded-lg p-3">
                            <h5 className="text-white/90 font-medium text-sm mb-1">
                              {skillArea.skill_area_name}
                            </h5>
                            <div className="flex flex-wrap gap-1">
                              {skillArea.skills?.map((skill: any) => (
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
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, [currentPage]);

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

  const handleViewCategory = () => {
    toast('View functionality coming soon!');
  };

  const handleSaveCategory = (category: ProjectCategory) => {
    if (selectedCategory) {
      setCategories(prev => prev.map(cat => cat.id === category.id ? category : cat));
    } else {
      setCategories(prev => [...prev, category]);
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
    </div>
  );
};

export default ProjectCategoriesManagement;
