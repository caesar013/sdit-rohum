<script setup>
import { ref, onMounted } from 'vue'
import {
    PlusIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    TrashIcon,
    XMarkIcon,
    PhotoIcon,
    CalendarIcon,
    ArrowsUpDownIcon
} from '@heroicons/vue/24/outline'
import {
    createAlbum,
    updateAlbum,
    deleteAlbum,
    getAlbumById,
    addPhotoToAlbum,
    updatePhoto,
    deletePhoto,
    reorderPhotos
} from '@/services/adminApi'
import { getGalleryAlbums } from '@/services/api'

// State
const albums = ref([])
const isLoading = ref(false)
const showModal = ref(false)
const showPhotoModal = ref(false)
const showReorderModal = ref(false)
const isEditMode = ref(false)
const currentAlbum = ref(null)
const currentPhoto = ref(null)

// Filters & Search
const searchQuery = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalPages = ref(1)
const totalItems = ref(0)

// Album Form data
const albumFormData = ref({
    title: '',
    description: '',
    album_date: '',
    cover_photo: null
})

const coverPreview = ref(null)

// Photo Form data
const photoFormData = ref({
    photo: null,
    caption: '',
    display_order: 1
})

const photoPreview = ref(null)

// Current album photos for management
const albumPhotos = ref([])
const isLoadingPhotos = ref(false)

// Reorder state
const reorderItems = ref([])

// Helper function for date formatting
const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
}

const formatDateForInput = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

// Fetch albums
const fetchAlbums = async () => {
    isLoading.value = true
    try {
        const params = {
            page: currentPage.value,
            limit: itemsPerPage.value,
            search: searchQuery.value || undefined
        }

        const response = await getGalleryAlbums(params)

        if (response.success) {
            albums.value = response.data || []
            if (response.pagination) {
                totalPages.value = response.pagination.totalPages
                totalItems.value = response.pagination.total
            }
        }
    } catch (error) {
        console.error('Error fetching albums:', error)
        alert('Gagal memuat data album')
    } finally {
        isLoading.value = false
    }
}

// Fetch album details with photos
const fetchAlbumDetails = async (albumId) => {
    isLoadingPhotos.value = true
    try {
        const response = await getAlbumById(albumId)
        if (response.success) {
            albumPhotos.value = response.data.photos || []
        }
    } catch (error) {
        console.error('Error fetching album details:', error)
        alert('Gagal memuat foto album')
    } finally {
        isLoadingPhotos.value = false
    }
}

// Modal handlers for Albums
const openCreateModal = () => {
    isEditMode.value = false
    currentAlbum.value = null
    resetAlbumForm()
    showModal.value = true
}

const openEditModal = async (album) => {
    isEditMode.value = true
    currentAlbum.value = album
    albumFormData.value = {
        title: album.title || '',
        description: album.description || '',
        album_date: formatDateForInput(album.album_date) || '',
        cover_photo: null
    }
    coverPreview.value = album.cover_photo || null
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    resetAlbumForm()
}

const resetAlbumForm = () => {
    albumFormData.value = {
        title: '',
        description: '',
        album_date: '',
        cover_photo: null
    }
    coverPreview.value = null
}

// Handle cover photo change
const handleCoverChange = (event) => {
    const file = event.target.files[0]
    if (file) {
        albumFormData.value.cover_photo = file
        const reader = new FileReader()
        reader.onload = (e) => {
            coverPreview.value = e.target.result
        }
        reader.readAsDataURL(file)
    }
}

// Submit album form
const handleAlbumSubmit = async () => {
    // Validation
    if (!albumFormData.value.title || !albumFormData.value.album_date) {
        alert('Mohon lengkapi judul dan tanggal album')
        return
    }

    try {
        const data = new FormData()
        data.append('title', albumFormData.value.title)
        data.append('description', albumFormData.value.description || '')
        data.append('album_date', albumFormData.value.album_date)

        if (albumFormData.value.cover_photo) {
            data.append('cover_photo', albumFormData.value.cover_photo)
        }

        if (isEditMode.value) {
            await updateAlbum(currentAlbum.value.id, data)
            alert('Album berhasil diperbarui')
        } else {
            await createAlbum(data)
            alert('Album berhasil ditambahkan')
        }

        closeModal()
        fetchAlbums()
    } catch (error) {
        console.error('Error saving album:', error)
        alert(error.message || 'Gagal menyimpan album')
    }
}

// Delete album
const handleDeleteAlbum = async (album) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus album "${album.title}" dan semua fotonya?`)) {
        return
    }

    try {
        await deleteAlbum(album.id)
        alert('Album berhasil dihapus')
        fetchAlbums()
    } catch (error) {
        console.error('Error deleting album:', error)
        alert('Gagal menghapus album')
    }
}

// Photo management
const openPhotoManagement = async (album) => {
    currentAlbum.value = album
    await fetchAlbumDetails(album.id)
    showPhotoModal.value = true
}

const closePhotoModal = () => {
    showPhotoModal.value = false
    currentAlbum.value = null
    albumPhotos.value = []
    resetPhotoForm()
}

const resetPhotoForm = () => {
    photoFormData.value = {
        photo: null,
        caption: '',
        display_order: albumPhotos.value.length + 1
    }
    photoPreview.value = null
    currentPhoto.value = null
}

const handlePhotoChange = (event) => {
    const file = event.target.files[0]
    if (file) {
        photoFormData.value.photo = file
        const reader = new FileReader()
        reader.onload = (e) => {
            photoPreview.value = e.target.result
        }
        reader.readAsDataURL(file)
    }
}

const handleAddPhoto = async () => {
    if (!photoFormData.value.photo) {
        alert('Mohon pilih foto')
        return
    }

    try {
        const data = new FormData()
        data.append('photo', photoFormData.value.photo)
        data.append('caption', photoFormData.value.caption || '')
        data.append('display_order', photoFormData.value.display_order.toString())

        await addPhotoToAlbum(currentAlbum.value.id, data)
        alert('Foto berhasil ditambahkan')
        resetPhotoForm()
        await fetchAlbumDetails(currentAlbum.value.id)
    } catch (error) {
        console.error('Error adding photo:', error)
        alert(error.message || 'Gagal menambahkan foto')
    }
}

const handleDeletePhoto = async (photo) => {
    if (!confirm('Apakah Anda yakin ingin menghapus foto ini?')) {
        return
    }

    try {
        await deletePhoto(photo.id)
        alert('Foto berhasil dihapus')
        await fetchAlbumDetails(currentAlbum.value.id)
    } catch (error) {
        console.error('Error deleting photo:', error)
        alert('Gagal menghapus foto')
    }
}

// Reorder functionality
const openReorderModal = () => {
    reorderItems.value = albumPhotos.value.map(photo => ({
        id: photo.id,
        photo_url: photo.photo_url,
        caption: photo.caption,
        display_order: photo.display_order
    })).sort((a, b) => a.display_order - b.display_order)
    showReorderModal.value = true
}

const closeReorderModal = () => {
    showReorderModal.value = false
    reorderItems.value = []
}

const moveUp = (index) => {
    if (index > 0) {
        const temp = reorderItems.value[index]
        reorderItems.value[index] = reorderItems.value[index - 1]
        reorderItems.value[index - 1] = temp
        updateDisplayOrders()
    }
}

const moveDown = (index) => {
    if (index < reorderItems.value.length - 1) {
        const temp = reorderItems.value[index]
        reorderItems.value[index] = reorderItems.value[index + 1]
        reorderItems.value[index + 1] = temp
        updateDisplayOrders()
    }
}

const updateDisplayOrders = () => {
    reorderItems.value.forEach((item, index) => {
        item.display_order = index + 1
    })
}

const saveReorder = async () => {
    try {
        const photos = reorderItems.value.map(item => ({
            id: item.id,
            display_order: item.display_order
        }))

        await reorderPhotos(currentAlbum.value.id, { photos })
        alert('Urutan foto berhasil disimpan')
        closeReorderModal()
        await fetchAlbumDetails(currentAlbum.value.id)
    } catch (error) {
        console.error('Error reordering photos:', error)
        alert('Gagal menyimpan urutan foto')
    }
}

// Pagination
const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        fetchAlbums()
    }
}

onMounted(() => {
    fetchAlbums()
})
</script>

<template>
    <div class="p-6">
        <!-- Header -->
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-800 mb-2">Manajemen Album Foto</h1>
            <p class="text-gray-600">Kelola album dan foto kegiatan sekolah</p>
        </div>

        <!-- Actions Bar -->
        <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
                <!-- Search -->
                <div class="flex-1 w-full md:max-w-md">
                    <div class="relative">
                        <MagnifyingGlassIcon class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input v-model="searchQuery" @keyup.enter="fetchAlbums" type="text" placeholder="Cari album..."
                            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
                    </div>
                </div>

                <!-- Add Button -->
                <button @click="openCreateModal"
                    class="w-full md:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center justify-center gap-2">
                    <PlusIcon class="w-5 h-5" />
                    Tambah Album
                </button>
            </div>

            <!-- Results Info -->
            <div class="text-sm text-gray-600 mt-4">
                Menampilkan {{ albums.length }} dari {{ totalItems }} album
            </div>
        </div>

        <!-- Albums Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Loading State -->
            <div v-if="isLoading" class="col-span-full text-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p class="text-gray-600">Memuat data...</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="albums.length === 0" class="col-span-full text-center py-12">
                <PhotoIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p class="text-gray-600">Tidak ada album</p>
            </div>

            <!-- Album Cards -->
            <div v-else v-for="album in albums" :key="album.id"
                class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <!-- Cover Photo -->
                <div class="aspect-video bg-gray-100 relative overflow-hidden">
                    <img v-if="album.cover_photo" :src="album.cover_photo" :alt="album.title"
                        class="w-full h-full object-cover" />
                    <div v-else
                        class="w-full h-full flex items-center justify-center bg-linear-to-br from-primary to-primary-dark">
                        <PhotoIcon class="w-20 h-20 text-white opacity-50" />
                    </div>
                    <!-- Photo Count Badge -->
                    <div class="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                        {{ album.photo_count || 0 }} foto
                    </div>
                </div>

                <!-- Content -->
                <div class="p-4">
                    <h3 class="text-lg font-bold text-gray-900 mb-2">{{ album.title }}</h3>
                    <p v-if="album.description" class="text-gray-600 text-sm mb-3 line-clamp-2">
                        {{ album.description }}
                    </p>
                    <div class="flex items-center text-sm text-gray-500 mb-4">
                        <CalendarIcon class="w-4 h-4 mr-1" />
                        {{ formatDate(album.album_date) }}
                    </div>

                    <!-- Actions -->
                    <div class="flex gap-2">
                        <button @click="openPhotoManagement(album)"
                            class="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                            Kelola Foto
                        </button>
                        <button @click="openEditModal(album)"
                            class="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">
                            <PencilIcon class="w-5 h-5 text-gray-600" />
                        </button>
                        <button @click="handleDeleteAlbum(album)"
                            class="px-3 py-2 border border-red-300 rounded hover:bg-red-50">
                            <TrashIcon class="w-5 h-5 text-red-600" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-6 flex items-center justify-center gap-2">
            <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
                class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
            </button>
            <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
                class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Next
            </button>
        </div>

        <!-- Album Modal -->
        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <!-- Modal Header -->
                <div class="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 class="text-xl font-bold text-gray-800">
                        {{ isEditMode ? 'Edit Album' : 'Tambah Album Baru' }}
                    </h2>
                    <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                        <XMarkIcon class="w-6 h-6" />
                    </button>
                </div>

                <!-- Modal Body -->
                <form @submit.prevent="handleAlbumSubmit" class="p-6 space-y-4">
                    <!-- Cover Photo Upload -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Foto Sampul
                        </label>
                        <div class="flex items-center gap-4">
                            <div class="w-32 h-24 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                                <img v-if="coverPreview" :src="coverPreview" alt="Preview"
                                    class="w-full h-full object-cover" />
                                <PhotoIcon v-else class="w-12 h-12 text-gray-400" />
                            </div>
                            <div>
                                <input type="file" @change="handleCoverChange" accept="image/*" class="hidden"
                                    id="cover-upload" />
                                <label for="cover-upload"
                                    class="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                    <PhotoIcon class="w-5 h-5" />
                                    Pilih Foto
                                </label>
                                <p class="text-xs text-gray-500 mt-1">JPG, PNG (Max 5MB)</p>
                            </div>
                        </div>
                    </div>

                    <!-- Title -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Judul Album <span class="text-red-500">*</span>
                        </label>
                        <input v-model="albumFormData.title" type="text" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Contoh: Perayaan HUT RI ke-79" />
                    </div>

                    <!-- Date -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Tanggal Album <span class="text-red-500">*</span>
                        </label>
                        <input v-model="albumFormData.album_date" type="date" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
                    </div>

                    <!-- Description -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Deskripsi
                        </label>
                        <textarea v-model="albumFormData.description" rows="3"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Deskripsi album..."></textarea>
                    </div>

                    <!-- Form Actions -->
                    <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button type="button" @click="closeModal"
                            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            Batal
                        </button>
                        <button type="submit" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
                            {{ isEditMode ? 'Simpan Perubahan' : 'Tambah Album' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Photo Management Modal -->
        <div v-if="showPhotoModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <!-- Modal Header -->
                <div class="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 class="text-xl font-bold text-gray-800">Kelola Foto Album</h2>
                        <p class="text-sm text-gray-600 mt-1">{{ currentAlbum?.title }}</p>
                    </div>
                    <button @click="closePhotoModal" class="text-gray-400 hover:text-gray-600">
                        <XMarkIcon class="w-6 h-6" />
                    </button>
                </div>

                <!-- Modal Body -->
                <div class="p-6">
                    <!-- Add Photo Form -->
                    <div class="bg-gray-50 rounded-lg p-4 mb-6">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4">Tambah Foto Baru</h3>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div class="md:col-span-2">
                                <!-- Photo Upload -->
                                <div class="flex items-start gap-4 mb-4">
                                    <div
                                        class="w-32 h-24 rounded bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                                        <img v-if="photoPreview" :src="photoPreview" alt="Preview"
                                            class="w-full h-full object-cover" />
                                        <PhotoIcon v-else class="w-12 h-12 text-gray-400" />
                                    </div>
                                    <div class="flex-1">
                                        <input type="file" @change="handlePhotoChange" accept="image/*" class="hidden"
                                            id="photo-upload" />
                                        <label for="photo-upload"
                                            class="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                            <PhotoIcon class="w-5 h-5" />
                                            Pilih Foto
                                        </label>
                                        <p class="text-xs text-gray-500 mt-1">JPG, PNG (Max 5MB)</p>
                                        <!-- Caption -->
                                        <input v-model="photoFormData.caption" type="text"
                                            class="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="Caption foto (opsional)" />
                                    </div>
                                </div>
                            </div>
                            <div class="flex items-end">
                                <button @click="handleAddPhoto"
                                    class="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
                                    Tambah Foto
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Photos List -->
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-800">
                            Daftar Foto ({{ albumPhotos.length }})
                        </h3>
                        <button v-if="albumPhotos.length > 1" @click="openReorderModal"
                            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                            <ArrowsUpDownIcon class="w-5 h-5" />
                            Atur Urutan
                        </button>
                    </div>

                    <!-- Loading Photos -->
                    <div v-if="isLoadingPhotos" class="text-center py-12">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p class="text-gray-600">Memuat foto...</p>
                    </div>

                    <!-- Empty Photos -->
                    <div v-else-if="albumPhotos.length === 0" class="text-center py-12 bg-gray-50 rounded-lg">
                        <PhotoIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p class="text-gray-600">Belum ada foto dalam album ini</p>
                    </div>

                    <!-- Photos Grid -->
                    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <div v-for="photo in albumPhotos" :key="photo.id"
                            class="bg-white rounded-lg border border-gray-200 overflow-hidden group relative">
                            <div class="aspect-square bg-gray-100">
                                <img :src="photo.photo_url" :alt="photo.caption" class="w-full h-full object-cover" />
                            </div>
                            <div v-if="photo.caption" class="p-2">
                                <p class="text-xs text-gray-600 line-clamp-2">{{ photo.caption }}</p>
                            </div>
                            <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button @click="handleDeletePhoto(photo)"
                                    class="bg-red-600 text-white p-2 rounded hover:bg-red-700">
                                    <TrashIcon class="w-4 h-4" />
                                </button>
                            </div>
                            <div
                                class="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                                #{{ photo.display_order }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Reorder Modal -->
        <div v-if="showReorderModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <!-- Modal Header -->
                <div class="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 class="text-xl font-bold text-gray-800">Atur Urutan Foto</h2>
                    <button @click="closeReorderModal" class="text-gray-400 hover:text-gray-600">
                        <XMarkIcon class="w-6 h-6" />
                    </button>
                </div>

                <!-- Modal Body -->
                <div class="p-6">
                    <div class="space-y-2">
                        <div v-for="(item, index) in reorderItems" :key="item.id"
                            class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div class="flex flex-col gap-1">
                                <button @click="moveUp(index)" :disabled="index === 0"
                                    class="p-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                                    ↑
                                </button>
                                <button @click="moveDown(index)" :disabled="index === reorderItems.length - 1"
                                    class="p-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                                    ↓
                                </button>
                            </div>
                            <div class="w-16 h-16 bg-gray-100 rounded overflow-hidden shrink-0">
                                <img :src="item.photo_url" :alt="item.caption" class="w-full h-full object-cover" />
                            </div>
                            <div class="flex-1">
                                <p class="font-medium text-gray-800">Urutan: {{ item.display_order }}</p>
                                <p class="text-sm text-gray-600">{{ item.caption || 'Tanpa caption' }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Form Actions -->
                    <div class="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-200">
                        <button @click="closeReorderModal"
                            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            Batal
                        </button>
                        <button @click="saveReorder"
                            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
                            Simpan Urutan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
