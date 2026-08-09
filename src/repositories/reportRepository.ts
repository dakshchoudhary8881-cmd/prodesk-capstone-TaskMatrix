import { BaseRepository } from './baseRepository';
import db from '@/mock/db.json';

class ReportRepository extends BaseRepository<any> {
  constructor() {
    // We pass empty array for base since we override methods
    super('reports', []);
  }

  async getCharts() {
    return (await import('@/api/client')).apiClient.get('/charts', db.charts);
  }

  async getActivities() {
    return (await import('@/api/client')).apiClient.get('/activities', db.activities);
  }

  async getReports() {
    return (await import('@/api/client')).apiClient.get('/reports', db.reports);
  }
}

export const reportRepository = new ReportRepository();
