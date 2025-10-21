import { defineStore } from "pinia";
import { ref } from "vue";

import type { LoginResponse } from '@/core/domain/types/login.types'; 

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const EMPLOYEE_ID_KEY = 'employeeId';
const EMPLOYEE_EMAIL_KEY = 'email';

export const useAuthStore = defineStore("auth", () => {
  const accessToken = ref<string | null>(localStorage.getItem(ACCESS_TOKEN_KEY));
  const refreshToken = ref<string | null>(localStorage.getItem(REFRESH_TOKEN_KEY));
  const employeeId = ref<string | null>(localStorage.getItem(EMPLOYEE_ID_KEY));
  const email = ref<string | null>(localStorage.getItem(EMPLOYEE_EMAIL_KEY));

  function setAuth(payload: LoginResponse) {
    accessToken.value = payload.accessToken;
    refreshToken.value = payload.refreshToken;
    employeeId.value = payload.employee.id;
    email.value = payload.employee.email;
  }

  function clearAuth() {
    accessToken.value = null;
    refreshToken.value = null;
    employeeId.value = null;
    email.value = null;

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(EMPLOYEE_ID_KEY);
    localStorage.removeItem(EMPLOYEE_EMAIL_KEY);
  }

  function isAuthenticated() {
    return !!accessToken.value;
  }

  return {
    accessToken,
    refreshToken,
    employeeId,
    email,
    setAuth,
    clearAuth,
    isAuthenticated,
  };
});