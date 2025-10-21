<template>
  <v-container
    fluid
    class="pa-0 d-flex flex-column"
    style="background: #f6f7f9; min-height: 100vh"
  >
    <v-row no-gutters class="fill-height">
      <v-col
        cols="12"
        md="6"
        class="d-flex flex-column align-center justify-center pa-10 pa-md-12"
      >
        <div class="d-flex flex-column" style="max-width: 480px">
          <v-avatar size="100" class="mb-8 bg-transparent">
            <v-img :src="logoImage" alt="Logo do Sistema" contain></v-img>
          </v-avatar>

          <h1
            class="mb-4 text-h3"
            style="font-weight: 800; color: #1e1e1e"
          >
            Bem-vindo ao seu<br />
            sistema educacional
          </h1>

          <p class="text-subtitle-1 text-grey-darken-2 mb-10">
            Acesse sua conta para gerenciar todos os alunos.
          </p>

          <div class="d-flex flex-column gap-3">
            <div class="d-flex align-center mb-3">
              <v-icon color="success" size="30" class="mr-4">mdi-lock-check</v-icon>
              <div>
                <strong class="text-body-1 text-grey-darken-4">Segurança avançada</strong><br />
                <span class="text-caption text-grey-darken-1">
                  Seus dados protegidos com criptografia de ponta a ponta.
                </span>
              </div>
            </div>

            <v-divider class="my-2"></v-divider>

            <div class="d-flex align-center">
              <v-icon color="primary" size="30" class="mr-4">mdi-rocket-launch-outline</v-icon>
              <div>
                <strong class="text-body-1 text-grey-darken-4">Acesso rápido</strong><br />
                <span class="text-caption text-grey-darken-1">
                  Interface otimizada para máxima produtividade.
                </span>
              </div>
            </div>
          </div>
          <div
            class="d-flex justify-center align-center mt-10"
            style="perspective: 1200px"
          >
            <div
              ref="mockupRef"
              class="rounded-xl elevation-8"
              style="
                transform: rotateY(-10deg) rotateX(5deg);
                transition: transform 0.6s ease, box-shadow 0.6s ease;
                max-width: 520px;
                background: linear-gradient(180deg, #fdfdfd 0%, #f2f4f7 100%);
                padding: 8px;
              "
              @mouseenter="onMouseEnter"
              @mouseleave="onMouseLeave"
            >
            <v-img
              :src="systemImage"
              alt="Mockup do Sistema Educacional"
              width="520"
              height="380"
              cover
              class="rounded-lg"
              style="object-fit: cover; image-rendering: -webkit-optimize-contrast;"
            />
            </div>
          </div>

        </div>
      </v-col>

      <v-col
        cols="12"
        md="6"
        class="d-flex align-center justify-center pa-4 pa-sm-8"
        style="background: #ffffff"
      >
        <v-card
          class="pa-6 pa-sm-10 rounded-xl"
          elevation="10"
          max-width="480"
          width="100%"
        >
          <h2 class="text-h4 font-weight-bold mb-1 text-center">Acesso ao Sistema</h2>
          <p class="text-body-2 text-grey-darken-1 mb-8 text-center">
            Entre com suas credenciais para continuar
          </p>

          <v-tabs
            v-model="tab"
            grow
            class="mb-8 bg-grey-lighten-4 rounded-pill"
            color="primary"
          >
            <v-tab value="login" class="text-none font-weight-medium text-body-1">Login</v-tab>
            <v-tab value="register" class="text-none font-weight-medium text-body-1">Registrar</v-tab>
          </v-tabs>

          <v-window v-model="tab">
            <v-window-item value="login">
              <v-form @submit.prevent="onLoginSubmit">
                <v-text-field
                  label="Email"
                  placeholder="admin@empresa.com"
                  v-model="loginEmail"
                  :error-messages="loginErrors.email"
                  prepend-inner-icon="mdi-email-outline"
                  variant="outlined"
                  density="comfortable"
                  class="mb-4 mt-2"
                />
                <v-text-field
                  label="Senha"
                  v-model="loginPassword"
                  :error-messages="loginErrors.password"
                  type="password"
                  prepend-inner-icon="mdi-lock-outline"
                  variant="outlined"
                  density="comfortable"
                  class="mb-6"
                />

                <v-btn
                  color="primary"
                  type="submit"
                  size="x-large"
                  block
                  :loading="isLoginPending"
                  :disabled="isLoginPending"
                  rounded="lg"
                  class="text-none font-weight-bold"
                >
                  Entrar
                </v-btn>
              </v-form>
            </v-window-item>

            <v-window-item value="register">
              <v-form @submit.prevent="onRegisterSubmit">
                <v-text-field
                  label="Nome"
                  v-model="registerName"
                  :error-messages="registerErrors.name"
                  prepend-inner-icon="mdi-account-outline"
                  variant="outlined"
                  density="comfortable"
                  class="mb-4 mt-10"
                />
                <v-text-field
                  label="Email"
                  v-model="registerEmail"
                  :error-messages="registerErrors.email"
                  prepend-inner-icon="mdi-email-outline"
                  variant="outlined"
                  density="comfortable"
                  class="mb-4"
                />
                <v-text-field
                  label="Senha"
                  v-model="registerPassword"
                  :error-messages="registerErrors.password"
                  type="password"
                  prepend-inner-icon="mdi-lock-outline"
                  variant="outlined"
                  density="comfortable"
                  class="mb-6"
                />

                <v-btn
                  color="primary"
                  type="submit"
                  size="x-large"
                  block
                  :loading="isRegisterEmployeePending"
                  :disabled="isRegisterEmployeePending"
                  rounded="lg"
                  class="text-none font-weight-bold"
                >
                  Registrar
                </v-btn>
              </v-form>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { useLoginForm } from '@/hooks/useLoginForm';
import { useLoginMutation } from '@/hooks/useLoginMutation';
import { useRegisterEmployeeForm } from '@/hooks/useRegisterEmployeeForm';
import { useRegisterEmployeeMutation } from '@/hooks/useRegisterEmployeeMutation';
import { ref } from "vue";
import logoImage from '@/assets/grupo-logo.png';
import systemImage from '@/assets/pc-system.png';

const tab = ref<"login" | "register">("login");

const { 
    handleSubmit: handleLoginValidation, 
    errors: loginErrors,
    defineField: defineLoginField 
} = useLoginForm();

const { 
    handleSubmit: handleRegisterValidation, 
    errors: registerErrors,
    defineField: defineRegisterField
} = useRegisterEmployeeForm();

const [loginEmail] = defineLoginField('email');
const [loginPassword] = defineLoginField('password');

const [registerName] = defineRegisterField('name');
const [registerEmail] = defineRegisterField('email');
const [registerPassword] = defineRegisterField('password');

const mockupRef = ref<HTMLDivElement | null>(null)

const { mutate: loginUser, isPending: isLoginPending } = useLoginMutation();
const { mutate: registerEmployee, isPending: isRegisterEmployeePending } = useRegisterEmployeeMutation();

const onLoginSubmit = handleLoginValidation((values) => {
  loginUser(values);
});


const onRegisterSubmit = handleRegisterValidation((values) => {
  registerEmployee(values, {
    onSuccess: () => {
      tab.value = "login";
    },
  });
});


const onMouseEnter = () => {
  if (mockupRef.value) {
    mockupRef.value.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1.02)'
  }
}

const onMouseLeave = () => {
  if (mockupRef.value) {
    mockupRef.value.style.transform = 'rotateY(-10deg) rotateX(5deg) scale(1)'
  }
}

</script>
