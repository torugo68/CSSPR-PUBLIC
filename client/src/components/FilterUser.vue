<template>
    <v-data-table
      class="data-table"
      :headers="headers"
      :items="user"
      :sort-by="[{ key: 'date', order: 'desc' }]"
      hide-default-footer
      style="font-size: 1em; overflow-y: auto; max-width: 1500px; min-width: 80%; width: 100%;"
      no-data-text="Digite um nome ou email para filtrar"
    >
        <template v-slot:top>
            <v-toolbar
                prominent
                color="blue-lighten-5"
            >
            <v-toolbar-title style="font-weight: 2px;">Filtrar Usuários</v-toolbar-title>
            <v-divider
                inset
                vertical
            ></v-divider>
            <v-spacer></v-spacer>
            <v-text-field
                append-inner-icon="mdi-magnify"
                density="compact"
                label="Filtrar"
                variant="solo"
                hide-details
                single-line
                v-model="query"
                class="me-2"
                :loading="searching"
            ></v-text-field>
            <v-btn
                color="primary"
                @click="fetchData"
                class="mr-10"
                :disabled="searching"
            >
            Filtrar
            </v-btn>
            <v-dialog
            v-if="false"
            v-model="dialog"
            max-width="500px"
            >
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          class="me-2"
          size="small"
          @click="viewUser(item)"
        >
            mdi-eye
        </v-icon>
      </template>
    </v-data-table>
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
          title: 'Nome',
          align: 'start',
          key: 'name',
        },
        { title: 'Email', key: 'email', sortable: false },
        { title: 'Grupo', key: 'role', sortable: false },
        { title: 'Setor', key: 'department', sortable: false },
        // { title: 'Ações', key: 'actions', sortable: false }, to be implemented
    ];
    const user = ref([]);
    const id = ref(null);

    const query = ref('');
    const searching = ref(false);
  
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

    watch(dialog, (val) => {
        if (!val) close();
    });

    function fetchData() {
        try {
            if (query.value) {
                searching.value = true;
                setTimeout(async () => {
                    const response = await axios.get(`http://localhost:3001/api/user?query=${query.value}`, { withCredentials: true });
                    const userInfo = response.data.map(user => {
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role.name,
                            department: user.department.name,
                        }
                    });
                    user.value = userInfo;
                    searching.value = false;
                }, 450);
            }
        } catch (error) {
            console.error("Error fetching data");
        }
    }

    function viewUser(item) {
    id.value = item.id;
    dialog.value = true;
  }
  </script>

<style scoped>
  .data-table {
    flex-grow: 1;
    height: 650px;
    max-height: fit-content;
  }
</style>