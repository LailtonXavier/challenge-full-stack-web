import type { LoginResponse } from '@/core/domain/types/login.types';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const EMPLOYEE_ID_KEY = 'employeeId';
const EMPLOYEE_EMAIL_KEY = 'email';

export const tokenStore = {
  async saveAuthData(data: LoginResponse) {
    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    localStorage.setItem(EMPLOYEE_ID_KEY, data.employee.id);
    localStorage.setItem(EMPLOYEE_EMAIL_KEY, data.employee.email);
  },

  async clearAuthData() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(EMPLOYEE_ID_KEY);
    localStorage.removeItem(EMPLOYEE_EMAIL_KEY);
  },
  
  async getAccessToken(): Promise<string | null> {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  async getAccessEmployeeId(): Promise<string | null> {
    return localStorage.getItem(EMPLOYEE_ID_KEY);
  },
};