import { apiService } from './apiService';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  role: string;
}

interface AuthResponse {
  user: any;
  token: string;
}

class AuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    const data: LoginData = { email, password };
    return await apiService.post<AuthResponse>('/auth/login', data);
  }

  async register(email: string, password: string, role: string): Promise<AuthResponse> {
    const data: RegisterData = { email, password, role };
    return await apiService.post<AuthResponse>('/auth/register', data);
  }

  async getCurrentUser(): Promise<any> {
    return await apiService.get<any>('/auth/me');
  }

  async logout(): Promise<void> {
    // Could call backend logout endpoint if needed
    // await apiService.post('/auth/logout');
  }
}

export const authService = new AuthService();
