<script>
import { globalState } from '../../globalState';

export default {
    data() {
        return {
            loading: true,
        };
    },
    created() {
        fetch(`${globalState.apiUrl.value}/api/auth/logout`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (response.ok) {
                this.$router.push('/login');
                console.log('Logout successful');
            } else {
                this.$router.push('/error/internal/');
                console.error('Logout failed');
            }
        })
        .catch(error => {
            console.error('An error occurred:');
        })
        .finally(() => {
            this.loading = false;
        });
    },
};
</script>

<template>
    <div>
        <h1></h1>
    </div>
</template>