<template>
  <v-app style="background: #f4f6f8; display: flex; flex-direction: column; min-height: 100vh;">
    <v-app-bar 
      app 
      color="white" 
      elevation="2" 
      class="d-flex align-center justify-space-between flex-wrap px-4 py-2"
    >
      <v-avatar size="80" class="ml-2 bg-transparent">
        <v-img :src="logoImage" alt="Logo do Sistema" contain></v-img>
      </v-avatar>

      <v-spacer></v-spacer>
      
      <v-btn 
        icon 
        class="mr-4 mt-2 mt-sm-0"
        :loading="isLogoutPending"
        :disabled="isLogoutPending"
        @click="handleLogout"
        aria-label="Sair do sistema"
        title="Sair do sistema"
      >
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      :permanent="$vuetify.display.mdAndUp"
      temporary
      width="250"
      class="bg-grey-lighten-4 d-flex flex-column"
      style="border-right: 1px solid #e0e0e0;"
    >
      <div class="pa-4 text-subtitle-1 font-weight-medium text-grey-darken-3 text-center text-sm-start">
        Módulo Acadêmico
      </div>

      <v-list density="compact" nav class="mt-2">
        <v-list-item
          prepend-icon="mdi-account-school-outline"
          title="Alunos"
          value="alunos"
          color="primary"
          class="bg-white rounded-s-xl my-1 border-e-lg border-primary text-body-1"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="flex-grow-1">
      <v-container fluid class="pa-6 pa-sm-8">
        <h1 class="text-h4 font-weight-bold mb-6 text-grey-darken-3 text-center text-sm-start">
          Consulta de Alunos
        </h1>

        <StudentEditModal 
          :is-visible="showEditDialog"
          :student="selectedStudent"
          @close="showEditDialog = false"
        />

        <StudentDeleteModal 
          :is-visible="showDeleteDialog"
          :student="selectedStudent"
          @close="(deleted) => { showDeleteDialog = false; if(deleted) loadItems(1) }"
        />

        <StudentRegisterModal 
          :is-visible="showRegisterDialog"
          @close="(registered) => { showRegisterDialog = false; if(registered) loadItems(1) }"
        />

        <v-card 
          class="pa-4 pa-sm-6 pa-md-8 rounded-xl elevation-4"
          style="max-width: 100%; overflow-x: auto;"
        >
          <v-row 
            align="center"
            class="mb-4 d-flex flex-wrap gap-4"
            style="row-gap: 16px;"
          >
            <v-col cols="12" sm="8" md="6" lg="5" class="px-2">
              <v-text-field
                v-model="searchQuery"
                label="Digite sua busca (Nome, RA, CPF)"
                prepend-inner-icon="mdi-magnify"
                variant="solo-filled"
                density="comfortable"
                single-line
                hide-details
                flat
                rounded="lg"
                clearable
                @keyup.enter="loadItems"
                @click:clear="clearSearch"
                class="w-100"
              />
            </v-col>
            <v-col cols="12" sm="4" md="2" class="d-flex justify-center justify-sm-start px-2">
              <v-btn
                color="primary"
                size="large"
                rounded="lg"
                class="text-none font-weight-bold w-100 w-sm-auto"
                @click="loadItems"
                :loading="isLoading"
              >
                <v-icon left>mdi-filter-variant</v-icon>
                Pesquisar
              </v-btn>
            </v-col>
            <v-col cols="12" md="4" class="d-flex justify-center justify-md-end px-2">
              <v-btn
                color="success"
                size="large"
                rounded="lg"
                class="text-none font-weight-bold elevation-4 w-100 w-md-auto"
                @click="addStudent"
              >
                <v-icon left>mdi-plus-circle-outline</v-icon>
                Cadastrar Aluno
              </v-btn>
            </v-col>
          </v-row>

          <v-data-table-server
            :items-per-page="10" 
            :items-per-page-options="[10]"
            v-model:page="page"
            :items="students"
            :headers="headers"
            :items-length="totalItems"
            :loading="isLoading"
            @update:options="loadItems"
            item-value="registroAcademico"
            class="elevation-0 w-100"
            style="min-width: 100%; overflow-x: auto;"
          >
            <template v-slot:item.actions="{ item }">
              <div class="d-flex justify-center justify-md-center">
                <v-tooltip text="Editar">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon="mdi-pencil-outline"
                      variant="flat"
                      size="small"
                      color="warning"
                      class="mr-2"
                      @click="editStudent(item)"
                    ></v-btn>
                  </template>
                </v-tooltip>
                
                <v-tooltip text="Excluir">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon="mdi-delete-outline"
                      variant="flat"
                      size="small"
                      color="error"
                      @click="deleteStudet(item)"
                    ></v-btn>
                  </template>
                </v-tooltip>
              </div>
            </template>
            
            <template v-slot:no-data>
              <div class="pa-4 text-center text-grey-darken-1">
                Nenhum aluno encontrado. Tente refinar a busca ou cadastre um novo.
              </div>
            </template>
          </v-data-table-server>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>


<script setup lang="ts">
import { useStudentStore } from '@/core/infra/store/studentStore';
import { useListStudentMutation } from '@/hooks/useListStudentMutation';
import { useSearchStudentMutation } from '@/hooks/useSearchStudentMutation';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import type { VDataTableServer } from 'vuetify/components';

import type { Student } from '@/core/domain/entities/student';

import StudentEditModal from '@/core/components/StudentEditModal.vue';
import StudentRegisterModal from '@/core/components/StudentRegisterModal.vue';
import StudentDeleteModal from '@/core/components/StudentDeleteModal.vue';
import type { DataTableHeader } from 'vuetify';
import { capitalize } from '@/shared/utils/capitalize';
import { formatedCPF } from '@/shared/utils/formatedCPF';
import logoImage from '@/assets/grupo-logo.png';
import { useLogoutMutation } from '@/hooks/useLogoutMutation';

const studentStore = useStudentStore();
const listStudentMutation = useListStudentMutation();
const searchStudentMutation = useSearchStudentMutation()

const logoutMutation = useLogoutMutation();
const { mutate: doLogout, isPending: isLogoutPending } = logoutMutation;

const showRegisterDialog = ref(false);
const showDeleteDialog = ref(false);
const drawer = ref(true)

const showEditDialog = ref(false);
const selectedStudent = ref<Student | null>(null);
const searchQuery = ref('');
const page = ref(1);

const { listStudent } = storeToRefs(studentStore);

interface ItemsTable {
  id: string;
  ra: string;
  name: string;
  email: string;
  cpf: string;
  actions: string;
  fullStudent: Student;
}

const students = computed(() => {
  return listStudent.value?.students.map(s => {
    return {
      id: s.id,
      ra: `RA: ${s.ra}`,
      name: capitalize(s.name),
      email: s.email,
      cpf: formatedCPF(s.cpf), 
      actions: '',
      fullStudent: s, 
    };
  }) ?? [];
});

const totalItems = computed(() => {
  return listStudent.value?.total ?? 0;
});

const isLoading = computed(() =>
  listStudentMutation.isPending.value || searchStudentMutation.isPending.value
);

const headers: DataTableHeader[] = [
  { title: 'Registro Acadêmico', key: 'ra', align: 'start', sortable: true },
  { title: 'Nome', key: 'name', align: 'start', sortable: true },
  { title: 'CPF', key: 'cpf', align: 'start', sortable: false },
  { title: 'Ações', key: 'actions', align: 'center', sortable: false },
];

async function loadItems(options?: any) {
  const currentPage = options?.page ?? page.value;
  page.value = currentPage; 
  
  if (searchQuery.value.trim()) {
    await searchStudentMutation.mutateAsync({
      query: searchQuery.value.trim(),
      page: currentPage,
    });
  } else {
    await listStudentMutation.mutateAsync(currentPage);
  } 
}

async function clearSearch() {
  searchQuery.value = '';
  await loadItems({ page: 1 });
}

onMounted(() => {
  loadItems({ page: 1 });
});


const addStudent = () => {
  showRegisterDialog.value = true;
};

const editStudent = (item: ItemsTable) => {
  selectedStudent.value = item.fullStudent; 
  showEditDialog.value = true;
};

const deleteStudet = (item: ItemsTable) => {
  selectedStudent.value = item.fullStudent; 
  showDeleteDialog.value = true;
};

function handleLogout() {
  doLogout();
}
</script>

<style scoped>
.v-navigation-drawer :deep(.v-navigation-drawer__content) {
  overflow-y: hidden;
}
</style>

