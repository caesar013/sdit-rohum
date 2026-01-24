<script setup>
import { ref, computed } from 'vue'
import {
    MagnifyingGlassIcon,
    PhotoIcon,
    XMarkIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CalendarIcon
} from '@heroicons/vue/24/outline'

// Modal state
const showModal = ref(false)
const selectedAlbum = ref(null)
const currentPhotoIndex = ref(0)

// Search
const searchQuery = ref('')

// Sample photo albums - will be fetched from backend
const allAlbums = ref([
    {
        id: 1,
        title: 'Outing Class 2025',
        date: '28 Oktober 2025',
        photoCount: 8,
        coverImage: '/placeholder-album-1.jpg',
        photos: [
            { id: 1, url: '/placeholder-photo-1.jpg', caption: 'Kunjungan ke Museum' },
            { id: 2, url: '/placeholder-photo-2.jpg', caption: 'Foto bersama' },
            { id: 3, url: '/placeholder-photo-3.jpg', caption: 'Di Taman Pintar' },
            { id: 4, url: '/placeholder-photo-4.jpg', caption: 'Belajar sains' },
            { id: 5, url: '/placeholder-photo-5.jpg', caption: 'Naik kereta' },
            { id: 6, url: '/placeholder-photo-6.jpg', caption: 'Makan siang' },
            { id: 7, url: '/placeholder-photo-7.jpg', caption: 'Bermain bersama' },
            { id: 8, url: '/placeholder-photo-8.jpg', caption: 'Pulang ke sekolah' }
        ]
    },
    {
        id: 2,
        title: 'Arsip Migrasi',
        description: 'Beberapa dokumentasi foto yang diamankan dari website lama SD Negeri Kedungrejo Pengasih',
        date: '19 Juni 2025',
        photoCount: 25,
        coverImage: '/placeholder-album-2.jpg',
        photos: Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            url: `/placeholder-photo-${i + 1}.jpg`,
            caption: `Arsip Foto setelah migrasi website sdn kedungrejo pengasih - Foto ${i + 1} dari 25`
        }))
    }
])

// Filtered albums based on search
const filteredAlbums = computed(() => {
    if (!searchQuery.value) return allAlbums.value

    const query = searchQuery.value.toLowerCase()
    return allAlbums.value.filter(album =>
        album.title.toLowerCase().includes(query)
    )
})

// Functions
const handleSearch = () => {
    // TODO: Implement search functionality with backend API
}

const openAlbum = (album) => {
    selectedAlbum.value = album
    currentPhotoIndex.value = 0
    showModal.value = true
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

                <!-- No Results -->
                <div v-if="filteredAlbums.length === 0" class="text-center py-12">
                    <div class="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                        <PhotoIcon class="w-16 h-16 mx-auto text-neutral-300 mb-4" />
                        <h3 class="text-xl font-bold text-neutral-900 mb-2">Tidak ada album</h3>
                        <p class="text-neutral-600">
                            Tidak ditemukan album dengan pencarian "{{ searchQuery }}"
                        </p>
                    </div>
                </div>

                <!-- Albums Grid -->
                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="album in filteredAlbums" :key="album.id"
                        class="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer">
                        <!-- Album Cover with Overlay -->
                        <div class="relative overflow-hidden aspect-video">
                            <img :src="album.coverImage" :alt="album.title" @error="handleImageError"
                                class="w-full h-full object-cover" />

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
                                <span>{{ album.date }}</span>
                            </div>
                            <div class="flex items-center gap-2 text-sm text-blue-600 font-semibold">
                                <PhotoIcon class="w-4 h-4" />
                                <span>{{ album.photoCount }} Foto</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Pagination -->
                <div class="mt-12 flex justify-center">
                    <div class="inline-flex items-center gap-2">
                        <button class="w-10 h-10 bg-blue-600 text-white rounded-lg font-semibold cursor-pointer">
                            1
                        </button>
                    </div>
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
                                <img :src="selectedAlbum.photos[currentPhotoIndex].url"
                                    :alt="selectedAlbum.photos[currentPhotoIndex].caption" @error="handleImageError"
                                    class="w-full h-auto max-h-[70vh] object-contain" />
                            </div>

                            <!-- Caption -->
                            <div class="p-6 bg-white">
                                <p class="text-neutral-900 font-medium mb-2">
                                    {{ selectedAlbum.photos[currentPhotoIndex].caption }}
                                </p>
                                <div class="flex items-center justify-between text-sm text-neutral-500">
                                    <span>Foto {{ currentPhotoIndex + 1 }} dari {{ selectedAlbum.photos.length }}</span>
                                    <span>{{ selectedAlbum.date }}</span>
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
