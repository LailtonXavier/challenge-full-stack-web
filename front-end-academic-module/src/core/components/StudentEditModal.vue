<template>
  <v-dialog :model-value="isVisible" max-width="500px" persistent>
    <v-card class="rounded-xl elevation-10">
      
      <v-card-title 
        class="text-h5 font-weight-bold bg-primary text-white d-flex align-center justify-space-between pa-4"
        style="border-bottom: 2px solid #ddd;"
      >
        <div class="d-flex align-center">
          <v-icon class="mr-3">mdi-pencil-box-multiple-outline</v-icon>
          Editar Aluno
        </div>
        <v-btn 
          icon="mdi-close" 
          variant="text" 
          color="white" 
          size="small" 
          @click="closeModal"
        />
      </v-card-title>

      <v-card-text class="py-6 px-6">
        <p class="text-body-2 text-grey-darken-1 mb-6">
          Atualize as informações de nome e e-mail do aluno.
        </p>

        <v-form @submit.prevent="submitEdit">
          <v-text-field
            v-model="name"
            v-bind="nameAttrs"
            :error-messages="errors.name"
            label="Nome Completo"
            prepend-inner-icon="mdi-account-outline"
            variant="outlined"
            density="default"
            class="mb-4"
            color="primary"
            rounded="lg"
          />
          <v-text-field
            v-model="email"
            v-bind="emailAttrs"
            :error-messages="errors.email"
            label="Email de Contato"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            density="default"
            class="mb-4"
            color="primary"
            rounded="lg"
          />
        </v-form>
        
      </v-card-text>

      <v-card-actions class="pa-4 bg-grey-lighten-4">
        <v-spacer />
        <v-btn 
          color="grey-darken-2" 
          variant="flat" 
          rounded="lg"
          class="text-none font-weight-medium px-4"
          @click="closeModal"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          rounded="lg"
          class="text-none font-weight-bold elevation-4 px-4"
          :loading="updateStudentMutation.isPending.value"
          @click="submitEdit"
        >
          <v-icon start>mdi-content-save-outline</v-icon>
          Salvar Alterações
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import type { Student } from '@/core/domain/entities/student';
import { useUpdateStudentForm } from '@/hooks/useUpdateStudentForm';
import { useUpdateStudentMutation } from '@/hooks/useUpdateStudentMutation';

const props = defineProps<{
  isVisible: boolean;
  student: Student | null;
}>();

const emit = defineEmits(['close']);

const { handleSubmit, reset, defineField, errors } = useUpdateStudentForm();
const updateStudentMutation = useUpdateStudentMutation();

const [name, nameAttrs] = defineField('name');
const [email, emailAttrs] = defineField('email');


watch(() => props.student, (newStudent) => {
  if (newStudent) {
    reset({
      values: {
        name: newStudent.name,
        email: newStudent.email,
      },
    });
  } else {
    reset(); 
  }
}, { immediate: true });


function closeModal() {
  reset();
  emit('close');
}

const submitEdit = handleSubmit(async (formValues) => {
  if (!props.student) return;

  await updateStudentMutation.mutateAsync({
    studentId: props.student.id,
    data: formValues,
  });
  
  closeModal();
});
</script>