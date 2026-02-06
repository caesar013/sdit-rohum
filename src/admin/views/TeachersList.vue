<script setup>
import { ref, onMounted } from 'vue'
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { createTeacher, updateTeacher, deleteTeacher } from '../../services/adminApi'
import { getTeachers, getTeacherStatuses } from '../../services/api'

const teachersList = ref([])
const isLoading = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
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
    <div>
        <!-- Page Header -->
        <div class="flex flex-wrap items-center justify-between mb-6 -mx-3">
            <div class="w-full px-3 md:w-1/2">
                <h1 class="text-3xl font-bold text-gray-800">Teachers Management</h1>
                <p class="text-gray-600">Manage teachers and staff information</p>
            </div>
            <div class="w-full px-3 md:w-1/2 md:text-right">
                <button @click="openCreateModal"
                    class="inline-flex items-center px-6 py-3 font-bold text-white transition-all bg-blue-500 rounded-lg hover:bg-blue-600 hover:shadow-lg">
                    <PlusIcon class="w-5 h-5 mr-2" />
                    Add Teacher
                </button>
            </div>
        </div>

        <!-- Filters -->
        <div class="flex flex-wrap mb-6 -mx-3">
            <div class="w-full px-3">
                <div
                    class="relative flex flex-col min-w-0 wrap-break-words bg-white shadow-xl rounded-2xl bg-clip-border">
                    <div class="p-6">
                        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <label class="block mb-2 text-sm font-medium text-gray-700">Search</label>
                                <input v-model="searchQuery" @keyup.enter="handleSearch" type="text"
                                    placeholder="Search by name or subject..."
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label class="block mb-2 text-sm font-medium text-gray-700">Status</label>
                                <select v-model="selectedStatus" @change="handleSearch"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">All Status</option>
                                    <option v-for="stat in statuses" :key="stat.value" :value="stat.value">
                                        {{ stat.label }}
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label class="block mb-2 text-sm font-medium text-gray-700">&nbsp;</label>
                                <button @click="handleSearch"
                                    class="w-full px-4 py-2 font-medium text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600">
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Teachers Table -->
        <div class="flex flex-wrap -mx-3">
            <div class="flex-none w-full max-w-full px-3">
                <div
                    class="relative flex flex-col min-w-0 mb-6 wrap-break-words bg-white border-0 border-transparent border-solid shadow-xl rounded-2xl bg-clip-border">
                    <div class="p-6 pb-0 mb-0 border-b-0 border-b-solid rounded-t-2xl border-b-transparent">
                        <h6 class="font-bold text-gray-800">Teachers & Staff</h6>
                    </div>
                    <div class="flex-auto px-0 pt-0 pb-2">
                        <div class="p-0 overflow-x-auto">
                            <table class="items-center w-full mb-0 align-top border-collapse text-slate-500">
                                <thead class="align-bottom">
                                    <tr>
                                        <th
                                            class="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                            Photo
                                        </th>
                                        <th
                                            class="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                            Name
                                        </th>
                                        <th
                                            class="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                            NIP
                                        </th>
                                        <th
                                            class="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                            Subject
                                        </th>
                                        <th
                                            class="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                            Status
                                        </th>
                                        <th
                                            class="px-6 py-3 font-semibold capitalize align-middle bg-transparent border-b border-collapse border-solid shadow-none tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="isLoading">
                                        <td colspan="6" class="px-6 py-4 text-center text-sm">
                                            Loading...
                                        </td>
                                    </tr>
                                    <tr v-else-if="teachersList.length === 0">
                                        <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                                            No teachers found
                                        </td>
                                    </tr>
                                    <tr v-else v-for="teacher in teachersList" :key="teacher.id">
                                        <td class="p-2 align-middle bg-transparent border-b whitespace-nowrap">
                                            <div class="px-2 py-1">
                                                <img v-if="teacher.photo_url" :src="teacher.photo_url"
                                                    :alt="teacher.name" class="w-12 h-12 rounded-full object-cover" />
                                                <div v-else
                                                    class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                                                    {{ teacher.name.charAt(0).toUpperCase() }}
                                                </div>
                                            </div>
                                        </td>
                                        <td class="p-2 align-middle bg-transparent border-b whitespace-nowrap">
                                            <div class="px-2 py-1">
                                                <h6 class="mb-0 text-sm leading-normal text-gray-800">{{ teacher.name }}
                                                </h6>
                                            </div>
                                        </td>
                                        <td class="p-2 align-middle bg-transparent border-b whitespace-nowrap">
                                            <span class="text-xs font-semibold leading-tight text-slate-400">
                                                {{ teacher.nip }}
                                            </span>
                                        </td>
                                        <td class="p-2 align-middle bg-transparent border-b whitespace-nowrap">
                                            <span class="text-xs font-semibold leading-tight text-slate-400">
                                                {{ teacher.subject }}
                                            </span>
                                        </td>
                                        <td
                                            class="p-2 text-center align-middle bg-transparent border-b whitespace-nowrap">
                                            <span :class="getStatusColor(teacher.status)"
                                                class="px-2 py-1 text-xs font-semibold rounded-full">
                                                {{ teacher.status }}
                                            </span>
                                        </td>
                                        <td class="p-2 align-middle bg-transparent border-b whitespace-nowrap">
                                            <div class="flex items-center justify-center gap-2">
                                                <button @click="openEditModal(teacher)"
                                                    class="p-2 text-blue-600 transition-colors hover:text-blue-800"
                                                    title="Edit">
                                                    <PencilIcon class="w-5 h-5" />
                                                </button>
                                                <button @click="handleDelete(teacher.id)"
                                                    class="p-2 text-red-600 transition-colors hover:text-red-800"
                                                    title="Delete">
                                                    <TrashIcon class="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Pagination -->
                    <div v-if="totalPages > 1"
                        class="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                        <div class="text-sm text-gray-600">
                            Page {{ currentPage }} of {{ totalPages }}
                        </div>
                        <div class="flex gap-2">
                            <button @click="handlePageChange(currentPage - 1)" :disabled="currentPage === 1"
                                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                Previous
                            </button>
                            <button v-for="page in totalPages" :key="page" @click="handlePageChange(page)"
                                :class="page === currentPage ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
                                class="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg">
                                {{ page }}
                            </button>
                            <button @click="handlePageChange(currentPage + 1)" :disabled="currentPage === totalPages"
                                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                Next
                            </button>
                        </div>
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
                            <input type="file" @change="handlePhotoChange" accept="image/*"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <div v-if="photoPreview" class="mt-4">
                                <img :src="photoPreview" alt="Preview"
                                    class="w-32 h-32 rounded-lg shadow-md object-cover" />
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
