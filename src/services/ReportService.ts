import { apiClient } from '@/api/client';

export class ReportService {
  static async getCharts(): Promise<any> {
    // Charts are computed from real task/project data on the frontend
    return {};
  }

  static async getActivities(): Promise<any[]> {
    try {
      return await apiClient.get<any[]>('/activities');
    } catch {
      return [];
    }
  }

  static async getReports(): Promise<any[]> {
    return [];
  }

  static async addActivity(_activity: any): Promise<void> {
    // Activities are now automatically logged by the backend services
    // No need to manually post from the frontend
  }
}
