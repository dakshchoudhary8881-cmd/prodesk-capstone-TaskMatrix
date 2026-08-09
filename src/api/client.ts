import dbData from '@/mock/db.json';

const STORAGE_KEY = 'taskmatrix_mock_db';

class LocalDatabase {
  private data: any;

  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY);
    let parsed = saved ? JSON.parse(saved) : null;
    
    // If it's empty or missing users, re-initialize
    if (!parsed || !parsed.users || parsed.users.length === 0) {
      this.data = JSON.parse(JSON.stringify(dbData)); // Deep copy
      this.save();
    } else {
      this.data = parsed;
    }
  }

  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  }

  getCollection(name: string) {
    if (!this.data[name]) this.data[name] = [];
    return this.data[name];
  }

  insert(collection: string, item: any) {
    const arr = this.getCollection(collection);
    const id = `${collection.substring(0, 3)}_${Date.now().toString(36)}`;
    const newItem = { ...item, id };
    arr.push(newItem);
    this.save();
    return newItem;
  }

  update(collection: string, id: string, item: any) {
    const arr = this.getCollection(collection);
    const index = arr.findIndex((x: any) => x.id === id);
    if (index !== -1) {
      arr[index] = { ...arr[index], ...item };
      this.save();
      return arr[index];
    }
    return null;
  }

  remove(collection: string, id: string) {
    const arr = this.getCollection(collection);
    this.data[collection] = arr.filter((x: any) => x.id !== id);
    this.save();
  }
}

const db = new LocalDatabase();

/**
 * Normalizes a mock item.
 */
function normalize(obj: any): any {
  if (Array.isArray(obj)) return obj.map(normalize);
  if (obj && typeof obj === 'object') {
    const res: any = { ...obj };
    // Just ensure ownerId, etc. are populated since mock DB uses `ownerId` natively
    return res;
  }
  return obj;
}

class ApiClient {
  private delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

  async get<T>(url: string, mockFallback?: any): Promise<T> {
    await this.delay();
    
    // Auth
    if (url === '/auth/me') {
      const authStr = localStorage.getItem('auth-storage');
      if (authStr) {
        try {
          const auth = JSON.parse(authStr);
          if (auth.state && auth.state.user) {
            return auth.state.user as T;
          }
        } catch(e) {}
      }
      throw new Error('Not authenticated');
    }

    // Projects
    if (url.startsWith('/projects')) {
      const match = url.match(/^\/projects\/([^\/]+)$/);
      if (match) {
        const item = db.getCollection('projects').find((x: any) => x.id === match[1]);
        if (item) return normalize(item);
        throw new Error('Not found');
      }
      return normalize(db.getCollection('projects')) as unknown as T;
    }

    // Tasks
    if (url.startsWith('/tasks')) {
      if (url.includes('/comments')) {
        return normalize(db.getCollection('comments')) as unknown as T;
      }
      const match = url.match(/^\/tasks\/([^\/]+)$/);
      if (match) {
        const item = db.getCollection('tasks').find((x: any) => x.id === match[1]);
        if (item) return normalize(item);
        throw new Error('Not found');
      }
      return normalize(db.getCollection('tasks')) as unknown as T;
    }

    // Notifications
    if (url.startsWith('/notifications')) {
      return normalize(db.getCollection('notifications')) as unknown as T;
    }

    // Activities
    if (url.startsWith('/activities')) {
      return normalize(db.getCollection('activities')) as unknown as T;
    }

    // Workspaces
    if (url.startsWith('/workspaces')) {
      return normalize(db.getCollection('workspaces')) as unknown as T;
    }

    // Fallback if provided (from old baseRepository calls)
    if (mockFallback) return normalize(mockFallback) as T;

    return [] as unknown as T;
  }

  async post<T>(url: string, data: any): Promise<T> {
    await this.delay();
    
    if (url === '/auth/login') {
      const users = db.getCollection('users');
      console.log('Login attempt:', data.email, 'Users in DB:', users.length);
      const user = users.find((u: any) => u.email === data.email) || users[0];
      if (user) {
        console.log('Found user:', user.email);
        return user as T;
      }
      console.error('No users found in DB');
      throw new Error('Invalid credentials. Please try again.');
    }
    if (url === '/auth/register') {
      const user = db.insert('users', { ...data, role: 'Member', status: 'Online' });
      return user as T;
    }
    if (url === '/auth/logout') {
      return {} as T;
    }

    if (url.startsWith('/projects')) return db.insert('projects', data) as T;
    if (url.startsWith('/tasks')) {
      if (url.includes('/comments')) {
        return db.insert('comments', data) as T;
      }
      return db.insert('tasks', data) as T;
    }
    
    return data as T;
  }

  async put<T>(url: string, data: any): Promise<T> {
    await this.delay();
    
    const collection = url.split('/')[1];
    const id = url.split('/')[2];
    if (collection && id) {
      const updated = db.update(collection, id, data);
      if (updated) return updated as T;
    }

    return data as T;
  }

  async patch<T>(url: string, data: any): Promise<T> {
    return this.put<T>(url, data);
  }

  async delete(url: string): Promise<boolean> {
    await this.delay();
    
    const collection = url.split('/')[1];
    const id = url.split('/')[2];
    if (collection && id) {
      db.remove(collection, id);
    }
    return true;
  }
}

export const apiClient = new ApiClient();
export const axiosInstance = {} as any; // Dummy export for compatibility
