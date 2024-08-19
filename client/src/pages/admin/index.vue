<template>
    <v-app>
      <v-card class="fill-height">
        <v-layout row fill-height class="fill-height">
          <v-navigation-drawer
            style="width: 100%; max-width: 250px; min-width: 1%;"
            class="bg-blue"
            theme="dark"
            image="/bg-2.jpg"
            permanent
          >
          <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            "
            class="mt-5"
          >
            <p style="font-size: 30px;" class="mx-7">Painel Administrativo</p>
          </div>
            <v-list color="transparent">
              <v-list-item 
                prepend-icon="mdi-home"
                @click="goToHome"
                title="Início">
              </v-list-item>
              <v-list-item prepend-icon="mdi-gavel" title="Admins" @click="changeTab(0)"></v-list-item>
              <v-list-item prepend-icon="mdi-office-building" title="Setores" @click="changeTab(1)"></v-list-item>
              <v-list-item prepend-icon="mdi-account-group" title="Grupos" @click="changeTab(2)"></v-list-item>
              <v-list-item prepend-icon="mdi-cog" title="Sistemas" @click="changeTab(3)"></v-list-item>
              <v-list-item prepend-icon="mdi-file-document" title="Termos" @click="changeTab(4)"></v-list-item>
            </v-list>
  
            <template v-slot:append>
              <div class="flex-container">
                <div class="pa-2" style="width:70%;">
                  <v-btn
                  append-icon="mdi-logout" 
                  block 
                  @click="logout"
                  >
                    SAIR
                  </v-btn>
                </div>
              </div>
            </template>
          </v-navigation-drawer>
          <v-main class="fill-height">
            <v-container class="justify-center fill-height">
              <admin-role-or-department v-if="tab === 0" :parentData="tab"></admin-role-or-department>
              <admin-role-or-department v-if="tab === 1" :parentData="tab"></admin-role-or-department>
              <admin-role-or-department v-if="tab === 2" :parentData="tab"></admin-role-or-department>
              <admin-role-or-department v-if="tab === 3" :parentData="tab"></admin-role-or-department>
              <admin-role-or-department v-if="tab === 4" :parentData="tab"></admin-role-or-department>
            </v-container>
          </v-main>
        </v-layout>
      </v-card>
    </v-app>
  </template>
  
<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();

  const tab = ref(0);
  function changeTab(value) {
    tab.value = value;
  }

  const goToHome = () => {
    router.push({ name: '/' });
  };
  
  const logout = () => {
    router.push({ name: '/logout/' });
  };
</script>
  
  <style>
  html, body, #app {
    height: 100%;
    margin: 0;
  }
  .fill-height {
    flex: 50%;
    display: flex;
    flex-direction: column;
  }

  .flex-container {
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
  }
  </style>