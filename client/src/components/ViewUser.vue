<template>
  <v-card class="mx-auto" min-width="450px" max-width="550px" style="overflow-x: auto;">
    <v-card-title class="custom-title" style="display:flex">
      Visualizar Usuário
    </v-card-title>
    <v-container v-if="!loading">
      <v-row>
        <v-col cols="12">
          <v-icon left class="mb-2">mdi-account</v-icon>
          <h4 class="d-inline">Nome: {{ user?.name || 'N/A' }}</h4>
        </v-col>
        <v-col cols="12" dense>
          <v-icon left class="mb-2">mdi-email</v-icon>
          <h5 class="d-inline">Email: {{ user?.email || 'N/A' }}</h5>
        </v-col>
        <v-col cols="12" dense>
          <v-icon left class="mb-2">mdi-account-group</v-icon>
          <h5 class="d-inline">Grupo: {{ user?.role?.name || 'N/A' }}</h5>
        </v-col>
        <v-col cols="12" dense>
          <v-icon left class="mb-2">mdi-office-building</v-icon>
          <h5 class="d-inline">Setor: {{ user?.department?.name || 'N/A' }}</h5>
        </v-col>
      </v-row>
      <v-row dense v-if="user?.sids?.length > 0">
        <v-col cols="12">
          <v-list>
            <h5>Termos:</h5>
            <v-list-item v-for="(sid, index) in user?.sids || []" :key="index">
              <div style="display:flex">
                <p>{{ user?.sids[index].sid?.name }}:</p>
                <a style="font-size: 1.05em; font-weight: bold;" class="ml-2" :href="baseUrl"
                   @click.prevent="copyToClipboard(sid?.value)" title="Copiar e consultar o protocolo">
                  <p>{{ sid?.value }}</p>
                </a>
              </div>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
      <div v-else>
        <v-row>
          <v-col cols="12">
            <h5>Nenhum termo cadastrado.</h5>
          </v-col>
        </v-row>
      </div>
      <div class="me-2" style="display: flex;">
        <h5>Teletrabalho:</h5>
        <div class="ml-2">
          <v-chip color="green" dark v-if="user.homeOffice">
            Sim ✅
          </v-chip>
          <v-chip color="red" dark v-else>
            Não ❌
          </v-chip>
        </div>
      </div>
      <div v-if="user.homeOffice">
        <ul>
          <li>Data de início: {{ convertDate(user.homeOfficeStart) }}</li>
          <li>Data de término: {{ convertDate(user.homeOfficeEnd) }}</li>
        </ul>
      </div>
      <v-data-table :headers="headers" :items="user.permissions.map(permission => {
        const system = systems.find(system => system.id === permission.systemId);
        if (system) {
          return { ...system, name: `${system.name}` };
        }
        return undefined;
      }).filter(system => system !== undefined) || []" class="elevation-1 mt-2" :hide-default-footer="true"
                    :hide-default-header="true" v-if="user.permissions?.length > 0" style="font-size: large">
        <template v-slot:item.name="{ item }">
          <span>{{ item.name }}</span>
          <span style="float: right;">Sim ✅</span>
        </template>
      </v-data-table>
      <div v-else>
        <v-row>
          <v-col cols="12">
            <h5>Nenhum sistema cadastrado.</h5>
          </v-col>
        </v-row>
      </div>
      <div class="mt-5" style="display: flex;" v-if="props.disable">
        <p class="me-1 mb-4">Status:</p>
        <v-chip color="red" dark style="margin-left: 10px;">
          Desativado
        </v-chip>
      </div>
      <v-btn text="Fechar" variant="text" @click="emitValue" append-icon="mdi-close" style="float: right;"
             class="mt-6"></v-btn>
    </v-container>
    <div v-else style="height: 100px; display: flex; justify-content: center; align-items: center;">
      <Loading/>
    </div>
  </v-card>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import axios from '@/axiosSetup';

import {globalState} from '../globalState';
import Loading from './Loading.vue';

const emit = defineEmits(['closed']);

const emitValue = () => {
  emit('closed');
};

const loading = ref(false);

const user = ref([]);
const systems = ref([]);

const headers = [
  {text: 'Sistema', value: 'name'},
  {text: 'Permissão', value: 'verified'}
];
const baseUrl = 'https://www.eprotocolo.pr.gov.br/spiweb/consultarProtocoloDigital.do?action=pesquisar';

const props = defineProps({
  userId: Number,
  disable: {
    type: Boolean,
    default: false
  }
})

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

async function copyToClipboard(value) {
  try {
    await navigator.clipboard.writeText(value);
    console.log('Text copied to clipboard');
  } catch (err) {
    console.error('Failed to copy text to clipboard');
  }

  window.open(baseUrl, '_blank');
}


onMounted(async () => {
  loading.value = true;
  try {
    await axios.get(`${globalState.apiUrl.value}/api/user/${props.userId}?disable=${props.disable}`, {withCredentials: true})
      .then((response) => {
        user.value = response.data;
      })

    await axios.get(`${globalState.apiUrl.value}/api/system`, {withCredentials: true})
      .then((response) => {
        systems.value = response.data;
      })

    setTimeout(() => {
      loading.value = false;
    }, 300);
  } catch (error) {
    console.error('Error fetch user data.')
    loading.value = false;
  }
});
</script>

<style scoped>
.custom-title {
  font-size: x-large;
  font-weight: bold;
}

.button-container {
  display: flex;
  justify-content: flex-end;
}

.custom-text-field {
  width: 99%;
}

.d-inline {
  display: inline-block;
  margin-left: 8px;
}
</style>
