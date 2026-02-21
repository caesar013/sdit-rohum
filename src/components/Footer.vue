<script setup>
import { computed } from 'vue'
import { useSchoolProfile } from '@/services/schoolProfile'

const { schoolProfile } = useSchoolProfile()

const quickLinks = [
  { name: 'Tentang Kami', href: '/identitas-sekolah' },
  { name: 'Visi & Misi', href: '/visi-misi' },
  { name: 'Berita', href: '/berita' },
  { name: 'Galeri Foto', href: '/galeri-foto' },
  { name: 'Hubungi Kami', href: '/hubungi-kami' },
]

const contactInfo = computed(() => [
  { label: 'Telepon', value: schoolProfile.value.phone || '-' },
  { label: 'Email', value: schoolProfile.value.email || '-' },
  { label: 'Alamat', value: schoolProfile.value.address || '-' },
])

const schoolVision = computed(() => schoolProfile.value.vision || 'Beriman, Kreatif, Berprestasi, Berkarakter, dan Berbudaya. Membentuk generasi unggul dengan pendidikan berkualitas.')
</script>

<template>
  <footer class="bg-neutral-900 text-white py-12 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <!-- About Column -->
        <div>
          <h3 class="text-2xl font-bold text-secondary mb-4">{{ schoolProfile.school_name }}</h3>
          <p class="text-neutral-300">
            {{ schoolVision }}
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-lg font-semibold mb-4">Tautan Cepat</h4>
          <ul class="space-y-2">
            <li v-for="link in quickLinks" :key="link.name">
              <router-link :to="link.href" class="text-neutral-300 hover:text-secondary transition-colors duration-200">
                {{ link.name }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h4 class="text-lg font-semibold mb-4">Hubungi Kami</h4>
          <ul class="space-y-2">
            <li v-for="info in contactInfo" :key="info.label" class="text-neutral-300">
              <span class="font-medium text-white">{{ info.label }}:</span> {{ info.value }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Copyright -->
      <div class="border-t border-neutral-700 pt-8 text-center">
        <p class="text-neutral-400">
          &copy; {{ new Date().getFullYear() }} {{ schoolProfile.school_name }}. Hak Cipta Dilindungi.
        </p>
      </div>
    </div>
  </footer>
</template>
