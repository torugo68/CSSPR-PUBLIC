<template>
    <v-data-table
      class="data-table"
      :headers="headers"
      :items="filteredLogs"
      :sort-by="[{ key: 'date', order: 'desc' }]"
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
  import { ref, reactive, watch, onMounted, computed } from 'vue';
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
        { title: 'Email do Usuário', key: 'email', sortable: false },
        { title: 'Grupo do Usuário', key: 'role', sortable: false },
        { title: 'Tipo da Operação', key: 'operation', sortable: false },
        { title: 'Data da Operação', key: 'date' },
        { title: 'Administrador', key: 'admin'},
    ];
    
    const id = ref(1);
    
    const logs = ref([]);

    const searchQuery = ref('');
  
    const filteredLogs = computed(() => {
      const query = searchQuery.value.toLowerCase();
      return logs.value
        .filter(log => 
          log && log.name && log.email && (
            log.name.toLowerCase().includes(query) || 
            log.email.toLowerCase().includes(query)
          )
        )
        .sort((a, b) => new Date(b.date) - new Date(a.date));
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
    }

    function formatDate(isoDate) {
      const date = new Date(isoDate);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'UTC'
      }).format(date);
    }

    async function fetchData() {
        try {
            await axios.get('http://localhost:3001/api/logs', { withCredentials: true })
            .then((response) => {
              const logsInfo = response.data.map(log => {
                if (log.user) {
                  return {
                    admin: log.admin.username,
                    name: log.user.name,
                    email: log.user.email,
                    role: log.user.role.name,
                    department: log.user.department.name,
                    date: formatDate(log.createdAt),
                    operation: log.operation.name,
                  }
                }
              });
                logs.value = logsInfo;
            });

        } catch (error) {
            console.error("Error fetching data", error);
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