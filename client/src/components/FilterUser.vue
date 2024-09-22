<template>
  <v-data-table class="data-table" :headers="headers" :items="user" :sort-by="[{ key: 'date', order: 'desc' }]"
                :items-per-page="50" itemsPerPageText="Usuários por página"
                style="font-size: 1em; overflow-y: auto; max-width: 1500px; min-width: 80%; width: 100%;"
                no-data-text="Digite um nome ou email para filtrar" show-footer>
    <template v-slot:top>
      <v-toolbar prominent color="blue-lighten-5">
        <v-toolbar-title>Filtrar Usuários</v-toolbar-title>
        <v-divider inset vertical></v-divider>
        <v-spacer></v-spacer>
        <div @click="filterToggle">
          <span class="headline">Filtro Avançado</span>
          <v-icon class="me-8" size="large">
            mdi-filter
          </v-icon>
        </div>
        <v-dialog v-model="filter" max-width="400px" :loading="loading">
          <v-card>
            <v-card-title>
              <span class="headline">Filtro Avançado</span>
              <v-icon size="small" class="mb-2">mdi-filter</v-icon>
            </v-card-title>
            <v-card-text>
              <v-select v-model="selectedRoles" :items="roles.map(role => role.name).sort()" label="Filtrar por Grupo"
                        multiple dense hide-details class="me-2">
                <template #selection="{ item, index }">
                  <v-chip v-if="index < 3" small>
                    {{ item.title }}
                  </v-chip>
                  <div v-if="index === 3 && showMoreRoles" style="color: grey; font-size: small">
                    (+{{ selectedRoles.length - 3 }} outros)
                  </div>
                </template>
              </v-select>
            </v-card-text>
            <v-card-text>
              <v-select v-model="selectedDepartments" :items="departments.map(department => department.name).sort()"
                        label="Filtrar por Setores" multiple dense hide-details class="me-2">
                <template v-slot:prepend-item>
                  <v-checkbox class="ml-4 text-body-2 small-checkbox" @click="toggleSelectAll" hide-details
                              v-model="selectAll" ripple>
                    <template v-slot:label>
                      <span class="text-body-2"> Selecionar todos </span>
                    </template>
                  </v-checkbox>
                  <v-divider/>
                </template>
                <template #selection="{ item, index }">
                  <v-chip v-if="index < 3" small>
                    {{ item.title }}
                  </v-chip>
                  <div v-if="index === 3 && showMoreDepartments" style="color: grey; font-size: small">
                    (+{{ selectedDepartments.length - 3 }} outros)
                  </div>
                </template>
              </v-select>
            </v-card-text>
            <v-card-text v-if="systems != null || systems !== undefined">
              <v-select v-model="selectedSystems" :items="systems.map(sid => sid.name).sort()"
                        label="Filtrar por Sistema" multiple dense hide-details class="me-2">
                <template #selection="{ item, index }">
                  <v-chip v-if="index < 3" small>
                    {{ item.title }}
                  </v-chip>
                  <div v-if="index === 3 && showMoreSystems" style="color: grey; font-size: small">
                    (+{{ selectedRoles.length - 3 }} outros)
                  </div>
                </template>
              </v-select>
            </v-card-text>
            <div class="mx-5">
              <div class="teletrabalho-container">
                <p>Filtrar por teletrabalho:</p>
                <v-switch v-model="homeOffice" color="success" hide-details inset class="mb-2"></v-switch>
              </div>
              <div class="d-flex me-2" style="gap: 16px;" v-if="false">
                <v-text-field v-model="homeOfficeStart" label="Data de início" type="date"
                              style="flex: 1;"></v-text-field>
                <v-text-field v-model="homeOfficeEnd" label="Data de término" type="date"
                              style="flex: 1;"></v-text-field>
              </div>
            </div>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="reset">Limpar</v-btn>
              <v-btn color="primary" @click="filterToggle">OK</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-text-field append-inner-icon="mdi-magnify" density="compact" label="Filtrar" variant="solo" hide-details
                      single-line v-model="query" class="me-2" :loading="searching"></v-text-field>
        <v-btn color="primary" @click="fetchData" :disabled="searching">
          Filtrar
        </v-btn>
        <v-dialog v-if="false" v-model="dialog" max-width="500px">
        </v-dialog>
        <v-btn :disabled="!user || user.length === 0" class="me-2" style="color: green;">
          <v-icon @click="exportToCSV">mdi-file-excel</v-icon>
          <v-tooltip activator="parent" location="top">Exportar para CSV</v-tooltip>
        </v-btn>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon class="me-2" size="small" @click="viewUser(item)">
        mdi-eye
      </v-icon>
    </template>
  </v-data-table>
</template>

<script setup>
import {computed, onMounted, ref, watch} from 'vue';
import axios from '@/axiosSetup';

import {globalState} from '@/globalState';

import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

const loading = ref(true);
const dialog = ref(false);
const headers = [
  {
    title: 'Nome',
    align: 'start',
    key: 'name',
  },
  {title: 'Email', key: 'email', sortable: false},
  {title: 'Grupo', key: 'role', sortable: true},
  {title: 'Setor', key: 'department', sortable: true},
  // { title: 'Ações', key: 'actions', sortable: false }, to be implemented
];
const user = ref([]);
const id = ref(null);
const roles = ref([]);
const systems = ref([]);
const departments = ref([]);

const selectedRoles = ref([]);
const selectedSystems = ref([]);
const selectedDepartments = ref([]);

const query = ref('');
const homeOfficeEnd = ref('')
const homeOfficeStart = ref('')
const filter = ref(false);
const homeOffice = ref(false);
const selectAll = ref(false);
const searching = ref(false);

function filterToggle() {
  filter.value = !filter.value;
}

function reset() {
  selectedRoles.value = [];
  selectedSystems.value = [];
  selectedDepartments.value = [];
  homeOffice.value = false;
  homeOfficeEnd.value = '';
  homeOfficeStart.value = '';
}


function toggleSelectAll() {
  if (selectAll.value === false) {
    selectedDepartments.value = departments.value.map(department => department.name);
    selectAll.value = true;
  } else if (selectAll.value === true) {
    selectedDepartments.value = [];
    selectAll.value = false;
  }
}

const showMoreRoles = computed(() => {
  return selectedRoles.value.length > 3;
});

const showMoreSystems = computed(() => {
  return selectedSystems.value.length > 3;
});

const showMoreDepartments = computed(() => {
  return selectedDepartments.value.length > 3;
});

watch(selectedRoles, (newVal) => {
  if (newVal.length === 0) {
    selectAll.value = false;
  }
});
watch(dialog, (val) => {
  if (!val) close();
});

const exportToCSV = () => {
  const csvContent = convertToCSV(user.value);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'relatorio-usuarios.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

function convertToCSV(data) {
  if (data.length === 0) return '';

  data.sort((a, b) => {
    const departmentComparison = a.department.localeCompare(b.department);
    if (departmentComparison !== 0) {
      return departmentComparison;
    }
    return a.role.localeCompare(b.role);
  });

  const hasHomeOffice = data.some(user => user.homeOffice);

  const headers = Object.keys(data[0])
    .filter(key => key !== 'id' && key !== 'homeOffice' && key !== 'homeOfficeStart' && key !== 'homeOfficeEnd')
    .map(key => {
      if (key === 'name') return 'Nome';
      if (key === 'role') return 'Grupo';
      if (key === 'email') return 'Email';
      if (key === 'department') return 'Setor';
      return key;
    });

  if (hasHomeOffice) {
    headers.push('Início', 'Término');
  }

  const rows = data
    .map(user => {
      const { id, homeOffice, homeOfficeStart, homeOfficeEnd, ...rest } = user;
      const values = Object.values(rest)
        .map(value => `"${String(value).replace(/"/g, '""')}"`);

      if (homeOffice) {
        values.push(`"${homeOfficeStart || ''}"`, `"${homeOfficeEnd || ''}"`);
      }

      return values.join(',');
    })
    .join('\n');

  return `${headers.join(',')}\n${rows}`;
}

async function fetchData() {
  try {
    searching.value = true;

    if (query.value.length > 0 || selectedDepartments.value.length > 0 || selectedRoles.value.length > 0 || selectedSystems.value.length > 0 || homeOffice.value) {
      const response = await axios.get(`${globalState.apiUrl.value}/api/user`, {
        params: {
          query: query.value,
          selectedRoles: selectedRoles.value.map(roleName => {
            const role = roles.value.find(r => r.name === roleName);
            return role ? role.id : null;
          }).filter(id => id !== null),
          selectedDepartments: selectedDepartments.value.map(departmentName => {
            const department = departments.value.find(r => r.name === departmentName);
            return department ? department.id : null;
          }).filter(id => id !== null),
          selectedSystems: selectedSystems.value.map(systemName => {
            const system = systems.value.find(r => r.name === systemName);
            return system ? system.id : null;
          }).filter(id => id !== null),
          homeOffice: homeOffice.value,
        },
        withCredentials: true
      });

      user.value = response.data.map(user => {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role.name,
          department: user.department.name,
          homeOffice: user.homeOffice,
          homeOfficeStart: convertDate(user.homeOfficeStart),
          homeOfficeEnd: convertDate(user.homeOfficeEnd),
        }
      });
    } else {
      toastr.warning('Por favor, insira um nome ou e-mail, ou aplique um filtro para refinar sua busca.', null, {
        timeOut: 1500,
        progressBar: true,
        preventDuplicates: true
      });
    }
  } catch (error) {
    console.error("Error fetching data");
  }

  setTimeout(() => {
    searching.value = false;
  }, 1500);
}

function viewUser(item) {
  id.value = item.id;
  dialog.value = true;
}

function convertDate(dateString) {
  if (!dateString) {
    return 'N/A';
  }

  const date = dateString.substr(0, 10);
  const day = date.substr(8, 2);
  const month = date.substr(5, 2);
  const year = date.substr(0, 4);

  return `${day}/${month}/${year}`;
}

onMounted(async () => {
  try {
    roles.value = (await axios.get(`${globalState.apiUrl.value}/api/role`, {withCredentials: true})).data;
    systems.value = (await axios.get(`${globalState.apiUrl.value}/api/system`, {withCredentials: true})).data;
    departments.value = (await axios.get(`${globalState.apiUrl.value}/api/department`, {withCredentials: true})).data;
    loading.value = false;
  } catch (error) {
    console.error("Error fetching data");
  }
});
</script>

<style scoped>
.data-table {
  flex-grow: 1;
  height: 650px;
  max-height: fit-content;
}

.small-checkbox {
  height: 24px;
  line-height: 24px;
}

.teletrabalho-container {
  display: flex;
  align-items: center;
}

.teletrabalho-container p {
  margin-right: 10px;
  font-size: large;
}
</style>
