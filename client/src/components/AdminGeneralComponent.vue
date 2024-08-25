<template>
  <v-data-table-virtual
  :headers="headers"
  :items="items.sort((a, b) => {
    if (a.name.toLowerCase() < b.name.toLowerCase()) {
      return -1;
    }
    if (a.name.toLowerCase() > b.name.toLowerCase()) {
      return 1;
    }
    return 0;
  })"
  item-value="name"
  height="400px"
  :loading="loading"
  > 
  <template v-slot:top>
    <div class="d-flex align-items-center mb-3 mt-5">
        <h5><span class="me-1 ml-2">Adicionar novo {{ headers[0].title }}</span></h5>
        <v-icon small  class="ml-1" @click="toggleCreateDialog">mdi-plus-circle</v-icon>
    </div>
    <v-dialog v-model="dialogCreate" style="max-width:420px; min-width: none;">
      <admin-general-create-item :parentData="tab" @closed="toggleCreateDialog"/>
    </v-dialog>
    <v-dialog v-model="dialogEdit" max-width="50%" width="450px">
      <admin-general-create-item :parentData="tab" :edit="true" :id="currentEditId" @closed="toggleEditDialog"/>
    </v-dialog>
    <v-dialog v-model="dialogDelete" max-width="30%">
      <v-card>
        <v-card-title class="text-h5">Deletar {{ headers[0].title }}?</v-card-title>
        <p style="text-align: center;" v-if="!allowedToDelete">Não é possível deletar o {{ headers[0].title }} porque existem usuários associados a ele.</p>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="toggleDeleteDialog">Cancelar</v-btn>
          <v-btn color="red-darken-3" variant="text" :loading="loadingDelete" :disabled="!allowedToDelete" @click="confirmDelete()">Confirmar</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
    <template v-slot:item.actions="{ item }">
      <div style="display: flex; gap: 2px; align-items: center;">
          <div style="display: flex; flex-direction: column; align-items: center;">
            <v-icon
              size="small"
              @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>
            <v-tooltip
              activator="parent"
              location="top"
            >Editar</v-tooltip>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center;">
            <v-icon
              size="small"
              @click="deleteItem(item)"
            >
              mdi-delete
            </v-icon>
            <v-tooltip
              activator="parent"
              location="top"
            >Deletar</v-tooltip>
          </div>
        </div>
    </template>
    </v-data-table-virtual>
  </template>

<script setup> 
import { ref, onMounted } from 'vue';
import axios from 'axios';

import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

import { globalState } from '../globalState';

const props = defineProps({
  parentData: {
    type: Number,
    required: true,
  },
  id: {
    type: Number,
    required: false,
    default: null,
  },
});

const headers = [
  {
    title: 'Nome',
    align: 'start',
    key: 'name',
  },
  { title: 'Ações', key: 'actions'},
];

const loading = ref(false);
const loadingDelete = ref(false);
const items = ref([]);
const tab = ref(props.parentData);
const allowedToDelete = ref(false);
const currentDeleteItem = ref(null);
const currentEditId = ref(null);
let fetch = ''

const dialogCreate = ref(false);
const dialogDelete = ref(false);
const dialogEdit = ref(false);

switch (props.parentData) {
  case 0: 
    fetch = `${globalState.apiUrl.value}/api/admin`;
    headers[0].title = 'Admin';
    break;
  case 1:
    fetch = `${globalState.apiUrl.value}/api/department`;
    headers[0].title = 'Setor';
    break;
  case 2:
    fetch = `${globalState.apiUrl.value}/api/role`;
    headers[0].title = 'Grupo';
    break;
  case 3:
    fetch = `${globalState.apiUrl.value}/api/system`;
    headers[0].title = 'Sistema';
    break;
  case 4:
    fetch = `${globalState.apiUrl.value}/api/sid`;
    headers[0].title = 'Termo';
    break;
  default:
    break;
}

function toggleCreateDialog() {
  fetchData();
  dialogCreate.value = !dialogCreate.value;
}

function toggleEditDialog() {
  fetchData();
  dialogEdit.value = !dialogEdit.value;
}

function editItem(item) {
  currentEditId.value = item.id;
  dialogEdit.value = true;
}
function deleteItem(item) {
  checkIfCanDelete(item.id);
  dialogDelete.value = true;
  currentDeleteItem.value = item.id;
}

function toggleDeleteDialog() {
  fetchData();
  dialogDelete.value = !dialogDelete.value;
}

const confirmDelete = async () => {
  loadingDelete.value = true;

  await axios.delete(`${fetch}/${currentDeleteItem.value}`, { withCredentials: true })
    .then(() => {
      toastr.success(`${headers[0].title} deletado com sucesso!`, null, { timeOut: 470});
      fetchData();
    }).catch((error) => {
      toastr.error('Erro ao deletar o item', null, { timeOut: 470});
    });
    
    loadingDelete.value = false;
    toggleDeleteDialog()
  };

async function checkIfCanDelete(id) {
  await axios.get(`${fetch}/check/${id}`, { withCredentials: true })
    .then((response) => {
      allowedToDelete.value = true;
    }).catch((error) => {
      console.error('Error checking if can delete');
      allowedToDelete.value = false;
    });
}

async function fetchData() {
  const { data } = await axios.get(fetch, { withCredentials: true });
  items.value = data;
}

onMounted(async () => {
    loading.value = true;
    await fetchData()
    setTimeout(() => {
      tab.value = props.parentData;
      loading.value = false;
    }, 500);
});
</script>