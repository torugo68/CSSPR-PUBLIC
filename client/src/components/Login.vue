<template>
  <div>
    <v-img class="mx-auto my-7" max-width="228"
      src="../assets/logo-escuro.jpg"></v-img>

    <h4 class="mb-3 text-center">PROCURADORIA-GERAL DO ESTADO DO PARANÁ</h4>
    <h5 class="mb-3 text-center">CONTROLE DE SISTEMAS</h5>
    

    <v-card class="mx-auto pa-10 pb-8" elevation="8"  max-width="510" rounded="lg">
      <div class="text-subtitle-1 text-medium-emphasis">
        Usuário
      </div>
      <v-text-field v-model="username" density="compact" placeholder="Usuário" prepend-inner-icon="mdi-account-outline"
        variant="outlined">
      </v-text-field>
      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Senha
      </div>
      <v-text-field v-model="password" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
        density="compact" placeholder="Senha" prepend-inner-icon="mdi-lock-outline" variant="outlined"
        @click:append-inner="visible = !visible">
      </v-text-field>
      <a class="text-caption text-decoration-none text-blue" href="#" rel="noopener noreferrer" target="_blank">
        Esqueceu a senha?
      </a>
      <v-btn :loading="loading" @click="sendData" block class="mb-8 mt-3" color="blue" size="large" variant="tonal">
        Entrar
      </v-btn>
    </v-card>
  </div>
</template>

<script>
  import toastr from 'toastr';
  import 'toastr/build/toastr.min.css';
  import axios from 'axios';

  export default {
    data: () => ({
      visible: false,
      username: 'admin',
      password: 'admin',
      loading: false
    }),
    methods: {
      async sendData() {
        this.loading = true;
        setTimeout(async () =>{
          try {
            const loginData = JSON.stringify({
                username: this.username,
                password: this.password
            });

            await axios.post('http://localhost:3001/api/auth/login', loginData, {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json'
              }
            })
            .then(response => {
              if (response.status === 200) {
                this.loading = false;
                toastr.success('Login efetuado com sucesso', null, { timeOut: 200 });
                setTimeout(() => { this.$router.push('/'); }, 300);
              } 
              else {
                toastr.error('Usuário ou senha inválidos');
                this.loading = false;
              }
            })
            .catch(error => {
              console.error("ERR CATCH");
              this.loading = false;
              toastr.error('Usuário ou senha inválidos');
            });
          } 
          catch (error) {
            this.loading = false;
            toastr.error('Usuário ou senha inválidos');
          }
        },
        1000);
      }
    }
  }
</script>

<script>
</script>