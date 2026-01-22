<script setup>
import { ref } from 'vue'

const navLinks = [
  { name: 'Home', href: '#' },
  {
    name: 'Profil',
    href: '#profil',
    dropdown: true,
    submenu: [
      { name: 'Identitas Sekolah', href: '#identitas' },
      { name: 'Sejarah', href: '#sejarah' },
      { name: 'Akreditasi Sekolah', href: '#akreditasi' },
      { name: 'Sarana Prasarana', href: '#sarana-prasarana' },
    ]
  },
  { name: 'Berita', href: '#berita' },
  {
    name: 'Direktori',
    href: '#direktori',
    dropdown: true,
    submenu: [
      { name: 'Peserta Didik', href: '#peserta-didik' },
      { name: 'Guru dan Tendik', href: '#guru-tendik' },
      { name: 'PD Non Aktif', href: '#pd-non-aktif' },
    ]
  },
  {
    name: 'Galeri',
    href: '#galeri',
    dropdown: true,
    submenu: [
      { name: 'Foto', href: '#galeri-foto' },
      { name: 'Video', href: '#galeri-video' },
    ]
  },
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
          <div v-for="link in navLinks" :key="link.name" class="relative group">
            <a :href="link.href"
              class="text-white hover:text-secondary font-medium transition-colors duration-200 flex items-center py-5">
              {{ link.name }}
              <svg v-if="link.dropdown"
                class="w-4 h-4 ml-1 transform rotate-180 group-hover:rotate-0 transition-transform duration-200"
                fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd" />
              </svg>
            </a>

            <!-- Dropdown Menu -->
            <div v-if="link.dropdown && link.submenu"
              class="absolute left-0 top-full mt-0 w-56 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div class="py-2">
                <a v-for="item in link.submenu" :key="item.name" :href="item.href"
                  class="block px-4 py-3 text-neutral-700 hover:bg-primary/10 hover:text-primary transition-colors duration-150">
                  {{ item.name }}
                </a>
              </div>
            </div>
          </div>
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
