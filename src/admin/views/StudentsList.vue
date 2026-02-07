<script setup>
import { ref, onMounted, computed } from 'vue'
import {
    PlusIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    TrashIcon,
    XMarkIcon,
    PhotoIcon,
    UserIcon
} from '@heroicons/vue/24/outline'
import {
    getAdminStudents,
    createStudent,
    updateStudent,
    deleteStudent
} from '@/services/adminApi'
import { getStudentStatuses } from '@/services/api'

// State
const students = ref([])
const isLoading = ref(false)
const showModal = ref(false)
const isEditMode = ref(false)
const currentStudent = ref(null)

// Filters & Search
const searchQuery = ref('')
const selectedStatus = ref('all')
const selectedGender = ref('all')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalPages = ref(1)
const totalItems = ref(0)

// Status & Gender Options
const statusOptions = ref([
    { value: 'all', label: 'Semua Status' }
])

const genderOptions = [
    { value: 'all', label: 'Semua Gender' },
    { value: 'male', label: 'Laki-laki' },
    { value: 'female', label: 'Perempuan' }
]

// Form data
const formData = ref({
    nisn: '',
    nis: '',
    name: '',
    gender: '',
    birth_place: '',
    birth_date: '',
    address: '',
    parent_name: '',
    parent_phone: '',
    status: 'active',
    photo: null
})

const photoPreview = ref(null)

// Fetch students
const fetchStudents = async () => {
    isLoading.value = true
    try {
        const params = {
            page: currentPage.value,
            limit: itemsPerPage.value,
            search: searchQuery.value || undefined,
            status: selectedStatus.value !== 'all' ? selectedStatus.value : undefined,
            gender: selectedGender.value !== 'all' ? selectedGender.value : undefined
        }

        const response = await getAdminStudents(params)

        if (response.success) {
            students.value = response.data || []
            if (response.pagination) {
                totalPages.value = response.pagination.totalPages
                totalItems.value = response.pagination.total
            }
        }
    } catch (error) {
        console.error('Error fetching students:', error)
        alert('Gagal memuat data siswa')
    } finally {
        isLoading.value = false
    }
}

// Fetch statuses
const fetchStatuses = async () => {
    try {
        const response = await getStudentStatuses()
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

// Modal handlers
const openCreateModal = () => {
    isEditMode.value = false
    currentStudent.value = null
    resetForm()
    showModal.value = true
}

const openEditModal = (student) => {
    isEditMode.value = true
    currentStudent.value = student
    formData.value = {
        nisn: student.nisn || '',
        nis: student.nis || '',
        name: student.name || '',
        gender: student.gender || '',
        birth_place: student.birth_place || '',
        birth_date: formatDateForInput(student.birth_date),
        address: student.address || '',
        parent_name: student.parent_name || '',
        parent_phone: student.parent_phone || '',
        status: student.status || 'active',
        photo: null
    }
    photoPreview.value = student.photo_url || null
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    resetForm()
}

const resetForm = () => {
    formData.value = {
        nisn: '',
        nis: '',
        name: '',
        gender: '',
        birth_place: '',
        birth_date: '',
        address: '',
        parent_name: '',
        parent_phone: '',
        status: 'active',
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
    // Validation - only nisn, name, and gender are truly required by DB
    if (!formData.value.nisn || !formData.value.name || !formData.value.gender) {
        alert('Mohon lengkapi semua field yang wajib diisi (NISN, Nama, Gender)')
        return
    }

    try {
        const data = new FormData()
        data.append('nisn', formData.value.nisn)
        if (formData.value.nis) data.append('nis', formData.value.nis)
        data.append('name', formData.value.name)
        data.append('gender', formData.value.gender)
        if (formData.value.birth_place) data.append('birth_place', formData.value.birth_place)
        if (formData.value.birth_date) data.append('birth_date', formData.value.birth_date)
        data.append('address', formData.value.address || '')
        data.append('parent_name', formData.value.parent_name || '')
        data.append('parent_phone', formData.value.parent_phone || '')
        data.append('status', formData.value.status)

        if (formData.value.photo) {
            data.append('photo', formData.value.photo)
        }

        if (isEditMode.value) {
            await updateStudent(currentStudent.value.id, data)
            alert('Siswa berhasil diperbarui')
        } else {
            await createStudent(data)
            alert('Siswa berhasil ditambahkan')
        }

        closeModal()
        fetchStudents()
    } catch (error) {
        console.error('Error saving student:', error)
        alert(error.message || 'Gagal menyimpan data siswa')
    }
}

// Delete student
const handleDelete = async (student) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus siswa "${student.name}"?`)) {
        return
    }

    try {
        await deleteStudent(student.id)
        alert('Siswa berhasil dihapus')
        fetchStudents()
    } catch (error) {
        console.error('Error deleting student:', error)
        alert('Gagal menghapus siswa')
    }
}

// Pagination
const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        fetchStudents()
    }
}

// Status badge color
const getStatusColor = (status) => {
    switch (status) {
        case 'active': return 'bg-green-100 text-green-800'
        case 'inactive': return 'bg-gray-100 text-gray-800'
        case 'graduated': return 'bg-blue-100 text-blue-800'
        case 'transferred': return 'bg-yellow-100 text-yellow-800'
        default: return 'bg-gray-100 text-gray-800'
    }
}

// Gender badge color
const getGenderColor = (gender) => {
    return gender === 'male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
}

// Format date for display
const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Convert date to YYYY-MM-DD format for input
const formatDateForInput = (dateString) => {
    if (!dateString) return ''
    // Extract just the date part from ISO string (e.g., "2010-10-10T00:00:00.000Z" -> "2010-10-10")
    return dateString.split('T')[0]
}

// Initialize
onMounted(() => {
    fetchStatuses()
    fetchStudents()
})
</script>

<template>
    <div class="p-6">
        <!-- Header & Actions -->
        <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h1 class="text-2xl font-bold text-gray-800 mb-2">Manajemen Data Siswa</h1>
                    <p class="text-gray-600">Kelola data peserta didik sekolah</p>
                </div>
                <button @click="openCreateModal"
                    class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap cursor-pointer">
                    <PlusIcon class="w-5 h-5" />
                    Tambah Siswa
                </button>
            </div>

            <!-- Filters -->
            <div class="flex flex-col md:flex-row gap-4 mb-4">
                <!-- Search -->
                <div class="flex-1">
                    <div class="relative">
                        <MagnifyingGlassIcon class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input v-model="searchQuery" @keyup.enter="fetchStudents" type="text"
                            placeholder="Cari siswa (nama atau NISN)..."
                            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent hover:cursor-pointer" />
                    </div>
                </div>

                <!-- Status Filter -->
                <select v-model="selectedStatus" @change="fetchStudents"
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent hover:cursor-pointer">
                    <option v-for="status in statusOptions" :key="status.value" :value="status.value">
                        {{ status.label }}
                    </option>
                </select>

                <!-- Gender Filter -->
                <select v-model="selectedGender" @change="fetchStudents"
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent hover:cursor-pointer">
                    <option v-for="gender in genderOptions" :key="gender.value" :value="gender.value">
                        {{ gender.label }}
                    </option>
                </select>
            </div>

            <!-- Results Info -->
            <div class="text-sm text-gray-600">
                Menampilkan {{ students.length }} dari {{ totalItems }} siswa
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
                                NISN
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nama
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Gender
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tanggal Lahir
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
                        <tr v-else-if="students.length === 0">
                            <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                                Tidak ada data siswa
                            </td>
                        </tr>
                        <tr v-else v-for="student in students" :key="student.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <img :src="student.photo_url || 'https://via.placeholder.com/100/0d5f5f/ffffff?text=Siswa'"
                                    :alt="student.name" class="w-12 h-12 rounded-full object-cover" />
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ student.nisn }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">{{ student.name }}</div>
                                <div v-if="student.parent_name" class="text-sm text-gray-500">
                                    Wali: {{ student.parent_name }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getGenderColor(student.gender)"
                                    class="px-2 py-1 text-xs font-semibold rounded-full">
                                    {{ student.gender === 'male' ? 'L' : 'P' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ formatDate(student.birth_date) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getStatusColor(student.status)"
                                    class="px-2 py-1 text-xs font-semibold rounded-full">
                                    {{ student.status }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button @click="openEditModal(student)"
                                    class="text-primary hover:text-primary-dark mr-3 hover:cursor-pointer" title="Edit">
                                    <PencilIcon class="w-5 h-5" />
                                </button>
                                <button @click="handleDelete(student)" class="text-red-600 hover:text-red-900 cursor-pointer"
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
                        {{ isEditMode ? 'Edit Siswa' : 'Tambah Siswa Baru' }}
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
                            Foto Siswa
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

                    <!-- NISN & NIS -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                NISN <span class="text-red-500">*</span>
                            </label>
                            <input v-model="formData.nisn" type="text" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Masukkan NISN" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                NIS
                            </label>
                            <input v-model="formData.nis" type="text"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Masukkan NIS" />
                        </div>
                    </div>

                    <!-- Name -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Nama Lengkap <span class="text-red-500">*</span>
                        </label>
                        <input v-model="formData.name" type="text" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Masukkan nama lengkap" />
                    </div>

                    <!-- Gender & Birth Date -->
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
                                Tanggal Lahir
                            </label>
                            <input v-model="formData.birth_date" type="date"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
                        </div>
                    </div>

                    <!-- Birth Place -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Tempat Lahir
                        </label>
                        <input v-model="formData.birth_place" type="text"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Masukkan tempat lahir" />
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

                    <!-- Parent Info -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Nama Wali
                            </label>
                            <input v-model="formData.parent_name" type="text"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Nama orang tua/wali" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Telepon Wali
                            </label>
                            <input v-model="formData.parent_phone" type="tel"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Nomor telepon" />
                        </div>
                    </div>

                    <!-- Status -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Status <span class="text-red-500">*</span>
                        </label>
                        <select v-model="formData.status" required
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
                            {{ isEditMode ? 'Simpan Perubahan' : 'Tambah Siswa' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
