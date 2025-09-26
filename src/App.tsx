/**
 * Main Application Component
 * 
 * This is the root component of the DevPortal application that manages
 * the overall application state and routing between different sections.
 * It uses a tab-based navigation system to switch between different
 * management interfaces.
 */

import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import DashboardLayout from './components/DashboardLayout';
import DashboardOverview from './components/DashboardOverview';
import DevelopersManagement from './components/DevelopersManagement';
import ProjectsManagement from './components/ProjectsManagement';
import SkillAreasManagement from './components/SkillAreasManagement';
import ProjectCategoriesManagement from './components/ProjectCategoriesManagement';
import AIAgentInterface from './components/AIAgentInterface';
import LoginPage from './components/auth/LoginPage';
import UpdatePasswordPage from './components/auth/UpdatePasswordPage';
import CreateUserPage from './components/auth/CreateUserPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

/**
 * Main App component that renders the dashboard layout and manages tab navigation
 * @returns JSX element containing the main application interface
 */
function AppContent() {
  // State to track the currently active tab/section
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isAuthenticated, user, isLoading } = useAuth();

  // Handle URL-based routing
  useEffect(() => {
    const path = window.location.pathname;
    
    if (path === '/login') {
      return;
    } else if (path === '/update-password') {
      return;
    } else if (path === '/create-user') {
      return;
    } else if (path === '/dashboard' || path === '/') {
      setActiveTab('dashboard');
    } else {
      // Extract tab from path
      const tab = path.substring(1);
      if (['dashboard', 'developers', 'projects', 'skill-areas', 'project-categories', 'ai-agent'].includes(tab)) {
        setActiveTab(tab);
      } else {
        setActiveTab('dashboard');
      }
    }
  }, []);

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const newPath = tab === 'dashboard' ? '/dashboard' : `/${tab}`;
    window.history.pushState({}, '', newPath);
  };

  /**
   * Renders the appropriate component based on the active tab
   * @returns JSX element for the current active section
   */
  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'developers':
        return <DevelopersManagement />;
      case 'projects':
        return <ProjectsManagement />;
      case 'skill-areas':
        return <SkillAreasManagement />;
      case 'project-categories':
        return <ProjectCategoriesManagement />;
      case 'ai-agent':
        return <AIAgentInterface />;
      default:
        return <DashboardOverview />;
    }
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Handle routing based on authentication state and URL
  const path = window.location.pathname;

  if (path === '/login') {
    return <LoginPage />;
  }

  if (path === '/update-password') {
    return <UpdatePasswordPage />;
  }

  if (path === '/create-user') {
    return (
      <ProtectedRoute requiredRole="admin">
        <CreateUserPage />
      </ProtectedRoute>
    );
  }

  // Main dashboard - requires authentication
  if (!isAuthenticated || !user) {
    window.location.href = '/login';
    return null;
  }

  // Check if user needs to update password
  if (user.first_login) {
    window.location.href = '/update-password';
    return null;
  }

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={handleTabChange}>
      {renderActiveComponent()}
    </DashboardLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
