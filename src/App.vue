<script setup>
// import { RouterLink, RouterView } from 'vue-router'
// import { useRoute } from 'vue-router';
// import DataDisplay from './components/DataDisplay.vue'
// const route = useRoute();
// console.log('routes', route.params);
</script>

<template>
  <!-- <v-app>
    <DataDisplay />
  </v-app> -->
  <!-- <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header> -->

  <!-- router裡的homeView -->
  <RouterView />
</template>

<style lang="scss" scoped></style>
