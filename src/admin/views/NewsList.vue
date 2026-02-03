<script setup>
import { ref, onMounted, computed } from 'vue'
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { getAdminNews, getAdminNewsById, createNews, updateNews, deleteNews } from '../../services/adminApi'
import { getNewsCategories, getNewsStatuses } from '../../services/api'

const newsList = ref([])
const isLoading = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const searchQuery = ref('')
const selectedCategory = ref('')

const categories = ref([])
const statuses = ref([])
const selectedStatus = ref('')

// Modal state
const isModalOpen = ref(false)
const isEditMode = ref(false)
const isSubmitting = ref(false)
const newsForm = ref({
    title: '',
    content: '',
    category: '',
    status: 'draft',
    featured_image: null
})
const imagePreview = ref(null)
const editingNewsId = ref(null)

// Fetch categories and statuses from API
const fetchCategoriesAndStatuses = async () => {
    try {
        const [categoriesRes, statusesRes] = await Promise.all([
            getNewsCategories(),
            getNewsStatuses()
        ])

        if (categoriesRes.success) {
            categories.value = categoriesRes.data
        }

        if (statusesRes.success) {
            statuses.value = statusesRes.data
        }

        // Set default category if available
        if (categories.value.length > 0 && !newsForm.value.category) {
            newsForm.value.category = categories.value[0].value
        }
    } catch (error) {
        console.error('Error fetching categories/statuses:', error)
    }
}

// Fetch news from API
const fetchNews = async () => {
    isLoading.value = true
    try {
        const params = {
            page: currentPage.value,
            limit: 10
        }

        if (searchQuery.value) {
            params.search = searchQuery.value
        }

        if (selectedCategory.value && selectedCategory.value !== 'all') {
            params.category = selectedCategory.value
        }

        if (selectedStatus.value && selectedStatus.value !== 'all' && selectedStatus.value !== '') {
            params.status = selectedStatus.value
        }

        const response = await getAdminNews(params)

        if (response.success) {
            newsList.value = response.data
            if (response.pagination) {
                totalPages.value = response.pagination.totalPages
                currentPage.value = response.pagination.page
            }
        }
    } catch (error) {
        console.error('Error fetching news:', error)
        alert('Failed to fetch news articles')
    } finally {
        isLoading.value = false
    }
}

const openCreateModal = () => {
    isEditMode.value = false
    editingNewsId.value = null
    newsForm.value = {
        title: '',
        content: '',
        category: categories.value.length > 0 ? categories.value[0].value : '',
        status: 'draft',
        featured_image: null
    }
    imagePreview.value = null
    isModalOpen.value = true
}

const openEditModal = async (news) => {
    isEditMode.value = true
    editingNewsId.value = news.id

    try {
        const response = await getAdminNewsById(news.id)

        if (response.success) {
            const data = response.data
            newsForm.value = {
                title: data.title,
                content: data.content,
                category: data.category,
                status: data.status,
                featured_image: null
            }
            imagePreview.value = data.featured_image_url || null
            isModalOpen.value = true
        }
    } catch (error) {
        console.error('Error fetching news:', error)
        alert('Failed to load news article')
    }
}

const closeModal = () => {
    isModalOpen.value = false
    newsForm.value = {
        title: '',
        content: '',
        category: categories.value.length > 0 ? categories.value[0].value : '',
        status: 'draft',
        featured_image: null
    }
    imagePreview.value = null
    editingNewsId.value = null
}

const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
        newsForm.value.featured_image = file
        const reader = new FileReader()
        reader.onload = (e) => {
            imagePreview.value = e.target.result
        }
        reader.readAsDataURL(file)
    }
}

const handleSubmit = async () => {
    if (!newsForm.value.title || !newsForm.value.content) {
        alert('Please fill in all required fields')
        return
    }

    isSubmitting.value = true
    try {
        const formData = new FormData()
        formData.append('title', newsForm.value.title)
        formData.append('content', newsForm.value.content)
        formData.append('category', newsForm.value.category)
        formData.append('status', newsForm.value.status)

        if (newsForm.value.featured_image) {
            formData.append('featured_image', newsForm.value.featured_image)
        }

        let response
        if (isEditMode.value) {
            response = await updateNews(editingNewsId.value, formData)
        } else {
            response = await createNews(formData)
        }

        if (response.success) {
            alert(isEditMode.value ? 'News updated successfully!' : 'News created successfully!')
            closeModal()
            fetchNews()
        }
    } catch (error) {
        console.error('Error saving news:', error)
        alert('Failed to save news article')
    } finally {
        isSubmitting.value = false
    }
}

const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this news article?')) {
        try {
            const response = await deleteNews(id)

            if (response.success) {
                alert('News deleted successfully!')
                fetchNews()
            }
        } catch (error) {
            console.error('Error deleting news:', error)
            alert('Failed to delete news article')
        }
    }
}

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const getStatusColor = (status) => {
    return status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
}

const handleSearch = () => {
    currentPage.value = 1
    fetchNews()
}

const handlePageChange = (page) => {
    currentPage.value = page
    fetchNews()
}

onMounted(async () => {
    await fetchCategoriesAndStatuses()
    fetchNews()
})
</script>

<template>
    <div>
        <!-- Page Header -->
        <div class="flex flex-wrap items-center justify-between mb-6 -mx-3">
            <div class="w-full px-3 md:w-1/2">
                <h1 class="text-3xl font-bold text-gray-800">News Management</h1>
                <p class="text-gray-600">Manage all news articles</p>
            </div>
            <div class="w-full px-3 md:w-1/2 md:text-right">
                <button @click="openCreateModal"
                    class="inline-flex items-center px-6 py-3 font-bold text-white transition-all bg-blue-500 rounded-lg hover:bg-blue-600 hover:shadow-lg">
                    <PlusIcon class="w-5 h-5 mr-2" />
                    Create News
                </button>
            </div>
        </div>

        <!-- Filters -->
        <div class="flex flex-wrap mb-6 -mx-3">
            <div class="w-full px-3">
                <div
                    class="relative flex flex-col min-w-0 wrap-break-words bg-white shadow-xl rounded-2xl bg-clip-border">
                    <div class="p-6">
                        <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div>
                                <label class="block mb-2 text-sm font-medium text-gray-700">Search</label>
                                <input v-model="searchQuery" @keyup.enter="handleSearch" type="text"
                                    placeholder="Search news..."
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label class="block mb-2 text-sm font-medium text-gray-700">Category</label>
                                <select v-model="selectedCategory" @change="handleSearch"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">All Categories</option>
                                    <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                                        {{ cat.label }}
                                    </option>
                                </select>
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

        <!-- News Table -->
        <div class="flex flex-wrap -mx-3">
            <div class="flex-none w-full max-w-full px-3">
                <div
                    class="relative flex flex-col min-w-0 mb-6 wrap-break-words bg-white border-0 border-transparent border-solid shadow-xl rounded-2xl bg-clip-border">
                    <div class="p-6 pb-0 mb-0 border-b-0 border-b-solid rounded-t-2xl border-b-transparent">
                        <h6 class="font-bold text-gray-800">News Articles</h6>
                    </div>
                    <div class="flex-auto px-0 pt-0 pb-2">
                        <div class="p-0 overflow-x-auto">
                            <table class="items-center w-full mb-0 align-top border-collapse text-slate-500">
                                <thead class="align-bottom">
                                    <tr>
                                        <th
                                            class="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                            Title
                                        </th>
                                        <th
                                            class="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                            Category
                                        </th>
                                        <th
                                            class="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                            Status
                                        </th>
                                        <th
                                            class="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                            Views
                                        </th>
                                        <th
                                            class="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                            Date
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
                                    <tr v-else-if="newsList.length === 0">
                                        <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                                            No news articles found
                                        </td>
                                    </tr>
                                    <tr v-else v-for="news in newsList" :key="news.id">
                                        <td class="p-2 align-middle bg-transparent border-b whitespace-nowrap">
                                            <div class="flex px-2 py-1">
                                                <div class="flex flex-col justify-center">
                                                    <h6 class="mb-0 text-sm leading-normal text-gray-800">{{ news.title
                                                        }}</h6>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="p-2 align-middle bg-transparent border-b whitespace-nowrap">
                                            <span class="text-xs font-semibold leading-tight text-slate-400">{{
                                                news.category }}</span>
                                        </td>
                                        <td
                                            class="p-2 text-center align-middle bg-transparent border-b whitespace-nowrap">
                                            <span :class="getStatusColor(news.status)"
                                                class="px-2 py-1 text-xs font-semibold rounded-full">
                                                {{ news.status }}
                                            </span>
                                        </td>
                                        <td
                                            class="p-2 text-center align-middle bg-transparent border-b whitespace-nowrap">
                                            <span class="text-xs font-semibold leading-tight text-slate-400">{{
                                                news.views }}</span>
                                        </td>
                                        <td
                                            class="p-2 text-center align-middle bg-transparent border-b whitespace-nowrap">
                                            <span class="text-xs font-semibold leading-tight text-slate-400">{{
                                                formatDate(news.created_at) }}</span>
                                        </td>
                                        <td class="p-2 align-middle bg-transparent border-b whitespace-nowrap">
                                            <div class="flex items-center justify-center gap-2">
                                                <button @click="openEditModal(news)"
                                                    class="p-2 text-blue-600 transition-colors hover:text-blue-800"
                                                    title="Edit">
                                                    <PencilIcon class="w-5 h-5" />
                                                </button>
                                                <button @click="handleDelete(news.id)"
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
            <div class="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl m-4">
                <!-- Modal Header -->
                <div class="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b border-gray-200">
                    <h2 class="text-2xl font-bold text-gray-800">
                        {{ isEditMode ? 'Edit News' : 'Create News' }}
                    </h2>
                    <button @click="closeModal" class="p-2 text-gray-500 transition-colors hover:text-gray-700">
                        <XMarkIcon class="w-6 h-6" />
                    </button>
                </div>

                <!-- Modal Body -->
                <div class="p-6">
                    <form @submit.prevent="handleSubmit" class="space-y-6">
                        <!-- Title -->
                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-700">
                                Title <span class="text-red-500">*</span>
                            </label>
                            <input v-model="newsForm.title" type="text" required
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter news title" />
                        </div>

                        <!-- Category & Status -->
                        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label class="block mb-2 text-sm font-medium text-gray-700">Category</label>
                                <select v-model="newsForm.category"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                                        {{ cat.label }}
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label class="block mb-2 text-sm font-medium text-gray-700">Status</label>
                                <select v-model="newsForm.status"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option v-for="stat in statuses" :key="stat.value" :value="stat.value">
                                        {{ stat.label }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <!-- Content -->
                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-700">
                                Content <span class="text-red-500">*</span>
                            </label>
                            <textarea v-model="newsForm.content" required rows="10"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter news content"></textarea>
                        </div>

                        <!-- Featured Image -->
                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-700">Featured Image</label>
                            <input type="file" @change="handleImageChange" accept="image/*"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <div v-if="imagePreview" class="mt-4">
                                <img :src="imagePreview" alt="Preview" class="max-w-md rounded-lg shadow-md" />
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
