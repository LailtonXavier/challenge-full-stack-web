import { createEmployeeService } from '@/core/infra/controllers/employee/create';
import type { FormattedError } from '@/core/infra/services/api.services';
import { useAuthStore } from '@/core/infra/store/authStore';
import { useEmployeeStore } from '@/core/infra/store/employeeStore';
import type { EmployeeDto } from '@/shared/schemas/registerEmployeeSchema';
import { useMutation } from '@tanstack/vue-query';
import { toast } from "vue-sonner";

export function useRegisterEmployeeMutation() {
  const auth = useEmployeeStore();

  const registerEmployeeMutation = useMutation({
    mutationFn: (payload: EmployeeDto) => createEmployeeService(payload),

    onSuccess: (data) => {
      auth.setEmployee(data); 

      toast.success("Cadastro realizado com sucesso! Faça login agora!");
    },
    onError: (err: FormattedError) => {
      const errorMessage = err.message ?? "Erro ao criar um funcionario";
      toast.error(errorMessage);

      if (err.status === 401 && err.message === "jwt expired") {
        const auth = useAuthStore();
        auth.clearAuth();
        toast.error("Sua sessão expirou. Faça login novamente.");
        window.location.href = "/";
      }
    },
  });

  return registerEmployeeMutation;
}