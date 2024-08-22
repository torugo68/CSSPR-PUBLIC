<template>
    <v-data-table-virtual
    :headers="headers"
    :items="usersData"
    item-value="name"
    height="400px"
    :loading="loading"
    > 
    <template v-slot:top>
      <div class="d-flex align-items-center mb-3 mt-5">
          <h5><span class="me-1 ml-2">Usuários desativados</span></h5>
      </div>
    </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          class="me-2"
          size="small"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          size="small"
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
  
  import { globalState } from '../globalState';
  
  const usersData = ref([])

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
  
  onMounted(() => {
      loading.value = true;
      fetchData()
      setTimeout(async () => {
          tab.value = props.parentData;
        loading.value = false;
      }, 500);
  });
</script>