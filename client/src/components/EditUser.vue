<template>
  <v-card class="mx-auto" min-width="450px" max-width="600px" style="overflow-x: auto;">
    <v-card-title class="custom-title">
      <v-icon class="mr-1">mdi-account</v-icon>
      Editar Usuário
    </v-card-title>
    <v-container>
      <div v-if="!loadingComponent">
        <v-form @submit.prevent="submit">
          <div v-if="editName" style="display: flex; align-items: center;">
            <v-text-field v-model="name.value.value" label="Nome" :error-messages="name.errorMessage.value" clearable
              variant="underlined" class="mb-3"></v-text-field>
            <v-icon small @click="toggleNameEdit" class="ml-1"
              :disabled="NamehasErrorMessages.value">mdi-content-save</v-icon>
          </div>
          <div v-else style="display: flex; align-items: center;" class="mb-3">
            <h5>{{ name.value.value }}</h5>
            <v-icon small @click="toggleNameEdit" class="ml-1">mdi-pencil</v-icon>
          </div>
          <div v-if="editEmail" style="display: flex; align-items: center;">
            <v-text-field v-model="email.value.value" label="Email" :error-messages="email.errorMessage.value" clearable
              variant="underlined" class="mb-3"></v-text-field>
            <v-icon small @click="toggleEmailEdit" class="ml-1"
              :disabled="EmailhasErrorMessages.value">mdi-content-save</v-icon>
          </div>
          <div v-else style="display: flex; align-items: center;" class="mb-3">
            <h5>{{ email.value.value }}</h5>
            <v-icon small @click="toggleEmailEdit" class="ml-1">mdi-pencil</v-icon>
          </div>
          <v-select v-model="role.value.value" :items="roles.map(role => role.name).sort((a, b) => a.localeCompare(b))"
            item-text="name" item-value="id" :error-messages="role.errorMessage.value"
            label="Selecione o Grupo"></v-select>
          <v-select v-model="department.value.value"
            :items="departments.map(department => department.name).sort((a, b) => a.localeCompare(b))" item-text="name"
            item-value="id" label="Selecione o Setor" :error-messages="department.errorMessage.value"></v-select>
          <v-select v-model="selectedSystems.value.value"
            :items="systems.map(item => item.name).sort((a, b) => a.localeCompare(b))" label="Gerenciar Sistemas"
            :error-messages="selectedSystems.errorMessage.value" multiple>
            <template v-slot:selection="{ item, index }">
              <div v-if="selectedSystems.value.value.length > 1">
                <v-chip v-if="index < 4 && index != 0">
                  <span>{{ item.title }}</span>
                </v-chip>
                <span v-if="index === 4" class="text-grey text-caption align-self-center">
                  (+{{ selectedSystems.value.value.length - 4 }} outros)
                </span>
              </div>
              <div v-else>
                <span class="text-grey text-caption align-self-center">
                  (Nenhum sistema selecionado)
                </span>
              </div>
            </template>
          </v-select>
          <div class="d-flex align-items-center mb-3">
            <span class="me-1 ml-2">Adicionar novo termo</span>
            <v-icon small @click="addNewSid()">mdi-plus-circle</v-icon>
          </div>
          <div v-for="item, index in sids" :key="item">
            <div style="display: flex; align-items: center;">
              <div v-if="item.activated" style="flex: 1;">
                <v-container fluid v-if="item.newSid">
                  <v-row justify="start">
                    <v-col cols="auto">
                      <div>
                        <v-select v-model="item.sid.name"
                          :items="allSids.map(item => item.name).filter(item => !sids.map(item => item.sid.name).includes(item)).sort((a, b) => a.localeCompare(b))"
                          item-text="name" item-value="id" label="Termo"></v-select>
                      </div>
                    </v-col>
                    <v-col>
                      <v-row>
                        <v-col>
                          <v-text-field v-model="item.value" :label="item.sid.name" :error-messages="item.errorMessage"
                            clearable variant="underlined" class="mb-3 custom-text-field flex"
                            @input="validateSid(item.value, index)">
                            <template v-slot:append>
                              <v-icon small @click="toggleActivation(index)"
                                :disabled="item.errorMessage !== ''">mdi-content-save</v-icon>
                            </template>
                          </v-text-field>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-container>
                <!-- existing sids !!!  -->
                <div style="display: flex; align-items: center;" v-else>
                  <v-text-field v-model="item.value" :label="item.sid.name" :error-messages="item.errorMessage"
                    variant="underlined" class="mb-3 custom-text-field"
                    @input="validateSid(item.value, index)"></v-text-field>
                  <v-icon small @click="toggleActivation(index)"
                    :disabled="item.errorMessage !== ''">mdi-content-save</v-icon>
                </div>
              </div>
              <div v-else style="display: flex; align-items: center; flex: 1;" class="mb-3">
                <p style="margin-right: 3px; font-weight: bold; font-size: 1.05em;" class="mb-2 ml-1">SID {{
                  item.sid.name }}:</p>
                <a style="font-size: 1.05em" class="ml-2 mb-2" :href="baseUrl"
                  @click.prevent="copyToClipboard(item.value)">{{
                    item.value }}</a>
                <v-icon small @click="toggleActivation(index)" class="ml-1 mb-2">mdi-pencil</v-icon>
              </div>
            </div>
          </div>
          <div class="teletrabalho-container">
            <h5>Teletrabalho:</h5>
            <v-switch v-model="homeOffice" color="success" hide-details inset class="mb-2"></v-switch>
          </div>
          <div class="d-flex me-2" style="gap: 16px;" v-if="homeOffice">
            <v-text-field v-model="homeOfficeStart" label="Digite a data de início" type="date"
              style="flex: 1;"></v-text-field>
            <v-text-field v-model="homeOfficeEnd" label="Digite a data de término" type="date"
              style="flex: 1;"></v-text-field>
          </div>
          <h6 v-if="isHomeOfficeDateValid() && homeOffice" class="alert">
            A data de início deve ser menor que a de término
          </h6>
          <div class="button-container mt-5">
            <v-btn color="black-darken-1" variant="text" @click="emitValue(true)">Cancelar</v-btn>
            <v-btn color="blue-darken-3" :loading="loading" variant="text" type="submit" append-icon="mdi-check"
              :disabled="Editing()">Salvar</v-btn>
          </div>
        </v-form>
      </div>
      <Loading v-else></Loading>
    </v-container>
  </v-card>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from '@/axiosSetup';
import { useField, useForm } from 'vee-validate'
import validator from 'validator';

import { globalState } from '../globalState';
import Loading from './Loading.vue';

import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

const loading = ref(false);
const loadingComponent = ref(false);
const emit = defineEmits(['closed', 'editedUser']);

const emitValue = (value) => {
  emit('closed', value);
};
const emitEditedUser = (value) => {
  emit('editedUser', value);
};

const { handleSubmit } = useForm({
  validationSchema: {
    name(value) {
      if (!value) return 'Campo obrigatório.'
      if (!validator.isLength(value, { min: 3 })) return 'É necessario ter pelo menos 3 caracteres.'
      if (!validator.isLength(value, { max: 250 })) return 'É permitido ter no máximo 250 caracteres.'
      return true
    },

    email(value) {
      if (!value) return 'Campo obrigatório.'
      if (!validator.isEmail(value)) return 'Email inválido.'
      if (!validator.isLength(value, { min: 3 })) return 'É necessario ter pelo menos 3 caracteres.'
      if (!validator.isLength(value, { max: 250 })) return 'É permitido ter no máximo 250 caracteres.'
      return true
    },

    role(value) {
      if (value) return true
      return 'Campo obrigatório.'
    },

    department(value) {
      if (value) return true
      return 'Campo obrigatório.'
    },

    SelectedSystems(value) {
      if (selectedSystems.value.value === undefined || selectedSystems.value.value === null || selectedSystems.value.value.length === 0) selectedSystems.value.value = '';
      return true
    },
  },
})

const name = useField('name');
const email = useField('email');
const role = useField('role');
const homeOffice = ref(false);
const homeOfficeStart = ref(null);
const homeOfficeEnd = ref(null);
const department = useField('department');
const selectedSystems = useField('SelectedSystems');
const sids = ref([])
const baseUrl = 'https://www.eprotocolo.pr.gov.br/spiweb/consultarProtocoloDigital.do?action=pesquisar';

// API
const departments = ref([]);
const roles = ref([]);
const systems = ref([]);
const allSids = ref([]);
const oldUserData = ref([]);

const props = defineProps({
  userId: Number,
})

const editName = ref(false);
const editEmail = ref(false);
function toggleNameEdit() {
  editName.value = !editName.value
}
function toggleEmailEdit() {
  editEmail.value = !editEmail.value
}

const submit = handleSubmit(async values => {
  loading.value = true;

  try {
    let userData = {}
    if (oldUserData.value.name !== values.name) {
      userData = {
        ...userData,
        name: values.name
      }
    }
    if (oldUserData.value.email !== values.email) {
      userData = {
        ...userData,
        email: values.email
      }
    }
    if (homeOffice.value !== oldUserData.value.homeOffice || homeOfficeStart.value !== convertDate(oldUserData.value.homeOfficeStart) || homeOfficeEnd.value !== convertDate(oldUserData.value.homeOfficeEnd)) {
      userData = {
        ...userData,
        homeOffice: Boolean(homeOffice.value),
        homeOfficeStart: homeOfficeStart.value,
        homeOfficeEnd: homeOfficeEnd.value,
      }
    }
    if (oldUserData.value.roleId !== roles.value.find(role => role.name === values.role).id) {
      userData = {
        ...userData,
        roleId: roles.value.find(role => role.name === values.role).id
      }
    }
    if (oldUserData.value.departmentId !== departments.value.find(department => department.name === values.department).id) {
      userData = {
        ...userData,
        departmentId: departments.value.find(department => department.name === values.department).id
      }
    }
    if (Object.keys(userData).length > 0) {
      await axios.put(`${globalState.apiUrl.value}/api/user/${props.userId}`, userData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    for (let i = 0; i < systems.value.length; i++) {
      if (oldUserData.value.permissions.some(permission => permission.systemId === systems.value[i].id) && !selectedSystems.value.value.includes(systems.value[i].name)) {
        let permissionId = oldUserData.value.permissions.find(permission => permission.systemId === systems.value[i].id).id;
        await axios.delete(`${globalState.apiUrl.value}/api/permission/${permissionId}`, { withCredentials: true })
          .catch(error => {
            console.log('Usuário foi criado, porém não foi possivel remover as permissões.');
          });
      } else if (!oldUserData.value.permissions.some(permission => permission.systemId === systems.value[i].id) && selectedSystems.value.value.includes(systems.value[i].name)) {
        let newPermission = {
          userId: props.userId,
          systemId: systems.value[i].id,
        }
        await axios.post(`${globalState.apiUrl.value}/api/permission`, newPermission, { withCredentials: true })
          .catch(error => {
            console.log('Usuário foi criado, porém não foi possivel designar as permissões.');
          });
      }
    }

    try {
      for (let i = 0; i < oldUserData.value.sids.length; i++) {
        if (sids.value[i].value !== oldUserData.value.sids[i].value) {
          let newSid = {
            userId: props.userId,
            sidId: sids.value[i].sidId,
            value: sids.value[i].value
          }
          await axios.put(`${globalState.apiUrl.value}/api/user-sids/${sids.value[i].id}`, newSid, { withCredentials: true })
            .catch(error => {
              console.log('Usuário foi salvo, porém não foi possivel atualizar os sids.');
            });
        }
      }

      if (sids.value.length != oldUserData.value.sids.length) {
        for (let i = oldUserData.value.sids.length; i < sids.value.length; i++) {
          let newSid = {
            userId: props.userId,
            sidId: allSids.value.find(sid => sid.name === sids.value[i].sid.name).id,
            value: sids.value[i].value
          }

          await axios.post(`${globalState.apiUrl.value}/api/user-sids`, newSid, { withCredentials: true })
        }
      }
    } catch (error) {
      console.error('Error saving sids');
    }

    await axios.get(`${globalState.apiUrl.value}/api/user/${props.userId}`, { withCredentials: true })
      .then(response => {
        emitEditedUser(response.data);
      });

    toastr.success('Usuário salvo com sucesso.', null, { timeOut: 470 });
    emitValue(true);
  } catch (error) {
    toastr.error('Erro ao salvar usuário, talvez já exista outro usuário com mesmo email', null, { timeOut: 470 });
    console.error('Error saving user');
  }

  setTimeout(() => {
    loading.value = false;
  }, 350);
});

function convertDate(date) {
  const d = new Date(date);
  const isoString = d.toISOString();
  return isoString.split('T')[0];
}

onMounted(async () => {
  loadingComponent.value = true;
  try {
    await axios.get(`${globalState.apiUrl.value}/api/system`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      systems.value = response.data;
    });

    await axios.get(`${globalState.apiUrl.value}/api/role`, { withCredentials: true })
      .then(response => {
        roles.value = response.data;
      })
      .catch(error => {
        console.error('Error fetching roles');
      });

    await axios.get(`${globalState.apiUrl.value}/api/department`, { withCredentials: true })
      .then(response => {
        departments.value = response.data;
      })
      .catch(error => {
        console.error('Error fetching departments');
      });

    await axios.get(`${globalState.apiUrl.value}/api/sid`, { withCredentials: true })
      .then(response => {
        allSids.value = response.data;
      });

    await axios.get(`${globalState.apiUrl.value}/api/user/${props.userId}`, { withCredentials: true })
      .then(response => {
        if (response.data.homeOfficeStart || response.data.homeOfficeEnd) {
          homeOfficeStart.value = convertDate(response.data.homeOfficeStart);
          homeOfficeEnd.value = convertDate(response.data.homeOfficeEnd);
        }

        oldUserData.value = response.data;
        name.value.value = response.data.name;
        email.value.value = response.data.email;
        homeOffice.value = response.data.homeOffice;
        role.value.value = roles.value.find(role => role.id === response.data.roleId).name;
        department.value.value = departments.value.find(department => department.id === response.data.departmentId).name;
        selectedSystems.value.value = [''].concat(
          response.data.permissions.map(permission =>
            systems.value.find(system => system.id === permission.systemId).name
          )
        );
        sids.value = response.data.sids.map(item => ({
          ...item,
          activated: false,
          errorMessage: ''
        }))
      });

    setTimeout(() => {
      loadingComponent.value = false;
    }, 150);
  } catch (error) {
    loadingComponent.value = false;
  }
});

const NamehasErrorMessages = (watch(() => name.errorMessage.value, (newValue) => {
  if (newValue != undefined) {
    NamehasErrorMessages.value = true;
    return true;
  } else {
    NamehasErrorMessages.value = false;
    return false;
  }
}));
const EmailhasErrorMessages = (watch(() => email.errorMessage.value, (newValue) => {
  if (newValue != undefined) {
    EmailhasErrorMessages.value = true;
    return true;
  } else {
    EmailhasErrorMessages.value = false;
    return false;
  }
}));

function copyToClipboard(value) {
  const url = baseUrl;
  navigator.clipboard.writeText(value).then(() => {
  }).catch(err => {
    console.error('Failed to copy');
  });
  window.open(url, '_blank');
}

function validateSid(value, index) {
  if (value && value.length > 0) {
    value = value.replace(/\D/g, '');
    if (value.length > 9) {
      value = value.slice(0, 9);
    }

    if (value.length > 2) value = value.slice(0, 2) + '.' + value.slice(2);
    if (value.length > 6) value = value.slice(0, 6) + '.' + value.slice(6);
    if (value.length > 10) value = value.slice(0, 10) + '-' + value.slice(10, 11);

    value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');

    if (!/^\d{2}\.\d{3}\.\d{3}-\d{1}$/.test(value)) {
      sids.value[index].errorMessage = 'Formato inválido. Ex: 00.000.000-0';
    } else {
      sids.value[index].errorMessage = '';
    }

    sids.value[index].value = value;
  } else if (value.length === 0) {
    sids.value[index].errorMessage = 'Campo obrigatório.';
  } else {
    sids.value[index].errorMessage = '';
  }
}

function toggleActivation(index) {
  sids.value[index].activated = !sids.value[index].activated;
}

function isHomeOfficeDateValid() {
  if (homeOfficeStart.value && homeOfficeEnd.value) {
    return homeOfficeStart.value > homeOfficeEnd.value;
  }
  return true;
}

function Editing() {
  if (editName.value || editEmail.value || sids.value.some(item => item.activated)) {
    return true;
  } else {
    if (homeOffice.value) {
      if (isHomeOfficeDateValid()) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}

function addNewSid() {
  const firstAvailableName = allSids.value
    .map(item => item.name)
    .filter(item => !sids.value.map(item => item.sid.name).includes(item))[0];
  const firstAvailableId = allSids.value.find(item => item.name === firstAvailableName)?.id;
  if (!firstAvailableName || !firstAvailableId) {
    return toastr.error('Todos os termos já foram adicionados.', null, { timeOut: 470 });
  }

  return sids.value.push({
    id: null,
    userId: props.userId,
    sidId: firstAvailableId,
    value: '',
    activated: true,
    newSid: true,
    errorMessage: 'Campo obrigatório.',
    sid: {
      name: firstAvailableName
    }
  });
}
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

.teletrabalho-container {
  display: flex;
  align-items: center;
}

.teletrabalho-container h5 {
  margin-right: 10px;
}

.alert {
  color: red;
  background-color: #f8d7da;
  border-color: #f5c6cb;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
}
</style>
