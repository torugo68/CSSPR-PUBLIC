<template>
  <v-card>
    <v-card-title>
      {{ operation }} novo {{ currentName }}
    </v-card-title>
    <v-card-text>
      <form @submit.prevent="submit">
        <v-text-field
          v-model="name.value.value"
          :counter="300"
          :error-messages="name.errorMessage.value"
          label="Nome"
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
  import axios from 'axios';

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

const emitValue = (value) => {
  log(value);
  emit('closed', value);
};

  const loading = ref(false);
  const tab = ref(props.parentData);
  const operation = ref('Criar');

  let fetch = ''
  let currentName = ''

  if (tab.value === 1) {
    fetch = 'http://localhost:3001/api/department';
    currentName = 'Setor';
  } else if (tab.value === 2) {
    fetch = 'http://localhost:3001/api/role';
    currentName = 'Grupo';
  } else if (tab.value === 3) {
    fetch = 'http://localhost:3001/api/system';
    currentName = 'Sistema';
  } else if (tab.value === 4) {
    fetch = 'http://localhost:3001/api/sid';
    currentName = 'Termo';
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
      }
    },
  })
  const name = useField('name')

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

  const submit = handleSubmit(values => {
      loading.value = true;
      setTimeout(async () => {
        try {
          if (props.edit) {
            await axios.put(`${fetch}/${props.id}`, { name: values.name }, { withCredentials: true });
            toastr.success(`${currentName} editado com sucesso!`);
          } else {
            await axios.post(fetch, { name: values.name }, { withCredentials: true });
            toastr.success(`${currentName} criado com sucesso!`);
          }
          emitValue();
        } catch (error) {
          toastr.error('Algo deu errado, talvez o nome já exista.');
        }
        loading.value = false;
      }, 1000);
    });
</script>