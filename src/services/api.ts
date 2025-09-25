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

class ApiService {
  private api: ReturnType<typeof axios.create>;
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 300000, // Increased to 5 minutes
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
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

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          toast.error('Session expired. Please login again.');
          window.location.href = '/login';
        } else if (error.response?.status >= 500) {
          toast.error('Server error. Please try again later.');
        } else if (error.response?.data?.details) {
          toast.error(error.response.data.details);
        } else {
          toast.error('An error occurred. Please try again.');
        }
        return Promise.reject(error);
      }
    );
  }

  // Developers API
  async getDevelopers(page = 1): Promise<ApiResponse<Developer[]>> {
    const response = await this.api.get<ApiResponse<Developer[]>>(
      `/api/developers/?page=${page}`
    );
    return response.data;
  }

  async getDeveloper(id: number): Promise<ApiResponse<Developer>> {
    const response = await this.api.get<ApiResponse<any>>(
      `/api/developers/${id}/`
    );

    const raw = response.data as ApiResponse<any>;
    const normalized: ApiResponse<Developer> = {
      details: raw.details,
      data: {
        // copy primitive fields directly
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
        // map grouped skills to internal types
        skills: Array.isArray(raw.data?.skills)
          ? raw.data.skills.map((area: any) => ({
              id: area.skill_area_id ?? area.id,
              name: area.skill_area_name ?? area.name,
              skills: Array.isArray(area.skills)
                ? area.skills.map((s: any) => ({
                    id: s.skill_id ?? s.id,
                    name: s.skill_name ?? s.name,
                    skill_area: area.skill_area_id ?? area.id,
                  }))
                : [],
            }))
          : [],
        // map projects possibly using backend names
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

  async createDeveloper(data: CreateDeveloperRequest): Promise<ApiResponse<Developer>> {
    const response = await this.api.post<ApiResponse<Developer>>(
      '/api/developers/',
      data
    );
    return response.data;
  }

  async updateDeveloper(id: number, data: Partial<CreateDeveloperRequest>): Promise<ApiResponse<Developer>> {
    const response = await this.api.put<ApiResponse<Developer>>(
      `/api/developers/${id}/`,
      data
    );
    return response.data;
  }

  async addSkillsToDeveloper(data: AddSkillsRequest): Promise<ApiResponse<any>> {
    const response = await this.api.post<ApiResponse<any>>(
      '/api/developers/add_dev_skills/',
      data
    );
    return response.data;
  }

  // Skill Areas API
  async getSkillAreas(page = 1): Promise<ApiResponse<SkillArea[]>> {
    const response = await this.api.get<ApiResponse<SkillArea[]>>(
      `/api/skill-areas/?page=${page}`
    );
    return response.data;
  }

  async getSkillArea(id: number): Promise<ApiResponse<SkillArea>> {
    const response = await this.api.get<ApiResponse<SkillArea>>(
      `/api/skill-areas/${id}/`
    );
    return response.data;
  }

  async createSkillArea(data: CreateSkillAreaRequest): Promise<ApiResponse<SkillArea>> {
    const response = await this.api.post<ApiResponse<SkillArea>>(
      '/api/skill-areas/',
      data
    );
    return response.data;
  }

  async addSkillsToArea(data: AddSkillsToAreaRequest): Promise<ApiResponse<any>> {
    const response = await this.api.post<ApiResponse<any>>(
      '/api/skill-areas/add_skills/',
      data
    );
    return response.data;
  }

  // Developer Projects API
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

  async getDeveloperProject(id: number): Promise<ApiResponse<DeveloperProject>> {
    const response = await this.api.get<ApiResponse<DeveloperProject>>(
      `/api/developer-projects/${id}/`
    );
    return response.data;
  }

  async createDeveloperProject(data: CreateProjectRequest): Promise<ApiResponse<DeveloperProject>> {
    const response = await this.api.post<ApiResponse<DeveloperProject>>(
      '/api/developer-projects/',
      data
    );
    return response.data;
  }

  async updateDeveloperProject(id: number, data: Partial<CreateProjectRequest>): Promise<ApiResponse<DeveloperProject>> {
    const response = await this.api.put<ApiResponse<DeveloperProject>>(
      `/api/developer-projects/${id}/`,
      data
    );
    return response.data;
  }

  // Project Categories API
  async getProjectCategories(page = 1): Promise<ApiResponse<ProjectCategory[]>> {
    const response = await this.api.get<ApiResponse<ProjectCategory[]>>(
      `/api/projects/?page=${page}`
    );
    return response.data;
  }

  async getProjectCategory(id: number): Promise<ApiResponse<DetailedProjectCategory>> {
    const response = await this.api.get<ApiResponse<DetailedProjectCategory>>(
      `/api/projects/${id}/`
    );
    return response.data;
  }

  async createProjectCategory(data: CreateProjectCategoryRequest | { name: string; description: string; use_cases: string[] }): Promise<ApiResponse<ProjectCategory>> {
    const response = await this.api.post<ApiResponse<ProjectCategory>>(
      '/api/projects/',
      data
    );
    return response.data;
  }

  async updateProjectCategory(id: number, data: Partial<CreateProjectCategoryRequest>): Promise<ApiResponse<ProjectCategory>> {
    const response = await this.api.put<ApiResponse<ProjectCategory>>(
      `/api/projects/${id}/`,
      data
    );
    return response.data;
  }

  async updateProjectCategoryDescription(id: number, description: string): Promise<ApiResponse<ProjectCategory>> {
    const response = await this.api.put<ApiResponse<ProjectCategory>>(
      `/api/projects/${id}/`,
      { description }
    );
    return response.data;
  }

  async updateProjectCategoryUseCases(id: number, use_cases: string[]): Promise<ApiResponse<ProjectCategory>> {
    const response = await this.api.put<ApiResponse<ProjectCategory>>(
      `/api/projects/${id}/`,
      { use_cases }
    );
    return response.data;
  }

  async addRequiredSkills(data: AddRequiredSkillsRequest): Promise<ApiResponse<any>> {
    const response = await this.api.post<ApiResponse<any>>(
      '/api/projects/add_required_skills/',
      data
    );
    return response.data;
  }

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