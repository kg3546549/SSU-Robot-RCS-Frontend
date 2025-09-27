import { Robot, CreateRobotDto, UpdateRobotDto, ApiResponse, RobotHealthData } from '../types/robot';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

class ApiService {
  private async fetchWithErrorHandling<T>(
    url: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        error,
      };
    }
  }

  // Get all robots
  async getAllRobots(filters?: { type?: string; status?: string }): Promise<ApiResponse<Robot[]>> {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.status) params.append('status', filters.status);

    const queryString = params.toString();
    const url = queryString ? `/robots?${queryString}` : '/robots';

    return this.fetchWithErrorHandling<Robot[]>(url);
  }

  // Get online robots only
  async getOnlineRobots(): Promise<ApiResponse<Robot[]>> {
    return this.fetchWithErrorHandling<Robot[]>('/robots/online');
  }

  // Get robot by ID
  async getRobotById(id: string): Promise<ApiResponse<Robot>> {
    return this.fetchWithErrorHandling<Robot>(`/robots/${id}`);
  }

  // Create new robot
  async createRobot(robotData: CreateRobotDto): Promise<ApiResponse<Robot>> {
    return this.fetchWithErrorHandling<Robot>('/robots', {
      method: 'POST',
      body: JSON.stringify(robotData),
    });
  }

  // Update robot
  async updateRobot(id: string, robotData: UpdateRobotDto): Promise<ApiResponse<Robot>> {
    return this.fetchWithErrorHandling<Robot>(`/robots/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(robotData),
    });
  }

  // Update robot status
  async updateRobotStatus(id: string, status: 'online' | 'offline' | 'error'): Promise<ApiResponse<Robot>> {
    return this.fetchWithErrorHandling<Robot>(`/robots/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Delete robot
  async deleteRobot(id: string): Promise<ApiResponse<void>> {
    return this.fetchWithErrorHandling<void>(`/robots/${id}`, {
      method: 'DELETE',
    });
  }

  // Get robot health
  async getRobotHealth(id: string): Promise<ApiResponse<RobotHealthData>> {
    return this.fetchWithErrorHandling<RobotHealthData>(`/robots/${id}/health`);
  }
}

export const apiService = new ApiService();
export default apiService;