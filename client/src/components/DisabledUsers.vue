<template>
    <v-data-table
      class="data-table"
      :headers="headers"
      :items="filteredUsers"
      :sort-by="[{ key: 'email', order: 'asc' }]"
      v-if="!loading"
      :items-per-page="25"
      style="font-size: 1em; overflow-y: auto; max-width: 1500px; min-width: 80%; width: 100%;"
      itemsPerPageText="Usuários desativados por página"
      :loading="loading"
      item-value="name"
    >
    <template v-slot:top>
      <v-toolbar
            prominent
            color="blue-lighten-5"
        >
          <v-toolbar-title style="font-weight: 2px;">Usuários Desativados</v-toolbar-title>
          <v-divider
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-dialog
            max-width="500px"
          >
            <template v-slot:activator="{ props }">
              <v-card-text>
                <v-text-field
                  :loading="loading"
                  append-inner-icon="mdi-magnify"
                  density="compact"
                  label="Procurar"
                  variant="solo"
                  hide-details
                  single-line
                  v-model="searchQuery"
                ></v-text-field>
              </v-card-text>
            </template>
          </v-dialog>
          <v-dialog v-model="dialogRestore" max-width="30%">
            <v-card>
              <v-card-title class="text-h5">Restaurar usuário?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="text" @click="closeRestore">Cancelar</v-btn>
                <v-btn color="green" variant="text" @click="restoreItemConfirm">Confirmar</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogView">
            <ViewUser :userId="id" :disable="true" />
          </v-dialog>
        </v-toolbar>
    </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          class="me-2"
          size="small"
          @click="viewItem(item)"
        >
          mdi-eye
        </v-icon>
        <v-icon
          size="small"
          @click="restoreItem(item)"
        >
          mdi-restore
        </v-icon>
      </template>
      </v-data-table>
    </template>
<script setup>
  import { ref, onMounted, computed, watch} from 'vue';
  import axios from 'axios';

  import toastr from 'toastr';
  import 'toastr/build/toastr.min.css';
  import ViewUser from './ViewUser.vue';

  import { globalState } from '../globalState';

  const usersData = ref([])
  const departments = ref([])
  const roles = ref([])

  const searchQuery = ref('');

  const dialogView = ref(false);
  const id = ref(1);

  const dialogRestore = ref(false);

  watch(dialogRestore, (val) => {
    if (!val) closeRestore();
  });

  async function restoreItemConfirm() {
    toastr.success('Usuário restaurado com sucesso!', null, { timeOut: 470});
    closeRestore();
  }

  function restoreItem(item) {
    dialogRestore.value = true;
  }

  function closeRestore() {
    dialogRestore.value = false;
  }

  function viewItem(item) {
    id.value = item.id;
    dialogView.value = true;
  }

  const filteredUsers = computed(() => {
    const query = searchQuery.value.toLowerCase();
    return usersData.value.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  const headers = [
    {
      title: 'Nome',
      align: 'start',
      sortable: false,
      key: 'name',
    },
    { title: 'Email', key: 'email' },
    { title: 'Grupo', key: 'roleId' },
    { title: 'Setor', key: 'departmentId' },
    { title: 'Data da exclusão', key: 'departmentId' },
    { title: 'Admin', key: 'admin' },
    { title: 'Ações', key: 'actions', sortable: false },
  ];

  const loading = ref(false);

async function fetchData() {
    try {
        const users = await axios.get(`${globalState.apiUrl.value}/api/user?disable=true`, {
            withCredentials: true,
            headers: {
            'Content-Type': 'application/json'
            }
        });

        await axios.get(`${globalState.apiUrl.value}/api/role`, { withCredentials: true })
        .then(response => {
            roles.value = response.data;
        })
        .catch(error => {
            console.error('Error fetching roles:');
        });

        await axios.get(`${globalState.apiUrl.value}/api/department`, { withCredentials: true })
            .then(response => {
            departments.value = response.data;
            })
            .catch(error => {
            console.error('Error fetching departments');
            });
        const userInfo = users.data.map(user => {
            return {
            id: user.id,
            name: user.name,
            email: user.email,
            roleId: roles.value.find(role => role.id === user.roleId).name,
            departmentId: departments.value.find(department => department.id === user.departmentId).name,
            }
        });

        usersData.value = userInfo;
    } catch (error) {
    console.error("Error fetching data");
    }
}

  onMounted(() => {
      loading.value = true;
      fetchData()
      setTimeout(async () => {
        loading.value = false;
      }, 500);
  });
</script>
