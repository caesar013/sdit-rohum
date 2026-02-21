<script setup>
import { ref, onMounted, computed } from 'vue'
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, PhotoIcon } from '@heroicons/vue/24/outline'
import { getAdminNews, getAdminNewsById, createNews, updateNews, deleteNews } from '../../services/adminApi'
import { getNewsCategories, getNewsStatuses } from '../../services/api'

const newsList = ref([])
const isLoading = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
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
                totalItems.value = response.pagination.total
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
    <div class="p-6">
        <!-- Header & Actions -->
        <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h1 class="text-2xl font-bold text-gray-800 mb-2">News Management</h1>
                    <p class="text-gray-600">Manage all news articles</p>
                </div>
                <button @click="openCreateModal"
                    class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap">
                    <PlusIcon class="w-5 h-5" />
                    Create News
                </button>
            </div>

            <!-- Filters -->
            <div class="flex flex-col md:flex-row gap-4 mb-4">
                <div class="flex-1">
                    <div class="relative">
                        <input v-model="searchQuery" @keyup.enter="handleSearch" type="text"
                            placeholder="Search news..."
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
                    </div>
                </div>
                <select v-model="selectedCategory" @change="handleSearch"
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="">All Categories</option>
                    <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                        {{ cat.label }}
                    </option>
                </select>
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
                Menampilkan {{ newsList.length }} dari {{ totalItems }} berita
            </div>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Judul
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Kategori
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
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
                        <tr v-else-if="newsList.length === 0">
                            <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                                Tidak ada data berita
                            </td>
                        </tr>
                        <tr v-else v-for="news in newsList" :key="news.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4">
                                <div class="text-sm font-medium text-gray-900">{{ news.title }}</div>
                                <div class="text-sm text-gray-500">{{ news.slug }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ news.category }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getStatusColor(news.status)"
                                    class="px-2 py-1 text-xs font-semibold rounded-full">
                                    {{ news.status }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ formatDate(news.created_at) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button @click="openEditModal(news)" class="text-primary hover:text-primary-dark mr-3"
                                    title="Edit">
                                    <PencilIcon class="w-5 h-5" />
                                </button>
                                <button @click="handleDelete(news.id)" class="text-red-600 hover:text-red-900"
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
                            <div class="flex items-center gap-4">
                                <div
                                    class="w-32 h-32 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                                    <img v-if="imagePreview" :src="imagePreview" alt="Preview"
                                        class="w-full h-full object-cover" />
                                    <PhotoIcon v-else class="w-12 h-12 text-gray-400" />
                                </div>
                                <div>
                                    <input type="file" @change="handleImageChange" accept="image/*" class="hidden"
                                        id="image-upload" />
                                    <label for="image-upload"
                                        class="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                        <PhotoIcon class="w-5 h-5" />
                                        Choose Image
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
