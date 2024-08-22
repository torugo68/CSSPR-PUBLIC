<template>
    <v-data-table
      class="data-table"
      :headers="headers"
      :items="filteredUsers"
      :sort-by="[{ key: 'email', order: 'asc' }]"
      v-if="!loading"
      :items-per-page="25"
      style="font-size: 1em; overflow-y: auto; max-width: 1500px; min-width: 80%; width: 100%;"
      itemsPerPageText="Usuários por página"
    >
      <template v-slot:top>
        <v-toolbar
            prominent
            color="blue-lighten-5"
        >
          <v-toolbar-title style="font-weight: 2px;">Listar Usuários</v-toolbar-title>
          <v-divider
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialog"
            max-width="500px"
          >
            <template v-slot:activator="{ props }">
              <v-btn
                class="mb-2 mt-3"
                color="primary"
                dark
                v-bind="props"
              >
                Novo Usuário
              </v-btn>
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
            <create-user @closed="handleNewUser"></create-user>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="30%">
            <v-card>
              <v-card-title class="text-h5">Deletar usuário?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancelar</v-btn>
                <v-btn color="red-darken-3" variant="text" @click="deleteItemConfirm">Confirmar</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogEdit">
            <edit-user :userId="id" @closed="closeEdit" @editedUser="editedUser"></edit-user>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          class="me-2"
          size="small"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          size="small"
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <v-progress-circular
      v-else
      :size="60"
      color="primary"
      indeterminate
      ></v-progress-circular>
      
    </template>

<script setup>
  import { ref, reactive, watch, onMounted, nextTick, computed } from 'vue';
  import axios from 'axios';
  
  import { globalState } from '../globalState';

  import toastr from 'toastr';
  import 'toastr/build/toastr.min.css';
  
  const isMounted = ref(false) 
  const loading = ref(true);
  const dialog = ref(false);
  const dialogDelete = ref(false);
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
    { title: 'Ações', key: 'actions', sortable: false },
  ];
  const users = ref([]);
  const editedIndex = ref(-1);
  const editedItem = reactive({
    name: '',
    email: '',
    roleId: -1,
    departmentId: -1,
  });
  const defaultItem = {
    name: '',
    email: '',
    roleId: -1,
    departmentId: -1,
  };
  const id = ref(1);
  
  const usersData = ref([]);
  const roles = ref([]);
  const departments = ref([]);
  const searchQuery = ref('');
  
  const filteredUsers = computed(() => {
    const query = searchQuery.value.toLowerCase();
    return usersData.value.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query)
    );
  });

  watch(dialog, (val) => {
    if (!val) close();
  });
  
  watch(dialogDelete, (val) => {
    if (!val) closeDelete();
  });

  const closeEdit = () => {
    dialogEdit.value = false;
  };

  const editedUser = (value) => {
    const user = usersData.value.find(user => user.id === value.id);
    if (user) {
      user.name = value.name;
      user.email = value.email;
      user.roleId = roles.value.find(role => role.id === value.roleId).name;
      user.departmentId = departments.value.find(department => department.id === value.departmentId).name;
    } else {
      console.error('User not found');
    }
    dialogEdit.value = false;
  };

  const handleNewUser = (value) => {
    usersData.value.push({
      id: value.id,
      name: value.name,
      email: value.email,
      roleId: roles.value.find(role => role.id === value.roleId).name,
      departmentId: departments.value.find(department => department.id === value.departmentId).name,
    });
    dialog.value = false;
  };
  
  onMounted(() => {
    if (!isMounted.value) {
      setTimeout(async () => {
        await fetchData();
        isMounted.value = true;
        loading.value = false;
      }, 600);
    }
  });
  
  function editItem(item) {
    id.value = item.id;
    dialogEdit.value = true;
  }
  
  function deleteItem(item) {
    editedIndex.value = users.value.indexOf(item);
    Object.assign(editedItem, item);
    dialogDelete.value = true;
  }
  
  async function deleteItemConfirm() {
    users.value.splice(editedIndex.value, 1);
    const userId = usersData.value.find(user => user.email === editedItem.email).id;
    try {
      await axios.delete(`${globalState.apiUrl.value}/api/user/${userId}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      usersData.value = usersData.value.filter(user => user.id !== userId);
      toastr.success('Usuário deletado com sucesso!', null, { timeOut: 470});
    } catch (error) {
      toastr.error('Erro ao deletar usuário', null, { timeOut: 470});
    }
    closeDelete();
  }
  
  const dialogEdit = ref(false);

  function close() {
    dialog.value = false;
    nextTick(() => {
      Object.assign(editedItem, defaultItem);
      editedIndex.value = -1;
    });
  }
  
  function closeDelete() {
    dialogDelete.value = false;
    nextTick(() => {
      editedIndex.value = -1;
    });
  }
  
  async function fetchData() {
    try {
      const users = await axios.get(`${globalState.apiUrl.value}/api/user`, {
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
  </script>

<style scoped>
  .data-table {
    flex-grow: 1;
    height: 650px;
    max-height: fit-content;
  }
</style>