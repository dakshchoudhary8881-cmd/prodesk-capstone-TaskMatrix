import { BaseRepository } from './baseRepository';
import type { Project } from '@/types';
import db from '@/mock/db.json';

class ProjectRepository extends BaseRepository<Project> {
  constructor() {
    super('projects', db.projects as Project[]);
  }
}

export const projectRepository = new ProjectRepository();
