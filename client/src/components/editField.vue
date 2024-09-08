<template>
  <div class="text-center pa-4">
    <v-dialog v-model="dialog" max-width="400" persistent>
      <template v-slot:activator="{ props: activatorProps }">
        <v-icon v-bind="activatorProps">mdi-pencil</v-icon>
      </template>

      <v-card prepend-icon="mdi-account" :title=props.title>
        <v-container>
          <v-text-field v-model="data.value" :label="props.title" clearable></v-text-field>
        </v-container>
        <template v-slot:actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialog = false">
            Cancelar
          </v-btn>

          <v-btn @click="dialog = false">
            Salvar
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useField, useForm } from 'vee-validate'

const data = ref('')
const dialog = ref(false)

const props = defineProps(['title', 'fieldData'])

const { handleSubmit, handleReset } = useForm({
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
      return true
    },

    sid(value) {
      if (value) {
        if (value.length > 0) {
          sid.value.value = sid.value.value.replace(/\D/g, '');
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
</script>