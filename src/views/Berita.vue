<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
    MagnifyingGlassIcon,
    ChevronRightIcon,
    ChevronLeftIcon
} from '@heroicons/vue/24/outline'
import { getNews } from '@/services/api'

const router = useRouter()

// News data
const allNews = ref([])

// Search and pagination
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 6
const totalPages = ref(1)
const isLoading = ref(false)

// Fetch news from API
const fetchNews = async () => {
    isLoading.value = true
    try {
        const response = await getNews({
            page: currentPage.value,
            limit: itemsPerPage,
            search: searchQuery.value,
            status: 'published'
        })

        if (response.success) {
            allNews.value = response.data
            if (response.pagination) {
                totalPages.value = response.pagination.totalPages
            }
        }
    } catch (error) {
        console.error('Error fetching news:', error)
        // Keep empty array on error
        allNews.value = []
    } finally {
        isLoading.value = false
    }
}

// Functions
const handleSearch = () => {
    currentPage.value = 1
    fetchNews()
}

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
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

const goToNewsDetail = (slug) => {
    router.push(`/berita/${slug}`)
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

// Format date from API
const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = { day: '2-digit', month: 'short', year: 'numeric' }
    return date.toLocaleDateString('id-ID', options)
}

// Watch for page changes
watch(currentPage, () => {
    fetchNews()
})

// Fetch news on mount
onMounted(() => {
    fetchNews()
})
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

                <!-- Loading State -->
                <div v-if="isLoading" class="text-center py-12">
                    <div class="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                        <p class="text-neutral-600">Memuat berita...</p>
                    </div>
                </div>

                <!-- News Grid -->
                <div v-else-if="allNews.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="news in allNews" :key="news.id" @click="goToNewsDetail(news.slug)"
                        class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col cursor-pointer">
                        <!-- Image -->
                        <div class="relative overflow-hidden h-48">
                            <img :src="news.featured_image || '/placeholder-news.jpg'" :alt="news.title" @error="handleImageError"
                                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />

                            <!-- Date Badge -->
                            <div
                                class="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold text-primary">
                                {{ formatDate(news.created_at) }}
                            </div>
                        </div>

                        <!-- Content -->
                        <div class="p-6 flex flex-col grow">
                            <h3
                                class="text-xl font-bold text-neutral-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                {{ news.title }}
                            </h3>

                            <p class="text-neutral-600 text-sm mb-4 line-clamp-3 grow">
                                {{ news.excerpt || news.content?.substring(0, 150) + '...' }}
                            </p>

                            <!-- Read More Button -->
                            <div
                                class="inline-flex items-center text-primary hover:text-primary-dark font-semibold text-sm group/btn mt-auto">
                                Baca Selengkapnya
                                <ChevronRightIcon
                                    class="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- No Results Message -->
                <div v-else class="text-center py-12">
                    <div class="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                        <MagnifyingGlassIcon class="w-16 h-16 mx-auto text-neutral-300 mb-4" />
                        <h3 class="text-xl font-bold text-neutral-900 mb-2">Tidak ada hasil</h3>
                        <p class="text-neutral-600" v-if="searchQuery">
                            Tidak ditemukan berita yang sesuai dengan pencarian "{{ searchQuery }}"
                        </p>
                        <p class="text-neutral-600" v-else>
                            Belum ada berita yang tersedia
                        </p>
                    </div>
                </div>

                <!-- Pagination -->
                <div v-if="!isLoading && allNews.length > 0 && totalPages > 1" class="mt-12 flex justify-center">
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
