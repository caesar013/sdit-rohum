<script setup>
import { ref, onMounted } from 'vue'
import {
    PlusIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    TrashIcon,
    XMarkIcon,
    PhotoIcon,
    BuildingOfficeIcon
} from '@heroicons/vue/24/outline'
import {
    createFacility,
    updateFacility,
    deleteFacility,
    getFacilityCategoryStats,
    getFacilityConditionStats
} from '@/services/adminApi'
import { getFacilities, getFacilityCategories, getFacilityConditions } from '@/services/api'

// State
const facilities = ref([])
const isLoading = ref(false)
const showModal = ref(false)
const isEditMode = ref(false)
const currentFacility = ref(null)

// Filters & Search
const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedCondition = ref('all')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalPages = ref(1)
const totalItems = ref(0)

// Options
const categoryOptions = ref([
    { value: 'all', label: 'Semua Kategori' }
])

const conditionOptions = ref([
    { value: 'all', label: 'Semua Kondisi' }
])

// Stats
const categoryStats = ref({})
const conditionStats = ref({})

// Form data
const formData = ref({
    name: '',
    category: '',
    quantity: 1,
    condition_status: 'good',
    description: '',
    photo: null
})

const photoPreview = ref(null)

// Fetch facilities
const fetchFacilities = async () => {
    isLoading.value = true
    try {
        const params = {
            page: currentPage.value,
            limit: itemsPerPage.value,
            search: searchQuery.value || undefined,
            category: selectedCategory.value !== 'all' ? selectedCategory.value : undefined,
            condition_status: selectedCondition.value !== 'all' ? selectedCondition.value : undefined
        }

        const response = await getFacilities(params)

        if (response.success) {
            facilities.value = response.data || []
            if (response.pagination) {
                totalPages.value = response.pagination.totalPages
                totalItems.value = response.pagination.total
            }
        }
    } catch (error) {
        console.error('Error fetching facilities:', error)
        alert('Gagal memuat data sarana prasarana')
    } finally {
        isLoading.value = false
    }
}

// Fetch categories
const fetchCategories = async () => {
    try {
        const response = await getFacilityCategories()
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

// Fetch conditions
const fetchConditions = async () => {
    try {
        const response = await getFacilityConditions()
        if (response.success && response.data) {
            const options = response.data.map(cond => ({
                value: cond.value,
                label: cond.label
            }))
            console.log(options)

            conditionOptions.value = [
                { value: 'all', label: 'Semua Kondisi' },
                ...options
            ]
        }
    } catch (error) {
        console.error('Error fetching conditions:', error)
    }
}

// Fetch stats
const fetchStats = async () => {
    try {
        const [categoryRes, conditionRes] = await Promise.all([
            getFacilityCategoryStats(),
            getFacilityConditionStats()
        ])

        if (categoryRes.success) {
            categoryStats.value = categoryRes.data
        }
        if (conditionRes.success) {
            conditionStats.value = conditionRes.data
        }
    } catch (error) {
        console.error('Error fetching stats:', error)
    }
}

// Modal handlers
const openCreateModal = () => {
    isEditMode.value = false
    currentFacility.value = null
    resetForm()
    showModal.value = true
}

const openEditModal = (facility) => {
    isEditMode.value = true
    currentFacility.value = facility
    formData.value = {
        name: facility.name || '',
        category: facility.category || '',
        quantity: facility.quantity || 1,
        condition_status: facility.condition_status || 'good',
        description: facility.description || '',
        photo: null
    }
    photoPreview.value = facility.photo_url || null
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    resetForm()
}

const resetForm = () => {
    formData.value = {
        name: '',
        category: '',
        quantity: 1,
        condition_status: 'good',
        description: '',
        photo: null
    }
    photoPreview.value = null
}

// Handle photo change
const handlePhotoChange = (event) => {
    const file = event.target.files[0]
    if (file) {
        formData.value.photo = file
        const reader = new FileReader()
        reader.onload = (e) => {
            photoPreview.value = e.target.result
        }
        reader.readAsDataURL(file)
    }
}

// Submit form
const handleSubmit = async () => {
    // Validation
    if (!formData.value.name || !formData.value.category || !formData.value.quantity) {
        alert('Mohon lengkapi semua field yang wajib diisi')
        return
    }

    try {
        const data = new FormData()
        data.append('name', formData.value.name)
        data.append('category', formData.value.category)
        data.append('quantity', formData.value.quantity.toString())
        data.append('condition_status', formData.value.condition_status)
        data.append('description', formData.value.description || '')

        if (formData.value.photo) {
            data.append('photo', formData.value.photo)
        }

        if (isEditMode.value) {
            await updateFacility(currentFacility.value.id, data)
            alert('Sarana prasarana berhasil diperbarui')
        } else {
            await createFacility(data)
            alert('Sarana prasarana berhasil ditambahkan')
        }

        closeModal()
        fetchFacilities()
        fetchStats()
    } catch (error) {
        console.error('Error saving facility:', error)
        alert(error.message || 'Gagal menyimpan data sarana prasarana')
    }
}

// Delete facility
const handleDelete = async (facility) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus "${facility.name}"?`)) {
        return
    }

    try {
        await deleteFacility(facility.id)
        alert('Sarana prasarana berhasil dihapus')
        fetchFacilities()
        fetchStats()
    } catch (error) {
        console.error('Error deleting facility:', error)
        alert('Gagal menghapus sarana prasarana')
    }
}

// Pagination
const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        fetchFacilities()
    }
}

// Condition badge color
const getConditionColor = (condition) => {
    switch (condition) {
        case 'good': return 'bg-green-100 text-green-800'
        case 'fair': return 'bg-blue-100 text-blue-800'
        case 'poor': return 'bg-yellow-100 text-yellow-800'
        case 'needs_repair': return 'bg-yellow-100 text-yellow-800'
        case 'damaged': return 'bg-red-100 text-red-800'
        default: return 'bg-gray-100 text-gray-800'
    }
}

// Get category label
const getCategoryLabel = (value) => {
    const category = categoryOptions.value.find(c => c.value === value)
    return category ? category.label : value
}

// Get condition label
const getConditionLabel = (value) => {
    const condition = conditionOptions.value.find(c => c.value === value)
    return condition ? condition.label : value
}

// Initialize
onMounted(() => {
    fetchCategories()
    fetchConditions()
    fetchFacilities()
    fetchStats()
})
</script>

<template>
    <div class="p-6">
        <!-- Header & Actions -->
        <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h1 class="text-2xl font-bold text-gray-800 mb-2">Manajemen Sarana Prasarana</h1>
                    <p class="text-gray-600">Kelola data fasilitas dan infrastruktur sekolah</p>
                </div>
                <button @click="openCreateModal"
                    class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap">
                    <PlusIcon class="w-5 h-5" />
                    Tambah Fasilitas
                </button>
            </div>

            <!-- Filters -->
            <div class="flex flex-col md:flex-row gap-4 mb-4">
                <!-- Search -->
                <div class="flex-1">
                    <div class="relative">
                        <MagnifyingGlassIcon class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input v-model="searchQuery" @keyup.enter="fetchFacilities" type="text"
                            placeholder="Cari fasilitas..."
                            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
                    </div>
                </div>

                <!-- Category Filter -->
                <select v-model="selectedCategory" @change="fetchFacilities"
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option v-for="category in categoryOptions" :key="category.value" :value="category.value">
                        {{ category.label }}
                    </option>
                </select>

                <!-- Condition Filter -->
                <select v-model="selectedCondition" @change="fetchFacilities"
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option v-for="condition in conditionOptions" :key="condition.value" :value="condition.value">
                        {{ condition.label }}
                    </option>
                </select>
            </div>

            <!-- Results Info -->
            <div class="text-sm text-gray-600">
                Menampilkan {{ facilities.length }} dari {{ totalItems }} fasilitas
            </div>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Foto
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nama Fasilitas
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Kategori
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Jumlah
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Kondisi
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
                        <tr v-else-if="facilities.length === 0">
                            <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                                Tidak ada data fasilitas
                            </td>
                        </tr>
                        <tr v-else v-for="facility in facilities" :key="facility.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <img :src="facility.photo_url || 'https://via.placeholder.com/100/0d5f5f/ffffff?text=Fasilitas'"
                                    :alt="facility.name" class="w-12 h-12 rounded object-cover" />
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm font-medium text-gray-900">{{ facility.name }}</div>
                                <div v-if="facility.description" class="text-sm text-gray-500 line-clamp-1">
                                    {{ facility.description }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ getCategoryLabel(facility.category) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ facility.quantity }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getConditionColor(facility.condition_status)"
                                    class="px-2 py-1 text-xs font-semibold rounded-full">
                                    {{ getConditionLabel(facility.condition_status) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button @click="openEditModal(facility)"
                                    class="text-primary hover:text-primary-dark mr-3" title="Edit">
                                    <PencilIcon class="w-5 h-5" />
                                </button>
                                <button @click="handleDelete(facility)" class="text-red-600 hover:text-red-900"
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
                        {{ isEditMode ? 'Edit Fasilitas' : 'Tambah Fasilitas Baru' }}
                    </h2>
                    <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                        <XMarkIcon class="w-6 h-6" />
                    </button>
                </div>

                <!-- Modal Body -->
                <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
                    <!-- Photo Upload -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Foto Fasilitas
                        </label>
                        <div class="flex items-center gap-4">
                            <div class="w-24 h-24 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                                <img v-if="photoPreview" :src="photoPreview" alt="Preview"
                                    class="w-full h-full object-cover" />
                                <BuildingOfficeIcon v-else class="w-12 h-12 text-gray-400" />
                            </div>
                            <div>
                                <input type="file" @change="handlePhotoChange" accept="image/*" class="hidden"
                                    id="photo-upload" />
                                <label for="photo-upload"
                                    class="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                    <PhotoIcon class="w-5 h-5" />
                                    Pilih Foto
                                </label>
                                <p class="text-xs text-gray-500 mt-1">JPG, PNG (Max 5MB)</p>
                            </div>
                        </div>
                    </div>

                    <!-- Name -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Nama Fasilitas <span class="text-red-500">*</span>
                        </label>
                        <input v-model="formData.name" type="text" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Contoh: Ruang Kelas 1A" />
                    </div>

                    <!-- Category & Quantity -->
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
                                Jumlah <span class="text-red-500">*</span>
                            </label>
                            <input v-model.number="formData.quantity" type="number" required min="1"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="1" />
                        </div>
                    </div>

                    <!-- Condition -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Kondisi <span class="text-red-500">*</span>
                        </label>
                        <select v-model="formData.condition_status" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                            <option v-for="condition in conditionOptions.filter(c => c.value !== 'all')"
                                :key="condition.value" :value="condition.value">
                                {{ condition.label }}
                            </option>
                        </select>
                    </div>

                    <!-- Description -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Deskripsi
                        </label>
                        <textarea v-model="formData.description" rows="3"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Deskripsi tambahan tentang fasilitas..."></textarea>
                    </div>

                    <!-- Form Actions -->
                    <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button type="button" @click="closeModal"
                            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            Batal
                        </button>
                        <button type="submit" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
                            {{ isEditMode ? 'Simpan Perubahan' : 'Tambah Fasilitas' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
