import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { LoginSchema, type LoginDto } from '@/shared/schemas/loginSchema';

export function useLoginForm() {
  const validationSchema = toTypedSchema(LoginSchema);

  const {
    handleSubmit, 
    errors, 
    setFieldValue, 
    values,      
    resetForm,   
    defineField
  } = useForm<LoginDto>({
    validationSchema, 
    initialValues: {  
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