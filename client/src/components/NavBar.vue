<template>
  <v-layout style="min-height: 60px; max-width: 100%;">
    <v-app-bar color="teal-darken-4" image="../assets/bandeira.svg" style="opacity: 0.9;">
      <template v-slot:image>
        <v-img gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"></v-img>
      </template>

      <a href="/">
        <div class="navbar">
          <v-img src="../assets/logo.png" alt="Logo" contain :width="logoWidth" class="mr-3 ml-7"></v-img>
        </div>
      </a>
      <v-spacer></v-spacer>
      <v-tabs v-if="windowWidth >= 600" v-model="tab" align-tabs="center" color="light-blue-lighten-5" class="mr-14"
        scrollable>
        <v-tab :value="1">Listar Usuários</v-tab>
        <v-tab :value="2">Cadastrar Usuário</v-tab>
        <v-tab :value="3">Filtrar Usuário</v-tab>
        <v-tab :value="4">Logs de Usuário</v-tab>
      </v-tabs>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-icon size="45" class="mr-5" v-bind="props">mdi-account-circle</v-icon>
        </template>
        <v-list max-width="200px">
          <div v-if="windowWidth < 600" class="mx-2">
            <v-list max-width="200px">
              <v-list-item @click="tab = 1">
                <v-list-item-title>Listar Usuários</v-list-item-title>
              </v-list-item>
              <v-list-item @click="tab = 2">
                <v-list-item-title>Cadastrar Usuários</v-list-item-title>
              </v-list-item>
              <v-list-item @click="tab = 3">
                <v-list-item-title>Filtrar Usuários</v-list-item-title>
              </v-list-item>
              <v-list-item @click="tab = 4">
                <v-list-item-title>Logs de Usuários</v-list-item-title>
              </v-list-item>
            </v-list>
            <v-divider color="info" inset></v-divider>
          </div>
          <v-list-item v-for="(item, i) in items" :key="i">
            <v-list-item-action>
              <a :href="item.url" class="custom-link">
                <v-list-item-title>
                  <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
                  {{ item.title }}
                </v-list-item-title>
              </a>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
    </v-main>
  </v-layout>
</template>

<script lang="ts">
export default {
  data: () => ({
    tab: 1,
    items: [
      { title: 'Admin', icon: 'mdi-lock', url: '/admin/' },
      { title: 'Documentação', icon: 'mdi-file-document', url: '/documents/' },
      { title: 'Sair', icon: 'mdi-logout', url: '/logout/' },
    ],
    windowWidth: window.innerWidth
  }),
  mounted() {
    window.addEventListener('resize', this.updateWindowWidth);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateWindowWidth);
  },
  methods: {
    emitTab() {
      this.$emit('update-tab', this.tab);
    },
    updateWindowWidth() {
      this.windowWidth = window.innerWidth;
    },
  },
  computed: {
    logoWidth() {
      return this.windowWidth < 600 ? '80px' : '160px';
    },
    logoSrc() {
      return '../assets/logo.png';
    },
  },
  watch: {
    tab(newVal) {
      this.emitTab();
    },
  },
};
</script>

<style scoped>
.custom-link {
  color: inherit;
  text-decoration: none;
}
</style>