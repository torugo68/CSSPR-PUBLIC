<template>
    <v-data-table
      class="data-table"
      :headers="headers"
      :items="logs.value"
      :sort-by="[{ key: 'email', order: 'asc' }]"
      v-if="!loading"
      style="font-size: 1em; overflow-y: auto; max-width: 1500px; min-width: 80%; width: 100%;"
    >
      <template v-slot:top>
        <v-toolbar
            prominent
            color="blue-lighten-5"
        >
          <v-toolbar-title style="font-weight: 2px;">Logs</v-toolbar-title>
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
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          class="me-2"
          size="small"
        >
            mdi-eye
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
  
  import toastr from 'toastr';
  import 'toastr/build/toastr.min.css';
  
  const isMounted = ref(false); 
  const loading = ref(true);
  const dialog = ref(false);
  const headers = [
        {
          title: 'Nome do Usuário',
          align: 'start',
          sortable: false,
          key: 'name',
        },
        { title: 'Email do Usuário', key: 'user.email', sortable: false },
        { title: 'Grupo do Usuário', key: 'roleId', sortable: false },
        { title: 'Data da Operação', key: 'date' },
        { title: 'Administrador', key: 'admins'},
    ];
    const defaultItem = {
        name: '',
        email: '',
        roleId: -1,
        departmentId: -1,
    };
    const id = ref(1);
    
    const logs = ref([]);

    const searchQuery = ref('');
  
    const filteredLogs = computed(() => {
        const query = searchQuery.value.toLowerCase();
        return logs.value.filter(user => 
            user.name.toLowerCase().includes(query) || 
            user.email.toLowerCase().includes(query)
        );
    });

    watch(dialog, (val) => {
    if (!val) close();
    });

    onMounted(() => {
    if (!isMounted.value) {
        setTimeout(async () => {
        await fetchData();
        isMounted.value = true;
        loading.value = false;
        }, 600);
    }
    });

    function close() {
    dialog.value = false;
    nextTick(() => {
        Object.assign(editedItem, defaultItem);
        editedIndex.value = -1;
    });
    }

    async function fetchData() {
        try {
            const logsInfo = await axios.get('http://localhost:3001/api/logs', { withCredentials: true });

            console.log(logsInfo)
            logs.value = logsInfo;
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