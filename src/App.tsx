import React, { useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import DashboardOverview from './components/DashboardOverview';
import DevelopersManagement from './components/DevelopersManagement';
import ProjectsManagement from './components/ProjectsManagement';
import SkillAreasManagement from './components/SkillAreasManagement';
import ProjectCategoriesManagement from './components/ProjectCategoriesManagement';
import AIAgentInterface from './components/AIAgentInterface';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

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
