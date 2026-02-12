<script setup>
import { ref, onMounted } from 'vue'
import {
    MagnifyingGlassIcon,
    TrashIcon,
    XMarkIcon,
    EnvelopeIcon,
    EnvelopeOpenIcon,
    CheckCircleIcon,
    ClockIcon
} from '@heroicons/vue/24/outline'
import { getAdminContacts, getContactStats, updateContactStatus, deleteContact } from '@/services/adminApi'

// Status constants (from database schema)
const CONTACT_STATUS = {
    UNREAD: 'unread',
    READ: 'read',
    REPLIED: 'replied'
}

// State
const messages = ref([])
const isLoading = ref(false)
const showDetailModal = ref(false)
const currentMessage = ref(null)

// Filters & Search
const selectedStatus = ref('all')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(20)
const totalPages = ref(1)
const totalItems = ref(0)

// Stats
const stats = ref({
    unread: 0,
    read: 0,
    replied: 0
})

// Status options
const statusOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: CONTACT_STATUS.UNREAD, label: 'Belum Dibaca' },
    { value: CONTACT_STATUS.READ, label: 'Sudah Dibaca' },
    { value: CONTACT_STATUS.REPLIED, label: 'Sudah Dibalas' }
]

// Fetch messages
const fetchMessages = async () => {
    isLoading.value = true
    try {
        const params = {
            page: currentPage.value,
            limit: itemsPerPage.value,
            status: selectedStatus.value !== 'all' ? selectedStatus.value : undefined
        }

        const response = await getAdminContacts(params)

        if (response.success) {
            messages.value = response.data || []
            if (response.pagination) {
                totalPages.value = response.pagination.totalPages
                totalItems.value = response.pagination.total
            }
        }
    } catch (error) {
        console.error('Error fetching messages:', error)
        alert('Gagal memuat data pesan')
    } finally {
        isLoading.value = false
    }
}

// Fetch stats
const fetchStats = async () => {
    try {
        const response = await getContactStats()
        if (response.success && response.data) {
            stats.value = response.data
        }
    } catch (error) {
        console.error('Error fetching stats:', error)
    }
}

// Modal handlers
const openDetailModal = async (message) => {
    currentMessage.value = message
    showDetailModal.value = true

    // Mark as read if unread
    if (message.status === CONTACT_STATUS.UNREAD) {
        await handleStatusUpdate(message, CONTACT_STATUS.READ)
    }
}

const closeDetailModal = () => {
    showDetailModal.value = false
    currentMessage.value = null
}

// Update status
const handleStatusUpdate = async (message, newStatus) => {
    try {
        await updateContactStatus(message.id, { status: newStatus })

        // Update local state
        const index = messages.value.findIndex(m => m.id === message.id)
        if (index !== -1) {
            messages.value[index].status = newStatus
        }

        if (currentMessage.value && currentMessage.value.id === message.id) {
            currentMessage.value.status = newStatus
        }

        // Refresh stats
        fetchStats()
    } catch (error) {
        console.error('Error updating status:', error)
        alert('Gagal mengubah status')
    }
}

// Delete message
const handleDelete = async (message) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus pesan dari "${message.name}"?`)) {
        return
    }

    try {
        await deleteContact(message.id)
        alert('Pesan berhasil dihapus')

        if (showDetailModal.value) {
            closeDetailModal()
        }

        fetchMessages()
        fetchStats()
    } catch (error) {
        console.error('Error deleting message:', error)
        alert('Gagal menghapus pesan')
    }
}

// Status badge color
const getStatusColor = (status) => {
    switch (status) {
        case CONTACT_STATUS.UNREAD:
            return 'bg-yellow-100 text-yellow-800'
        case CONTACT_STATUS.READ:
            return 'bg-blue-100 text-blue-800'
        case CONTACT_STATUS.REPLIED:
            return 'bg-green-100 text-green-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}

// Status label
const getStatusLabel = (status) => {
    const option = statusOptions.find(opt => opt.value === status)
    return option ? option.label : status
}

// Status icon
const getStatusIcon = (status) => {
    switch (status) {
        case CONTACT_STATUS.UNREAD:
            return EnvelopeIcon
        case CONTACT_STATUS.READ:
            return EnvelopeOpenIcon
        case CONTACT_STATUS.REPLIED:
            return CheckCircleIcon
        default:
            return EnvelopeIcon
    }
}

// Format date
const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// Pagination
const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        fetchMessages()
    }
}

onMounted(() => {
    fetchMessages()
    fetchStats()
})
</script>

<template>
    <div class="p-6">
        <!-- Header -->
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-800 mb-2">Pesan Kontak</h1>
            <p class="text-gray-600">Kelola pesan dari pengunjung website</p>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600">Belum Dibaca</p>
                        <p class="text-2xl font-bold text-gray-800">{{ stats.unread || 0 }}</p>
                    </div>
                    <EnvelopeIcon class="w-12 h-12 text-yellow-500 opacity-50" />
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600">Sudah Dibaca</p>
                        <p class="text-2xl font-bold text-gray-800">{{ stats.read || 0 }}</p>
                    </div>
                    <EnvelopeOpenIcon class="w-12 h-12 text-blue-500 opacity-50" />
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600">Sudah Dibalas</p>
                        <p class="text-2xl font-bold text-gray-800">{{ stats.replied || 0 }}</p>
                    </div>
                    <CheckCircleIcon class="w-12 h-12 text-green-500 opacity-50" />
                </div>
            </div>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div class="flex flex-col md:flex-row gap-4 items-stretch">
                <!-- Status Filter -->
                <select v-model="selectedStatus" @change="fetchMessages"
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                    </option>
                </select>

                <div class="flex-1"></div>

                <!-- Results Info -->
                <div class="text-sm text-gray-600 flex items-center">
                    Menampilkan {{ messages.length }} dari {{ totalItems }} pesan
                </div>
            </div>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nama & Email
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Subjek
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tanggal
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
                        <tr v-else-if="messages.length === 0">
                            <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                                Tidak ada pesan
                            </td>
                        </tr>
                        <tr v-else v-for="message in messages" :key="message.id" class="hover:bg-gray-50 cursor-pointer"
                            @click="openDetailModal(message)">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getStatusColor(message.status)"
                                    class="px-2 py-1 text-xs font-semibold rounded-full flex items-center gap-1 w-fit">
                                    <component :is="getStatusIcon(message.status)" class="w-4 h-4" />
                                    {{ getStatusLabel(message.status) }}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm font-medium text-gray-900"
                                    :class="{ 'font-bold': message.status === CONTACT_STATUS.UNREAD }">
                                    {{ message.name }}
                                </div>
                                <div class="text-sm text-gray-500">{{ message.email }}</div>
                                <div v-if="message.phone" class="text-sm text-gray-500">{{ message.phone }}</div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm text-gray-900 max-w-md truncate">
                                    {{ message.subject || 'Tanpa subjek' }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div class="flex items-center gap-1">
                                    <ClockIcon class="w-4 h-4" />
                                    {{ formatDate(message.created_at) }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" @click.stop>
                                <button @click="handleDelete(message)" class="text-red-600 hover:text-red-900"
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

        <!-- Detail Modal -->
        <div v-if="showDetailModal && currentMessage"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <!-- Modal Header -->
                <div class="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 class="text-xl font-bold text-gray-800">Detail Pesan</h2>
                        <p class="text-sm text-gray-600 mt-1">{{ formatDate(currentMessage.created_at) }}</p>
                    </div>
                    <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600">
                        <XMarkIcon class="w-6 h-6" />
                    </button>
                </div>

                <!-- Modal Body -->
                <div class="p-6 space-y-6">
                    <!-- Status Badge -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <div class="flex gap-2">
                            <button v-for="option in statusOptions.filter(o => o.value !== 'all')" :key="option.value"
                                @click="handleStatusUpdate(currentMessage, option.value)" :class="[
                                    'px-4 py-2 rounded-lg border transition-colors',
                                    currentMessage.status === option.value
                                        ? 'bg-primary text-white border-primary'
                                        : 'bg-white border-gray-300 hover:bg-gray-50'
                                ]">
                                {{ option.label }}
                            </button>
                        </div>
                    </div>

                    <!-- Contact Info -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                            <p class="text-gray-900">{{ currentMessage.name }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <a :href="`mailto:${currentMessage.email}`" class="text-primary hover:underline">
                                {{ currentMessage.email }}
                            </a>
                        </div>
                        <div v-if="currentMessage.phone">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                            <a :href="`tel:${currentMessage.phone}`" class="text-primary hover:underline">
                                {{ currentMessage.phone }}
                            </a>
                        </div>
                        <div v-if="currentMessage.subject">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Subjek</label>
                            <p class="text-gray-900">{{ currentMessage.subject }}</p>
                        </div>
                    </div>

                    <!-- Message -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Pesan</label>
                        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <p class="text-gray-900 whitespace-pre-wrap">{{ currentMessage.message }}</p>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex justify-between pt-4 border-t border-gray-200">
                        <button @click="handleDelete(currentMessage)"
                            class="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                            Hapus Pesan
                        </button>
                        <button @click="closeDetailModal"
                            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
