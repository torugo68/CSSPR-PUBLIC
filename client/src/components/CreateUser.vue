<template>
    <v-card
    class="mx-auto"
    min-width="450px"
    max-width="450px"
    >
      <v-card-title class="custom-title">
        <v-icon class="mr-1">mdi-account</v-icon>
        Cadastrar Usuário
      </v-card-title>
          <v-container>
            <v-form @submit.prevent="submit">
              <v-text-field
                v-model="name.value.value"
                label="Nome"
                :error-messages="name.errorMessage.value"
                clearable
              ></v-text-field>
              <v-text-field
                v-model="email.value.value"
                label="Email"
                type="email"
                :error-messages="email.errorMessage.value"
                clearable
              ></v-text-field>
              <v-select
                v-model="role.value.value"
                :items="roles.map(role => role.name).sort((a, b) => a.localeCompare(b))"
                item-text="name"
                item-value="id"
                :error-messages="role.errorMessage.value"
                label="Selecione o Grupo"
              ></v-select>
              <v-select
                v-model="department.value.value"
                :items="departments.map(department => department.name).sort((a, b) => a.localeCompare(b))"
                item-text="name"
                item-value="id"
                label="Selecione o Setor"
                :error-messages="department.errorMessage.value"
              ></v-select>
              <v-select
                v-model="selectedSystems.value.value"
                :items="systems.map(item => item.name).sort((a, b) => a.localeCompare(b))"
                label="Gerenciar Sistemas"
                :error-messages="selectedSystems.errorMessage.value"
                multiple
              >
                <template v-slot:selection="{ item, index }">
                  <div v-if="selectedSystems.value.value.length > 1">
                    <v-chip v-if="index < 4 && index != 0">
                        <span>{{ item.title }}</span>
                    </v-chip>
                    <span
                        v-if="index === 4"
                        class="text-grey text-caption align-self-center"
                    >
                        (+{{ selectedSystems.value.value.length - 4 }} outros)
                    </span>
                  </div>
                  <div v-else>
                    <span
                      class="text-grey text-caption align-self-center"
                    >
                      (Nenhum sistema selecionado)
                    </span>
                  </div>
              </template>
            </v-select>
            <v-container fluid>
              <v-row justify="start">
                <v-col cols="auto">
                  <v-checkbox
                    v-model="tcc"
                    :label="`TCC?`"
                  ></v-checkbox>
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    v-model="tur"
                    :label="`TUR?`"
                  ></v-checkbox>
                </v-col>
                <v-col>
                  <v-text-field
                    v-if="tcc || tur"
                    v-model="sid.value.value"
                    label="SID termos"
                    clearable
                    counter="12"
                    :error-messages="sid.errorMessage.value"
                  ></v-text-field>
                  <v-text-field
                    v-else
                    v-model="sid.value.value"
                    label="SID termos"
                    clearable
                    counter="12"
                    :error-messages="sid.errorMessage.value"
                    disabled
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
              <v-btn :loading="loading" type="submit" size="large" block color="primary" variant="tonal" class="mt-2">Cadastrar</v-btn>
            </v-form>
          </v-container>
    </v-card>
  </template>
  
<script setup>
  import { useField, useForm } from 'vee-validate'
  import { ref, onMounted } from 'vue';
  import validator from 'validator';
  import axios from '@/axiosSetup';

  import { globalState } from '../globalState';

  import toastr from 'toastr';
  import 'toastr/build/toastr.min.css';

  const emit = defineEmits(['closed']);

  const emitValue = (value) => {
    emit('closed', value);
  };
  
  const loading = ref(false);

  const { handleSubmit, handleReset } = useForm({
    validationSchema: {
      name (value) {
        if (!value) return 'Campo obrigatório.'
        if (!validator.isLength(value, { min: 3 })) return 'É necessario ter pelo menos 3 caracteres.'
        if (!validator.isLength(value, { max: 250 })) return 'É permitido ter no máximo 250 caracteres.'
        return true
      },
      
      email (value) {
        if (!value) return 'Campo obrigatório.'
        if (!validator.isEmail(value)) return 'Email inválido.'
        if (!validator.isLength(value, { min: 3 })) return 'É necessario ter pelo menos 3 caracteres.'
        if (!validator.isLength(value, { max: 250 })) return 'É permitido ter no máximo 250 caracteres.'
        return true
      },

      role (value) {
        if (value) return true
        return 'Campo obrigatório.'
      },
  
      department (value) {
        if (value) return true
        return 'Campo obrigatório.'
      },

      SelectedSystems (value) {
        if (selectedSystems.value.value === undefined || selectedSystems.value.value === null) selectedSystems.value.value = '';
        return true
      },

      sid (value) {
        if (!tcc.value && !tur.value) return true;

        if (value) {
          if (value.length > 0) {
            sid.value.value =  sid.value.value.replace(/\D/g, '');
            if (!validator.isLength(value, { max: 9 })) {
              sid.value.value = sid.value.value.slice(0, 9);
            }
            
            if (value.length > 2) sid.value.value = sid.value.value.slice(0, 2) + '.' + sid.value.value.slice(2);
            if (value.length > 6) sid.value.value = sid.value.value.slice(0, 6) + '.' + sid.value.value.slice(6);
            if (value.length > 10) sid.value.value = sid.value.value.slice(0, 10) + '-' + sid.value.value.slice(10, 11);
            
            sid.value.value = sid.value.value.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');

            if (!/^\d{2}\.\d{3}\.\d{3}-\d{1}$/.test(value)) return 'Formato inválido. Ex: 00.000.000-0';
          }
        }

        if ((tcc.value || tur.value) && !value) return 'Campo obrigatório.';
        return true
      }
    },
  })

  const name = useField('name');
  const email = useField('email');
  const role = useField('role');
  const sid = useField('sid');
  const department = useField('department');
  const selectedSystems = useField('SelectedSystems');
  const tur = ref(false);
  const tcc = ref(false);
  
  const departments = ref([]);
  const roles = ref([]);
  const systems = ref([]);

  const submit = handleSubmit(async values => {
      loading.value = true;
      try {
        let userSids = [];
        let permissions = [];

        let userData = {
          name: values.name,
          email: values.email,
          roleId: roles.value.find(role => role.name === values.role).id,
          departmentId: departments.value.find(department => department.name === values.department).id,
        };

        if (tcc.value) {
          userSids.push({
            sidId: 1,
            value: sid.value.value
          });
        }

        if (tur.value) {
          userSids.push({
            sidId: 2,
            value: sid.value.value
          });
        }

        if (userSids.length > 0) {
          userData = {
            ...userData,
            userSids
          }
        }

        if (selectedSystems.value.value && selectedSystems.value.value.length > 1) {
          for (let i = 1; i < selectedSystems.value.value.length; i++) {
            const system = systems.value.find(item => item.name === selectedSystems.value.value[i]);
            if (system) {
              permissions.push({
                systemId: system.id,
              });
            }
          }
          
          userData = {
            ...userData,
            permissions
          }
        }

        await axios.post(`${globalState.apiUrl.value}/api/user`, userData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          toastr.success('Usuário criado com sucesso', null, { timeOut: 470});
          emitValue(response.data);
        }).catch(e => {
          toastr.error('Erro ao criar usuário, talvez já exista outro usuário com mesmo email', null, { timeOut: 470});
        });
      } catch (e) {
        toastr.error('Erro ao criar usuário, talvez já exista outro usuário com mesmo email', null, { timeOut: 470});
      }
      
      setTimeout(async () => {
        loading.value = false;
        }, 300);
    });

  onMounted(async () => {
    try {
      await axios.get(`${globalState.apiUrl.value}/api/system`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => { 
        systems.value = response.data;
      });
      
      axios.get(`${globalState.apiUrl.value}/api/role`, { withCredentials: true })
      .then(response => {
        roles.value = response.data;
      })
      .catch(error => {
        console.error('Error fetching roles');
      });
      
      axios.get(`${globalState.apiUrl.value}/api/department`, { withCredentials: true })
        .then(response => {
          departments.value = response.data;
        })
        .catch(error => {
          console.error('Error fetching departments');
        });
    } catch (error) {
      console.log('Errors to fetch data');
    }
  });
</script>

<style scoped>
.custom-title {
  font-size: x-large;
  font-weight: bold;
}
</style>