<script setup>
import { ref, computed } from 'vue'
import {
    MagnifyingGlassIcon,
    PlayCircleIcon,
    VideoCameraIcon,
    CalendarIcon
} from '@heroicons/vue/24/outline'

// Search
const searchQuery = ref('')

// Sample videos - will be fetched from backend
const allVideos = ref([
    {
        id: 1,
        title: 'SENAM ANAK INDONESIA HEBAT SD NEGERI KEDUNGREJO',
        date: '14 Juni 2025',
        thumbnail: '/placeholder-video-1.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=xxxxx'
    },
    {
        id: 2,
        title: 'Pengenalan Lingkungan Sekolah',
        date: '14 Juni 2025',
        thumbnail: '/placeholder-video-2.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=xxxxx'
    },
    {
        id: 3,
        title: 'Ekstrakurikuler Karawitan SD Negeri Kedungrejo Kapanewon Pengasih',
        date: '14 Juni 2025',
        thumbnail: '/placeholder-video-3.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=xxxxx'
    },
    {
        id: 4,
        title: 'Kegiatan Belajar Mengajar',
        date: '10 Juni 2025',
        thumbnail: '/placeholder-video-4.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=xxxxx'
    },
    {
        id: 5,
        title: 'School Strategic Discussion (SSD)',
        date: '8 Juni 2025',
        thumbnail: '/placeholder-video-5.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=xxxxx'
    },
    {
        id: 6,
        title: 'Kegiatan Literasi Digital',
        date: '5 Juni 2025',
        thumbnail: '/placeholder-video-6.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=xxxxx'
    }
])

// Filtered videos based on search
const filteredVideos = computed(() => {
    if (!searchQuery.value) return allVideos.value

    const query = searchQuery.value.toLowerCase()
    return allVideos.value.filter(video =>
        video.title.toLowerCase().includes(query)
    )
})

// Functions
const handleSearch = () => {
    // TODO: Implement search functionality with backend API
}

const handleVideoClick = (video) => {
    // TODO: Implement video click action (to be decided)
    console.log('Video clicked:', video)
}

const handleImageError = (event) => {
    event.target.src = 'https://via.placeholder.com/640x360/0d5f5f/ffffff?text=Video+Kegiatan'
}
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
                    <div class="flex gap-4">
                        <div class="grow">
                            <div class="relative">
                                <MagnifyingGlassIcon
                                    class="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                <input v-model="searchQuery" @input="handleSearch" type="text"
                                    placeholder="Cari di sini..."
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

        <!-- Videos Grid -->
        <section class="py-12 px-4">
            <div class="max-w-7xl mx-auto">

                <!-- No Results -->
                <div v-if="filteredVideos.length === 0" class="text-center py-12">
                    <div class="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                        <VideoCameraIcon class="w-16 h-16 mx-auto text-neutral-300 mb-4" />
                        <h3 class="text-xl font-bold text-neutral-900 mb-2">Tidak ada video</h3>
                        <p class="text-neutral-600">
                            Tidak ditemukan video dengan pencarian "{{ searchQuery }}"
                        </p>
                    </div>
                </div>

                <!-- Videos Grid -->
                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="video in filteredVideos" :key="video.id" @click="handleVideoClick(video)"
                        class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
                        <!-- Video Thumbnail -->
                        <div class="relative overflow-hidden aspect-video bg-black">
                            <img :src="video.thumbnail" :alt="video.title" @error="handleImageError"
                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />

                            <!-- Play Button Overlay -->
                            <div
                                class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                                <div
                                    class="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <PlayCircleIcon class="w-16 h-16 text-primary" />
                                </div>
                            </div>
                        </div>

                        <!-- Video Info -->
                        <div class="p-6">
                            <h3
                                class="text-lg font-bold text-neutral-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                {{ video.title }}
                            </h3>

                            <div class="flex items-center gap-2 text-sm text-neutral-500">
                                <CalendarIcon class="w-4 h-4" />
                                <span>{{ video.date }}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    </div>
</template>
