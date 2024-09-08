<template>
  <div class="d-flex flex-column justify-content-center align-items-center" id="main">
    <a href="/">
      <img src="@/assets/logo-escuro.jpg" alt="Click aqui para ir para Home" class="logo" style="height: 150px;" />
    </a>
    <div class="d-flex justify-content-center align-items-center">
      <h1 class="mr-3 pr-3 align-top border-right inline-block align-content-center">500</h1>
      <div class="inline-block align-middle">
        <h2 class="font-weight-normal lead" id="desc">Error interno do servidor. Contate o administrador ou <a
            href="/">Tente novamente</a>.</h2>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Internal',
};
</script>

<style scoped>
#main {
  height: 100vh;
  /* Full viewport height */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  /* Stack items vertically */
}

.logo {
  margin-bottom: 1rem;
  /* Space between logo and text */
}

h1 {
  margin-right: 1rem;
  padding-right: 1rem;
  border-right: 1px solid #000;
}

.inline-block {
  display: inline-block;
}

.align-middle {
  vertical-align: middle;
}

.font-weight-normal {
  font-weight: normal;
}

.lead {
  font-size: 1.25rem;
}
</style>