<template>
  <div id="app">
    <nav-bar @update-tab="handleTabUpdate"></nav-bar>
    <v-container fluid class="fill-height">
      <data-table-user v-if="tab === 1" />
      <create-user v-else-if="tab === 2" />
      <create-role v-else-if="tab === 3" />
      <create-department v-else />
    </v-container>
    <footer>
      <FooterBar />
    </footer>
  </div>
</template>

<script setup>
  import { ref } from 'vue';

  const tab = ref(1);

  function handleTabUpdate(newTab) {
    console.log(newTab);
    tab.value = newTab;
  }
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

nav {
  background-color: #333;
  color: white;
  padding: 1rem;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 1rem;
}

nav ul li {
  display: inline;
}

main {
  flex: 1;
  padding: 1rem;
}

footer {
  color: white;
  text-align: center;
  padding: 1rem;
}

.fill-height {
  flex: 50%;
  display: flex;
  flex-direction: column;
}
</style>