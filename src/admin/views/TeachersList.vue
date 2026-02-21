<script setup>
import { ref, onMounted } from 'vue'
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, PhotoIcon, UserIcon } from '@heroicons/vue/24/outline'
import { createTeacher, updateTeacher, deleteTeacher } from '../../services/adminApi'
import { getTeachers, getTeacherStatuses } from '../../services/api'

const teachersList = ref([])
const isLoading = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const searchQuery = ref('')
const selectedStatus = ref('')

const statuses = ref([])

// Modal state
const isModalOpen = ref(false)
const isEditMode = ref(false)
const isSubmitting = ref(false)
const teacherForm = ref({
    name: '',
    nip: '',
    subject: '',
    status: 'active',
    photo: null
})
const photoPreview = ref(null)
const editingTeacherId = ref(null)

// Fetch statuses from API
const fetchStatuses = async () => {
    try {
        const response = await getTeacherStatuses()

        if (response.success) {
            statuses.value = response.data
        }
    } catch (error) {
        console.error('Error fetching statuses:', error)
    }
}

// Fetch teachers from API
const fetchTeachers = async () => {
    isLoading.value = true
    try {
        const params = {
            page: currentPage.value,
            limit: 10
        }

        if (searchQuery.value) {
            params.search = searchQuery.value
        }

        if (selectedStatus.value && selectedStatus.value !== '') {
            params.status = selectedStatus.value
        }

        const response = await getTeachers(params)

        if (response.success) {
            teachersList.value = response.data
            if (response.pagination) {
                totalPages.value = response.pagination.totalPages
                currentPage.value = response.pagination.page
                totalItems.value = response.pagination.total
            }
        }
    } catch (error) {
        console.error('Error fetching teachers:', error)
        alert('Failed to fetch teachers')
    } finally {
        isLoading.value = false
    }
}

const openCreateModal = () => {
    isEditMode.value = false
    editingTeacherId.value = null
    teacherForm.value = {
        name: '',
        nip: '',
        subject: '',
        status: 'active',
        photo: null
    }
    photoPreview.value = null
    isModalOpen.value = true
}

const openEditModal = async (teacher) => {
    isEditMode.value = true
    editingTeacherId.value = teacher.id

    teacherForm.value = {
        name: teacher.name,
        nip: teacher.nip,
        subject: teacher.subject,
        status: teacher.status,
        photo: null
    }
    photoPreview.value = teacher.photo_url || null
    isModalOpen.value = true
}

const closeModal = () => {
    isModalOpen.value = false
    teacherForm.value = {
        name: '',
        nip: '',
        subject: '',
        status: 'active',
        photo: null
    }
    photoPreview.value = null
    editingTeacherId.value = null
}

const handlePhotoChange = (event) => {
    const file = event.target.files[0]
    if (file) {
        teacherForm.value.photo = file
        const reader = new FileReader()
        reader.onload = (e) => {
            photoPreview.value = e.target.result
        }
        reader.readAsDataURL(file)
    }
}

const handleSubmit = async () => {
    if (!teacherForm.value.name || !teacherForm.value.nip || !teacherForm.value.subject) {
        alert('Please fill in all required fields')
        return
    }

    isSubmitting.value = true
    try {
        const formData = new FormData()
        formData.append('name', teacherForm.value.name)
        formData.append('nip', teacherForm.value.nip)
        formData.append('subject', teacherForm.value.subject)
        formData.append('status', teacherForm.value.status)

        if (teacherForm.value.photo) {
            formData.append('photo', teacherForm.value.photo)
        }

        let response
        if (isEditMode.value) {
            response = await updateTeacher(editingTeacherId.value, formData)
        } else {
            response = await createTeacher(formData)
        }

        if (response.success) {
            alert(isEditMode.value ? 'Teacher updated successfully!' : 'Teacher created successfully!')
            closeModal()
            fetchTeachers()
        }
    } catch (error) {
        console.error('Error saving teacher:', error)
        alert('Failed to save teacher')
    } finally {
        isSubmitting.value = false
    }
}

const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this teacher?')) {
        try {
            const response = await deleteTeacher(id)

            if (response.success) {
                alert('Teacher deleted successfully!')
                fetchTeachers()
            }
        } catch (error) {
            console.error('Error deleting teacher:', error)
            alert('Failed to delete teacher')
        }
    }
}

const getStatusColor = (status) => {
    const colors = {
        'active': 'bg-green-100 text-green-800',
        'inactive': 'bg-yellow-100 text-yellow-800',
        'retired': 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
}

const handleSearch = () => {
    currentPage.value = 1
    fetchTeachers()
}

const handlePageChange = (page) => {
    currentPage.value = page
    fetchTeachers()
}

onMounted(async () => {
    await fetchStatuses()
    fetchTeachers()
})
</script>

<template>
    <div class="p-6">
        <!-- Header & Actions -->
        <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h1 class="text-2xl font-bold text-gray-800 mb-2">Teachers Management</h1>
                    <p class="text-gray-600">Manage teachers and staff information</p>
                </div>
                <button @click="openCreateModal"
                    class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap">
                    <PlusIcon class="w-5 h-5" />
                    Add Teacher
                </button>
            </div>

            <!-- Filters -->
            <div class="flex flex-col md:flex-row gap-4 mb-4">
                <div class="flex-1">
                    <div class="relative">
                        <input v-model="searchQuery" @keyup.enter="handleSearch" type="text"
                            placeholder="Search by name or subject..."
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
                    </div>
                </div>
                <select v-model="selectedStatus" @change="handleSearch"
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="">All Status</option>
                    <option v-for="stat in statuses" :key="stat.value" :value="stat.value">
                        {{ stat.label }}
                    </option>
                </select>
            </div>

            <!-- Results Info -->
            <div class="text-sm text-gray-600">
                Menampilkan {{ teachersList.length }} dari {{ totalItems }} guru/tendik
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
                                NIP
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mata Pelajaran
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
                            <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                                Memuat data...
                            </td>
                        </tr>
                        <tr v-else-if="teachersList.length === 0">
                            <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                                Tidak ada data guru
                            </td>
                        </tr>
                        <tr v-else v-for="teacher in teachersList" :key="teacher.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <img :src="teacher.photo_url || 'https://via.placeholder.com/100/0d5f5f/ffffff?text=GTK'"
                                    :alt="teacher.name" class="w-12 h-12 rounded-full object-cover" />
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">{{ teacher.name }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ teacher.nip }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ teacher.subject }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getStatusColor(teacher.status)"
                                    class="px-2 py-1 text-xs font-semibold rounded-full">
                                    {{ teacher.status }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button @click="openEditModal(teacher)"
                                    class="text-primary hover:text-primary-dark mr-3" title="Edit">
                                    <PencilIcon class="w-5 h-5" />
                                </button>
                                <button @click="handleDelete(teacher.id)" class="text-red-600 hover:text-red-900"
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
                        <button @click="handlePageChange(currentPage - 1)" :disabled="currentPage === 1"
                            class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                            Previous
                        </button>
                        <button @click="handlePageChange(currentPage + 1)" :disabled="currentPage === totalPages"
                            class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal for Create/Edit -->
        <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl m-4">
                <!-- Modal Header -->
                <div class="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b border-gray-200">
                    <h2 class="text-2xl font-bold text-gray-800">
                        {{ isEditMode ? 'Edit Teacher' : 'Add Teacher' }}
                    </h2>
                    <button @click="closeModal" class="p-2 text-gray-500 transition-colors hover:text-gray-700">
                        <XMarkIcon class="w-6 h-6" />
                    </button>
                </div>

                <!-- Modal Body -->
                <div class="p-6">
                    <form @submit.prevent="handleSubmit" class="space-y-6">
                        <!-- Name -->
                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-700">
                                Name <span class="text-red-500">*</span>
                            </label>
                            <input v-model="teacherForm.name" type="text" required
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter teacher name" />
                        </div>

                        <!-- NIP & Subject -->
                        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label class="block mb-2 text-sm font-medium text-gray-700">
                                    NIP <span class="text-red-500">*</span>
                                </label>
                                <input v-model="teacherForm.nip" type="text" required
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter NIP" />
                            </div>
                            <div>
                                <label class="block mb-2 text-sm font-medium text-gray-700">
                                    Subject <span class="text-red-500">*</span>
                                </label>
                                <input v-model="teacherForm.subject" type="text" required
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter subject" />
                            </div>
                        </div>

                        <!-- Status -->
                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-700">Status</label>
                            <select v-model="teacherForm.status"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option v-for="stat in statuses" :key="stat.value" :value="stat.value">
                                    {{ stat.label }}
                                </option>
                            </select>
                        </div>

                        <!-- Photo -->
                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-700">Photo</label>
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
                                        Choose Photo
                                    </label>
                                    <p class="text-xs text-gray-500 mt-1">JPG, PNG (Max 5MB)</p>
                                </div>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex justify-end gap-4 pt-4 border-t border-gray-200">
                            <button type="button" @click="closeModal"
                                class="px-6 py-2 font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200">
                                Cancel
                            </button>
                            <button type="submit" :disabled="isSubmitting"
                                class="px-6 py-2 font-medium text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
                                {{ isSubmitting ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
