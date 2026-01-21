<script setup>
const navLinks = [
  { name: 'Home', href: '#' },
  { name: 'Profil', href: '#profil', dropdown: true },
  { name: 'Berita', href: '#berita' },
  { name: 'Direktori', href: '#direktori', dropdown: true },
  { name: 'Galeri', href: '#galeri', dropdown: true },
  { name: 'Unduhan', href: '#unduhan' },
  { name: 'Hubungi Kami', href: '#hubungi' },
]
</script>

<template>
  <nav class="sticky top-0 z-50 bg-primary shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <a href="#" class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
              SD
            </div>
            <span class="text-lg font-semibold text-white">SD IT Rohmatul Ummah</span>
          </a>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:flex space-x-8">
          <a v-for="link in navLinks" :key="link.name" :href="link.href"
            class="text-white hover:text-secondary font-medium transition-colors duration-200 flex items-center">
            {{ link.name }}
            <svg v-if="link.dropdown" class="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd" />
            </svg>
          </a>
        </div>

        <!-- Search Icon -->
        <div class="hidden md:block">
          <button class="text-white hover:text-secondary p-2">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <button class="text-white hover:text-secondary p-2">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
