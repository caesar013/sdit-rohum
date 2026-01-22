<script setup>
import Navbar from '../components/Navbar.vue'
import Hero from '../components/Hero.vue'
import Stats from '../components/Stats.vue'
import PrincipalMessage from '../components/PrincipalMessage.vue'
import News from '../components/News.vue'
import VideoProfile from '../components/VideoProfile.vue'
import QuickAccess from '../components/QuickAccess.vue'
import Footer from '../components/Footer.vue'
</script>

<template>
    <div class="min-h-screen">
        <Hero />
        <Stats />
        <PrincipalMessage />
        <News />
        <VideoProfile />
        <QuickAccess />
    </div>
</template>
