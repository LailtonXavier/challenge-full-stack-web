import { searchStudentService } from '@/core/infra/controllers/student/getSearchStudent';
import type { FormattedError } from '@/core/infra/services/api.services';
import { useAuthStore } from '@/core/infra/store/authStore';
import { useStudentStore } from '@/core/infra/store/studentStore';
import { useMutation } from '@tanstack/vue-query';
import { toast } from "vue-sonner";

interface MutationProps {
  query: string, 
  page: number
}

export function useSearchStudentMutation() {
  const student = useStudentStore();

  const searchStudent = useMutation({
    mutationFn: (data: MutationProps) => searchStudentService(data.query, data.page),
    onSuccess: (data) => {
      student.setListStudent(data); 
    },
    onError: (err: FormattedError) => {
      const errorMessage = err.message ?? "Erro ao pesquisar os estudantes";
      toast.error(errorMessage);
      
      if (err.status === 401 && err.message === "jwt expired") {
        const auth = useAuthStore();
        auth.clearAuth();
        toast.error("Sua sessão expirou. Faça login novamente.");
        window.location.href = "/";
      }
    },
  });

  return searchStudent;
}