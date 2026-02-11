<script setup>
import { ref, onMounted } from 'vue'
import { getAchievements, getAchievementCategories, getAchievementLevels } from '@/services/api'
import { TrophyIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useSchoolProfile } from '@/services/schoolProfile'

const { schoolProfile } = useSchoolProfile()

const achievements = ref([])
const isLoading = ref(false)
const selectedCategory = ref('all')
const selectedLevel = ref('all')
const selectedYear = ref('all')
const searchQuery = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(12)
const totalPages = ref(1)
const totalItems = ref(0)

// Options
const categoryOptions = ref([
    { value: 'all', label: 'Semua Kategori' }
])

const levelOptions = ref([
    { value: 'all', label: 'Semua Tingkat' }
])

const yearOptions = ref([
    { value: 'all', label: 'Semua Tahun' }
])

// Lightbox state
const showLightbox = ref(false)
const lightboxImage = ref('')
const lightboxTitle = ref('')

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
            const years = [...new Set(achievements.value.map(a => a.achievement_year).filter(y => y))].sort((a, b) => b - a)
            yearOptions.value = [
                { value: 'all', label: 'Semua Tahun' },
                ...years.map(year => ({ value: year, label: year.toString() }))
            ]
        }
    } catch (error) {
        console.error('Error fetching achievements:', error)
    } finally {
        isLoading.value = false
    }
}

// Fetch categories
const fetchCategories = async () => {
    try {
        const response = await getAchievementCategories()
        if (response.success && response.data) {
            categoryOptions.value = [
                { value: 'all', label: 'Semua Kategori' },
                ...response.data
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
            levelOptions.value = [
                { value: 'all', label: 'Semua Tingkat' },
                ...response.data
            ]
        }
    } catch (error) {
        console.error('Error fetching levels:', error)
    }
}

// Pagination
const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        fetchAchievements()
        window.scrollTo({ top: 0, behavior: 'smooth' })
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

// Get labels
const getCategoryLabel = (value) => {
    const category = categoryOptions.value.find(c => c.value === value)
    return category ? category.label : value
}

const getLevelLabel = (value) => {
    const level = levelOptions.value.find(l => l.value === value)
    return level ? level.label : value
}

// Lightbox functions
const openLightbox = (achievement) => {
    if (achievement.certification_image) {
        lightboxImage.value = achievement.certification_image
        lightboxTitle.value = achievement.title
        showLightbox.value = true
    }
}

const closeLightbox = () => {
    showLightbox.value = false
    lightboxImage.value = ''
    lightboxTitle.value = ''
}

// Initialize
onMounted(() => {
    fetchCategories()
    fetchLevels()
    fetchAchievements()
})
</script>

<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Hero Section -->
        <section class="bg-linear-to-br from-primary to-primary-dark py-20 px-4">
            <div class="max-w-4xl mx-auto text-center">
                <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
                    Prestasi Sekolah
                </h1>
                <p class="text-xl text-white/90 mb-8">
                    Berbagai penghargaan dan prestasi yang telah diraih oleh {{ schoolProfile.school_name }}
                </p>

                <!-- Search Bar -->
                <div class="max-w-2xl mx-auto">
                    <form @submit.prevent="fetchAchievements" class="relative">
                        <input v-model="searchQuery" type="text" placeholder="Cari prestasi..."
                            class="w-full px-6 py-4 pr-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all" />
                        <button type="submit"
                            class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors cursor-pointer">
                            <MagnifyingGlassIcon class="w-5 h-5 text-white" />
                        </button>
                    </form>
                </div>
            </div>
        </section>

        <!-- Filters Section -->
        <section class="py-8 bg-white border-b -mt-12 relative z-10">
            <div class="container mx-auto px-4">
                <div class="max-w-6xl mx-auto">
                    <div class="flex flex-col md:flex-row gap-4 justify-center">
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
                            <option v-for="year in yearOptions" :key="year.value" :value="year.value">
                                {{ year.label }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
        </section>

        <!-- Achievements Grid -->
        <section class="py-12">
            <div class="container mx-auto px-4">
                <div class="max-w-6xl mx-auto">
                    <!-- Loading State -->
                    <div v-if="isLoading" class="text-center py-12">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p class="text-gray-600 mt-4">Memuat data prestasi...</p>
                    </div>

                    <!-- Empty State -->
                    <div v-else-if="achievements.length === 0" class="text-center py-12">
                        <TrophyIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p class="text-gray-600">Tidak ada data prestasi</p>
                    </div>

                    <!-- Achievements Grid -->
                    <div v-else>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div v-for="achievement in achievements" :key="achievement.id"
                                class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <!-- Certificate Image -->
                                <div class="aspect-video bg-gray-100 relative overflow-hidden cursor-pointer"
                                    @click="openLightbox(achievement)">
                                    <img v-if="achievement.certification_image" :src="achievement.certification_image"
                                        :alt="achievement.title"
                                        class="w-full h-full object-cover hover:scale-105 transition-transform" />
                                    <div v-else
                                        class="w-full h-full flex items-center justify-center bg-linear-to-br from-primary to-primary-dark">
                                        <TrophyIcon class="w-20 h-20 text-white opacity-50" />
                                    </div>
                                </div>

                                <!-- Content -->
                                <div class="p-4">
                                    <!-- Badges -->
                                    <div class="flex flex-wrap gap-2 mb-3">
                                        <span :class="getCategoryColor(achievement.category)"
                                            class="px-2 py-1 text-xs font-semibold rounded-full">
                                            {{ getCategoryLabel(achievement.category) }}
                                        </span>
                                        <span :class="getLevelColor(achievement.level)"
                                            class="px-2 py-1 text-xs font-semibold rounded-full">
                                            {{ getLevelLabel(achievement.level) }}
                                        </span>
                                        <span
                                            class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                            {{ achievement.achievement_year }}
                                        </span>
                                    </div>

                                    <!-- Title -->
                                    <h3 class="text-lg font-bold text-gray-900 mb-2">
                                        {{ achievement.title }}
                                    </h3>

                                    <!-- Description -->
                                    <p v-if="achievement.description" class="text-gray-600 text-sm line-clamp-2">
                                        {{ achievement.description }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Pagination -->
                        <div v-if="totalPages > 1" class="mt-12 flex items-center justify-center gap-2">
                            <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
                                class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                Previous
                            </button>

                            <div class="flex gap-2">
                                <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="[
                                    'px-4 py-2 rounded-lg border',
                                    currentPage === page
                                        ? 'bg-primary text-white border-primary'
                                        : 'border-gray-300 hover:bg-gray-50'
                                ]">
                                    {{ page }}
                                </button>
                            </div>

                            <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
                                class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Lightbox Modal -->
        <Transition name="fade">
            <div v-if="showLightbox" @click="closeLightbox"
                class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
                <!-- Close Button -->
                <button @click="closeLightbox"
                    class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10">
                    <XMarkIcon class="w-8 h-8" />
                </button>

                <!-- Image Container -->
                <div @click.stop class="max-w-5xl max-h-[90vh] w-full">
                    <img :src="lightboxImage" :alt="lightboxTitle" class="w-full h-full object-contain" />
                    <p v-if="lightboxTitle" class="text-white text-center mt-4 text-lg">
                        {{ lightboxTitle }}
                    </p>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
