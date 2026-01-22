<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentIndex = ref(0)
let autoScrollInterval = null

const newsArticles = [
    {
        id: 1,
        title: 'Selamat Memasuki Masa Purna Tugas, Ibu Siti Mariya...',
        excerpt: 'Tanggal, 1 Agustus 2025 – Suasana haru menyelimuti SD IT Rohmatul Ummah, Kapanewon Pengasih, saat seluruh keluarga besar sekolah melepas salah satu...',
        image: '/news-1.jpg',
        date: '08 Agustus 2025',
        category: 'Berita',
        categoryColor: 'bg-purple-500'
    },
    {
        id: 2,
        title: 'Installer Aplikasi Dapodik versi 2026.b',
        excerpt: 'Berdasarkan sumber dari website resmi Dapodik&nbsp;, pada tanggal 13 Januari 2026 telah rilis Aplikasi Dapodik Versi 2026.b, dengan beberapa catatan p',
        image: '/news-2.jpg',
        date: '14 Januari 2026',
        category: 'Informasi',
        categoryColor: 'bg-teal-500'
    },
    {
        id: 3,
        title: 'Serunya Outing Class SD IT Rohmatul Ummah ke Yogya...',
        excerpt: 'Sabtu, 25 Oktober 2025 menjadi hari penuh keceriaan bagi siswa SD IT Rohmatul Ummah Kapanewon Pengasih. Hari ini, para siswa mengikuti Outing Class ke...',
        image: '/news-3.jpg',
        date: '27 Oktober 2025',
        category: 'Berita',
        categoryColor: 'bg-purple-500'
    }
]

const scrollToNext = () => {
    currentIndex.value = (currentIndex.value + 1) % newsArticles.length
}

const scrollToPrev = () => {
    currentIndex.value = currentIndex.value === 0 ? newsArticles.length - 1 : currentIndex.value - 1
}

onMounted(() => {
    autoScrollInterval = setInterval(scrollToNext, 5000)
})

onUnmounted(() => {
    if (autoScrollInterval) {
        clearInterval(autoScrollInterval)
    }
})
</script>

<template>
    <section class="py-20 px-4 bg-white">
        <div class="max-w-7xl mx-auto">
            <!-- Section Header -->
            <div class="text-center mb-12">
                <h2 class="text-4xl font-bold text-neutral-900 mb-2">
                    Artikel & Berita
                </h2>
                <div class="w-20 h-1 bg-secondary mx-auto mb-4"></div>
                <p class="text-neutral-600 text-lg">
                    Ikuti update terbaru seputar kegiatan dan informasi sekolah
                </p>
            </div>

            <!-- News Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                <article v-for="article in newsArticles" :key="article.id"
                    class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    <!-- Article Image -->
                    <div class="relative h-48 bg-linear-to-br from-primary-light to-primary overflow-hidden">
                        <img :src="article.image" :alt="article.title" class="w-full h-full object-cover"
                            @error="$event.target.src = 'https://placehold.co/600x400/14b8a6/white?text=SD+Kedungrejo'" />
                        <div
                            :class="`absolute top-4 left-4 ${article.categoryColor} text-white px-3 py-1 rounded-full text-sm font-medium`">
                            {{ article.category }}
                        </div>
                    </div>

                    <!-- Article Content -->
                    <div class="p-6">
                        <p class="text-sm text-neutral-500 mb-2">{{ article.date }}</p>
                        <h3 class="text-xl font-bold text-neutral-900 mb-3 line-clamp-2">
                            {{ article.title }}
                        </h3>
                        <p class="text-neutral-600 mb-4 line-clamp-3">
                            {{ article.excerpt }}
                        </p>
                        <a href="#"
                            class="inline-flex items-center text-primary hover:text-primary-dark font-semibold transition-colors">
                            Selengkapnya
                            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                </article>
            </div>

            <!-- Pagination -->
            <div class="flex justify-center items-center gap-3">
                <button @click="scrollToPrev"
                    class="px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors flex items-center cursor-pointer">
                    <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Sebelumnya
                </button>

                <div class="flex items-center gap-2">
                    <button class="w-10 h-10 bg-primary text-white rounded-lg font-semibold cursor-pointer">1</button>
                </div>

                <button
                    class="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors flex items-center font-semibold cursor-pointer">
                    Lihat Semua Berita
                </button>

                <button @click="scrollToNext"
                    class="px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors flex items-center cursor-pointer">
                    Selanjutnya
                    <svg class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    </section>
</template>
