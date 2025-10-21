import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { RegisterEmployeeSchema, type EmployeeDto } from '@/shared/schemas/registerEmployeeSchema';

export function useRegisterEmployeeForm() {
  const validationSchema = toTypedSchema(RegisterEmployeeSchema);

  const {
    handleSubmit, 
    errors, 
    setFieldValue, 
    values,      
    resetForm,   
    defineField
  } = useForm<EmployeeDto>({
    validationSchema, 
    initialValues: {  
      name: '',
      email: '',
      password: '',
    },
  });
  
  return {
    handleSubmit,
    reset: resetForm,
    errors,
    values,
    setValue: setFieldValue,
    defineField
  };
}