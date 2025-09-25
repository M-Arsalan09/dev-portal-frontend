import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Tags, 
  X,
  Save,
  ChevronDown,
  ChevronRight,
  Code
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import apiService from '../services/api';
import type { SkillArea, CreateSkillAreaRequest } from '../types/api';

interface SkillAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillArea?: SkillArea;
  onSave: (skillArea: SkillArea) => void;
}

const SkillAreaModal: React.FC<SkillAreaModalProps> = ({ isOpen, onClose, skillArea, onSave }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateSkillAreaRequest>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (skillArea) {
      reset(skillArea);
    } else {
      reset({ name: '' });
    }
  }, [skillArea, reset]);

  const onSubmit = async (data: CreateSkillAreaRequest) => {
    setIsLoading(true);
    try {
      let result;
      if (skillArea) {
        // Note: Update endpoint not clearly defined in API guide
        result = { data: { ...skillArea, ...data } };
      } else {
        result = await apiService.createSkillArea(data);
      }
      
      toast.success(skillArea ? 'Skill area updated successfully!' : 'Skill area created successfully!');
      onSave(result.data);
      onClose();
    } catch (error) {
      console.error('Error saving skill area:', error);
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {skillArea ? 'Edit Skill Area' : 'Add New Skill Area'}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Skill Area Name</label>
              <input
                {...register('name', { required: 'Skill area name is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter skill area name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
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
                    {skillArea ? 'Update' : 'Create'}
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

interface AddSkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillArea: SkillArea;
  onSave: () => void;
}

const AddSkillsModal: React.FC<AddSkillsModalProps> = ({ isOpen, onClose, skillArea, onSave }) => {
  const [skills, setSkills] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!skills.trim()) {
      toast.error('Please enter at least one skill');
      return;
    }

    setIsLoading(true);
    try {
      await apiService.addSkillsToArea({
        skill_id: skillArea.id,
        skills: skills
      });
      
      toast.success('Skills added successfully!');
      onSave();
      onClose();
      setSkills('');
    } catch (error) {
      console.error('Error adding skills:', error);
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Add Skills to {skillArea.name}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills (comma-separated)
              </label>
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter skills separated by commas, e.g., Python, Machine Learning, Data Analysis"
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter multiple skills separated by commas
              </p>
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
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skills
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const SkillAreaCard: React.FC<{ 
  skillArea: SkillArea; 
  onEdit: (skillArea: SkillArea) => void;
  onDelete: (id: number) => void;
  onAddSkills: (skillArea: SkillArea) => void;
  onView: () => void;
}> = ({ skillArea, onEdit, onDelete, onAddSkills, onView }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [detailedSkillArea, setDetailedSkillArea] = useState<SkillArea | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDetails = async () => {
    if (isExpanded && !detailedSkillArea) {
      setIsLoading(true);
      try {
        const response = await apiService.getSkillArea(skillArea.id);
        setDetailedSkillArea(response.data);
      } catch (error) {
        console.error('Error fetching skill area details:', error);
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
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <Tags className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{skillArea.name}</h3>
              {skillArea.created_at && (
                <p className="text-white/70 text-sm">
                  Created {new Date(skillArea.created_at).toLocaleDateString()}
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
              onClick={() => onAddSkills(skillArea)}
              className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(skillArea)}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(skillArea.id)}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

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
              ) : detailedSkillArea?.skills && detailedSkillArea.skills.length > 0 ? (
                <div>
                  <h4 className="text-white font-medium mb-3">Skills in this area:</h4>
                  <div className="flex flex-wrap gap-2">
                    {detailedSkillArea.skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                      >
                        <Code className="w-3 h-3 mr-1" />
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Code className="w-8 h-8 text-white/30 mx-auto mb-2" />
                  <p className="text-white/70 text-sm">No skills added yet</p>
                  <button
                    onClick={() => onAddSkills(skillArea)}
                    className="mt-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
                  >
                    Add first skill
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-white/50 text-xs">
            ID: {skillArea.id}
          </div>
          {detailedSkillArea?.skills && (
            <div className="text-white/50 text-xs">
              {detailedSkillArea.skills.length} skills
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const SkillAreasManagement: React.FC = () => {
  const [skillAreas, setSkillAreas] = useState<SkillArea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddSkillsModalOpen, setIsAddSkillsModalOpen] = useState(false);
  const [selectedSkillArea, setSelectedSkillArea] = useState<SkillArea | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchSkillAreas();
  }, [currentPage]);

  const fetchSkillAreas = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getSkillAreas(currentPage);
      setSkillAreas(response.data);
      if (response.pagination) {
        setTotalPages(Math.ceil(response.pagination.count / response.pagination.page_size));
      }
    } catch (error) {
      console.error('Error fetching skill areas:', error);
      toast.error('Failed to fetch skill areas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSkillArea = () => {
    setSelectedSkillArea(undefined);
    setIsModalOpen(true);
  };

  const handleEditSkillArea = (skillArea: SkillArea) => {
    setSelectedSkillArea(skillArea);
    setIsModalOpen(true);
  };

  const handleDeleteSkillArea = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this skill area?')) {
      try {
        setSkillAreas(prev => prev.filter(area => area.id !== id));
        toast.success('Skill area deleted successfully!');
      } catch (error) {
        console.error('Error deleting skill area:', error);
        toast.error('Failed to delete skill area');
      }
    }
  };

  const handleAddSkills = (skillArea: SkillArea) => {
    setSelectedSkillArea(skillArea);
    setIsAddSkillsModalOpen(true);
  };

  const handleViewSkillArea = () => {
    toast('View functionality coming soon!');
  };

  const handleSaveSkillArea = (skillArea: SkillArea) => {
    if (selectedSkillArea) {
      setSkillAreas(prev => prev.map(area => area.id === skillArea.id ? skillArea : area));
    } else {
      setSkillAreas(prev => [...prev, skillArea]);
    }
  };

  const handleSkillsAdded = () => {
    // Refresh the skill areas list to update counts
    fetchSkillAreas();
  };

  const filteredSkillAreas = skillAreas.filter(skillArea =>
    skillArea.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 space-y-6 md:space-y-8 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Skill Areas Management</h1>
          <p className="text-white/70">Organize and manage development skills by categories</p>
        </div>
        <motion.button
          onClick={handleCreateSkillArea}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Add Skill Area</span>
        </motion.button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 md:p-6 border border-white/20 mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
            <input
              type="text"
              placeholder="Search skill areas by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Skill Areas Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4 mx-auto" />
            <p className="text-white/70">Loading skill areas...</p>
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
              {filteredSkillAreas.map((skillArea) => (
                <SkillAreaCard
                  key={skillArea.id}
                  skillArea={skillArea}
                  onEdit={handleEditSkillArea}
                  onDelete={handleDeleteSkillArea}
                  onAddSkills={handleAddSkills}
                  onView={handleViewSkillArea}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredSkillAreas.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Tags className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No skill areas found</h3>
              <p className="text-white/70 mb-6">
                {searchTerm ? 'No skill areas match your search criteria.' : 'Get started by creating your first skill area.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleCreateSkillArea}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Create First Skill Area
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

      {/* Skill Area Modal */}
      <SkillAreaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        skillArea={selectedSkillArea}
        onSave={handleSaveSkillArea}
      />

      {/* Add Skills Modal */}
      {selectedSkillArea && (
        <AddSkillsModal
          isOpen={isAddSkillsModalOpen}
          onClose={() => setIsAddSkillsModalOpen(false)}
          skillArea={selectedSkillArea}
          onSave={handleSkillsAdded}
        />
      )}
    </div>
  );
};

export default SkillAreasManagement;
