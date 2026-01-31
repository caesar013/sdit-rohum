<script setup>
import { ref, onMounted, watch } from 'vue'
import {
    MagnifyingGlassIcon,
    PhotoIcon,
    XMarkIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CalendarIcon
} from '@heroicons/vue/24/outline'
import { getGalleryAlbums, getGalleryAlbum } from '@/services/api'

// Modal state
const showModal = ref(false)
const selectedAlbum = ref(null)
const currentPhotoIndex = ref(0)

// Search and pagination
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 6
const totalPages = ref(1)
const isLoading = ref(false)

// Albums data
const allAlbums = ref([])

// Fetch albums from API
const fetchAlbums = async () => {
    isLoading.value = true
    try {
        const params = {
            page: currentPage.value,
            limit: itemsPerPage,
            search: searchQuery.value || undefined
        }

        console.log('Fetching albums with params:', params)
        const response = await getGalleryAlbums(params)
        console.log('API Response:', response)

        if (response.success) {
            allAlbums.value = response.data
            console.log('Albums data:', allAlbums.value)
            if (response.pagination) {
                totalPages.value = response.pagination.totalPages
            }
        }
    } catch (error) {
        console.error('Error fetching albums:', error)
        allAlbums.value = []
    } finally {
        isLoading.value = false
    }
}

// Functions
const handleSearch = () => {
    currentPage.value = 1
    fetchAlbums()
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

const openAlbum = async (album) => {
    try {
        // Fetch full album details with photos
        const response = await getGalleryAlbum(album.slug)
        if (response.success) {
            selectedAlbum.value = response.data
            currentPhotoIndex.value = 0
            showModal.value = true
        }
    } catch (error) {
        console.error('Error fetching album details:', error)
    }
}

const closeModal = () => {
    showModal.value = false
    selectedAlbum.value = null
    currentPhotoIndex.value = 0
}

const nextPhoto = () => {
    if (selectedAlbum.value && currentPhotoIndex.value < selectedAlbum.value.photos.length - 1) {
        currentPhotoIndex.value++
    }
}

const previousPhoto = () => {
    if (currentPhotoIndex.value > 0) {
        currentPhotoIndex.value--
    }
}

const handleImageError = (event) => {
    event.target.src = 'https://via.placeholder.com/800x600/0d5f5f/ffffff?text=Foto+Kegiatan'
}

const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = { day: '2-digit', month: 'long', year: 'numeric' }
    return date.toLocaleDateString('id-ID', options)
}

// Watch for page changes
watch(currentPage, () => {
    fetchAlbums()
})

// Fetch on mount
onMounted(() => {
    fetchAlbums()
})
</script>

<template>
    <div class="min-h-screen bg-neutral-50">
        <!-- Hero Section -->
        <section class="bg-linear-to-br from-primary to-primary-dark py-20 px-4">
            <div class="max-w-4xl mx-auto text-center">
                <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
                    Galeri Foto
                </h1>
                <p class="text-xl text-white/90">
                    Kumpulan dokumentasi kegiatan dalam bentuk foto
                </p>
            </div>
        </section>

        <!-- Search Section -->
        <section class="py-8 px-4 -mt-12 relative z-10">
            <div class="max-w-7xl mx-auto">
                <div class="bg-white rounded-2xl shadow-xl p-6">
                    <div class="flex gap-4">
                        <div class="grow">
                            <div class="relative">
                                <MagnifyingGlassIcon
                                    class="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                <input v-model="searchQuery" @input="handleSearch" type="text"
                                    placeholder="Cari album foto..."
                                    class="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                            </div>
                        </div>
                        <button @click="handleSearch"
                            class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors cursor-pointer">
                            Cari
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Albums Grid -->
        <section class="py-12 px-4">
            <div class="max-w-7xl mx-auto">

                <!-- Loading State -->
                <div v-if="isLoading" class="text-center py-12">
                    <div class="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                        <p class="text-neutral-600">Memuat album...</p>
                    </div>
                </div>

                <!-- No Results -->
                <div v-else-if="allAlbums.length === 0" class="text-center py-12">
                    <div class="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                        <PhotoIcon class="w-16 h-16 mx-auto text-neutral-300 mb-4" />
                        <h3 class="text-xl font-bold text-neutral-900 mb-2">Tidak ada album</h3>
                        <p class="text-neutral-600" v-if="searchQuery">
                            Tidak ditemukan album dengan pencarian "{{ searchQuery }}"
                        </p>
                        <p class="text-neutral-600" v-else>
                            Belum ada album foto yang tersedia
                        </p>
                    </div>
                </div>

                <!-- Albums Grid -->
                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="album in allAlbums" :key="album.id"
                        class="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer">
                        <!-- Album Cover with Overlay -->
                        <div class="relative overflow-hidden aspect-video">
                            <img :src="album.cover_photo || album.coverImage" :alt="album.title"
                                @error="handleImageError" class="w-full h-full object-cover" />

                            <!-- Hover Overlay -->
                            <div
                                class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                                <h3 class="text-white text-xl font-bold mb-2 px-4 text-center">{{ album.title }}</h3>
                                <p v-if="album.description"
                                    class="text-white/90 text-sm mb-4 px-4 text-center line-clamp-2">
                                    {{ album.description }}
                                </p>
                                <button @click="openAlbum(album)"
                                    class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2">
                                    <PhotoIcon class="w-5 h-5" />
                                    Lihat Album
                                </button>
                            </div>
                        </div>

                        <!-- Album Info -->
                        <div class="p-6">
                            <div class="flex items-center gap-2 text-sm text-neutral-500 mb-2">
                                <CalendarIcon class="w-4 h-4" />
                                <span>{{ formatDate(album.created_at || album.date) }}</span>
                            </div>
                            <div class="flex items-center gap-2 text-sm text-blue-600 font-semibold">
                                <PhotoIcon class="w-4 h-4" />
                                <span>{{ album.photo_count || album.photoCount || 0 }} Foto</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Pagination -->
                <div v-if="!isLoading && allAlbums.length > 0 && totalPages > 1" class="mt-12 flex justify-center">
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

        <!-- Photo Modal -->
        <Transition name="modal">
            <div v-if="showModal && selectedAlbum" class="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
                @click="closeModal">
                <div class="absolute inset-0 flex items-center justify-center p-4" @click.stop>

                    <!-- Close Button -->
                    <button @click="closeModal"
                        class="absolute top-4 right-4 w-12 h-12 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors cursor-pointer z-20">
                        <XMarkIcon class="w-6 h-6 text-white" />
                    </button>

                    <!-- Navigation Buttons -->
                    <button v-if="currentPhotoIndex > 0" @click="previousPhoto"
                        class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors cursor-pointer z-20">
                        <ChevronLeftIcon class="w-6 h-6 text-white" />
                    </button>

                    <button v-if="currentPhotoIndex < selectedAlbum.photos.length - 1" @click="nextPhoto"
                        class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors cursor-pointer z-20">
                        <ChevronRightIcon class="w-6 h-6 text-white" />
                    </button>

                    <!-- Photo Container -->
                    <div class="max-w-5xl w-full">
                        <div class="bg-white rounded-2xl shadow-2xl overflow-hidden">
                            <!-- Photo -->
                            <div class="relative bg-black">
                                <img :src="selectedAlbum.photos[currentPhotoIndex].photo_url || selectedAlbum.photos[currentPhotoIndex].url"
                                    :alt="selectedAlbum.photos[currentPhotoIndex].caption" @error="handleImageError"
                                    class="w-full h-auto max-h-[70vh] object-contain" />
                            </div>

                            <!-- Caption -->
                            <div class="p-6 bg-white">
                                <p class="text-neutral-900 font-medium mb-2">
                                    {{ selectedAlbum.photos[currentPhotoIndex].caption || selectedAlbum.title }}
                                </p>
                                <div class="flex items-center justify-between text-sm text-neutral-500">
                                    <span>Foto {{ currentPhotoIndex + 1 }} dari {{ selectedAlbum.photos.length }}</span>
                                    <span>{{ formatDate(selectedAlbum.created_at) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
/* Modal transition */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}
</style>
