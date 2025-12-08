import { api } from './api';

export interface ApiRoute {
  route: string;
  method: string;
  description: string;
  controller: string;
  action: string;
}

class RoutesService {
  async getAllRoutes(): Promise<ApiRoute[]> {
    const response = await api.get<ApiRoute[]>('/routes');
    return response.data;
  }
}

export const routesService = new RoutesService();
