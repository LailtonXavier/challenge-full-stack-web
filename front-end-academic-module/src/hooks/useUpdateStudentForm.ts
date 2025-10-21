import { UpdateStudentSchema, type UpdateStudentDTO } from '@/shared/schemas/updateStudentSchema';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';

export function useUpdateStudentForm() {
  const validationSchema = toTypedSchema(UpdateStudentSchema);

  const {
    handleSubmit, 
    errors, 
    setFieldValue, 
    values,      
    resetForm,   
    defineField
  } = useForm<UpdateStudentDTO>({
    validationSchema, 
    initialValues: {  
      name: '',
      email: '',
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