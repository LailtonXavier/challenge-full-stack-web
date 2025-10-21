import { getListStudentService } from '@/core/infra/controllers/student/getListStudent';
import type { FormattedError } from '@/core/infra/services/api.services';
import { useAuthStore } from '@/core/infra/store/authStore';
import { useStudentStore } from '@/core/infra/store/studentStore';
import { useMutation } from '@tanstack/vue-query';
import { toast } from "vue-sonner";

export function useListStudentMutation() {
  const student = useStudentStore();

  const listStudent = useMutation({
    mutationFn: (page: number) => getListStudentService(page),
    onSuccess: (data) => {
      student.setListStudent(data); 
    },
    onError: (err: FormattedError) => {
      const errorMessage = err.message ?? "Erro ao retornar os estudantes";
      toast.error(errorMessage);
      
      if (err.status === 401 && err.message === "jwt expired") {
        const auth = useAuthStore();
        auth.clearAuth();
        toast.error("Sua sessão expirou. Faça login novamente.");
        window.location.href = "/";
      }
    },
  });

  return listStudent;
}