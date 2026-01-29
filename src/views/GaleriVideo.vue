<script setup>
import { ref, onMounted, watch } from 'vue'
import {
    MagnifyingGlassIcon,
    PlayCircleIcon,
    VideoCameraIcon,
    CalendarIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/vue/24/outline'
import { getVideos } from '@/services/api'

// Search and filter
const searchQuery = ref('')
const selectedCategory = ref('all')
const currentPage = ref(1)
const itemsPerPage = 6

// Data
const allVideos = ref([])
const totalPages = ref(1)
const isLoading = ref(false)
const categories = ref([
    { value: 'all', label: 'Semua Kategori' },
    { value: 'profile', label: 'Profil Sekolah' },
    { value: 'activity', label: 'Kegiatan' },
    { value: 'achievement', label: 'Prestasi' },
    { value: 'event', label: 'Acara' },
    { value: 'other', label: 'Lainnya' }
])

// Fetch videos from API
const fetchVideos = async () => {
    isLoading.value = true
    try {
        const params = {
            page: currentPage.value,
            limit: itemsPerPage,
            search: searchQuery.value || undefined,
            category: selectedCategory.value !== 'all' ? selectedCategory.value : undefined
        }

        const response = await getVideos(params)

        if (response.success) {
            allVideos.value = response.data
            if (response.pagination) {
                totalPages.value = response.pagination.totalPages
            }
        }
    } catch (error) {
        console.error('Error fetching videos:', error)
        allVideos.value = []
    } finally {
        isLoading.value = false
    }
}

// Functions
const handleSearch = () => {
    currentPage.value = 1
    fetchVideos()
}

const handleCategoryChange = () => {
    currentPage.value = 1
    fetchVideos()
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

const handleVideoClick = (video) => {
    // Open video URL in new tab
    if (video.url) {
        window.open(video.url, '_blank')
    }
}

const handleImageError = (event) => {
    event.target.src = 'https://via.placeholder.com/640x360/0d5f5f/ffffff?text=Video+Kegiatan'
}

const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = { day: '2-digit', month: 'long', year: 'numeric' }
    return date.toLocaleDateString('id-ID', options)
}

// Get YouTube or Vimeo thumbnail
const getVideoThumbnail = (video) => {
    if (video.thumbnail_url) {
        return video.thumbnail_url
    }

    // Generate thumbnail from URL if platform is YouTube
    if (video.platform === 'youtube' && video.url) {
        const videoId = extractYouTubeId(video.url)
        if (videoId) {
            return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        }
    }

    return null
}

const extractYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
}

// Watch for page changes
watch(currentPage, () => {
    fetchVideos()
})

// Fetch on mount
onMounted(() => {
    fetchVideos()
})
</script>

<template>
    <div class="min-h-screen bg-neutral-50">
        <!-- Hero Section -->
        <section class="bg-linear-to-br from-primary to-primary-dark py-20 px-4">
            <div class="max-w-4xl mx-auto text-center">
                <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
                    Galeri Video
                </h1>
                <p class="text-xl text-white/90">
                    Kumpulan dokumentasi kegiatan dalam bentuk video
                </p>
            </div>
        </section>

        <!-- Search Section -->
        <section class="py-8 px-4 -mt-12 relative z-10">
            <div class="max-w-7xl mx-auto">
                <div class="bg-white rounded-2xl shadow-xl p-6">
                    <div class="flex flex-col md:flex-row gap-4">
                        <!-- Search Input -->
                        <div class="grow">
                            <div class="relative">
                                <MagnifyingGlassIcon
                                    class="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                <input v-model="searchQuery" @keyup.enter="handleSearch" type="text"
                                    placeholder="Cari video..."
                                    class="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                            </div>
                        </div>

                        <!-- Category Filter -->
                        <div class="md:w-64">
                            <select v-model="selectedCategory" @change="handleCategoryChange"
                                class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                                <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                                    {{ cat.label }}
                                </option>
                            </select>
                        </div>

                        <button @click="handleSearch"
                            class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors cursor-pointer">
                            Cari
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Videos Grid -->
        <section class="py-12 px-4">
            <div class="max-w-7xl mx-auto">

                <!-- Loading State -->
                <div v-if="isLoading" class="text-center py-12">
                    <div class="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                        <p class="text-neutral-600">Memuat video...</p>
                    </div>
                </div>

                <!-- No Results -->
                <div v-else-if="allVideos.length === 0" class="text-center py-12">
                    <div class="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                        <VideoCameraIcon class="w-16 h-16 mx-auto text-neutral-300 mb-4" />
                        <h3 class="text-xl font-bold text-neutral-900 mb-2">Tidak ada video</h3>
                        <p class="text-neutral-600" v-if="searchQuery">
                            Tidak ditemukan video dengan pencarian "{{ searchQuery }}"
                        </p>
                        <p class="text-neutral-600" v-else>
                            Belum ada video yang tersedia
                        </p>
                    </div>
                </div>

                <!-- Videos Grid -->
                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="video in allVideos" :key="video.id" @click="handleVideoClick(video)"
                        class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
                        <!-- Video Thumbnail -->
                        <div class="relative overflow-hidden aspect-video bg-black">
                            <img :src="getVideoThumbnail(video)" :alt="video.title" @error="handleImageError"
                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />

                            <!-- Play Button Overlay -->
                            <div
                                class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                                <div
                                    class="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <PlayCircleIcon class="w-16 h-16 text-primary" />
                                </div>
                            </div>

                            <!-- Category Badge -->
                            <div v-if="video.category"
                                class="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold text-primary capitalize">
                                {{ video.category }}
                            </div>
                        </div>

                        <!-- Video Info -->
                        <div class="p-6">
                            <h3
                                class="text-lg font-bold text-neutral-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                {{ video.title }}
                            </h3>

                            <p v-if="video.description" class="text-neutral-600 text-sm mb-3 line-clamp-2">
                                {{ video.description }}
                            </p>

                            <div class="flex items-center gap-2 text-sm text-neutral-500">
                                <CalendarIcon class="w-4 h-4" />
                                <span>{{ formatDate(video.created_at) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Pagination -->
                <div v-if="!isLoading && allVideos.length > 0 && totalPages > 1" class="mt-12 flex justify-center">
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
                        <button v-for="page in Math.min(totalPages, 10)" :key="page" @click="goToPage(page)" :class="[
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
