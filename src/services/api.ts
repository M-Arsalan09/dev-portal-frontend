/**
 * API Service Module
 * 
 * This module provides a centralized service for all API communications
 * with the backend. It handles authentication, error management, and
 * data transformation for the DevPortal application.
 */

import axios from 'axios';
import toast from 'react-hot-toast';
import type {
  Developer,
  SkillArea,
  DeveloperProject,
  ProjectCategory,
  DetailedProjectCategory,
  ApiResponse,
  AgentResponse,
  RawSkillArea,
  RawSkill,
  CreateDeveloperRequest,
  AddSkillsRequest,
  CreateProjectRequest,
  CreateSkillAreaRequest,
  AddSkillsToAreaRequest,
  CreateProjectCategoryRequest,
  AddRequiredSkillsRequest,
  AgentQueryRequest,
  AnalyzeProjectRequest
} from '../types/api';

/**
 * Centralized API service class for handling all backend communications
 * 
 * Features:
 * - Automatic authentication token management
 * - Global error handling with user-friendly messages
 * - Request/response interceptors for consistent behavior
 * - Data transformation for normalized API responses
 */
class ApiService {
  private api: ReturnType<typeof axios.create>;
  private baseURL: string;

  /**
   * Initialize the API service with configuration and interceptors
   */
  constructor() {
    // Get API base URL from environment variables or use default
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    
    // Create axios instance with default configuration
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 300000, // 5 minutes timeout for long-running operations
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Configure request and response interceptors for authentication and error handling
   * @private
   */
  private setupInterceptors(): void {
    // Request interceptor: Add authentication token to all requests
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor: Handle global error responses
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        this.handleApiError(error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Handle API errors with appropriate user feedback
   * @param error - The error object from axios
   * @private
   */
  private handleApiError(error: any): void {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      toast.error('Session expired. Please login again.');
      window.location.href = '/login';
    } else if (error.response?.status >= 500) {
      // Handle server errors
      toast.error('Server error. Please try again later.');
    } else if (error.response?.data?.details) {
      // Handle specific error messages from backend
      toast.error(error.response.data.details);
    } else {
      // Handle generic errors
      toast.error('An error occurred. Please try again.');
    }
  }

  // ==================== DEVELOPERS API ====================

  /**
   * Fetch paginated list of developers
   * @param page - Page number for pagination (default: 1)
   * @returns Promise resolving to paginated developer data
   */
  async getDevelopers(page = 1): Promise<ApiResponse<Developer[]>> {
    const response = await this.api.get<ApiResponse<Developer[]>>(
      `/api/developers/?page=${page}`
    );
    return response.data;
  }

  /**
   * Fetch detailed information for a specific developer
   * @param id - Developer ID
   * @returns Promise resolving to detailed developer data with normalized structure
   */
  async getDeveloper(id: number): Promise<ApiResponse<Developer>> {
    const response = await this.api.get<ApiResponse<any>>(
      `/api/developers/${id}/`
    );

    const raw = response.data as ApiResponse<any>;
    
    // Normalize the API response to match our internal data structure
    const normalized: ApiResponse<Developer> = {
      details: raw.details,
      data: {
        // Copy primitive fields directly
        id: raw.data.id,
        name: raw.data.name,
        email: raw.data.email,
        role: raw.data.role,
        graduation_date: raw.data.graduation_date,
        industry_experience: raw.data.industry_experience,
        employment_start_date: raw.data.employment_start_date,
        is_available: raw.data.is_available,
        last_updated: raw.data.last_updated,
        created_at: raw.data.created_at,
        overall_level: raw.data.overall_level,
        
        // Transform grouped skills to internal types
        skills: Array.isArray(raw.data?.skills)
          ? raw.data.skills.map((area: RawSkillArea) => ({
              id: area.skill_area_id,
              name: area.skill_area_name,
              skills: Array.isArray(area.skills)
                ? area.skills.map((s: RawSkill) => ({
                    id: s.skill_id,
                    name: s.skill_name,
                    skill_area: area.skill_area_id,
                    level: s.level,
                    level_name: s.level_name,
                    project_count: s.project_count,
                    last_updated: s.last_updated,
                  }))
                : [],
            }))
          : [],
          
        // Transform projects with backend field name mapping
        projects: Array.isArray(raw.data?.projects)
          ? raw.data.projects.map((p: any) => ({
              id: p.project_id ?? p.id,
              developer: raw.data.id,
              name: p.project_name ?? p.name,
              description: p.project_description ?? p.description,
              project_categories: p.project_categories ?? [],
              tech_stack: p.project_tech_stack ?? p.tech_stack ?? [],
              project_origin: p.project_origin,
              skills: Array.isArray(p.skills) ? p.skills : [],
              repo_link: p.repo_link,
              doc_link: p.doc_link,
              presentation_link: p.presentation_link,
              live_link: p.live_link,
              created_at: p.created_at,
            }))
          : [],
      },
      pagination: raw.pagination,
    };

    return normalized;
  }

  /**
   * Create a new developer profile
   * @param data - Developer data for creation
   * @returns Promise resolving to the created developer data
   */
  async createDeveloper(data: CreateDeveloperRequest): Promise<ApiResponse<Developer>> {
    const response = await this.api.post<ApiResponse<Developer>>(
      '/api/developers/',
      data
    );
    return response.data;
  }

  /**
   * Update an existing developer profile
   * @param id - Developer ID to update
   * @param data - Partial developer data for update
   * @returns Promise resolving to the updated developer data
   */
  async updateDeveloper(id: number, data: Partial<CreateDeveloperRequest>): Promise<ApiResponse<Developer>> {
    const response = await this.api.put<ApiResponse<Developer>>(
      `/api/developers/${id}/`,
      data
    );
    return response.data;
  }

  /**
   * Add skills to a developer's profile
   * @param data - Skills data to add
   * @returns Promise resolving to the updated skills data
   */
  async addSkillsToDeveloper(data: AddSkillsRequest): Promise<ApiResponse<any>> {
    const response = await this.api.post<ApiResponse<any>>(
      '/api/developers/add_dev_skills/',
      data
    );
    return response.data;
  }

  // ==================== SKILL AREAS API ====================

  /**
   * Fetch paginated list of skill areas
   * @param page - Page number for pagination (default: 1)
   * @returns Promise resolving to paginated skill area data
   */
  async getSkillAreas(page = 1): Promise<ApiResponse<SkillArea[]>> {
    const response = await this.api.get<ApiResponse<SkillArea[]>>(
      `/api/skill-areas/?page=${page}`
    );
    return response.data;
  }

  /**
   * Fetch detailed information for a specific skill area
   * @param id - Skill area ID
   * @returns Promise resolving to detailed skill area data
   */
  async getSkillArea(id: number): Promise<ApiResponse<SkillArea>> {
    const response = await this.api.get<ApiResponse<any>>(
      `/api/skill-areas/${id}/`
    );

    const raw = response.data as ApiResponse<any>;
    const normalized: ApiResponse<SkillArea> = {
      details: raw.details,
      data: {
        id: raw.data.id,
        name: raw.data.name,
        created_at: raw.data.created_at,
        skills: Array.isArray(raw.data?.skills)
          ? raw.data.skills.map((skill: any) => ({
              id: skill.skill_id ?? skill.id,
              name: skill.skill_name ?? skill.name,
              skill_area: raw.data.id,
              created_at: skill.created_at,
            }))
          : [],
      },
      pagination: raw.pagination,
    };

    return normalized;
  }

  /**
   * Create a new skill area
   * @param data - Skill area data for creation
   * @returns Promise resolving to the created skill area data
   */
  async createSkillArea(data: CreateSkillAreaRequest): Promise<ApiResponse<SkillArea>> {
    const response = await this.api.post<ApiResponse<SkillArea>>(
      '/api/skill-areas/',
      data
    );
    return response.data;
  }

  /**
   * Add skills to a skill area
   * @param data - Skills data to add
   * @returns Promise resolving to the updated skills data
   */
  async addSkillsToArea(data: AddSkillsToAreaRequest): Promise<ApiResponse<any>> {
    const response = await this.api.post<ApiResponse<any>>(
      '/api/skill-areas/add_skills/',
      data
    );
    return response.data;
  }

  // ==================== DEVELOPER PROJECTS API ====================

  /**
   * Fetch paginated list of developer projects with optional filtering
   * @param page - Page number for pagination (default: 1)
   * @param developerName - Optional developer name filter
   * @returns Promise resolving to paginated developer project data
   */
  async getDeveloperProjects(page = 1, developerName?: string): Promise<ApiResponse<DeveloperProject[]>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    if (developerName) {
      params.append('developer_name', developerName);
    }
    
    const response = await this.api.get<ApiResponse<DeveloperProject[]>>(
      `/api/developer-projects/?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Fetch detailed information for a specific developer project
   * @param id - Developer project ID
   * @returns Promise resolving to detailed developer project data
   */
  async getDeveloperProject(id: number): Promise<ApiResponse<DeveloperProject>> {
    const response = await this.api.get<ApiResponse<DeveloperProject>>(
      `/api/developer-projects/${id}/`
    );
    return response.data;
  }

  /**
   * Create a new developer project
   * @param data - Project data for creation
   * @returns Promise resolving to the created developer project data
   */
  async createDeveloperProject(data: CreateProjectRequest): Promise<ApiResponse<DeveloperProject>> {
    const response = await this.api.post<ApiResponse<DeveloperProject>>(
      '/api/developer-projects/',
      data
    );
    return response.data;
  }

  /**
   * Update an existing developer project
   * @param id - Developer project ID to update
   * @param data - Partial project data for update
   * @returns Promise resolving to the updated developer project data
   */
  async updateDeveloperProject(id: number, data: Partial<CreateProjectRequest>): Promise<ApiResponse<DeveloperProject>> {
    const response = await this.api.put<ApiResponse<DeveloperProject>>(
      `/api/developer-projects/${id}/`,
      data
    );
    return response.data;
  }

  // ==================== PROJECT CATEGORIES API ====================

  /**
   * Fetch paginated list of project categories
   * @param page - Page number for pagination (default: 1)
   * @returns Promise resolving to paginated project category data
   */
  async getProjectCategories(page = 1): Promise<ApiResponse<ProjectCategory[]>> {
    const response = await this.api.get<ApiResponse<ProjectCategory[]>>(
      `/api/projects/?page=${page}`
    );
    return response.data;
  }

  /**
   * Fetch detailed information for a specific project category
   * @param id - Project category ID
   * @returns Promise resolving to detailed project category data
   */
  async getProjectCategory(id: number): Promise<ApiResponse<DetailedProjectCategory>> {
    const response = await this.api.get<ApiResponse<DetailedProjectCategory>>(
      `/api/projects/${id}/`
    );
    return response.data;
  }

  /**
   * Create a new project category
   * @param data - Project category data for creation
   * @returns Promise resolving to the created project category data
   */
  async createProjectCategory(data: CreateProjectCategoryRequest | { name: string; description: string; use_cases: string[] }): Promise<ApiResponse<ProjectCategory>> {
    const response = await this.api.post<ApiResponse<ProjectCategory>>(
      '/api/projects/',
      data
    );
    return response.data;
  }

  /**
   * Add skills to a developer's profile
   * @param data - Developer skills data to add
   * @returns Promise resolving to the updated skills data
   */
  async addDeveloperSkills(data: { dev_id: number; skill_ids: number[] }): Promise<ApiResponse<any>> {
    const response = await this.api.post<ApiResponse<any>>(
      '/api/developers/add_dev_skills/',
      data
    );
    return response.data;
  }

  /**
   * Update an existing project category
   * @param id - Project category ID to update
   * @param data - Partial project category data for update
   * @returns Promise resolving to the updated project category data
   */
  async updateProjectCategory(id: number, data: Partial<CreateProjectCategoryRequest>): Promise<ApiResponse<ProjectCategory>> {
    const response = await this.api.put<ApiResponse<ProjectCategory>>(
      `/api/projects/${id}/`,
      data
    );
    return response.data;
  }

  /**
   * Update the description of a project category
   * @param id - Project category ID to update
   * @param description - New description for the project category
   * @returns Promise resolving to the updated project category data
   */
  async updateProjectCategoryDescription(id: number, description: string): Promise<ApiResponse<ProjectCategory>> {
    const response = await this.api.put<ApiResponse<ProjectCategory>>(
      `/api/projects/${id}/`,
      { description }
    );
    return response.data;
  }

  /**
   * Update the use cases of a project category
   * @param id - Project category ID to update
   * @param use_cases - New use cases for the project category
   * @returns Promise resolving to the updated project category data
   */
  async updateProjectCategoryUseCases(id: number, use_cases: string[]): Promise<ApiResponse<ProjectCategory>> {
    const response = await this.api.put<ApiResponse<ProjectCategory>>(
      `/api/projects/${id}/`,
      { use_cases }
    );
    return response.data;
  }

  /**
   * Add required skills to a project category
   * @param data - Required skills data to add
   * @returns Promise resolving to the updated skills data
   */
  async addRequiredSkills(data: AddRequiredSkillsRequest): Promise<ApiResponse<any>> {
    const response = await this.api.post<ApiResponse<any>>(
      '/api/projects/add_required_skills/',
      data
    );
    return response.data;
  }

  /**
   * Add skills to a skill area
   * @param data - Skills data to add to the skill area
   * @returns Promise resolving to the updated skills data
   */
  async addSkillsToSkillArea(data: { skill_area?: string; skills?: string; skill_id?: number }): Promise<ApiResponse<any>> {
    const response = await this.api.post<ApiResponse<any>>(
      '/api/skill-areas/add_skills/',
      data
    );
    return response.data;
  }


  // Agent API
  async queryAgent(data: AgentQueryRequest): Promise<AgentResponse> {
    const response = await this.api.post<AgentResponse>(
      '/api/agent/query/',
      data
    );
    return response.data;
  }

  async analyzeProject(data: AnalyzeProjectRequest): Promise<AgentResponse> {
    const formData = new FormData();
    formData.append('project_name', data.project_name);
    
    if (data.project_description) {
      formData.append('project_description', data.project_description);
    }
    
    if (data.project_file) {
      formData.append('project_file', data.project_file);
    }
    
    if (data.required_skills) {
      formData.append('required_skills', data.required_skills);
    }
    
    if (data.project_categories) {
      formData.append('project_categories', data.project_categories);
    }

    const response = await this.api.post<AgentResponse>(
      '/api/agent/analyze-project/',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;