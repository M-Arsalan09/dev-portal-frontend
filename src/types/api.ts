// API Types based on the integration guide
export interface Developer {
  id: number;
  name: string;
  email: string;
  role: string;
  graduation_date: string;
  industry_experience: number;
  employment_start_date: string;
  is_available: boolean;
  last_updated?: string;
  created_at?: string;
  skills?: SkillArea[];
  projects?: DeveloperProject[];
}

export interface SkillArea {
  id: number;
  name: string;
  created_at?: string;
  skills?: Skill[];
}

export interface Skill {
  id: number;
  name: string;
  skill_area: number;
  created_at?: string;
}

export interface DeveloperProject {
  id: number;
  developer: number;
  developer_name?: string;
  name: string;
  description?: string;
  project_categories: number[];
  tech_stack: string[];
  project_origin: string;
  skills: number[];
  repo_link?: string;
  doc_link?: string;
  presentation_link?: string;
  live_link?: string;
  created_at?: string;
}

export interface ProjectCategory {
  id: number;
  name: string;
  description?: string;
  use_cases: string[];
  created_at?: string;
  skills?: SkillArea[];
}

// API Response types for detailed project category data
export interface ProjectCategorySkillArea {
  skill_area_id: number;
  skill_area_name: string;
  skills: ProjectCategorySkill[];
}

export interface ProjectCategorySkill {
  skill_id: number;
  skill_name: string;
}

export interface DetailedProjectCategory {
  id: number;
  name: string;
  description?: string;
  use_cases: string[];
  created_at?: string;
  skills?: ProjectCategorySkillArea[];
}

export interface ApiResponse<T> {
  details: string;
  data: T;
  pagination?: {
    count: number;
    next: string | null;
    previous: string | null;
    current_page: number;
    page_size: number;
  };
}

export interface AgentResponse {
  success: boolean;
  response?: string;
  project_name?: string;
  project_description?: string;
  required_skills?: string[];
  project_categories?: string[];
  total_developers_analyzed?: number;
  analysis?: string;
  model?: string;
  error?: string;
}

export interface CreateDeveloperRequest {
  name: string;
  email: string;
  role: string;
  graduation_date: string;
  industry_experience: number;
  employment_start_date: string;
  is_available?: boolean;
}

export interface AddSkillsRequest {
  dev_id: number;
  skill_ids: number[];
}

export interface CreateProjectRequest {
  developer: number;
  name: string;
  description?: string;
  project_categories: number[];
  tech_stack: string[];
  project_origin: string;
  skills: number[];
  repo_link?: string;
  doc_link?: string;
  presentation_link?: string;
  live_link?: string;
}

export interface CreateSkillAreaRequest {
  name: string;
}

export interface AddSkillsToAreaRequest {
  skill_area?: string;
  skills?: string;
  skill_id?: number;
}

export interface CreateProjectCategoryRequest {
  name: string;
  description: string;
  use_cases: string[];
}

export interface AddRequiredSkillsRequest {
  project_category_id: number;
  skill_ids: number[];
}

export interface AgentQueryRequest {
  query: string;
}

export interface AnalyzeProjectRequest {
  project_name: string;
  project_description?: string;
  project_file?: File;
  required_skills?: string;
  project_categories?: string;
}