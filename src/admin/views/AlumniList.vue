<script setup>
import { ref, onMounted } from 'vue'
import {
    PlusIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    TrashIcon,
    XMarkIcon,
    PhotoIcon,
    UserIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon
} from '@heroicons/vue/24/outline'
import {
    updateAlumni,
    updateAlumniStatus,
    deleteAlumni,
    getAlumniStatusCounts
} from '@/services/adminApi'
import { getAlumni, getAlumniStatuses } from '@/services/api'

// State
const alumni = ref([])
const isLoading = ref(false)
const showModal = ref(false)
const isEditMode = ref(false)
const currentAlumni = ref(null)

// Filters & Search
const searchQuery = ref('')
const selectedStatus = ref('all')
const selectedGender = ref('all')
const selectedYear = ref('all')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalPages = ref(1)
const totalItems = ref(0)

// Stats
const statusCounts = ref({
    pending: 0,
    approved: 0,
    rejected: 0
})

// Status & Gender Options
const statusOptions = ref([
    { value: 'all', label: 'Semua Status' }
])

const genderOptions = [
    { value: 'all', label: 'Semua Gender' },
    { value: 'male', label: 'Laki-laki' },
    { value: 'female', label: 'Perempuan' }
]

// Graduation years (will be populated from data)
const yearOptions = ref([
    { value: 'all', label: 'Semua Tahun Lulus' }
])

// Form data
const formData = ref({
    nisn: '',
    name: '',
    gender: '',
    graduation_year: new Date().getFullYear(),
    current_school: '',
    current_occupation: '',
    phone: '',
    email: '',
    address: '',
    registration_status: 'approved',
    photo: null
})

const photoPreview = ref(null)

// Fetch alumni
const fetchAlumni = async () => {
    isLoading.value = true
    try {
        const params = {
            page: currentPage.value,
            limit: itemsPerPage.value,
            search: searchQuery.value || undefined,
            registration_status: selectedStatus.value !== 'all' ? selectedStatus.value : undefined,
            gender: selectedGender.value !== 'all' ? selectedGender.value : undefined,
            graduation_year: selectedYear.value !== 'all' ? selectedYear.value : undefined
        }

        const response = await getAlumni(params)

        if (response.success) {
            alumni.value = response.data || []
            if (response.pagination) {
                totalPages.value = response.pagination.totalPages
                totalItems.value = response.pagination.total
            }

            // Extract unique graduation years
            const years = [...new Set(alumni.value.map(a => a.graduation_year))].sort((a, b) => b - a)
            yearOptions.value = [
                { value: 'all', label: 'Semua Tahun Lulus' },
                ...years.map(year => ({ value: year.toString(), label: year.toString() }))
            ]
        }
    } catch (error) {
        console.error('Error fetching alumni:', error)
        alert('Gagal memuat data alumni')
    } finally {
        isLoading.value = false
    }
}

// Fetch statuses
const fetchStatuses = async () => {
    try {
        const response = await getAlumniStatuses()
        if (response.success && response.data) {
            const options = response.data.map(status => ({
                value: status.value,
                label: status.label
            }))
            statusOptions.value = [
                { value: 'all', label: 'Semua Status' },
                ...options
            ]
        }
    } catch (error) {
        console.error('Error fetching statuses:', error)
    }
}

// Fetch status counts
const fetchStatusCounts = async () => {
    try {
        const response = await getAlumniStatusCounts()
        if (response.success && response.data) {
            statusCounts.value = response.data
        }
    } catch (error) {
        console.error('Error fetching status counts:', error)
    }
}

// Modal handlers
const openEditModal = (alumniItem) => {
    isEditMode.value = true
    currentAlumni.value = alumniItem
    formData.value = {
        nisn: alumniItem.nisn || '',
        name: alumniItem.name || '',
        gender: alumniItem.gender || '',
        graduation_year: alumniItem.graduation_year || new Date().getFullYear(),
        current_school: alumniItem.current_school || '',
        current_occupation: alumniItem.current_occupation || '',
        phone: alumniItem.phone || '',
        email: alumniItem.email || '',
        address: alumniItem.address || '',
        registration_status: alumniItem.registration_status || 'approved',
        photo: null
    }
    photoPreview.value = alumniItem.photo_url || null
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    resetForm()
}

const resetForm = () => {
    formData.value = {
        nisn: '',
        name: '',
        gender: '',
        graduation_year: new Date().getFullYear(),
        current_school: '',
        current_occupation: '',
        phone: '',
        email: '',
        address: '',
        registration_status: 'approved',
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
    // Validation - name, gender, graduation_year are required
    if (!formData.value.name || !formData.value.gender || !formData.value.graduation_year) {
        alert('Mohon lengkapi semua field yang wajib diisi (Nama, Gender, Tahun Lulus)')
        return
    }

    try {
        const data = new FormData()
        if (formData.value.nisn) data.append('nisn', formData.value.nisn)
        data.append('name', formData.value.name)
        data.append('gender', formData.value.gender)
        data.append('graduation_year', formData.value.graduation_year.toString())
        if (formData.value.current_school) data.append('current_school', formData.value.current_school)
        if (formData.value.current_occupation) data.append('current_occupation', formData.value.current_occupation)
        if (formData.value.phone) data.append('phone', formData.value.phone)
        if (formData.value.email) data.append('email', formData.value.email)
        if (formData.value.address) data.append('address', formData.value.address)
        data.append('registration_status', formData.value.registration_status)

        if (formData.value.photo) {
            data.append('photo', formData.value.photo)
        }

        await updateAlumni(currentAlumni.value.id, data)
        alert('Alumni berhasil diperbarui')

        closeModal()
        fetchAlumni()
        fetchStatusCounts()
    } catch (error) {
        console.error('Error saving alumni:', error)
        alert(error.message || 'Gagal menyimpan data alumni')
    }
}

// Quick status update
const handleQuickStatusUpdate = async (alumniItem, newStatus) => {
    if (!confirm(`Apakah Anda yakin ingin mengubah status menjadi "${newStatus}"?`)) {
        return
    }

    try {
        await updateAlumniStatus(alumniItem.id, { registration_status: newStatus })
        alert('Status berhasil diperbarui')
        fetchAlumni()
        fetchStatusCounts()
    } catch (error) {
        console.error('Error updating status:', error)
        alert('Gagal mengubah status')
    }
}

// Delete alumni
const handleDelete = async (alumniItem) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus alumni "${alumniItem.name}"?`)) {
        return
    }

    try {
        await deleteAlumni(alumniItem.id)
        alert('Alumni berhasil dihapus')
        fetchAlumni()
        fetchStatusCounts()
    } catch (error) {
        console.error('Error deleting alumni:', error)
        alert('Gagal menghapus alumni')
    }
}

// Pagination
const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        fetchAlumni()
    }
}

// Status badge color
const getStatusColor = (status) => {
    switch (status) {
        case 'approved': return 'bg-green-100 text-green-800'
        case 'pending': return 'bg-yellow-100 text-yellow-800'
        case 'rejected': return 'bg-red-100 text-red-800'
        default: return 'bg-gray-100 text-gray-800'
    }
}

// Gender badge color
const getGenderColor = (gender) => {
    return gender === 'male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
}

// Initialize
onMounted(() => {
    fetchStatuses()
    fetchAlumni()
    fetchStatusCounts()
})
</script>

<template>
    <div class="p-6">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-white rounded-lg shadow-sm p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600">Menunggu Persetujuan</p>
                        <p class="text-2xl font-bold text-yellow-600">{{ statusCounts.pending || 0 }}</p>
                    </div>
                    <ClockIcon class="w-12 h-12 text-yellow-600 opacity-20" />
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600">Disetujui</p>
                        <p class="text-2xl font-bold text-green-600">{{ statusCounts.approved || 0 }}</p>
                    </div>
                    <CheckCircleIcon class="w-12 h-12 text-green-600 opacity-20" />
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600">Ditolak</p>
                        <p class="text-2xl font-bold text-red-600">{{ statusCounts.rejected || 0 }}</p>
                    </div>
                    <XCircleIcon class="w-12 h-12 text-red-600 opacity-20" />
                </div>
            </div>
        </div>

        <!-- Header & Actions -->
        <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div class="mb-6">
                <h1 class="text-2xl font-bold text-gray-800 mb-2">Manajemen Data Alumni</h1>
                <p class="text-gray-600">Kelola data alumni sekolah dan persetujuan pendaftaran</p>
            </div>

            <!-- Filters -->
            <div class="flex flex-col md:flex-row gap-4 mb-4">
                <!-- Search -->
                <div class="flex-1">
                    <div class="relative">
                        <MagnifyingGlassIcon class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input v-model="searchQuery" @keyup.enter="fetchAlumni" type="text"
                            placeholder="Cari alumni (nama atau NISN)..."
                            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
                    </div>
                </div>

                <!-- Status Filter -->
                <select v-model="selectedStatus" @change="fetchAlumni"
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option v-for="status in statusOptions" :key="status.value" :value="status.value">
                        {{ status.label }}
                    </option>
                </select>

                <!-- Gender Filter -->
                <select v-model="selectedGender" @change="fetchAlumni"
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option v-for="gender in genderOptions" :key="gender.value" :value="gender.value">
                        {{ gender.label }}
                    </option>
                </select>

                <!-- Year Filter -->
                <select v-model="selectedYear" @change="fetchAlumni"
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option v-for="year in yearOptions" :key="year.value" :value="year.value">
                        {{ year.label }}
                    </option>
                </select>
            </div>

            <!-- Results Info -->
            <div class="text-sm text-gray-600">
                Menampilkan {{ alumni.length }} dari {{ totalItems }} alumni
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
                                Nama
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Gender
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tahun Lulus
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Info Terkini
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-if="isLoading">
                            <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                                Memuat data...
                            </td>
                        </tr>
                        <tr v-else-if="alumni.length === 0">
                            <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                                Tidak ada data alumni
                            </td>
                        </tr>
                        <tr v-else v-for="alumniItem in alumni" :key="alumniItem.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <img :src="alumniItem.photo_url || 'https://via.placeholder.com/100/0d5f5f/ffffff?text=Alumni'"
                                    :alt="alumniItem.name" class="w-12 h-12 rounded-full object-cover" />
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm font-medium text-gray-900">{{ alumniItem.name }}</div>
                                <div v-if="alumniItem.nisn" class="text-sm text-gray-500">NISN: {{ alumniItem.nisn }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getGenderColor(alumniItem.gender)"
                                    class="px-2 py-1 text-xs font-semibold rounded-full">
                                    {{ alumniItem.gender === 'male' ? 'L' : 'P' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ alumniItem.graduation_year }}
                            </td>
                            <td class="px-6 py-4">
                                <div v-if="alumniItem.current_school" class="text-sm text-gray-900">
                                    🎓 {{ alumniItem.current_school }}
                                </div>
                                <div v-if="alumniItem.current_occupation" class="text-sm text-gray-900">
                                    💼 {{ alumniItem.current_occupation }}
                                </div>
                                <div v-if="!alumniItem.current_school && !alumniItem.current_occupation"
                                    class="text-sm text-gray-400">
                                    -
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getStatusColor(alumniItem.registration_status)"
                                    class="px-2 py-1 text-xs font-semibold rounded-full">
                                    {{ alumniItem.registration_status }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div class="flex items-center justify-end gap-2">
                                    <!-- Quick approve/reject buttons for pending -->
                                    <template v-if="alumniItem.registration_status === 'pending'">
                                        <button @click="handleQuickStatusUpdate(alumniItem, 'approved')"
                                            class="text-green-600 hover:text-green-900" title="Setujui">
                                            <CheckCircleIcon class="w-5 h-5" />
                                        </button>
                                        <button @click="handleQuickStatusUpdate(alumniItem, 'rejected')"
                                            class="text-red-600 hover:text-red-900" title="Tolak">
                                            <XCircleIcon class="w-5 h-5" />
                                        </button>
                                    </template>

                                    <button @click="openEditModal(alumniItem)"
                                        class="text-primary hover:text-primary-dark" title="Edit">
                                        <PencilIcon class="w-5 h-5" />
                                    </button>
                                    <button @click="handleDelete(alumniItem)" class="text-red-600 hover:text-red-900"
                                        title="Hapus">
                                        <TrashIcon class="w-5 h-5" />
                                    </button>
                                </div>
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
                        Edit Alumni
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
                            Foto Alumni
                        </label>
                        <div class="flex items-center gap-4">
                            <div
                                class="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                <img v-if="photoPreview" :src="photoPreview" alt="Preview"
                                    class="w-full h-full object-cover" />
                                <UserIcon v-else class="w-12 h-12 text-gray-400" />
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

                    <!-- Name & NISN -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Nama Lengkap <span class="text-red-500">*</span>
                            </label>
                            <input v-model="formData.name" type="text" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Masukkan nama lengkap" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                NISN
                            </label>
                            <input v-model="formData.nisn" type="text"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Masukkan NISN" />
                        </div>
                    </div>

                    <!-- Gender & Graduation Year -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Gender <span class="text-red-500">*</span>
                            </label>
                            <select v-model="formData.gender" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                                <option value="">Pilih Gender</option>
                                <option value="male">Laki-laki</option>
                                <option value="female">Perempuan</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Tahun Lulus <span class="text-red-500">*</span>
                            </label>
                            <input v-model.number="formData.graduation_year" type="number" required min="1990"
                                :max="new Date().getFullYear()"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="2020" />
                        </div>
                    </div>

                    <!-- Current School & Occupation -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Sekolah/Universitas Saat Ini
                            </label>
                            <input v-model="formData.current_school" type="text"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Nama sekolah/universitas" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Pekerjaan Saat Ini
                            </label>
                            <input v-model="formData.current_occupation" type="text"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Nama pekerjaan" />
                        </div>
                    </div>

                    <!-- Phone & Email -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Telepon
                            </label>
                            <input v-model="formData.phone" type="tel"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Nomor telepon" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input v-model="formData.email" type="email"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="alamat@email.com" />
                        </div>
                    </div>

                    <!-- Address -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Alamat
                        </label>
                        <textarea v-model="formData.address" rows="2"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Masukkan alamat lengkap"></textarea>
                    </div>

                    <!-- Registration Status -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Status Pendaftaran <span class="text-red-500">*</span>
                        </label>
                        <select v-model="formData.registration_status" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                            <option v-for="status in statusOptions.filter(s => s.value !== 'all')" :key="status.value"
                                :value="status.value">
                                {{ status.label }}
                            </option>
                        </select>
                    </div>

                    <!-- Form Actions -->
                    <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button type="button" @click="closeModal"
                            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            Batal
                        </button>
                        <button type="submit" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
