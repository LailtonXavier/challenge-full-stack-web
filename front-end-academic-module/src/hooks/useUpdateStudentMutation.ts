import { updateStudentSerrvice } from '@/core/infra/controllers/student/update';
import type { FormattedError } from '@/core/infra/services/api.services';
import { useAuthStore } from '@/core/infra/store/authStore';
import { useStudentStore } from '@/core/infra/store/studentStore';
import { type UpdateStudentDTO } from '@/shared/schemas/updateStudentSchema';
import { useMutation } from '@tanstack/vue-query';
import { toast } from "vue-sonner";

interface MutationProps {
  studentId: string;
  data: UpdateStudentDTO;
}

export function useUpdateStudentMutation() {
  const studentStore = useStudentStore();
  const auth = useAuthStore();

  const updateStudentMutation = useMutation({
    mutationFn: (payload: MutationProps) =>
      updateStudentSerrvice(payload.studentId, payload.data),

    onSuccess: (updatedStudent) => {
      studentStore.updateStudentInStore(updatedStudent.id, updatedStudent);

      toast.success("Estudante atualizado com sucesso!");
    },

    onError: (err: FormattedError) => {
      const errorMessage = err.message ?? "Erro ao atualizar o estudante.";
      toast.error(errorMessage);

      if (err.status === 401 && err.message === "jwt expired") {
        auth.clearAuth();
        toast.error("Sua sessão expirou. Faça login novamente.");
        window.location.href = "/";
      }
    },
  });

  return updateStudentMutation;
}
