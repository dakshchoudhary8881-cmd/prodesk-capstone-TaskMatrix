import { apiClient } from '@/api/client';

export abstract class BaseRepository<T extends { id: string }> {
  protected collectionName: string;
  protected mockData: T[];

  constructor(collectionName: string, mockData: T[]) {
    this.collectionName = collectionName;
    this.mockData = mockData;
  }

  async findAll(): Promise<T[]> {
    return apiClient.get<T[]>(`/${this.collectionName}`, this.mockData);
  }

  async findById(id: string): Promise<T | null> {
    const item = this.mockData.find((i) => i.id === id);
    if (!item) return null;
    return apiClient.get<T>(`/${this.collectionName}/${id}`, item);
  }

  async create(data: Omit<T, 'id'>): Promise<T> {
    const newItem = {
      ...data,
      id: `${this.collectionName.substring(0, 3)}_${Date.now().toString(36)}`,
    } as unknown as T;

    // In a real app we wouldn't mutate mockData here directly if using a real DB
    return apiClient.post<T>(`/${this.collectionName}`, newItem);
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const itemIndex = this.mockData.findIndex((i) => i.id === id);
    if (itemIndex === -1) throw new Error(`${this.collectionName} with id ${id} not found`);

    const updatedItem = { ...this.mockData[itemIndex], ...data };
    return apiClient.put<T>(`/${this.collectionName}/${id}`, updatedItem);
  }

  async delete(id: string): Promise<boolean> {
    return apiClient.delete(`/${this.collectionName}/${id}`);
  }
}
