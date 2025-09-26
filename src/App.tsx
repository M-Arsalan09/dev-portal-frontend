/**
 * Main Application Component
 * 
 * This is the root component of the DevPortal application that manages
 * the overall application state and routing between different sections.
 * It uses a tab-based navigation system to switch between different
 * management interfaces.
 */

import { useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import DashboardOverview from './components/DashboardOverview';
import DevelopersManagement from './components/DevelopersManagement';
import ProjectsManagement from './components/ProjectsManagement';
import SkillAreasManagement from './components/SkillAreasManagement';
import ProjectCategoriesManagement from './components/ProjectCategoriesManagement';
import AIAgentInterface from './components/AIAgentInterface';

/**
 * Main App component that renders the dashboard layout and manages tab navigation
 * @returns JSX element containing the main application interface
 */
function App() {
  // State to track the currently active tab/section
  const [activeTab, setActiveTab] = useState('dashboard');

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

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderActiveComponent()}
    </DashboardLayout>
  );
}

export default App;
