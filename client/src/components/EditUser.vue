<template>
  <v-card
    class="mx-auto"
    min-width="450px"
    max-width="500px"
    >
      <v-card-title class="custom-title">
        <v-icon class="mr-1">mdi-account</v-icon>
        Editar Usuário
      </v-card-title>
          <v-container>
            <div v-if="!loadingComponent">
              <v-form @submit.prevent="submit">
                <div v-if="editName" style="display: flex; align-items: center;">
                  <v-text-field
                    v-model="name.value.value"
                    label="Nome"
                    :error-messages="name.errorMessage.value"
                    clearable
                    variant="underlined"
                    class="mb-3"
                  ></v-text-field>
                  <v-icon small @click="toggleNameEdit" class="ml-1" :disabled="NamehasErrorMessages.value">mdi-content-save</v-icon>
                </div>
                <div v-else style="display: flex; align-items: center;" class="mb-3">
                  <h5>{{ name.value.value }}</h5>
                  <v-icon small @click="toggleNameEdit" class="ml-1">mdi-pencil</v-icon>
                </div>
                <div v-if="editEmail" style="display: flex; align-items: center;">
                  <v-text-field
                    v-model="email.value.value"
                    label="Email"
                    :error-messages="email.errorMessage.value"
                    clearable
                    variant="underlined"
                    class="mb-3"
                  ></v-text-field>
                  <v-icon small @click="toggleEmailEdit" class="ml-1" :disabled="EmailhasErrorMessages.value">mdi-content-save</v-icon>
                </div>
                <div v-else style="display: flex; align-items: center;" class="mb-3">
                  <h5>{{ email.value.value }}</h5>
                  <v-icon small @click="toggleEmailEdit" class="ml-1">mdi-pencil</v-icon>
                </div>
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
                    <v-chip v-if="index < 3">
                        <span>{{ item.title }}</span>
                    </v-chip>
                    <span
                        v-if="index === 3"
                        class="text-grey text-caption align-self-center"
                    >
                        (+{{ selectedSystems.value.value.length - 3 }} outros)
                    </span>
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
                <div class="button-container">
                  <v-btn color="black-darken-1" variant="text" @click="emitValue(true)">Cancelar</v-btn>
                  <v-btn color="blue-darken-3" :loading="loading" variant="text" type="submit" append-icon="mdi-check">Salvar</v-btn>
                </div>
              </v-form>
            </div>
            <div class="text-center" v-else>
              <v-progress-circular
              :size="50"
              color="primary"
              indeterminate
              ></v-progress-circular>
            </div>
          </v-container>
    </v-card>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import axios from 'axios';
  import { useField, useForm } from 'vee-validate'
  import validator from 'validator';
  
  import toastr from 'toastr';
  import 'toastr/build/toastr.min.css';
  
  
  const loading = ref(false);
  const loadingComponent = ref(false);
  const emit = defineEmits(['closed']);

  const emitValue = (value) => {
    emit('closed', value);
  };
  
  const { handleSubmit } = useForm({
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
        return true
      },

      sid (value) {
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
  
  // api
  const departments = ref([]);
  const roles = ref([]);
  const systems = ref([]);
  
  const props = defineProps({
          userId: Number,
      })

  // toggle editing 
  const editName = ref(false);
  const editEmail = ref(false);
  function toggleNameEdit() {
    editName.value = !editName.value
  }
  function toggleEmailEdit() {
    editEmail.value = !editEmail.value
  }
  

  const submit = handleSubmit(values => {
    loading.value = true;

    setTimeout(async () => {
      try {
        const userData = JSON.stringify({
          name: values.name,
          email: values.email,
          roleId: roles.value.find(role => role.name === values.role).id,
          departmentId: departments.value.find(department => department.name === values.department).id,
        });

        await axios.put(`http://localhost:3001/api/user/${props.userId}`, userData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (selectedSystems.value && selectedSystems.value.value && selectedSystems.value.value.length > 0)
        {
          for (let i = 0; i < selectedSystems.value.value.length; i++) {
            let newPermission = {
              userId: response.data.id,
              systemId: Number(systems.value.find(system => system.name === selectedSystems.value.value[i]).id),
            }
            await axios.post('http://localhost:3001/api/permission', newPermission, { withCredentials: true })
            .catch(error => {
              console.log('Usuário foi criado, porém não foi possivel designar as permissões.');
            });
          }
        }

        console.log(userData);
        toastr.success('Usuário salvo com sucesso.');
        emitValue(true);  
      } catch (error) {
        loading.value = false;
        toastr.error('Erro ao salvar usuário.');
        console.error('Error saving user:', error);
      }

      loading.value = false;
      }, 1000);
    });
    
  onMounted(() => {
    loadingComponent.value = true;
    setTimeout(async () => {
      try {
        await axios.get('http://localhost:3001/api/system', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => { 
          systems.value = response.data;
        });
        
        await axios.get('http://localhost:3001/api/role', { withCredentials: true })
        .then(response => {
          roles.value = response.data;
        })
        .catch(error => {
          console.error('Error fetching roles:', error);
        });
        
        await axios.get('http://localhost:3001/api/department', { withCredentials: true })
          .then(response => {
            departments.value = response.data;
          })
          .catch(error => {
            console.error('Error fetching departments:', error);
          });

        await axios.get(`http://localhost:3001/api/user/${props.userId}`, { withCredentials: true })
        .then(response => {
            console.log(response.data);
            name.value.value = response.data.name
            email.value.value = response.data.email
            role.value.value = roles.value.find(role => role.id === response.data.roleId).name
            department.value.value = departments.value.find(department => department.id === response.data.departmentId).name
            selectedSystems.value.value = response.data.permissions.map(permission => systems.value.find(system => system.id === permission.systemId).name)
        });

        loadingComponent.value = false;
      } catch (error) {
          loadingComponent.value = false;
      }
    }, 300);
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
</style>