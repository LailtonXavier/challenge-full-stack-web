import { deteleStudentService } from '@/core/infra/controllers/student/delete';
import type { FormattedError } from '@/core/infra/services/api.services';
import { useAuthStore } from '@/core/infra/store/authStore';
import { useMutation } from '@tanstack/vue-query';
import { toast } from "vue-sonner";

export function useDeleteStudentMutation() {

  const deleteStudentMutation = useMutation({
    mutationFn: (studentId: string) => deteleStudentService(studentId),
    onSuccess: () => {
      toast.success("Aluno deletado com sucesso!");
    },
    onError: (err: FormattedError) => {
      const errorMessage = err.message ?? "Erro ao deletar aluno";
      toast.error(errorMessage);

      if (err.status === 401 && err.message === "jwt expired") {
        const auth = useAuthStore();
        auth.clearAuth();
        toast.error("Sua sessão expirou. Faça login novamente.");
        window.location.href = "/";
      }
    },
  });

  return deleteStudentMutation;
}