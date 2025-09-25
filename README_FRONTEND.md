# Dev Portal Frontend

A modern, beautiful, and feature-rich dashboard for managing developers, projects, skills, and AI-powered project analysis.

## 🚀 Features

### 📊 Dashboard Overview
- **Real-time Statistics**: Track developers, projects, skills, and categories
- **Activity Feed**: Recent activities and updates
- **Quick Actions**: Fast access to common tasks
- **Performance Metrics**: Visual representation of team performance

### 👥 Developer Management
- **CRUD Operations**: Create, read, update, and delete developer profiles
- **Skills Tracking**: Manage developer skills and expertise areas
- **Availability Status**: Track who's available for new projects
- **Project History**: View all projects assigned to each developer

### 📁 Project Management
- **Project Portfolio**: Comprehensive project listing and details
- **Tech Stack Tracking**: Monitor technologies used across projects
- **Links Management**: Repository, documentation, and live project links
- **Project Categories**: Organize projects by type and complexity

### 🏷️ Skill Areas Management
- **Skill Organization**: Group related skills into logical areas
- **Expandable Cards**: Detailed view of skills within each area
- **Dynamic Adding**: Add new skills to existing areas
- **Real-time Updates**: Instant synchronization across the platform

### 🎯 Project Categories
- **Category Definitions**: Define project types with descriptions
- **Use Cases**: Document specific use cases for each category
- **Required Skills**: Link skills to project categories
- **Detailed Views**: Expandable cards with full information

### 🤖 AI Agent Interface
- **Smart Chat**: Interactive AI assistant for questions and guidance
- **Project Analysis**: Upload project documents for intelligent analysis
- **Developer Matching**: AI-powered developer recommendations
- **Requirement Extraction**: Automatic skill and category identification

## 🎨 Design Features

### Modern UI/UX
- **Glassmorphism Effects**: Beautiful translucent components
- **Gradient Backgrounds**: Eye-catching color schemes
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Design**: Works perfectly on all device sizes

### Interactive Components
- **Hover Effects**: Subtle animations on user interaction
- **Loading States**: Engaging loading indicators
- **Empty States**: Helpful guidance when no data is available
- **Modal Dialogs**: Clean, accessible modal interfaces

### Visual Hierarchy
- **Color-coded Categories**: Easy visual identification
- **Consistent Iconography**: Lucide React icons throughout
- **Typography Scale**: Clear information hierarchy
- **Status Indicators**: Visual feedback for all states

## 🛠️ Technology Stack

### Frontend Framework
- **React 19.1.1**: Latest React with concurrent features
- **TypeScript**: Type-safe development experience
- **Vite**: Lightning-fast build tool and dev server

### Styling & Animation
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Production-ready motion library
- **Custom CSS**: Additional styling for glassmorphism effects

### UI Components
- **Headless UI**: Unstyled, accessible UI components
- **Lucide React**: Beautiful & consistent icon library
- **React Hook Form**: Performant forms with easy validation

### State Management & API
- **Axios**: Promise-based HTTP client
- **React Query**: Powerful data synchronization
- **React Hot Toast**: Beautiful toast notifications

### Developer Experience
- **ESLint**: Code linting and formatting
- **TypeScript**: Static type checking
- **Hot Module Replacement**: Instant development feedback

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience with sidebar navigation
- **Tablet**: Adapted layouts for medium screens
- **Mobile**: Touch-friendly interface with collapsed navigation

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dev-portal-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Create .env file
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Install required dependencies**
   ```bash
   npm install @headlessui/react @heroicons/react axios clsx framer-motion react-router-dom react-hot-toast react-hook-form react-query date-fns lucide-react
   ```

5. **Install Tailwind CSS**
   ```bash
   npm install -D tailwindcss @tailwindcss/typography autoprefixer postcss
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## 🔌 API Integration

The frontend integrates with the Dev Portal Backend API providing:

### Authentication
- JWT token-based authentication
- Automatic token refresh
- Secure API communication

### Real-time Updates
- Optimistic updates for better UX
- Error handling and retry logic
- Loading states for all operations

### File Upload
- Project document analysis
- PDF and DOCX support
- Progress indicators

## 🎯 Key Components

### DashboardLayout
- Responsive sidebar navigation
- Collapsible menu for mobile
- Active state management
- User profile section

### Management Components
- **DevelopersManagement**: Full CRUD for developer profiles
- **ProjectsManagement**: Project portfolio with filtering
- **SkillAreasManagement**: Hierarchical skill organization
- **ProjectCategoriesManagement**: Category definitions and use cases

### AI Components
- **AIAgentInterface**: Chat and analysis interface
- **QueryChat**: Interactive AI conversation
- **ProjectAnalysis**: Document upload and analysis

## 🔒 Security Features

- **Input Validation**: Client-side form validation
- **XSS Prevention**: Sanitized user inputs
- **CSRF Protection**: Token-based request validation
- **Secure Headers**: Proper security headers configuration

## 🎨 Customization

### Theme Configuration
The application uses a comprehensive design system:

```css
/* Primary Colors */
--primary: 59 130 246;
--secondary: 139 92 246;
--accent: 16 185 129;

/* Status Colors */
--success: 34 197 94;
--warning: 245 158 11;
--danger: 239 68 68;
```

### Component Styling
- Consistent spacing using Tailwind's scale
- Custom CSS classes for glassmorphism
- Responsive breakpoints for all devices
- Dark mode ready color scheme

## 🚀 Performance Optimizations

- **Code Splitting**: Lazy-loaded components
- **Image Optimization**: Responsive images
- **Bundle Analysis**: Optimized build output
- **Caching**: Efficient API response caching

## 📊 Analytics & Monitoring

Ready for integration with:
- Google Analytics
- Application performance monitoring
- Error tracking services
- User behavior analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
