<template>
    <v-card
      class="mx-auto mt-15"
      max-width="800px"
      min-width="400px"
    >
    <a href="/" label="Incio">
        <v-img
            src="../../assets/governo-jpge.jpg"
            cover
            class="mx-auto my-4"
            max-width="50%"
            href="/"
        ></v-img>
    </a>
        
      <v-card-title class="mt-2">
        CONTROLE DE SISTEMAS - GUIA DE USUÁRIOS
      </v-card-title>
  
      <v-card-subtitle class="mb-6 subtitle-bold" style="font-size:20px;">
        <p>Este projeto é open-source. Confira o código no 
              <v-btn text color="primary" href="https://github.com/LambdaMike/CSSPR-PUBLIC" target="_blank">
                GitHub
              </v-btn>.
            </p>
            <p>Para mais instruções, baixe o PDF abaixo:</p>
            <v-btn color="primary" :href="pdfFile" download="guia-de-usuarios.pdf">
              Baixar PDF
            </v-btn>
            <v-container fluid class="d-flex flex-column justify-end">
            <v-row justify="end">
                <v-col cols="auto">
                <v-btn text href="/" label="Início">Voltar para o Início</v-btn>
                </v-col>
            </v-row>
            </v-container>
      </v-card-subtitle>
    </v-card>
  </template>
  <script setup>
    import pdfFile from '../../assets/guia-de-usuarios.pdf';
  </script>