<template>
  <v-dialog :model-value="isVisible" max-width="500px" persistent>
    <v-card class="rounded-xl elevation-10">
      <v-card-title 
        class="text-h5 font-weight-bold bg-success text-white d-flex align-center justify-space-between pa-4"
        style="border-bottom: 2px solid #ddd;"
      >
        <div class="d-flex align-center">
          <v-icon class="mr-3">mdi-account-plus-outline</v-icon>
          Cadastrar Aluno
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
          Preencha as informações do aluno para cadastro.
        </p>

        <v-form @submit.prevent="submitRegister">
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
          <v-text-field
            v-model="ra"
            v-bind="raAttrs"
            :error-messages="errors.ra"
            label="RA"
            prepend-inner-icon="mdi-card-account-details-outline"
            variant="outlined"
            density="default"
            class="mb-4"
            color="primary"
            rounded="lg"
          />
          <v-text-field
            v-model="cpf"
            v-bind="cpfAttrs"
            :error-messages="errors.cpf"
            label="CPF"
            prepend-inner-icon="mdi-card-account-details-outline"
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
          color="success"
          variant="elevated"
          rounded="lg"
          class="text-none font-weight-bold elevation-4 px-4"
          :loading="registerStudentMutation.isPending.value"
          @click="submitRegister"
        >
          <v-icon start>mdi-account-plus-outline</v-icon>
          Cadastrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useRegisterStudentForm } from '@/hooks/useRegisterStudentForm';
import { useRegisterStudentMutation } from '@/hooks/useRegisterStudentMutation';
import { defineProps, defineEmits } from 'vue';

defineProps<{ isVisible: boolean }>();
const emit = defineEmits(['close', 'registered']);

const { handleSubmit, reset, defineField, errors } = useRegisterStudentForm();
const registerStudentMutation = useRegisterStudentMutation();

const [name, nameAttrs] = defineField('name');
const [email, emailAttrs] = defineField('email');
const [ra, raAttrs] = defineField('ra');
const [cpf, cpfAttrs] = defineField('cpf');

function closeModal(registered = false) {
  reset();
  emit('close', registered);
}

const submitRegister = handleSubmit(async (formValues) => {
  await registerStudentMutation.mutateAsync(formValues);
  closeModal(true);
});
</script>
