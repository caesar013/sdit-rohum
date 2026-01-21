<script setup>
const quickLinks = [
  { name: 'Tentang Kami', href: '#tentang' },
  { name: 'Program', href: '#program' },
  { name: 'Berita', href: '#berita' },
  { name: 'Galeri', href: '#galeri' },
  { name: 'Kontak', href: '#kontak' },
]

const contactInfo = [
  { label: 'Telepon', value: '082136781467' },
  { label: 'Email', value: 'info@sditrohmatulummah.sch.id' },
  { label: 'Alamat', value: 'Jl. Hastrodirono No.40, Pulutan, Kec. Jekulo, Kab. Kudus, Jawa Tengah 59382, Indonesia' },
]
</script>

<template>
  <footer class="bg-neutral-900 text-white py-12 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <!-- About Column -->
        <div>
          <h3 class="text-2xl font-bold text-secondary mb-4">SD IT Rohmatul Ummah</h3>
          <p class="text-neutral-300">
            Beriman, Kreatif, Berprestasi, Berkarakter, dan Berbudaya. Membentuk generasi unggul dengan pendidikan
            berkualitas.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-lg font-semibold mb-4">Tautan Cepat</h4>
          <ul class="space-y-2">
            <li v-for="link in quickLinks" :key="link.name">
              <a :href="link.href" class="text-neutral-300 hover:text-secondary transition-colors duration-200">
                {{ link.name }}
              </a>
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
          &copy; {{ new Date().getFullYear() }} SD IT Rohmatul Ummah. Hak Cipta Dilindungi.
        </p>
      </div>
    </div>
  </footer>
</template>
