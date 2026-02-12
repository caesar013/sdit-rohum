<script setup>
import { ref, onMounted, computed } from 'vue'
import {
    PlusIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    TrashIcon,
    XMarkIcon,
    VideoCameraIcon,
    PlayCircleIcon,
    ClockIcon
} from '@heroicons/vue/24/outline'
import { createVideo, updateVideo, deleteVideo } from '@/services/adminApi'
import { getVideos, getVideoPlatforms } from '@/services/api'

// State
const videos = ref([])
const isLoading = ref(false)
const showModal = ref(false)
const isEditMode = ref(false)
const currentVideo = ref(null)

// Filters & Search
const searchQuery = ref('')
const selectedPlatform = ref('all')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalPages = ref(1)
const totalItems = ref(0)

// Platform options
const platformOptions = ref([])

// Form data
const formData = ref({
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: '',
    platform: '',
    duration: ''
})

// Fetch platforms
const fetchPlatforms = async () => {
    try {
        const response = await getVideoPlatforms()
        if (response.success) {
            platformOptions.value = [
                { value: 'all', label: 'Semua Platform' },
                ...response.data
            ]
            // Set default platform for form if not set
            if (!formData.value.platform && response.data.length > 0) {
                formData.value.platform = response.data[0].value
            }
        }
    } catch (error) {
        console.error('Error fetching platforms:', error)
    }
}

// Fetch videos
const fetchVideos = async () => {
    isLoading.value = true
    try {
        const params = {
            page: currentPage.value,
            limit: itemsPerPage.value,
            search: searchQuery.value || undefined,
            platform: selectedPlatform.value !== 'all' ? selectedPlatform.value : undefined
        }

        const response = await getVideos(params)

        if (response.success) {
            videos.value = response.data || []
            if (response.pagination) {
                totalPages.value = response.pagination.totalPages
                totalItems.value = response.pagination.total
            }
        }
    } catch (error) {
        console.error('Error fetching videos:', error)
        alert('Gagal memuat data video')
    } finally {
        isLoading.value = false
    }
}

// Modal handlers
const openCreateModal = () => {
    isEditMode.value = false
    currentVideo.value = null
    resetForm()
    showModal.value = true
}

const openEditModal = (video) => {
    isEditMode.value = true
    currentVideo.value = video
    const defaultPlatform = platformOptions.value.find(opt => opt.value !== 'all')?.value || ''
    formData.value = {
        title: video.title || '',
        description: video.description || '',
        video_url: video.url || video.video_url || '',
        thumbnail_url: video.thumbnail_url || '',
        platform: video.platform || defaultPlatform,
        duration: video.duration || ''
    }
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    resetForm()
}

const resetForm = () => {
    const defaultPlatform = platformOptions.value.find(opt => opt.value !== 'all')?.value || ''
    formData.value = {
        title: '',
        description: '',
        video_url: '',
        thumbnail_url: '',
        platform: defaultPlatform,
        duration: ''
    }
}

// Submit form
const handleSubmit = async () => {
    // Validation
    if (!formData.value.title || !formData.value.video_url || !formData.value.platform) {
        alert('Mohon lengkapi judul, URL video, dan platform')
        return
    }

    try {
        const data = {
            title: formData.value.title,
            description: formData.value.description || '',
            video_url: formData.value.video_url,
            thumbnail_url: formData.value.thumbnail_url || '',
            platform: formData.value.platform,
            duration: formData.value.duration || ''
        }

        if (isEditMode.value) {
            await updateVideo(currentVideo.value.id, data)
            alert('Video berhasil diperbarui')
        } else {
            await createVideo(data)
            alert('Video berhasil ditambahkan')
        }

        closeModal()
        fetchVideos()
    } catch (error) {
        console.error('Error saving video:', error)
        alert(error.message || 'Gagal menyimpan video')
    }
}

// Delete video
const handleDelete = async (video) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus "${video.title}"?`)) {
        return
    }

    try {
        await deleteVideo(video.id)
        alert('Video berhasil dihapus')
        fetchVideos()
    } catch (error) {
        console.error('Error deleting video:', error)
        alert('Gagal menghapus video')
    }
}

// Platform label
const getPlatformLabel = (platform) => {
    const option = platformOptions.value.find(opt => opt.value === platform)
    return option ? option.label : platform
}

// Platform badge color
const getPlatformColor = (platform) => {
    const lowerPlatform = platform?.toLowerCase()
    switch (lowerPlatform) {
        case 'youtube':
            return 'bg-red-100 text-red-800'
        case 'vimeo':
            return 'bg-blue-100 text-blue-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}

// Open video in new tab
const openVideo = (video) => {
    const url = video.url || video.video_url
    if (url) {
        window.open(url, '_blank')
    }
}

// Pagination
const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        fetchVideos()
    }
}

// Format duration (handles both seconds and HH:MM:SS format)
const formatDuration = (duration) => {
    if (!duration) return '-'
    // If it's already in HH:MM:SS or MM:SS format, return as is
    if (typeof duration === 'string' && duration.includes(':')) {
        return duration
    }
    // Otherwise treat as seconds
    const seconds = parseInt(duration)
    if (isNaN(seconds)) return duration

    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`
}

onMounted(async () => {
    await fetchPlatforms()
    fetchVideos()
})
</script>

<template>
    <div class="p-6">
        <!-- Header -->
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-800 mb-2">Manajemen Video</h1>
            <p class="text-gray-600">Kelola video kegiatan dan profil sekolah</p>
        </div>

        <!-- Actions Bar -->
        <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div class="flex flex-col md:flex-row gap-4 items-stretch">
                <!-- Search -->
                <div class="flex-1">
                    <div class="relative">
                        <MagnifyingGlassIcon class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input v-model="searchQuery" @keyup.enter="fetchVideos" type="text" placeholder="Cari video..."
                            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
                    </div>
                </div>

                <!-- Platform Filter -->
                <select v-model="selectedPlatform" @change="fetchVideos"
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option v-for="option in platformOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                    </option>
                </select>

                <!-- Add Button -->
                <button @click="openCreateModal"
                    class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center justify-center gap-2">
                    <PlusIcon class="w-5 h-5" />
                    Tambah Video
                </button>
            </div>

            <!-- Results Info -->
            <div class="text-sm text-gray-600 mt-4">
                Menampilkan {{ videos.length }} dari {{ totalItems }} video
            </div>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thumbnail
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Judul Video
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Platform
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Durasi
                            </th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-if="isLoading">
                            <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                                Memuat data...
                            </td>
                        </tr>
                        <tr v-else-if="videos.length === 0">
                            <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                                Tidak ada data video
                            </td>
                        </tr>
                        <tr v-else v-for="video in videos" :key="video.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="w-24 h-16 rounded bg-gray-100 flex items-center justify-center overflow-hidden relative group cursor-pointer"
                                    @click="openVideo(video)">
                                    <img v-if="video.thumbnail_url" :src="video.thumbnail_url" :alt="video.title"
                                        class="w-full h-full object-cover" />
                                    <VideoCameraIcon v-else class="w-8 h-8 text-gray-400" />
                                    <div
                                        class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <PlayCircleIcon class="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm font-medium text-gray-900">{{ video.title }}</div>
                                <div v-if="video.description" class="text-sm text-gray-500 line-clamp-1 max-w-md">
                                    {{ video.description }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getPlatformColor(video.platform)"
                                    class="px-2 py-1 text-xs font-semibold rounded-full">
                                    {{ getPlatformLabel(video.platform) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div class="flex items-center gap-1">
                                    <ClockIcon class="w-4 h-4 text-gray-400" />
                                    {{ formatDuration(video.duration) }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button @click="openEditModal(video)" class="text-primary hover:text-primary-dark mr-3"
                                    title="Edit">
                                    <PencilIcon class="w-5 h-5" />
                                </button>
                                <button @click="handleDelete(video)" class="text-red-600 hover:text-red-900"
                                    title="Hapus">
                                    <TrashIcon class="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-700">
                        Halaman {{ currentPage }} dari {{ totalPages }}
                    </div>
                    <div class="flex gap-2">
                        <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
                            class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                            Previous
                        </button>
                        <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
                            class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <!-- Modal Header -->
                <div class="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 class="text-xl font-bold text-gray-800">
                        {{ isEditMode ? 'Edit Video' : 'Tambah Video Baru' }}
                    </h2>
                    <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                        <XMarkIcon class="w-6 h-6" />
                    </button>
                </div>

                <!-- Modal Body -->
                <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
                    <!-- Title -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Judul Video <span class="text-red-500">*</span>
                        </label>
                        <input v-model="formData.title" type="text" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Contoh: Profil Sekolah 2024" />
                    </div>

                    <!-- Platform & Duration -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Platform <span class="text-red-500">*</span>
                            </label>
                            <select v-model="formData.platform" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                                <option value="">Pilih Platform</option>
                                <option v-for="option in platformOptions.filter(o => o.value !== 'all')"
                                    :key="option.value" :value="option.value">
                                    {{ option.label }}
                                </option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Durasi
                            </label>
                            <input v-model="formData.duration" type="text"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Contoh: 5:30 atau 330" />
                            <p class="text-xs text-gray-500 mt-1">Format: MM:SS atau detik (contoh: 5:30 atau 330)</p>
                        </div>
                    </div>

                    <!-- Video URL -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            URL Video <span class="text-red-500">*</span>
                        </label>
                        <input v-model="formData.video_url" type="url" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="https://youtube.com/watch?v=..." />
                    </div>

                    <!-- Thumbnail URL -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            URL Thumbnail
                        </label>
                        <input v-model="formData.thumbnail_url" type="url"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="https://example.com/thumbnail.jpg" />
                        <p class="text-xs text-gray-500 mt-1">Opsional - akan diambil otomatis dari YouTube jika kosong
                        </p>
                    </div>

                    <!-- Description -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Deskripsi
                        </label>
                        <textarea v-model="formData.description" rows="4"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Deskripsi video..."></textarea>
                    </div>

                    <!-- Form Actions -->
                    <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button type="button" @click="closeModal"
                            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            Batal
                        </button>
                        <button type="submit" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
                            {{ isEditMode ? 'Simpan Perubahan' : 'Tambah Video' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
