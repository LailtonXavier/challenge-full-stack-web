import { createStudentService } from '@/core/infra/controllers/student/create';
import type { FormattedError } from '@/core/infra/services/api.services';
import { useAuthStore } from '@/core/infra/store/authStore';
import type { CreateStudentDTO } from '@/shared/schemas/registerStudentSchema';
import { useMutation } from '@tanstack/vue-query';
import { toast } from "vue-sonner";

export function useRegisterStudentMutation() {

  const registerStudentMutation = useMutation({
    mutationFn: (payload: CreateStudentDTO) => createStudentService(payload),
    onSuccess: () => {
      toast.success("Aluno criado com sucesso!");
    },
    onError: (err: FormattedError) => {
      const errorMessage = err.message ?? "Erro ao criar aluno";
      toast.error(errorMessage);

      if (err.status === 401 && err.message === "jwt expired") {
        const auth = useAuthStore();
        auth.clearAuth();
        toast.error("Sua sessão expirou. Faça login novamente.");
        window.location.href = "/";
      }
    },
  });

  return registerStudentMutation;
}