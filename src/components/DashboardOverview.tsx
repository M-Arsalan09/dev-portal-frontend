import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  FolderOpen, 
  Tags, 
  Code2, 
  ArrowUpRight,
  Zap,
  Target,
  Star,
  BarChart3,
  Plus,
  ArrowRight
} from 'lucide-react';
import { apiService } from '../services/api';

const DashboardOverview: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    {
      title: 'Total Developers',
      value: '0',
      change: '',
      changeType: 'neutral',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
      borderColor: 'border-blue-500/20'
    },
    {
      title: 'Active Projects',
      value: '0',
      change: '',
      changeType: 'neutral',
      icon: FolderOpen,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-500',
      borderColor: 'border-emerald-500/20',
    },
    {
      title: 'Skill Areas',
      value: '0',
      change: '',
      changeType: 'neutral',
      icon: Tags,
      color: 'from-violet-500 to-violet-600',
      bgColor: 'bg-violet-500/10',
      iconColor: 'text-violet-500',
      borderColor: 'border-violet-500/20'
    },
    {
      title: 'Project Categories',
      value: '0',
      change: '',
      changeType: 'neutral',
      icon: Code2,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-500/10',
      iconColor: 'text-amber-500',
      borderColor: 'border-amber-500/20'
    }
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [developersRes, projectsRes, skillAreasRes, categoriesRes] = await Promise.allSettled([
          apiService.getDevelopers(1),
          apiService.getDeveloperProjects(1),
          apiService.getSkillAreas(1),
          apiService.getProjectCategories(1)
        ]);

        // Extract counts from pagination or data length
        const developerCount = developersRes.status === 'fulfilled' ? 
          (developersRes.value.pagination?.count || developersRes.value.data?.length || 0) : 0;
        
        const projectCount = projectsRes.status === 'fulfilled' ? 
          (projectsRes.value.pagination?.count || projectsRes.value.data?.length || 0) : 0;
        
        const skillAreaCount = skillAreasRes.status === 'fulfilled' ? 
          (skillAreasRes.value.pagination?.count || skillAreasRes.value.data?.length || 0) : 0;
        
        const categoryCount = categoriesRes.status === 'fulfilled' ? 
          (categoriesRes.value.pagination?.count || categoriesRes.value.data?.length || 0) : 0;

        // Update stats with real data
        setStats(prevStats => [
          { ...prevStats[0], value: developerCount.toString() },
          { ...prevStats[1], value: projectCount.toString() },
          { ...prevStats[2], value: skillAreaCount.toString() },
          { ...prevStats[3], value: categoryCount.toString() }
        ]);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Keep default values of 0 on error
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const quickActions = [
    {
      title: 'Add Developer',
      description: 'Register a new team member',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      action: 'add-developer'
    },
    {
      title: 'Create Project',
      description: 'Start a new project',
      icon: FolderOpen,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      action: 'create-project'
    },
    {
      title: 'AI Analysis',
      description: 'Analyze project requirements',
      icon: Zap,
      color: 'from-violet-500 to-violet-600',
      bgColor: 'bg-violet-500/10',
      borderColor: 'border-violet-500/20',
      action: 'ai-analysis'
    },
    {
      title: 'Manage Skills',
      description: 'Update skill areas',
      icon: Tags,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      action: 'manage-skills'
    }
  ];

  return (
    <div className="p-8 md:p-12 space-y-12 min-h-full">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Star className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Welcome to DevPortal</h1>
        </div>
        <div className="flex items-center justify-center space-x-4 mb-6">
          <p className="text-slate-400 text-lg max-w-3xl leading-relaxed">Manage your development team and projects with intelligent insights and streamlined workflows</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className={`${stat.bgColor} ${stat.borderColor} border backdrop-blur-xl rounded-2xl p-8 hover:scale-105 transition-all duration-300 group cursor-pointer`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`p-4 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:shadow-xl transition-shadow`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                {stat.change && (
                  <div className="flex items-center space-x-2">
                    <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-bold text-emerald-400">
                      {stat.change}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="text-4xl font-bold text-white mb-2">
                {loading ? (
                  <div className="animate-pulse bg-slate-600 h-10 w-16 rounded"></div>
                ) : (
                  stat.value
                )}
              </h3>
              <p className="text-slate-400 text-base font-medium">{stat.title}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-violet-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
          </div>
          <button className="p-3 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 transition-colors">
            <Plus className="w-5 h-5 text-slate-300" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-6 rounded-xl ${action.bgColor} ${action.borderColor} border hover:scale-105 transition-all duration-200 text-left group`}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-white font-bold mb-2 text-lg">{action.title}</h3>
                <p className="text-slate-400 text-sm mb-3">{action.description}</p>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Performance Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Team Performance</h2>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl text-slate-300 text-sm transition-colors font-medium">
              Last 30 days
            </button>
            <button className="p-3 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 transition-colors">
              <Target className="w-5 h-5 text-slate-300" />
            </button>
          </div>
        </div>
        <div className="h-80 bg-slate-700/30 rounded-xl flex items-center justify-center border border-slate-600/30">
          <div className="text-center">
            <BarChart3 className="w-20 h-20 text-slate-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-slate-300 mb-3">Performance Analytics</h3>
            <p className="text-slate-500 max-w-lg mx-auto text-lg leading-relaxed mb-6">Comprehensive team performance metrics and project completion rates will be displayed here</p>
            <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-bold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl">
              View Analytics
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;
