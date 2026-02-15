<script setup>
import { ref, onMounted } from 'vue'
import {
    MagnifyingGlassIcon,
    TrashIcon,
    XMarkIcon,
    ChatBubbleLeftRightIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    NewspaperIcon
} from '@heroicons/vue/24/outline'
import { getAdminComments, updateCommentStatus, deleteComment } from '@/services/adminApi'
import { getNews } from '@/services/api'

// Status constants (from database schema)
const COMMENT_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
}

// State
const comments = ref([])
const isLoading = ref(false)
const showDetailModal = ref(false)
const currentComment = ref(null)

// Filters
const selectedStatus = ref('all')
const selectedNewsId = ref('all')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(20)
const totalPages = ref(1)
const totalItems = ref(0)

// News articles for filter
const newsArticles = ref([])

// Status options
const statusOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: COMMENT_STATUS.PENDING, label: 'Menunggu Persetujuan' },
    { value: COMMENT_STATUS.APPROVED, label: 'Disetujui' },
    { value: COMMENT_STATUS.REJECTED, label: 'Ditolak' }
]

// Stats
const stats = ref({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
})

// Fetch comments
const fetchComments = async () => {
    isLoading.value = true
    try {
        const params = {
            page: currentPage.value,
            limit: itemsPerPage.value,
            status: selectedStatus.value !== 'all' ? selectedStatus.value : undefined,
            news_id: selectedNewsId.value !== 'all' ? selectedNewsId.value : undefined
        }

        const response = await getAdminComments(params)

        if (response.success) {
            comments.value = response.data || []
            if (response.pagination) {
                totalPages.value = response.pagination.totalPages
                totalItems.value = response.pagination.total
            }

            // Calculate stats from current data
            calculateStats()
        }
    } catch (error) {
        console.error('Error fetching comments:', error)
        alert('Gagal memuat data komentar')
    } finally {
        isLoading.value = false
    }
}

// Fetch news articles for filter
const fetchNewsArticles = async () => {
    try {
        const response = await getNews({ limit: 100 })
        if (response.success) {
            newsArticles.value = [
                { id: 'all', title: 'Semua Berita' },
                ...(response.data || [])
            ]
        }
    } catch (error) {
        console.error('Error fetching news articles:', error)
    }
}

// Calculate stats from all comments
const calculateStats = () => {
    stats.value = {
        pending: comments.value.filter(c => c.status === COMMENT_STATUS.PENDING).length,
        approved: comments.value.filter(c => c.status === COMMENT_STATUS.APPROVED).length,
        rejected: comments.value.filter(c => c.status === COMMENT_STATUS.REJECTED).length,
        total: comments.value.length
    }
}

// Modal handlers
const openDetailModal = (comment) => {
    currentComment.value = comment
    showDetailModal.value = true
}

const closeDetailModal = () => {
    showDetailModal.value = false
    currentComment.value = null
}

// Update status
const handleStatusUpdate = async (comment, newStatus) => {
    try {
        await updateCommentStatus(comment.id, { status: newStatus })

        // Update local state
        const index = comments.value.findIndex(c => c.id === comment.id)
        if (index !== -1) {
            comments.value[index].status = newStatus
        }

        if (currentComment.value && currentComment.value.id === comment.id) {
            currentComment.value.status = newStatus
        }

        // Recalculate stats
        calculateStats()

        alert('Status komentar berhasil diperbarui')
    } catch (error) {
        console.error('Error updating status:', error)
        alert('Gagal mengubah status')
    }
}

// Quick approve
const handleQuickApprove = async (comment, event) => {
    event.stopPropagation()
    if (confirm('Setujui komentar ini?')) {
        await handleStatusUpdate(comment, COMMENT_STATUS.APPROVED)
    }
}

// Quick reject
const handleQuickReject = async (comment, event) => {
    event.stopPropagation()
    if (confirm('Tolak komentar ini?')) {
        await handleStatusUpdate(comment, COMMENT_STATUS.REJECTED)
    }
}

// Delete comment
const handleDelete = async (comment, event) => {
    if (event) event.stopPropagation()

    if (!confirm(`Apakah Anda yakin ingin menghapus komentar dari "${comment.author_name}"?`)) {
        return
    }

    try {
        await deleteComment(comment.id)
        alert('Komentar berhasil dihapus')

        if (showDetailModal.value) {
            closeDetailModal()
        }

        fetchComments()
    } catch (error) {
        console.error('Error deleting comment:', error)
        alert('Gagal menghapus komentar')
    }
}

// Status badge color
const getStatusColor = (status) => {
    switch (status) {
        case COMMENT_STATUS.PENDING:
            return 'bg-yellow-100 text-yellow-800'
        case COMMENT_STATUS.APPROVED:
            return 'bg-green-100 text-green-800'
        case COMMENT_STATUS.REJECTED:
            return 'bg-red-100 text-red-800'
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
        case COMMENT_STATUS.PENDING:
            return ClockIcon
        case COMMENT_STATUS.APPROVED:
            return CheckCircleIcon
        case COMMENT_STATUS.REJECTED:
            return XCircleIcon
        default:
            return ChatBubbleLeftRightIcon
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

// Get news title
const getNewsTitle = (newsId) => {
    const news = newsArticles.value.find(n => n.id === newsId)
    return news ? news.title : `Berita #${newsId}`
}

// Pagination
const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        fetchComments()
    }
}

onMounted(() => {
    fetchNewsArticles()
    fetchComments()
})
</script>

<template>
    <div class="p-6">
        <!-- Header -->
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-800 mb-2">Moderasi Komentar</h1>
            <p class="text-gray-600">Kelola komentar dari pengunjung pada artikel berita</p>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600">Menunggu</p>
                        <p class="text-2xl font-bold text-gray-800">{{ stats.pending }}</p>
                    </div>
                    <ClockIcon class="w-12 h-12 text-yellow-500 opacity-50" />
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600">Disetujui</p>
                        <p class="text-2xl font-bold text-gray-800">{{ stats.approved }}</p>
                    </div>
                    <CheckCircleIcon class="w-12 h-12 text-green-500 opacity-50" />
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-500">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600">Ditolak</p>
                        <p class="text-2xl font-bold text-gray-800">{{ stats.rejected }}</p>
                    </div>
                    <XCircleIcon class="w-12 h-12 text-red-500 opacity-50" />
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600">Total</p>
                        <p class="text-2xl font-bold text-gray-800">{{ stats.total }}</p>
                    </div>
                    <ChatBubbleLeftRightIcon class="w-12 h-12 text-blue-500 opacity-50" />
                </div>
            </div>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div class="flex flex-col md:flex-row gap-4">
                <!-- Status Filter -->
                <select v-model="selectedStatus" @change="currentPage = 1; fetchComments()"
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                    </option>
                </select>

                <!-- News Filter -->
                <select v-model="selectedNewsId" @change="currentPage = 1; fetchComments()"
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option v-for="news in newsArticles" :key="news.id" :value="news.id">
                        {{ news.title }}
                    </option>
                </select>

                <!-- Results Info -->
                <div class="text-sm text-gray-600 flex items-center whitespace-nowrap">
                    {{ comments.length }} dari {{ totalItems }} komentar
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
                                Penulis
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Komentar
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Berita
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
                            <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                                Memuat data...
                            </td>
                        </tr>
                        <tr v-else-if="comments.length === 0">
                            <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                                Tidak ada komentar
                            </td>
                        </tr>
                        <tr v-else v-for="comment in comments" :key="comment.id" class="hover:bg-gray-50 cursor-pointer"
                            @click="openDetailModal(comment)">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getStatusColor(comment.status)"
                                    class="px-2 py-1 text-xs font-semibold rounded-full flex items-center gap-1 w-fit">
                                    <component :is="getStatusIcon(comment.status)" class="w-4 h-4" />
                                    {{ getStatusLabel(comment.status) }}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm font-medium text-gray-900">{{ comment.author_name }}</div>
                                <div class="text-sm text-gray-500">{{ comment.author_email }}</div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm text-gray-900 max-w-md line-clamp-2">
                                    {{ comment.comment }}
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-1 text-sm text-gray-600">
                                    <NewspaperIcon class="w-4 h-4 shrink-0" />
                                    <span class="truncate max-w-xs">{{ getNewsTitle(comment.news_id) }}</span>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ formatDate(comment.created_at) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" @click.stop>
                                <div class="flex justify-end gap-2">
                                    <button v-if="comment.status !== COMMENT_STATUS.APPROVED"
                                        @click="handleQuickApprove(comment, $event)"
                                        class="text-green-600 hover:text-green-900" title="Setujui">
                                        <CheckCircleIcon class="w-5 h-5" />
                                    </button>
                                    <button v-if="comment.status !== COMMENT_STATUS.REJECTED"
                                        @click="handleQuickReject(comment, $event)"
                                        class="text-red-600 hover:text-red-900" title="Tolak">
                                        <XCircleIcon class="w-5 h-5" />
                                    </button>
                                    <button @click="handleDelete(comment, $event)"
                                        class="text-gray-600 hover:text-gray-900" title="Hapus">
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

        <!-- Detail Modal -->
        <div v-if="showDetailModal && currentComment"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <!-- Modal Header -->
                <div class="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 class="text-xl font-bold text-gray-800">Detail Komentar</h2>
                        <p class="text-sm text-gray-600 mt-1">{{ formatDate(currentComment.created_at) }}</p>
                    </div>
                    <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600">
                        <XMarkIcon class="w-6 h-6" />
                    </button>
                </div>

                <!-- Modal Body -->
                <div class="p-6 space-y-6">
                    <!-- Status Actions -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Status Moderasi</label>
                        <div class="flex gap-2">
                            <button @click="handleStatusUpdate(currentComment, COMMENT_STATUS.PENDING)" :class="[
                                'flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors',
                                currentComment.status === COMMENT_STATUS.PENDING
                                    ? 'bg-yellow-500 text-white border-yellow-500'
                                    : 'bg-white border-gray-300 hover:bg-gray-50'
                            ]">
                                <ClockIcon class="w-5 h-5" />
                                Menunggu
                            </button>
                            <button @click="handleStatusUpdate(currentComment, COMMENT_STATUS.APPROVED)" :class="[
                                'flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors',
                                currentComment.status === COMMENT_STATUS.APPROVED
                                    ? 'bg-green-500 text-white border-green-500'
                                    : 'bg-white border-gray-300 hover:bg-gray-50'
                            ]">
                                <CheckCircleIcon class="w-5 h-5" />
                                Disetujui
                            </button>
                            <button @click="handleStatusUpdate(currentComment, COMMENT_STATUS.REJECTED)" :class="[
                                'flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors',
                                currentComment.status === COMMENT_STATUS.REJECTED
                                    ? 'bg-red-500 text-white border-red-500'
                                    : 'bg-white border-gray-300 hover:bg-gray-50'
                            ]">
                                <XCircleIcon class="w-5 h-5" />
                                Ditolak
                            </button>
                        </div>
                    </div>

                    <!-- News Article -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Artikel Berita</label>
                        <p class="text-gray-900">{{ getNewsTitle(currentComment.news_id) }}</p>
                    </div>

                    <!-- Author Info -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Penulis</label>
                            <p class="text-gray-900">{{ currentComment.author_name }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <a :href="`mailto:${currentComment.author_email}`" class="text-primary hover:underline">
                                {{ currentComment.author_email }}
                            </a>
                        </div>
                    </div>

                    <!-- Comment -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Komentar</label>
                        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <p class="text-gray-900 whitespace-pre-wrap">{{ currentComment.comment }}</p>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex justify-between pt-4 border-t border-gray-200">
                        <button @click="handleDelete(currentComment)"
                            class="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                            Hapus Komentar
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
