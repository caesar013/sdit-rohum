<script setup>
const images = [
  // '/placeholder-school-1.jpg',
  // '/placeholder-school-2.jpg',
  // '/placeholder-school-3.jpg',
  // '/placeholder-school-4.jpg',
]
</script>

<template>
  <section class="bg-linear-to-br from-primary to-primary-dark min-h-[600px] px-4 py-16 relative overflow-hidden">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Left Content -->
        <div class="text-white space-y-6">
          <!-- Badge/Notice -->
          <div class="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
            <span class="w-2 h-2 bg-secondary rounded-full mr-2"></span>
            <span>Tidak ada informasi penting saat ini.</span>
          </div>

          <!-- Main Headline -->
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Selamat Datang di<br>
            <span class="text-primary-light">SD IT Rohmatul Ummah</span>
          </h1>

          <!-- Tagline -->
          <p class="text-xl md:text-2xl text-white/90">
            Beriman, Kreatif, Berprestasi, Berkarakter, dan Berbudaya
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 pt-4">
            <a href="#visi-misi"
              class="bg-white hover:bg-emerald-50 text-primary hover:text-emerald-700 font-semibold px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-center inline-flex items-center justify-center">
              Visi & Misi
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a href="#pendaftaran"
              class="bg-secondary hover:bg-secondary-dark text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-center inline-flex items-center justify-center">
              Penerimaan Siswa Baru
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Right Content - Photo Grid -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-4">
            <div class="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden aspect-square">
              <!-- <img 
                src="/placeholder-school-1.jpg" 
                alt="Kegiatan Sekolah" 
                class="w-full h-full object-cover"
                @error="$event.target.src = 'https://placehold.co/400x400/14b8a6/white?text=SD+Kedungrejo'"
              /> -->
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden aspect-square">
              <!-- <img 
                src="/placeholder-school-2.jpg" 
                alt="Siswa Belajar" 
                class="w-full h-full object-cover"
                @error="$event.target.src = 'https://placehold.co/400x400/0d5f5f/white?text=Kegiatan+Belajar'"
              /> -->
            </div>
          </div>
          <div class="space-y-4 pt-8">
            <div class="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden aspect-square">
              <!-- <img 
                src="/placeholder-school-3.jpg" 
                alt="Prestasi Siswa" 
                class="w-full h-full object-cover"
                @error="$event.target.src = 'https://placehold.co/400x400/14b8a6/white?text=Prestasi+Siswa'"
              /> -->
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden aspect-square">
              <!-- <img 
                src="/placeholder-school-4.jpg" 
                alt="Fasilitas Sekolah" 
                class="w-full h-full object-cover"
                @error="$event.target.src = 'https://placehold.co/400x400/0d5f5f/white?text=Fasilitas'"
              /> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
