
import { api } from '../../services/api.services';

export async function logoutService(): Promise<void> {
  await api.post<boolean>('/auth/logout');
}
