<template>
  <v-dialog :model-value="isVisible" max-width="500px" persistent>
    <v-card class="rounded-xl elevation-10">
      <v-card-title 
        class="text-h5 font-weight-bold bg-error text-white d-flex align-center justify-space-between pa-4"
        style="border-bottom: 2px solid #ddd;"
      >
        <div class="d-flex align-center">
          <v-icon class="mr-3">mdi-alert-circle-outline</v-icon>
          Confirmar Exclusão
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
        <div class="text-center mb-4">
          <v-icon size="80" color="error" class="mb-3">
            mdi-delete-alert-outline
          </v-icon>
        </div>

        <p class="text-h6 font-weight-medium text-center mb-4 text-grey-darken-3">
          Tem certeza que deseja excluir este aluno?
        </p>

        <v-alert 
          type="warning" 
          variant="tonal" 
          class="mb-4"
          border="start"
          rounded="lg"
        >
          <div class="text-body-2">
            <strong>Atenção:</strong> Esta ação não pode ser desfeita.
          </div>
        </v-alert>

        <div v-if="student" class="bg-grey-lighten-4 pa-4 rounded-lg">
          <div class="mb-2">
            <span class="font-weight-bold text-grey-darken-2">Nome:</span>
            <span class="ml-2 text-grey-darken-3">{{ capitalize(student.name) }}</span>
          </div>
          <div class="mb-2">
            <span class="font-weight-bold text-grey-darken-2">RA:</span>
            <span class="ml-2 text-grey-darken-3">{{ student.ra }}</span>
          </div>
          <div class="mb-2">
            <span class="font-weight-bold text-grey-darken-2">Email:</span>
            <span class="ml-2 text-grey-darken-3">{{ student.email }}</span>
          </div>
          <div>
            <span class="font-weight-bold text-grey-darken-2">CPF:</span>
            <span class="ml-2 text-grey-darken-3">{{ formatedCPF(student.cpf) }}</span>
          </div>
        </div>
      </v-card-text>

      <v-card-actions class="pa-4 bg-grey-lighten-4">
        <v-spacer />
        <v-btn 
          color="grey-darken-2" 
          variant="flat" 
          rounded="lg"
          class="text-none font-weight-medium px-4"
          @click="closeModal"
          :disabled="deleteStudentMutation.isPending.value"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="error"
          variant="elevated"
          rounded="lg"
          class="text-none font-weight-bold elevation-4 px-4"
          :loading="deleteStudentMutation.isPending.value"
          @click="confirmDelete"
        >
          <v-icon start>mdi-delete-outline</v-icon>
          Excluir
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { Student } from '@/core/domain/entities/student';
import { useDeleteStudentMutation } from '@/hooks/useDeleteStudentMutation';
import { capitalize } from '@/shared/utils/capitalize';
import { formatedCPF } from '@/shared/utils/formatedCPF';

const props = defineProps<{ 
  isVisible: boolean;
  student: Student | null;
}>();

const emit = defineEmits(['close', 'deleted']);

const deleteStudentMutation = useDeleteStudentMutation();

function closeModal(deleted = false) {
  emit('close', deleted);
}

async function confirmDelete() {
  if (!props.student) return;
  
  await deleteStudentMutation.mutateAsync(props.student.id);
  closeModal(true);
}
</script>