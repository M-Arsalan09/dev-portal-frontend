# Dev Portal Frontend 🚀

A modern React-based dashboard for managing developers, projects, skill areas, and project categories with AI-powered analysis.

## Quick Start

### Prerequisites
- Node.js 18+
- Backend API running on `http://localhost:8000`

### Installation
```bash
git clone <repository-url>
cd Frontend_new
npm install
npm run dev
```
Application runs at `http://localhost:3000`

## 🎯 System Overview

The Dev Portal is organized into 6 main sections:

1. **Dashboard** - System overview and statistics
2. **Developers** - Manage developer profiles and skills
3. **Projects** - Create and manage development projects
4. **Skill Areas** - Organize technical skills by categories
5. **Project Categories** - Define project types and requirements
6. **AI Agent** - Intelligent project analysis and recommendations

## 📋 Complete Workflow Guide

### 1. Initial Setup Workflow

#### Step 1: Set up Skill Areas
```
Navigate to Skill Areas → Add Skill Area → Enter details → Add individual skills
```
**Purpose**: Create the foundation for organizing technical competencies

#### Step 2: Create Project Categories  
```
Navigate to Project Categories → Add Category → Define required skills
```
**Purpose**: Establish project types and their skill requirements

#### Step 3: Add Developers
```
Navigate to Developers → Add Developer → Fill profile → Assign skills
```
**Purpose**: Build your team database with skills mapping

#### Step 4: Create Projects
```
Navigate to Projects → Add Project → Multi-step creation → Assign categories
```
**Purpose**: Define project requirements and scope

### 2. Daily Operations Workflow

#### Developer Management
- **View Team**: Dashboard shows developer count and availability
- **Add Skills**: Use "Add Skills" button on developer cards
- **Update Profiles**: Edit developer information as needed
- **Track Availability**: Monitor who's available for new projects

#### Project Management
- **Create Projects**: Use multi-step form for comprehensive project setup
- **Analyze Requirements**: Use AI Agent for intelligent skill analysis
- **Match Developers**: Get AI recommendations for project staffing
- **Track Progress**: Monitor project status and updates

#### AI-Powered Analysis
- **Project Analysis**: Upload project files for skill requirement analysis
- **Developer Matching**: Get AI recommendations for best-fit developers
- **Chat Assistant**: Ask questions about optimal team composition

## 🔧 How to Use Each Feature

### Dashboard Overview
**What it shows**:
- Real-time counts (developers, projects, skill areas, categories)
- Quick action buttons
- System health indicators

**How to use**:
1. Check system statistics at a glance
2. Click quick action buttons to create new entities
3. Monitor overall system activity

### Developer Management

#### Adding a New Developer
1. Click **"Add Developer"** button
2. Fill required fields:
   - Name, Email, Role
   - Graduation Date
   - Industry Experience (years)
   - Employment Start Date
   - Availability Status
3. Click **"Save"**

#### Adding Skills to Developers
1. Find developer card
2. Click **"Add Skills"** (+ icon)
3. Select skills from dropdown lists
4. Click **"Add Skills"**

#### Editing Developer Info
1. Click **"Edit"** (pencil icon) on developer card
2. Modify information in form
3. Click **"Save"** to update

### Project Management

#### Creating a Project (Multi-Step Process)
**Step 1: Basic Information**
- Project name and description
- Tech stack (add multiple technologies)
- Timeline and priority

**Step 2: Skill Requirements** 
- Select required skills from skill areas
- Define skill levels needed
- Add specific competencies

**Step 3: Category Assignment**
- Choose project categories
- Link to existing category requirements
- Final review and creation

#### Project Analysis with AI
1. Go to **AI Agent** → **Project Analysis** tab
2. Enter project name and description
3. Upload project files (optional)
4. Click **"Analyze Project"**
5. Review AI recommendations for:
   - Required skills
   - Recommended developers
   - Project complexity assessment

### Skill Area Management

#### Creating Skill Areas
1. Click **"Add Skill Area"**
2. Enter name and description
3. Click **"Save"**

#### Adding Skills to Areas
1. Click **"Add Skills"** on skill area card
2. Enter skill names (one per line)
3. Click **"Add Skills"**

#### Viewing Skills in Areas
1. Click on skill area card to expand
2. View all skills within that area
3. Skills load automatically on expansion

### Project Category Management

#### Creating Categories
1. Click **"Add Category"**
2. Enter name and description
3. Define category purpose
4. Click **"Save"**

#### Adding Required Skills
1. Click **"Add Required Skills"** on category card
2. Select skills from available skill areas
3. Define requirement levels
4. Click **"Add Skills"**

### AI Agent Features

#### Chat Assistant
**Purpose**: Get intelligent answers about your team and projects

**How to use**:
1. Go to **AI Agent** → **AI Agent** tab
2. Type questions like:
   - "Which developers are best for React projects?"
   - "What skills are missing for mobile development?"
   - "Who should work on the new e-commerce project?"
3. Get AI-powered recommendations

#### Project Analysis
**Purpose**: Analyze project requirements and get developer recommendations

**How to use**:
1. Go to **AI Agent** → **Project Analysis** tab
2. Fill in project details:
   - Project name
   - Description
   - Upload files (code, requirements, etc.)
3. Click **"Analyze Project"**
4. Review AI analysis:
   - Identified technologies
   - Required skills
   - Recommended team members
   - Project complexity assessment

## 🔄 Complete System Flow

### Typical Project Setup Flow
```
1. Create Skill Areas → 2. Add Skills → 3. Create Project Categories →
4. Add Developers → 5. Assign Skills to Developers → 6. Create Project →
7. Use AI Analysis → 8. Match Developers to Project
```

### Data Relationships
```
Skill Areas contain Skills
↓
Developers have Skills (from Skill Areas)
↓
Project Categories require Skills
↓
Projects belong to Categories and need Skills
↓
AI matches Developers to Projects based on Skills
```

## 🛠 Technical Setup

### Environment Configuration
Create `.env.local`:
```bash
VITE_API_BASE_URL=http://localhost:8000
```

### Available Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## 🔌 Backend Integration

### Required API Endpoints
The frontend expects these backend endpoints:

**Developers**:
- `GET /api/developers/` - List developers
- `POST /api/developers/` - Create developer
- `PUT /api/developers/{id}/` - Update developer
- `POST /api/developers/add_dev_skills/` - Add skills

**Projects**:
- `GET /api/developer-projects/` - List projects
- `POST /api/developer-projects/` - Create project
- `PUT /api/developer-projects/{id}/` - Update project

**Skill Areas**:
- `GET /api/skill-areas/` - List skill areas
- `POST /api/skill-areas/` - Create skill area
- `POST /api/skill-areas/add_skills/` - Add skills

**Project Categories**:
- `GET /api/projects/` - List categories
- `POST /api/projects/` - Create category
- `POST /api/projects/add_required_skills/` - Add required skills

**AI Agent**:
- `POST /api/agent/query/` - Chat queries
- `POST /api/agent/analyze-project/` - Project analysis

### Authentication
JWT tokens are automatically managed and included in all requests.

## 🎨 UI Features

### Design Highlights
- **Modern Dark Theme**: Professional gradient backgrounds
- **Smooth Animations**: Framer Motion transitions
- **Responsive Design**: Mobile-friendly interface
- **Card-Based Layout**: Clean, organized information display
- **Modal Forms**: Focused data entry experience

### Navigation
- **Sidebar Navigation**: Collapsible menu with color-coded sections
- **Tab System**: Clear section organization
- **Search & Filter**: Find information quickly
- **Quick Actions**: Direct access to common tasks

## 🚨 Troubleshooting

### Common Issues

#### Backend Connection
```bash
# Check if backend is running
curl http://localhost:8000/api/developers/

# Verify environment variables
echo $VITE_API_BASE_URL
```

#### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Authentication Issues
- Check if JWT tokens are properly stored in localStorage
- Verify backend authentication endpoints are working
- Clear browser storage if needed

## 📚 Documentation

- **[System Documentation](./SYSTEM_DOCUMENTATION.md)** - Complete technical overview
- **[API Integration Guide](./API_Integration_Guide.md)** - Backend API reference
- **[Project Overview](./PROJECT_OVERVIEW.md)** - High-level features summary

## 🤝 Support

For issues, questions, or contributions:
- Create GitHub issues for bugs
- Check documentation for detailed technical information
- Follow the contributing guidelines for pull requests

---

**Built with React, TypeScript, Tailwind CSS, and modern web technologies.**