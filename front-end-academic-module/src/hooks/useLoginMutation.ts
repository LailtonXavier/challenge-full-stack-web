import { useMutation } from '@tanstack/vue-query';
import { useRouter } from 'vue-router';
import type { LoginDto } from '@/core/domain/types/login.types';
import { loginService } from '@/core/infra/controllers/auth/login';
import { useAuthStore } from '@/core/infra/store/authStore';
import { toast } from "vue-sonner";
import type { FormattedError } from '@/core/infra/services/api.services';

export function useLoginMutation() {
  const router = useRouter();
  const auth = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (payload: LoginDto) => loginService(payload),
    onSuccess: (data) => {
      auth.setAuth(data); 

      toast.success("Login realizado com sucesso!");

      router.push({ name: "home" });
    },
    onError: (err: FormattedError) => {
      const errorMessage = err.message ?? "Erro ao fazer login";
      toast.error(errorMessage);

      if (err.status === 401 && err.message === "jwt expired") {
        const auth = useAuthStore();
        auth.clearAuth();
        toast.error("Sua sessão expirou. Faça login novamente.");
        window.location.href = "/";
      }
    },
  });

  return loginMutation;
}