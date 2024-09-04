<template>
  <v-card>
    <v-card-title>
      {{ operation }} {{ currentName }}
    </v-card-title>
    <v-card-text>
      <form @submit.prevent="submit">
        <v-checkbox
          v-model="allowEditPassword"
          label="Alterar senha?"
          v-if="props.edit && currentName === 'Admin'"
        ></v-checkbox>
        <v-text-field
          v-model="name.value.value"
          :counter="300"
          :error-messages="name.errorMessage.value"
          label="Nome"
        ></v-text-field>
        <v-text-field
          v-model="password.value.value"
          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          :type="!show ? 'text' : 'password'"
          label="Senha"
          name="input-10-1"
          counter
          @click:append="show = !show"
          v-if="!props.edit && currentName === 'Admin'"
          :error-messages="password.errorMessage.value"
        ></v-text-field>
        <v-text-field
          v-model="password.value.value"
          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show ? 'text' : 'password'"
          label="Nova senha"
          name="input-10-1"
          counter
          @click:append="show = !show"
          v-if="props.edit && currentName === 'Admin' && allowEditPassword"
          :disabled="!allowEditPassword"
          :error-messages="password.errorMessage.value"
        ></v-text-field>
        <v-btn
          class="me-4"
          type="submit"
          :loading="loading"
        >
          Salvar
        </v-btn>

        <v-btn @click="emitValue">
          Cancelar
        </v-btn>
      </form>
    </v-card-text>
  </v-card>
</template>
<script setup>
  import { ref } from 'vue'
  import { useField, useForm } from 'vee-validate'
  import axios from '@/axiosSetup';

  import { globalState } from '../globalState';

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
    edit: {
      type: Boolean,
      required: false,
      default: false,
    },
  });

const emit = defineEmits(['closed']);

const emitValue = () => {
  emit('closed');
};

  const loading = ref(false);
  const tab = ref(props.parentData);
  const operation = ref('Criar');
  const allowEditPassword = ref(false);

  let fetch = ''
  let currentName = ''
  const show = ref(true);
  const currentEditTimes = ref(0);

  switch (tab.value) {
    case 0: 
      fetch = `${globalState.apiUrl.value}/api/admin`;
      currentName = 'Admin';
      break;
    case 1:
      fetch = `${globalState.apiUrl.value}/api/department`;
      currentName = 'Setor';
      break;
    case 2:
      fetch = `${globalState.apiUrl.value}/api/role`;
      currentName = 'Grupo';
      break;
    case 3:
      fetch = `${globalState.apiUrl.value}/api/system`;
      currentName = 'Sistema';
      break;
    case 4:
      fetch = `${globalState.apiUrl.value}/api/sid`;
      currentName = 'Termo';
      break;
    default:
      break;
  }

  if (props.edit) {
    operation.value = 'Editar';
    fetchData();
  }

  const { handleSubmit } = useForm({
    validationSchema: {
      name (value) {
        if (value?.length >= 2 && value?.length < 300) return true

        if (!value) return 'Campo obrigatório.'
        if (value?.length >= 300) return 'É permitido ter no máximo 300 caracteres.'
        if (value?.length < 2) return 'É necessario ter pelo menos 2 caracteres.'

        return 'Campo invalido'
      },
      password (value) {
        if (currentName !== 'Admin') {
          return true;
        }

 
        if (currentName === 'Admin' && props.edit && !allowEditPassword.value) {
          return true;
        }

        if (!value && password.value.value != 'pgepr2024' && currentEditTimes.value === 0 && !props.edit) {
          currentEditTimes.value = 1;
          password.value.value = 'pgepr2024';
        } 

        if (value?.length >= 3 && value?.length < 120) return true
        if (!value) return 'Campo obrigatório.'
        if (value?.length >= 120) return 'É permitido ter no máximo 120 caracteres.'
        if (value?.length < 3) return 'É necessario ter pelo menos 3 caracteres.'

      }
    },
  })
  const name = useField('name')
  const password = useField('password')

  async function fetchData() {
    try {
      if (props.id) {
        const response = await axios.get(`${fetch}/${props.id}`, { withCredentials: true });
        name.value.value = response.data.name;
      }
    } catch (error) {
      console.error(error);
    }
  }

  const submit = handleSubmit(async values => {
      loading.value = true;
      try {
        if (props.edit) {
          if (currentName === 'Admin') {
            await axios.put(`${fetch}/${props.id}`, 
            { 
              username: values.name,
              ...(allowEditPassword.value && { password: values.password }),
            }, 
            { withCredentials: true });
          }
          await axios.put(`${fetch}/${props.id}`, { name: values.name }, { withCredentials: true });
          toastr.success(`${currentName} editado com sucesso!`, null, { timeOut: 470});
        } else {
          if (currentName === 'Admin') {
            await axios.post(`${globalState.apiUrl.value}/api/auth/signup`, { 
              username: values.name,
              password: values.password,
              }, 
              { withCredentials: true });
          } else {
            await axios.post(fetch, { name: values.name }, { withCredentials: true });
          }
          toastr.success(`${currentName} criado com sucesso!`, null, { timeOut: 470});
        }
        emitValue();
      } catch (error) {
        toastr.error('Algo deu errado, talvez o nome já exista.', null, { timeOut: 470});
      }
      setTimeout(() => {
        loading.value = false;
      }, 800);
    });
</script>