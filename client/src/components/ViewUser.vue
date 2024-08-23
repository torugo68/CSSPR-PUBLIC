<template>
  <v-card
    class="mx-auto"
    min-width="450px"
    max-width="550px"
    :loading="loading"
  >
    <v-card-title class="custom-title">
      Visualizar Usuário
    </v-card-title>
    <v-container>
      <v-row dense>
        <v-col cols="12" dense>
          <v-icon left class="mb-2">mdi-account</v-icon>
          <h4 class="d-inline">Nome: {{ user?.name || 'N/A' }}</h4>
        </v-col>
        <v-col cols="12" dense>
          <v-icon left class="mb-2">mdi-email</v-icon>
          <h5 class="d-inline">Email: {{ user?.email || 'N/A' }}</h5>
        </v-col>
        <v-col cols="12" dense>
          <v-icon left class="mb-2">mdi-account-group</v-icon>
          <h5 class="d-inline">Grupo: {{ user?.role?.name || 'N/A' }}</h5>
        </v-col>
        <v-col cols="12" dense>
          <v-icon left class="mb-2">mdi-office-building</v-icon>
          <h5 class="d-inline">Setor: {{ user?.department?.name || 'N/A' }}</h5>
        </v-col>
      </v-row>
      <div v-if="user.sids.length > 0">
        asdas {{ user.sids.length }}
      </div>
      <v-row dense>
        <v-col cols="12">
          <v-list>
           <h5>Termos:</h5>  
            <v-list-item
              v-for="(sid, index) in user?.sids || []"
              :key="index"
            >
                {{ user?.sids[index].sid?.name }}: {{ sid?.value }}
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

import { globalState } from '../globalState';

const loading = ref(false);

const user = ref([]);
const userLog = ref([]);

const props = defineProps({
  userId: Number,
  disable: {
      type: Boolean,
      default: false
    }
})

onMounted(async () => {
  loading.value = true;
  console.log(props.userId)
  try {
    await axios.get(`${globalState.apiUrl.value}/api/user/${props.userId}?disable=${props.disable}`, { withCredentials: true })
      .then((response) => {
        user.value = response.data;
    })

    userLog.value = await axios.get(`${globalState.apiUrl.value}/api/logs/?userId=${props.userId}`, { withCredentials: true });
    loading.value = false;
    console.log(user.value);
    console.log(userLog.value.data);
  } catch (error) {
    console.error('Error fetch user data.')
  }
});
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

.d-inline {
  display: inline-block;
  margin-left: 8px;
}
</style>
