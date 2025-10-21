import { tokenStore } from '@/core/infra/store/tokenStore';
import { CreateStudentSchema, type CreateStudentDTO } from '@/shared/schemas/registerStudentSchema';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { ref, watchEffect } from 'vue';

export function useRegisterStudentForm() {
  const validationSchema = toTypedSchema(CreateStudentSchema);

  const employeeId = ref<string>('');

  tokenStore.getAccessEmployeeId().then(id => {
    if (id) employeeId.value = id;
  });

  const {
    handleSubmit, 
    errors, 
    setFieldValue, 
    values,      
    resetForm,   
    defineField
  } = useForm<CreateStudentDTO>({
    validationSchema, 
    initialValues: {  
      name: '',
      email: '',
      cpf: '',
      ra: '',
      employeeId: '',
    },
  });

  watchEffect(() => {
    if (employeeId.value && values.employeeId === '') {
      setFieldValue('employeeId', employeeId.value);
    }
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