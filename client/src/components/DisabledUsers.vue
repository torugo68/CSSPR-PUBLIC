<template>
    <v-data-table
      class="data-table"
      :headers="headers"
      :items="filteredUsers"
      v-if="!loading"
      :items-per-page="25"
      :items-per-page-options="[20, 50, 100]"
      style="font-size: 1em; overflow-y: auto; max-width: 1500px; min-width: 80%; width: 100%; max-height: 700px;"
      itemsPerPageText="Usuários por página"
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
                <v-btn color="green" variant="text" @click="restoreItemConfirm" :loading="loadingRestore">Confirmar</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogView">
            <view-user :userId="id" :disable="true" @closed="closeViewDialog()"/>
          </v-dialog>
        </v-toolbar>
    </template>
      <template v-slot:item.actions="{ item }">
        <div style="display: flex; gap: 2px; align-items: center;">
          <div style="display: flex; flex-direction: column; align-items: center;">
            <v-icon
              size="small"
              @click="viewItem(item)"
            >
              mdi-eye
            </v-icon>
            <v-tooltip
              activator="parent"
              location="top"
            >Visualizar</v-tooltip>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center;">
            <v-icon
              size="small"
              @click="restoreItem(item)"
            >
              mdi-restore
            </v-icon>
            <v-tooltip
              activator="parent"
              location="top"
            >Restaurar</v-tooltip>
          </div>
        </div>
      </template>
      </v-data-table>
      <div v-else>
        <Loading />
      </div>
  </template>
<script setup>
  import { ref, onMounted, computed, watch} from 'vue';
  import axios from '@/axiosSetup';

  import toastr from 'toastr';
  import 'toastr/build/toastr.min.css';

  import { globalState } from '../globalState';
  import Loading from './Loading.vue';

  const loadingRestore = ref(false);
  const usersData = ref([]);
  const departments = ref([]);
  const roles = ref([]);
  const userLog = ref([]);

  const searchQuery = ref('');

  const dialogView = ref(false);
  const id = ref(1);

  const dialogRestore = ref(false);

  watch(dialogRestore, (val) => {
    if (!val) closeRestore();
  });

  async function restoreItemConfirm() {
    loadingRestore.value = true;
    await axios.patch(
      `${globalState.apiUrl.value}/api/user?userId=${id.value}`, 
      { deletedAt: { not: null } }, 
      { withCredentials: true }
    )
    .then(response => {
      toastr.success('Usuário restaurado com sucesso!', null, { timeOut: 600});
    })
    .catch(error => {
      console.error('Error restoring user');
    });
    fetchData()
    closeRestore();
    loadingRestore.value = false;
  }

  function restoreItem(item) {
    id.value = item.id;
    dialogRestore.value = true;
  }

  function closeRestore() {
    dialogRestore.value = false;
  }

  function viewItem(item) {
    id.value = item.id;
    dialogView.value = true;
  }

  function closeViewDialog() {
    dialogView.value = false;
  }

  const filteredUsers = computed(() => {
    const query = searchQuery.value.toLowerCase();
    return usersData.value.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    ).sort((a, b) => new Date(b.date) - new Date(a.date));
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
    { title: 'Data da exclusão', key: 'deleteAt' },
    { title: 'Ações', key: 'actions', sortable: false },
  ];

const loading = ref(false);

const formatDate = (isoDate) => {
  if (!isoDate) return null;
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return null; 
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'America/Sao_Paulo' 
  }).format(date);
};

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
              deleteAt: formatDate(user.deletedAt),
            }
        });

        usersData.value = userInfo;
    } catch (error) {
    console.error("Error fetching data", error);
    }
    userLog.value = await axios.get(`${globalState.apiUrl.value}/api/logs/?userId=`, { withCredentials: true });
    userLog.value.data.sort((a, b) => {
      const dateA = new Date(a.deletedAt);
      const dateB = new Date(b.deletedAt);
      return dateA - dateB; 
    });
    setTimeout(async () => {
      loading.value = false;
    }, 150);
}

  onMounted(() => {
    loading.value = true;
    fetchData()
  });
</script>
