<template>
  <v-data-table-virtual
  :headers="headers"
  :items="items"
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
      <create-role-or-department :parentData="tab" @closed="toggleCreateDialog"/>
    </v-dialog>
    <v-dialog v-model="dialogEdit" max-width="50%" width="450px">
      <create-role-or-department :parentData="tab" :edit="true" :id="currentEditId" @closed="toggleEditDialog"/>
    </v-dialog>
    <v-dialog v-model="dialogDelete" max-width="30%">
      <v-card>
        <v-card-title class="text-h5">Deletar {{ headers[0].title }}?</v-card-title>
        <p class="mx-2" v-if="!allowedToDelete">Não é possível deletar o {{ headers[0].title }} porque existem usuários associados a ele.</p>
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
    </v-data-table-virtual>
  </template>

<script setup> 
import { ref, onMounted, defineProps } from 'vue';
import axios from 'axios';

import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

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
    fetch = 'http://localhost:3001/api/admin';
    headers[0].title = 'Admin';
    break;
  case 1:
    fetch = 'http://localhost:3001/api/department';
    headers[0].title = 'Setor';
    break;
  case 2:
    fetch = 'http://localhost:3001/api/role';
    headers[0].title = 'Grupo';
    break;
  case 3:
    fetch = 'http://localhost:3001/api/system';
    headers[0].title = 'Sistema';
    break;
  case 4:
    fetch = 'http://localhost:3001/api/sid';
    headers[0].title = 'Termo';
    break;
  default:
    fetch = 'http://localhost:3001/api/department';
    headers[0].title = 'Setor';
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

const confirmDelete = () => {
  loadingDelete.value = true;
  console.log('deleting', currentDeleteItem.value);
  axios.delete(`${fetch}/${currentDeleteItem.value}`, { withCredentials: true })
    .then(() => {
      toastr.success(`${headers[0].title} deletado com sucesso!`);
      fetchData();
      dialogDelete.value = false;
      loadingDelete.value = false;
    }).catch((error) => {
      toastr.error('Erro ao deletar o item');
      loadingDelete.value = false;
    });
  
    loadingDelete.value = false;
    toastr.success(`${headers[0].title} deletado com sucesso!`);
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

onMounted(() => {
    loading.value = true;
    fetchData()
    setTimeout(async () => {
      tab.value = props.parentData;
      loading.value = false;
    }, 500);
});
</script>