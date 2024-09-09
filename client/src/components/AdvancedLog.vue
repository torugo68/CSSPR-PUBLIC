<template>
    <v-data-table :headers="headers" :items="advancedLogs" item-value="id" show-expand
        @click:row="(event, item) => toggleExpand(item)" :items-per-page-options="[100, 250, 500]"
        style="font-size: 1em; overflow-y: auto; max-width: 1500px; min-width: 80%; width: 100%;" :loading="loading"
        :items-per-page="100" class="data-table">
        <template v-slot:top>
            <v-toolbar prominent color="blue-lighten-5">
                <v-toolbar-title style="font-weight: 2px;">Logs avançados</v-toolbar-title>
            </v-toolbar>
        </template>
        <template v-slot:expanded-row="{ columns, item }">
            <tr>
                <td :colspan="columns.length" class="admin-info">
                    <div class="admin-info__header">
                        <strong>Usuário do Administrador:</strong> {{ item.name }}
                    </div>
                    <div class="admin-info__details">
                        <div><strong>IP:</strong> {{ item.ip }}</div>
                        <div><strong>Data:</strong> {{ item.createAt }}</div>
                        <div style="display: flex;">
                            <v-expansion-panels style="width: 60%;" class="mx-1">
                                <v-expansion-panel title="Informações extras">
                                    <v-expansion-panel-text>
                                        <pre>{{ JSON.stringify(JSON.parse(item.params), null, 2) }}</pre>
                                        <pre>{{ JSON.stringify(JSON.parse(item.req).Body, null, 2) }}</pre>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </div>
                    </div>
                </td>
            </tr>
        </template>
    </v-data-table>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/axiosSetup';

import { globalState } from '../globalState';

const expanded = ref([])
const advancedLogs = ref([])
const loading = ref(true);

const headers = [
    {
        title: 'Administrador',
        align: 'start',
        sortable: false,
        key: 'name',
    },
    { title: 'Operação', key: 'operation' },
    { title: 'Operação', key: 'operation' },
    { title: 'Data', key: 'createAt' },
]

const toggleExpand = (item) => {
    const index = advancedLogs.value.findIndex(log => log.name === item.name);
    if (expanded.value.includes(index)) {
        expanded.value = expanded.value.filter(i => i !== index);
    } else {
        expanded.value = [index];
    }
};

const formatDate = (isoDate) => {
    if (!isoDate) return null;
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return null;
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'America/Sao_Paulo'
    }).format(date);
};

async function fetchData() {
    try {
        await axios.get(`${globalState.apiUrl.value}/api/logs/advanced`, { withCredentials: true })
            .then((response) => {
                const logs = response.data.map(log => {
                    if (log && log.name) {
                        return {
                            id: log.id,
                            name: log.name,
                            ip: log.ip,
                            req: log.req,
                            params: log.params,
                            createAt: formatDate(log.createdAt),
                            operation: log.operation,
                        }
                    } else if (log) {
                        return {
                            id: log.id,
                            name: log.name,
                            ip: log.ip,
                            req: JSON.parse(log.req),
                            params: JSON.parse(log.params),
                            createAt: formatDate(log.createdAt),
                            operation: log.operation,
                        }
                    }
                });
                advancedLogs.value = logs;
                console.log()
            });

    } catch (error) {
        console.error("Error fetching data", error);
    }
}

onMounted(async () => {
    await fetchData();
    setTimeout(() => {
        loading.value = false;
    }, 250);
})
</script>
<style scoped>
.data-table {
    flex-grow: 1;
    height: 650px;
    max-height: fit-content;
}

.admin-info {
    padding: 16px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.admin-info__header {
    font-size: 1.2em;
    margin-bottom: 8px;
}

.admin-info__details {
    margin-top: 8px;
}

.admin-info__details div {
    margin-bottom: 4px;
}
</style>