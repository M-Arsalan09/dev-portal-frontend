# Dev Portal Backend - Frontend Integration Guide

## Overview

This document provides comprehensive details for frontend developers on how to integrate with the Dev Portal Backend API. The system manages developers, their skills, projects, and includes an AI agent for project analysis.

## Base Configuration

- **Base URL**: Configure your `{{BaseURL}}` variable in your environment
- **Framework**: Django REST Framework with JWT Authentication
- **Database**: PostgreSQL
- **Pagination**: All list endpoints support pagination (10 items per page by default)

## Authentication

The API uses JWT (JSON Web Token) authentication:
- **Access Token Lifetime**: 5 minutes
- **Refresh Token Lifetime**: 1 day
- **Token Rotation**: Enabled

Include the JWT token in your request headers:
```
Authorization: Bearer <your_jwt_token>
```

## Common Response Format

All endpoints follow this consistent response format:

```json
{
  "details": "Success/Error message",
  "data": {},  // Response data
  "pagination": {  // Only in list endpoints
    "count": 25,
    "next": "http://example.com/api/endpoint/?page=3",
    "previous": "http://example.com/api/endpoint/?page=1",
    "current_page": 2,
    "page_size": 10
  }
}
```

---

## 1. Developers API

### Base Endpoint: `/api/developers/`

### 1.1 List Developers
**GET** `/api/developers/`

#### Query Parameters:
- `page` (optional): Page number for pagination (default: 1)

#### Response:
```json
{
  "details": "Developers fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "M Arsalan kamran",
      "email": "arsalankamran@ikonicsolution.com",
      "role": "AI/ML Developer",
      "is_available": true
    }
  ],
  "pagination": {
    "count": 25,
    "next": "http://example.com/api/developers/?page=2",
    "previous": null,
    "current_page": 1,
    "page_size": 10
  }
}
```

### 1.2 Create Developer
**POST** `/api/developers/`

#### Required Fields:
- `name` (string): Developer's full name
- `email` (string): Unique email address
- `role` (string): Developer's role/position
- `graduation_date` (date): Format: "YYYY-MM-DD"
- `industry_experience` (integer): Years of experience
- `employment_start_date` (date): Format: "YYYY-MM-DD"

#### Optional Fields:
- `is_available` (boolean): Default: true

#### Example Request:
```json
{
  "name": "M Arsalan kamran",
  "email": "arsalankamran@ikonicsolution.com",
  "role": "AI/ML Developer",
  "graduation_date": "2024-07-01",
  "industry_experience": 3,
  "employment_start_date": "2025-09-15",
  "is_available": true
}
```

#### Response:
```json
{
  "details": "Developer created successfully",
  "data": {
    "name": "M Arsalan kamran",
    "email": "arsalankamran@ikonicsolution.com",
    "role": "AI/ML Developer",
    "graduation_date": "2024-07-01",
    "industry_experience": 3,
    "employment_start_date": "2025-09-15",
    "is_available": true
  }
}
```

### 1.3 Retrieve Developer Details
**GET** `/api/developers/{id}/`

#### Path Parameters:
- `id` (integer): Developer ID

#### Response:
```json
{
  "details": "Developer fetched successfully",
  "data": {
    "name": "M Arsalan kamran",
    "email": "arsalankamran@ikonicsolution.com",
    "role": "AI/ML Developer",
    "graduation_date": "2024-07-01",
    "industry_experience": 3,
    "employment_start_date": "2025-09-15",
    "is_available": true,
    "skills": [
      {
        "skill_area_id": 1,
        "skill_area_name": "AI Integration",
        "skills": [
          {
            "skill_id": 13,
            "skill_name": "Machine Learning"
          }
        ]
      }
    ],
    "projects": [
      {
        "project_id": 1,
        "project_name": "AI Chatbot Project",
        "project_description": "A simple AI chatbot",
        "project_tech_stack": ["Python", "Django Rest", "OpenAI API"],
        "project_origin": "Personal Project"
      }
    ]
  }
}
```

### 1.4 Update Developer
**PUT** `/api/developers/{id}/`

#### Path Parameters:
- `id` (integer): Developer ID

#### Request Body:
- Supports partial updates
- Same fields as create, all optional

#### Example Request:
```json
{
  "role": "Senior AI Engineer"
}
```

### 1.5 Add Skills to Developer
**POST** `/api/developers/add_dev_skills/`

#### Required Fields:
- `dev_id` (integer): Developer ID
- `skill_ids` (array): Array of skill IDs

#### Example Request:
```json
{
  "dev_id": 2,
  "skill_ids": [13, 14, 15, 16, 17, 18, 19]
}
```

---

## 2. Skill Areas API

### Base Endpoint: `/api/skill-areas/`

### 2.1 List Skill Areas
**GET** `/api/skill-areas/`

#### Query Parameters:
- `page` (optional): Page number for pagination

#### Response:
```json
{
  "details": "Skill areas fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "AI Integration",
      "created_at": "2024-09-24T10:00:00Z"
    }
  ],
  "pagination": { /* pagination object */ }
}
```

### 2.2 Create Skill Area
**POST** `/api/skill-areas/`

#### Required Fields:
- `name` (string): Skill area name

#### Example Request:
```json
{
  "name": "AI Integration"
}
```

### 2.3 Retrieve Skill Area with Skills
**GET** `/api/skill-areas/{id}/`

#### Response:
```json
{
  "details": "Skill area fetched successfully",
  "data": {
    "skill_area_id": 3,
    "skill_area": "Generative AI",
    "skills": [
      {
        "skill_id": 1,
        "skill_name": "Prompt Engineering"
      }
    ]
  }
}
```

### 2.4 Add Skills to Skill Area
**POST** `/api/skill-areas/add_skills/`

#### Option 1 - Create new skill area with skills:
```json
{
  "skill_area": "Generative AI",
  "skills": "Prompt Engineering,GPT Models,LLM Training"
}
```

#### Option 2 - Add skills to existing skill area:
```json
{
  "skill_id": 4,
  "skills": "Prompt Engineering,GPT Models"
}
```

**Note**: Skills should be comma-separated in a single string.

---

## 3. Developer Projects API

### Base Endpoint: `/api/developer-projects/`

### 3.1 List Developer Projects
**GET** `/api/developer-projects/`

#### Query Parameters:
- `page` (optional): Page number for pagination
- `developer_name` (optional): Filter by developer name

#### Filter Example:
```
GET /api/developer-projects/?developer_name=M Arsalan kamran
```

#### Response:
```json
{
  "details": "Developer projects fetched successfully",
  "data": [
    {
      "id": 1,
      "developer_name": "M Arsalan kamran",
      "name": "AI Chatbot Project",
      "description": "A simple AI chatbot that can answer user's queries.",
      "tech_stack": ["Python", "Django Rest", "OpenAI API"],
      "project_origin": "Personal Project"
    }
  ],
  "pagination": { /* pagination object */ }
}
```

### 3.2 Create Developer Project
**POST** `/api/developer-projects/`

#### Required Fields:
- `developer` (integer): Developer ID
- `name` (string): Project name
- `project_categories` (array): Array of project category IDs
- `tech_stack` (array): Array of technology strings
- `project_origin` (string): Origin of the project
- `skills` (array): Array of skill IDs

#### Optional Fields:
- `description` (string): Project description
- `repo_link` (URL): Repository link
- `doc_link` (URL): Documentation link
- `presentation_link` (URL): Presentation link
- `live_link` (URL): Live project link

#### Example Request:
```json
{
  "developer": 1,
  "name": "AI Chatbot Project",
  "description": "A simple AI chatbot that can answer user's queries.",
  "project_categories": [1, 2],
  "tech_stack": ["Python", "Django Rest", "OpenAI API"],
  "project_origin": "Personal Project",
  "skills": [1, 2, 6, 7],
  "repo_link": "https://github.com/M-Arsalan09/openai-api-chatbot",
  "doc_link": "",
  "presentation_link": "",
  "live_link": ""
}
```

### 3.3 Retrieve Developer Project
**GET** `/api/developer-projects/{id}/`

#### Response:
```json
{
  "details": "Developer project fetched successfully",
  "data": {
    "id": 1,
    "name": "AI Chatbot Project",
    "description": "A simple AI chatbot",
    "tech_stack": ["Python", "Django Rest", "OpenAI API"],
    "project_origin": "Personal Project",
    "repo_link": "https://github.com/example",
    "doc_link": "",
    "presentation_link": "",
    "live_link": "",
    "created_at": "2024-09-24T10:00:00Z",
    "developer": 1,
    "developer_name": "M Arsalan kamran",
    "project_categories": [
      {
        "id": 1,
        "name": "Chatbot Development",
        "description": "Chatbot projects..."
      }
    ],
    "skills": [
      {
        "skill_area_id": 1,
        "skill_area_name": "AI Integration",
        "skills": [
          {
            "skill_id": 1,
            "skill_name": "Machine Learning"
          }
        ]
      }
    ]
  }
}
```

### 3.4 Update Developer Project
**PUT** `/api/developer-projects/{id}/`

#### Updatable Fields:
- `description`
- `tech_stack`
- `project_origin`
- `repo_link`
- `doc_link`
- `presentation_link`
- `live_link`

---

## 4. Project Categories API

### Base Endpoint: `/api/projects/`

### 4.1 List Project Categories
**GET** `/api/projects/`

#### Response:
```json
{
  "details": "Project categories fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "Automation",
      "description": "Automation involves using technology..."
    }
  ],
  "pagination": { /* pagination object */ }
}
```

### 4.2 Create Project Category
**POST** `/api/projects/`

#### Required Fields:
- `name` (string): Category name
- `description` (string): Category description
- `use_cases` (array): Array of use case strings

#### Example Request:
```json
{
  "name": "Automation",
  "description": "Automation involves using technology to handle repetitive tasks...",
  "use_cases": [
    "Robotic Process Automation (Document Processing, Data Entry, Email Automation)",
    "N8N and No-Code Tools Automation (Workflow Platforms, API Integrations)",
    "Web Automations with Selenium (Scraping, Testing, Form Submissions)"
  ]
}
```

### 4.3 Retrieve Project Category
**GET** `/api/projects/{id}/`

#### Response:
```json
{
  "details": "Project category fetched successfully",
  "data": {
    "id": 1,
    "name": "Automation",
    "description": "Automation involves using technology...",
    "use_cases": ["Use case 1", "Use case 2"],
    "skills": [
      {
        "skill_area_id": 1,
        "skill_area_name": "AI Integration",
        "skills": [
          {
            "skill_id": 6,
            "skill_name": "Process Automation"
          }
        ]
      }
    ]
  }
}
```

### 4.4 Update Project Category
**PUT** `/api/projects/{id}/`

#### Updatable Fields:
- `description` (string): New description
- `use_cases` (array): Additional use cases (will be appended to existing ones)

#### Example Request:
```json
{
  "description": "Updated description here"
}
```

Or:

```json
{
  "use_cases": ["New use case 1", "New use case 2"]
}
```

### 4.5 Add Required Skills to Project Category
**POST** `/api/projects/add_required_skills/`

#### Required Fields:
- `project_category_id` (integer): Project category ID
- `skill_ids` (array): Array of skill IDs

#### Example Request:
```json
{
  "project_category_id": 1,
  "skill_ids": [6, 1, 2, 3]
}
```

---

## 5. Agent API (AI Services)

### Base Endpoint: `/api/agent/`

### 5.1 Simple Query to Gemini
**POST** `/api/agent/query/`

#### Required Fields:
- `query` (string): Question or prompt for the AI

#### Example Request:
```json
{
  "query": "Explain how AI works in a few words"
}
```

#### Response:
```json
{
  "success": true,
  "response": "AI learns patterns from data to make predictions and decisions...",
  "model": "gemini-2.5-flash"
}
```

### 5.2 Analyze Project and Suggest Developers
**POST** `/api/agent/analyze-project/`

#### Content-Type: `multipart/form-data`

#### Required Fields:
- `project_name` (text): Name of the project

#### Required (One of):
- `project_description` (text): Text description of the project
- `project_file` (file): PDF or DOCX file containing project description

#### Optional Fields:
- `required_skills` (text): JSON string array of required skills
- `project_categories` (text): JSON string array of project categories

#### Example Request (Form Data):
```
project_name: "Customer Care Chatbot"
project_description: "A Customer Service Chatbot is an automated conversational agent..."
required_skills: "" (can be empty)
project_categories: "" (can be empty)
project_file: [file upload] (optional)
```

#### Response:
```json
{
  "success": true,
  "project_name": "Customer Care Chatbot",
  "project_description": "A Customer Service Chatbot...",
  "required_skills": ["Python", "NLP", "Django"],
  "project_categories": ["Chatbot Development"],
  "total_developers_analyzed": 5,
  "analysis": "Based on the project requirements, here are the recommended developers...",
  "model": "gemini-2.5-flash"
}
```

---

## Error Handling

### Common Error Responses:

#### 400 - Bad Request
```json
{
  "success": false,
  "error": "Required field missing",
  "details": "Field validation error message"
}
```

#### 404 - Not Found
```json
{
  "details": "Resource not found"
}
```

#### 500 - Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error: Details here",
  "model": "gemini-2.5-flash"
}
```

---

## Data Models Reference

### Developer
```typescript
interface Developer {
  id: number;
  name: string;
  email: string;
  role: string;
  graduation_date: string; // YYYY-MM-DD
  industry_experience: number;
  employment_start_date: string; // YYYY-MM-DD
  is_available: boolean;
  last_updated: string; // ISO datetime
  created_at: string; // ISO datetime
}
```

### Skill Area
```typescript
interface SkillArea {
  id: number;
  name: string;
  created_at: string;
}
```

### Skill
```typescript
interface Skill {
  id: number;
  name: string;
  skill_area: number; // Foreign key to SkillArea
  created_at: string;
}
```

### Developer Project
```typescript
interface DeveloperProject {
  id: number;
  developer: number; // Foreign key to Developer
  name: string;
  description?: string;
  project_categories: number[]; // Array of ProjectCategory IDs
  tech_stack: string[]; // Array of technology strings
  project_origin: string;
  skills: number[]; // Array of Skill IDs
  repo_link?: string;
  doc_link?: string;
  presentation_link?: string;
  live_link?: string;
  created_at: string;
}
```

### Project Category
```typescript
interface ProjectCategory {
  id: number;
  name: string;
  description?: string;
  use_cases: string[]; // Array of use case strings
  created_at: string;
}
```

---

## Frontend Implementation Tips

### 1. Pagination Handling
```javascript
const fetchDevelopers = async (page = 1) => {
  const response = await fetch(`${baseURL}/api/developers/?page=${page}`);
  const data = await response.json();
  
  return {
    developers: data.data,
    pagination: data.pagination
  };
};
```

### 2. Error Handling
```javascript
const handleApiError = (error) => {
  if (error.status === 404) {
    // Handle not found
  } else if (error.status === 400) {
    // Handle validation errors
  } else {
    // Handle general errors
  }
};
```

### 3. File Upload for Project Analysis
```javascript
const analyzeProject = async (formData) => {
  const response = await fetch(`${baseURL}/api/agent/analyze-project/`, {
    method: 'POST',
    body: formData, // FormData object
    headers: {
      'Authorization': `Bearer ${token}`,
      // Don't set Content-Type for FormData
    }
  });
  
  return await response.json();
};
```

### 4. Skills Management
When displaying skills, group them by skill areas for better UX:

```javascript
const groupSkillsByArea = (skills) => {
  return skills.reduce((acc, skillArea) => {
    acc[skillArea.skill_area_name] = skillArea.skills;
    return acc;
  }, {});
};
```

---

## Important Notes

1. **Pagination**: All list endpoints return paginated results with 10 items per page by default.

2. **Filtering**: Developer projects can be filtered by developer name using query parameters.

3. **Skills Structure**: Skills are always grouped by skill areas in responses for better organization.

4. **File Uploads**: The agent's analyze-project endpoint accepts PDF and DOCX files for project descriptions.

5. **Partial Updates**: PUT endpoints support partial updates - you only need to send the fields you want to update.

6. **Use Cases**: Project category use cases are appended (not replaced) when updating.

7. **Tech Stack**: Always stored as an array of strings, not a single string.

8. **Links**: All link fields (repo_link, doc_link, etc.) are optional and can be empty strings.

9. **Date Formats**: All dates should be in YYYY-MM-DD format for input, and will be returned in ISO format.

10. **Authentication**: Remember to include JWT tokens in your API requests for endpoints that require authentication.

This documentation should provide you with everything needed to successfully integrate with the Dev Portal Backend API. For any additional questions or clarifications, please refer to the Postman collection or contact the backend development team.
