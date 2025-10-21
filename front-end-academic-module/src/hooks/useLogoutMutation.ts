import { logoutService } from '@/core/infra/controllers/auth/logout';
import type { FormattedError } from '@/core/infra/services/api.services';
import { useAuthStore } from '@/core/infra/store/authStore';
import { tokenStore } from '@/core/infra/store/tokenStore';
import { useMutation } from '@tanstack/vue-query';
import { toast } from "vue-sonner";

export function useLogoutMutation() {
  const logoutMutation = useMutation({
    mutationFn: () => logoutService(),
    onSuccess: async () => {
      await tokenStore.clearAuthData()
      toast.success("Logout realizado com sucesso!");
      
      window.location.href = "/";
    },
    onError: (err: FormattedError) => {
      const errorMessage = err.message ?? "Erro ao fazer logout";
      toast.error(errorMessage);

      if (err.status === 401 && err.message === "jwt expired") {
        const auth = useAuthStore();
        auth.clearAuth();
        toast.error("Sua sessão expirou. Faça login novamente.");
        
        window.location.href = "/";
      }
    },
  });

  return logoutMutation;
}