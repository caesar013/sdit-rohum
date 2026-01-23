<script setup>
import { ref, computed } from 'vue'
import {
    MagnifyingGlassIcon,
    ChevronRightIcon,
    ChevronLeftIcon
} from '@heroicons/vue/24/outline'

// News data - will be fetched from backend API in the future
const allNews = ref([
    {
        id: 1,
        title: 'Installer Aplikasi Dapodik versi 2026.b',
        excerpt: 'Berdasarkan sumber dari website resmi Dapodik&nbsp;: pada tanggal 13 Januari 2026 telah rilis Aplikasi Dapodik Versi 2026.b, dengan...',
        image: '/placeholder-news-1.jpg',
        date: '14 Jan 2026',
        slug: 'installer-aplikasi-dapodik-2026'
    },
    {
        id: 2,
        title: 'Serunya Outing Class SD Negeri Kedungrejo ke Yogyakarta: Belajar Sambil Berwisata!',
        excerpt: 'Sabtu, 25 Oktober 2025 menjadi hari penuh keceriaan bagi siswa SD Negeri Kedungrejo Kapanewon Pengasih, Hari itu, para siswa mengiku...',
        image: '/placeholder-news-2.jpg',
        date: '27 Okt 2025',
        slug: 'outing-class-yogyakarta'
    },
    {
        id: 3,
        title: 'SDN Kedungrejo Terima Bantuan IFP, Teknologi Pembelajaran Semakin Canggih!',
        excerpt: 'Kedungtangkil, 21 Oktober 2025 — SD Negeri Kedungrejo Kapanewon Pengasih kembali menerima dukungan sarana pembelajaran dari...',
        image: '/placeholder-news-3.jpg',
        date: '23 Okt 2025',
        slug: 'bantuan-ifp-teknologi'
    },
    {
        id: 4,
        title: 'Siswa SD Negeri Kedungrejo Antusias Ikuti Edukasi Konservasi Alam dari Balai KSDA Yogyakarta',
        excerpt: 'Pengasih, 30 September 2025 — Suasana ceria pagi itu di SD Negeri Kedungrejo terasa berbeda dari biasanya. Sejak pukul 07.30 WIB...',
        image: '/placeholder-news-4.jpg',
        date: '01 Okt 2025',
        slug: 'edukasi-konservasi-alam'
    },
    {
        id: 5,
        title: 'ANBK Utama SD Negeri Kedungrejo Berjalan Lancar, Hari Kedua Sempat Mengalami Penundaan Teknis',
        excerpt: 'Kedungtangkil, Kapanewon Pengasih — Pada Rabu–Kamis, 24–25 September 2025, SD Negeri Kedungrejo Kapanewon Pengasih...',
        image: '/placeholder-news-5.jpg',
        date: '25 Sep 2025',
        slug: 'anbk-utama-2025'
    },
    {
        id: 6,
        title: 'Selamat Memasuki Masa Purna Tugas, Ibu Siti Mariyah, S.Pd.I',
        excerpt: 'Pengasih, 1 Agustus 2025 – Suasana haru menyelimuti SD Negeri Kedungrejo, Kapanewon Pengasih, saat seluruh keluarga besar sekola...',
        image: '/placeholder-news-6.jpg',
        date: '01 Agt 2025',
        slug: 'purna-tugas-ibu-siti'
    }
])

// Search and pagination
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 6
const totalPages = ref(10) // Will be calculated from backend response

// Filtered news based on search
const filteredNews = computed(() => {
    if (!searchQuery.value) return allNews.value

    const query = searchQuery.value.toLowerCase()
    return allNews.value.filter(news =>
        news.title.toLowerCase().includes(query) ||
        news.excerpt.toLowerCase().includes(query)
    )
})

// Paginated news
const paginatedNews = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredNews.value.slice(start, end)
})

// Functions - will be implemented when backend is ready
const handleSearch = () => {
    // TODO: Implement search functionality with backend API
    currentPage.value = 1
}

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        // TODO: Fetch data for the specific page from backend
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
}

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        goToPage(currentPage.value + 1)
    }
}

const previousPage = () => {
    if (currentPage.value > 1) {
        goToPage(currentPage.value - 1)
    }
}

// Generate page numbers for pagination
const pageNumbers = computed(() => {
    const pages = []
    const maxVisible = 10

    if (totalPages.value <= maxVisible) {
        for (let i = 1; i <= totalPages.value; i++) {
            pages.push(i)
        }
    } else {
        // Show first, last, current, and nearby pages
        for (let i = 1; i <= maxVisible; i++) {
            pages.push(i)
        }
    }

    return pages
})

// Handle image error
const handleImageError = (event) => {
    event.target.src = 'https://via.placeholder.com/400x250/0d5f5f/ffffff?text=Berita+Sekolah'
}
</script>

<template>
    <div class="min-h-screen bg-neutral-50">
        <!-- Hero Section with Search -->
        <section class="bg-linear-to-br from-primary to-primary-dark py-20 px-4">
            <div class="max-w-4xl mx-auto text-center">
                <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
                    Indeks Berita
                </h1>
                <p class="text-xl text-white/90 mb-8">
                    Informasi terbaru seputar kegiatan dan berita sekolah
                </p>

                <!-- Search Bar -->
                <div class="max-w-2xl mx-auto">
                    <form @submit.prevent="handleSearch" class="relative">
                        <input v-model="searchQuery" type="text" placeholder="Cari berita atau informasi..."
                            class="w-full px-6 py-4 pr-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all" />
                        <button type="submit"
                            class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors cursor-pointer">
                            <MagnifyingGlassIcon class="w-5 h-5 text-white" />
                        </button>
                    </form>
                </div>
            </div>
        </section>

        <!-- News Grid -->
        <section class="py-16 px-4 -mt-12 relative z-10">
            <div class="max-w-7xl mx-auto">

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="news in paginatedNews" :key="news.id"
                        class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
                        <!-- Image -->
                        <div class="relative overflow-hidden h-48">
                            <img :src="news.image" :alt="news.title" @error="handleImageError"
                                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />

                            <!-- Date Badge -->
                            <div
                                class="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold text-primary">
                                {{ news.date }}
                            </div>
                        </div>

                        <!-- Content -->
                        <div class="p-6 flex flex-col grow">
                            <h3
                                class="text-xl font-bold text-neutral-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors cursor-pointer">
                                {{ news.title }}
                            </h3>

                            <p class="text-neutral-600 text-sm mb-4 line-clamp-3 grow">
                                {{ news.excerpt }}
                            </p>

                            <!-- Read More Button -->
                            <button
                                class="inline-flex items-center text-primary hover:text-primary-dark font-semibold text-sm group/btn mt-auto cursor-pointer">
                                Baca Selengkapnya
                                <ChevronRightIcon
                                    class="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                <!-- No Results Message -->
                <div v-if="filteredNews.length === 0" class="text-center py-12">
                    <div class="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                        <MagnifyingGlassIcon class="w-16 h-16 mx-auto text-neutral-300 mb-4" />
                        <h3 class="text-xl font-bold text-neutral-900 mb-2">Tidak ada hasil</h3>
                        <p class="text-neutral-600">
                            Tidak ditemukan berita yang sesuai dengan pencarian "{{ searchQuery }}"
                        </p>
                    </div>
                </div>

                <!-- Pagination -->
                <div v-if="filteredNews.length > 0" class="mt-12 flex justify-center">
                    <nav class="inline-flex items-center gap-2">
                        <!-- Previous Button -->
                        <button @click="previousPage" :disabled="currentPage === 1" :class="[
                            'px-3 py-2 rounded-lg font-medium transition-colors',
                            currentPage === 1
                                ? 'text-neutral-400 cursor-not-allowed'
                                : 'text-primary hover:bg-primary hover:text-white cursor-pointer'
                        ]">
                            <ChevronLeftIcon class="w-5 h-5" />
                        </button>

                        <!-- Page Numbers -->
                        <button v-for="page in pageNumbers" :key="page" @click="goToPage(page)" :class="[
                            'min-w-10 px-3 py-2 rounded-lg font-medium transition-all cursor-pointer',
                            currentPage === page
                                ? 'bg-primary text-white shadow-md'
                                : 'text-neutral-700 hover:bg-neutral-100'
                        ]">
                            {{ page }}
                        </button>

                        <!-- Next Button -->
                        <button @click="nextPage" :disabled="currentPage === totalPages" :class="[
                            'px-3 py-2 rounded-lg font-medium transition-colors',
                            currentPage === totalPages
                                ? 'text-neutral-400 cursor-not-allowed'
                                : 'text-primary hover:bg-primary hover:text-white cursor-pointer'
                        ]">
                            <ChevronRightIcon class="w-5 h-5" />
                        </button>
                    </nav>
                </div>

            </div>
        </section>
    </div>
</template>
