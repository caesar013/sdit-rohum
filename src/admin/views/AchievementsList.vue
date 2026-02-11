<script setup>
import { ref, onMounted } from 'vue'
import {
    PlusIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    TrashIcon,
    XMarkIcon,
    PhotoIcon,
    TrophyIcon
} from '@heroicons/vue/24/outline'
import {
    createAchievement,
    updateAchievement,
    deleteAchievement,
    getAchievementCategoryStats,
    getAchievementLevelStats
} from '@/services/adminApi'
import { getAchievements, getAchievementCategories, getAchievementLevels } from '@/services/api'

// State
const achievements = ref([])
const isLoading = ref(false)
const showModal = ref(false)
const isEditMode = ref(false)
const currentAchievement = ref(null)

// Filters & Search
const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedLevel = ref('all')
const selectedYear = ref('all')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalPages = ref(1)
const totalItems = ref(0)

// Options
const categoryOptions = ref([
    { value: 'all', label: 'Semua Kategori' }
])

const levelOptions = ref([
    { value: 'all', label: 'Semua Tingkat' }
])

const achievementYearOptions = ref([
    { value: 'all', label: 'Semua Tahun' }
])

// Stats
const categoryStats = ref({})
const levelStats = ref({})

// Form data
const formData = ref({
    title: '',
    description: '',
    category: '',
    level: '',
    achievement_year: new Date().getFullYear(),
    certification_image: null
})

const certificatePreview = ref(null)

// Helper function for date formatting
const formatDateForInput = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

// Fetch achievements
const fetchAchievements = async () => {
    isLoading.value = true
    try {
        const params = {
            page: currentPage.value,
            limit: itemsPerPage.value,
            search: searchQuery.value || undefined,
            category: selectedCategory.value !== 'all' ? selectedCategory.value : undefined,
            level: selectedLevel.value !== 'all' ? selectedLevel.value : undefined,
            year: selectedYear.value !== 'all' ? selectedYear.value : undefined
        }

        const response = await getAchievements(params)

        if (response.success) {
            achievements.value = response.data || []
            if (response.pagination) {
                totalPages.value = response.pagination.totalPages
                totalItems.value = response.pagination.total
            }

            // Extract unique years for filter
            const years = [...new Set(achievements.value.map(a => a.achievement_year))].sort((a, b) => b - a)
            achievementYearOptions.value = [
                { value: 'all', label: 'Semua Tahun' },
                ...years.map(achievement_year => ({ value: achievement_year, label: achievement_year.toString() }))
            ]
        }
    } catch (error) {
        console.error('Error fetching achievements:', error)
        alert('Gagal memuat data prestasi')
    } finally {
        isLoading.value = false
    }
}

// Fetch categories
const fetchCategories = async () => {
    try {
        const response = await getAchievementCategories()
        if (response.success && response.data) {
            const options = response.data.map(cat => ({
                value: cat.value,
                label: cat.label
            }))
            categoryOptions.value = [
                { value: 'all', label: 'Semua Kategori' },
                ...options
            ]
        }
    } catch (error) {
        console.error('Error fetching categories:', error)
    }
}

// Fetch levels
const fetchLevels = async () => {
    try {
        const response = await getAchievementLevels()
        if (response.success && response.data) {
            const options = response.data.map(lvl => ({
                value: lvl.value,
                label: lvl.label
            }))
            levelOptions.value = [
                { value: 'all', label: 'Semua Tingkat' },
                ...options
            ]
        }
    } catch (error) {
        console.error('Error fetching levels:', error)
    }
}

// Fetch stats
const fetchStats = async () => {
    try {
        const [categoryRes, levelRes] = await Promise.all([
            getAchievementCategoryStats(),
            getAchievementLevelStats()
        ])

        if (categoryRes.success) {
            categoryStats.value = categoryRes.data
        }
        if (levelRes.success) {
            levelStats.value = levelRes.data
        }
    } catch (error) {
        console.error('Error fetching stats:', error)
    }
}

// Modal handlers
const openCreateModal = () => {
    isEditMode.value = false
    currentAchievement.value = null
    resetForm()
    showModal.value = true
}

const openEditModal = (achievement) => {
    isEditMode.value = true
    currentAchievement.value = achievement
    formData.value = {
        title: achievement.title || '',
        description: achievement.description || '',
        category: achievement.category || '',
        level: achievement.level || '',
        achievement_year: achievement.achievement_year || new Date().getFullYear(),
        certification_image: null
    }
    certificatePreview.value = achievement.certification_image || null
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    resetForm()
}

const resetForm = () => {
    formData.value = {
        title: '',
        description: '',
        category: '',
        level: '',
        achievement_year: new Date().getFullYear(),
        certification_image: null
    }
    certificatePreview.value = null
}

// Handle certificate image change
const handleCertificateChange = (event) => {
    const file = event.target.files[0]
    if (file) {
        formData.value.certification_image = file
        const reader = new FileReader()
        reader.onload = (e) => {
            certificatePreview.value = e.target.result
        }
        reader.readAsDataURL(file)
    }
}

// Submit form
const handleSubmit = async () => {
    // Validation
    if (!formData.value.title || !formData.value.category || !formData.value.level) {
        alert('Mohon lengkapi semua field yang wajib diisi')
        return
    }

    try {
        const data = new FormData()
        data.append('title', formData.value.title)
        data.append('description', formData.value.description || '')
        data.append('category', formData.value.category)
        data.append('level', formData.value.level)
        data.append('achievement_year', formData.value.achievement_year.toString())

        if (formData.value.certification_image) {
            data.append('certification_image', formData.value.certification_image)
        }

        if (isEditMode.value) {
            await updateAchievement(currentAchievement.value.id, data)
            alert('Prestasi berhasil diperbarui')
        } else {
            await createAchievement(data)
            alert('Prestasi berhasil ditambahkan')
        }

        closeModal()
        fetchAchievements()
        fetchStats()
    } catch (error) {
        console.error('Error saving achievement:', error)
        alert(error.message || 'Gagal menyimpan data prestasi')
    }
}

// Delete achievement
const handleDelete = async (achievement) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus "${achievement.title}"?`)) {
        return
    }

    try {
        await deleteAchievement(achievement.id)
        alert('Prestasi berhasil dihapus')
        fetchAchievements()
        fetchStats()
    } catch (error) {
        console.error('Error deleting achievement:', error)
        alert('Gagal menghapus prestasi')
    }
}

// Pagination
const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        fetchAchievements()
    }
}

// Category badge color
const getCategoryColor = (category) => {
    switch (category) {
        case 'academic': return 'bg-blue-100 text-blue-800'
        case 'sport': return 'bg-green-100 text-green-800'
        case 'art': return 'bg-purple-100 text-purple-800'
        case 'other': return 'bg-gray-100 text-gray-800'
        default: return 'bg-gray-100 text-gray-800'
    }
}

// Level badge color
const getLevelColor = (level) => {
    switch (level) {
        case 'international': return 'bg-red-100 text-red-800'
        case 'national': return 'bg-orange-100 text-orange-800'
        case 'province': return 'bg-yellow-100 text-yellow-800'
        case 'city': return 'bg-green-100 text-green-800'
        case 'district': return 'bg-blue-100 text-blue-800'
        case 'school': return 'bg-gray-100 text-gray-800'
        default: return 'bg-gray-100 text-gray-800'
    }
}

// Get category label
const getCategoryLabel = (value) => {
    const category = categoryOptions.value.find(c => c.value === value)
    return category ? category.label : value
}

// Get level label
const getLevelLabel = (value) => {
    const level = levelOptions.value.find(l => l.value === value)
    return level ? level.label : value
}

// Initialize
onMounted(() => {
    fetchCategories()
    fetchLevels()
    fetchAchievements()
    fetchStats()
})
</script>

<template>
    <div class="p-6">
        <!-- Header & Actions -->
        <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h1 class="text-2xl font-bold text-gray-800 mb-2">Manajemen Prestasi</h1>
                    <p class="text-gray-600">Kelola data prestasi dan penghargaan sekolah</p>
                </div>
                <button @click="openCreateModal"
                    class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap">
                    <PlusIcon class="w-5 h-5" />
                    Tambah Prestasi
                </button>
            </div>

            <!-- Filters -->
            <div class="flex flex-col md:flex-row gap-4 mb-4">
                <!-- Search -->
                <div class="flex-1">
                    <div class="relative">
                        <MagnifyingGlassIcon class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input v-model="searchQuery" @keyup.enter="fetchAchievements" type="text"
                            placeholder="Cari prestasi..."
                            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
                    </div>
                </div>

                <!-- Category Filter -->
                <select v-model="selectedCategory" @change="fetchAchievements"
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option v-for="category in categoryOptions" :key="category.value" :value="category.value">
                        {{ category.label }}
                    </option>
                </select>

                <!-- Level Filter -->
                <select v-model="selectedLevel" @change="fetchAchievements"
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option v-for="level in levelOptions" :key="level.value" :value="level.value">
                        {{ level.label }}
                    </option>
                </select>

                <!-- Year Filter -->
                <select v-model="selectedYear" @change="fetchAchievements"
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option v-for="year in achievementYearOptions" :key="year.value" :value="year.value">
                        {{ year.label }}
                    </option>
                </select>
            </div>

            <!-- Results Info -->
            <div class="text-sm text-gray-600">
                Menampilkan {{ achievements.length }} dari {{ totalItems }} prestasi
            </div>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Sertifikat
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Judul Prestasi
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Kategori
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tingkat
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tahun
                            </th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-if="isLoading">
                            <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                                Memuat data...
                            </td>
                        </tr>
                        <tr v-else-if="achievements.length === 0">
                            <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                                Tidak ada data prestasi
                            </td>
                        </tr>
                        <tr v-else v-for="achievement in achievements" :key="achievement.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div
                                    class="w-16 h-12 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                                    <img v-if="achievement.certification_image" :src="achievement.certification_image"
                                        :alt="achievement.title" class="w-full h-full object-cover" />
                                    <TrophyIcon v-else class="w-6 h-6 text-gray-400" />
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm font-medium text-gray-900">{{ achievement.title }}</div>
                                <div v-if="achievement.description" class="text-sm text-gray-500 line-clamp-1">
                                    {{ achievement.description }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getCategoryColor(achievement.category)"
                                    class="px-2 py-1 text-xs font-semibold rounded-full">
                                    {{ getCategoryLabel(achievement.category) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getLevelColor(achievement.level)"
                                    class="px-2 py-1 text-xs font-semibold rounded-full">
                                    {{ getLevelLabel(achievement.level) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ achievement.achievement_year }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button @click="openEditModal(achievement)"
                                    class="text-primary hover:text-primary-dark mr-3" title="Edit">
                                    <PencilIcon class="w-5 h-5" />
                                </button>
                                <button @click="handleDelete(achievement)" class="text-red-600 hover:text-red-900"
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
                        {{ isEditMode ? 'Edit Prestasi' : 'Tambah Prestasi Baru' }}
                    </h2>
                    <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                        <XMarkIcon class="w-6 h-6" />
                    </button>
                </div>

                <!-- Modal Body -->
                <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
                    <!-- Certificate Image Upload -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Foto Sertifikat
                        </label>
                        <div class="flex items-center gap-4">
                            <div class="w-24 h-24 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                                <img v-if="certificatePreview" :src="certificatePreview" alt="Preview"
                                    class="w-full h-full object-cover" />
                                <TrophyIcon v-else class="w-12 h-12 text-gray-400" />
                            </div>
                            <div>
                                <input type="file" @change="handleCertificateChange" accept="image/*" class="hidden"
                                    id="certificate-upload" />
                                <label for="certificate-upload"
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
                            Judul Prestasi <span class="text-red-500">*</span>
                        </label>
                        <input v-model="formData.title" type="text" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Contoh: Juara 1 Olimpiade Matematika" />
                    </div>

                    <!-- Category & Level -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Kategori <span class="text-red-500">*</span>
                            </label>
                            <select v-model="formData.category" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                                <option value="">Pilih Kategori</option>
                                <option v-for="category in categoryOptions.filter(c => c.value !== 'all')"
                                    :key="category.value" :value="category.value">
                                    {{ category.label }}
                                </option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Tingkat <span class="text-red-500">*</span>
                            </label>
                            <select v-model="formData.level" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                                <option value="">Pilih Tingkat</option>
                                <option v-for="level in levelOptions.filter(l => l.value !== 'all')" :key="level.value"
                                    :value="level.value">
                                    {{ level.label }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <!-- Year -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Tahun Prestasi <span class="text-red-500">*</span>
                        </label>
                        <input v-model.number="formData.achievement_year" type="number" required min="1900" max="2100"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            :placeholder="new Date().getFullYear().toString()" />
                    </div>

                    <!-- Description -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Deskripsi
                        </label>
                        <textarea v-model="formData.description" rows="3"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Deskripsi prestasi..."></textarea>
                    </div>

                    <!-- Form Actions -->
                    <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button type="button" @click="closeModal"
                            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            Batal
                        </button>
                        <button type="submit" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
                            {{ isEditMode ? 'Simpan Perubahan' : 'Tambah Prestasi' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
