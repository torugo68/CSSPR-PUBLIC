<template>
  <div>
    <v-img class="mx-auto my-7" max-width="228"
      src="../assets/logo-escuro.jpg"></v-img>

    <h4 class="mb-3 text-center">PROCURADORIA GERAL DO ESTADO DO PARANÁ</h4>
    <h5 class="mb-3 text-center">CONTROLE DE SISTEMAS</h5>
    

    <v-card class="mx-auto pa-10 pb-8" elevation="8"  max-width="510" rounded="lg">
      <div class="text-subtitle-1 text-medium-emphasis">
        Usuário
      </div>
      <v-text-field v-model="username" density="compact" placeholder="Usuário" prepend-inner-icon="mdi-account-outline"
        variant="outlined"
        @keydown.enter="sendData"
        >
      </v-text-field>
      
      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Senha
      </div>
      <v-text-field v-model="password" :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'" :type="visible ? 'text' : 'password'"
        density="compact" placeholder="Senha" prepend-inner-icon="mdi-lock-outline" variant="outlined"
        @click:append-inner="visible = !visible"
        @keydown.enter="debouncedSendData"
        >
      </v-text-field>
      <!--
      <a class="text-caption text-decoration-none text-blue" href="#" rel="noopener noreferrer" target="_blank">
        Esqueceu a senha?
      </a>
      -->
      <v-btn :loading="loading" @click="sendData" block class="mb-8 mt-3" color="blue" size="large" variant="tonal">
        Entrar
      </v-btn>
    </v-card>
  </div>
</template>

<script setup>

import { useRouter } from 'vue-router';
import axios from 'axios';
import toastr from 'toastr';
import { ref } from 'vue';


import { globalState } from '../globalState.ts';
import 'toastr/build/toastr.min.css';

const router = useRouter();

const username = ref('')
const password = ref('')
const loading = ref(false);
const visible = ref(false);

async function sendData() {
  loading.value = true;
  if (username.value.length > 0 && password.value.length > 0) {
    try {
      const loginData = {
        username: username.value,
        password: password.value
      }

      const response = await axios.post(`${globalState.apiUrl.value}/api/auth/login`, loginData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 200) {
        toastr.success(
          'Login efetuado com sucesso', 
          null, 
          { timeOut: 780, progressBar: true , preventDuplicates:true });
        setTimeout(() => { router.push('/'); }, 800);
      } else {
        error();
      }
  } catch (e) {
    error();
  }
  } else {
    error();
  }
}

function error() {
  setTimeout(() => {
    toastr.error(
      'Usuário ou senha inválidos',
       null, 
       { timeOut: 1000, preventDuplicates:true });
    loading.value = false;
  }, 1000);
}

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

const debouncedSendData = debounce(sendData, 300);
</script>

<script>
</script>