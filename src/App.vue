<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

const route = useRoute()

// Hide navbar and footer for admin routes
const isAdminRoute = computed(() => route.path.startsWith('/admin'))
</script>

<template>
  <div class="min-h-screen">
    <Navbar v-if="!isAdminRoute" />
    <router-view />
    <Footer v-if="!isAdminRoute" />
  </div>
</template>
