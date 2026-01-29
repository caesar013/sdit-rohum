<script setup>
import { ref, onMounted } from 'vue'
import {
    ClipboardDocumentListIcon,
    HomeModernIcon,
    BuildingLibraryIcon,
    ComputerDesktopIcon,
    WifiIcon,
    BuildingStorefrontIcon,
    BeakerIcon,
    TrophyIcon,
    AcademicCapIcon,
    PresentationChartBarIcon,
    LockClosedIcon,
    SparklesIcon,
    ChevronDownIcon
} from '@heroicons/vue/24/outline'
import { getFacilities, getFacilityCategories, getFacilityConditions } from '@/services/api'

// Loading state
const isLoading = ref(false)

// Facilities data from API
const allFacilities = ref([])

// Filter options
const categories = ref([])
const conditions = ref([])

// Computed facilities grouped by importance or category
const mainFacilities = ref([])
const supportingFacilities = ref([])

// Fetch facility categories
const fetchCategories = async () => {
    try {
        const response = await getFacilityCategories()
        if (response.success && response.data) {
            categories.value = response.data
        }
    } catch (error) {
        console.error('Error fetching facility categories:', error)
    }
}

// Fetch facilities from API
const fetchFacilities = async () => {
    isLoading.value = true
    try {
        const response = await getFacilities()

        if (response.success && response.data) {
            allFacilities.value = response.data

            // Group facilities - you can customize this based on your needs
            // For now, let's put the first 7 in main and rest in supporting
            mainFacilities.value = response.data.slice(0, 7).map(facility => ({
                title: facility.name,
                description: facility.description || '',
                icon: getIconName(facility.category),
                detail: `${facility.quantity || 0} Unit`,
                bgColor: getBgColor(facility.category),
                iconColor: getIconColor(facility.category),
                borderColor: getBorderColor(facility.category)
            }))

            supportingFacilities.value = response.data.slice(7).map(facility => ({
                title: facility.name,
                description: facility.description || '',
                icon: getIconName(facility.category),
                iconColor: getIconColor(facility.category)
            }))
        }
    } catch (error) {
        console.error('Error fetching facilities:', error)
        // Fall back to sample data if API fails
        setDefaultFacilities()
    } finally {
        isLoading.value = false
    }
}

// Helper function to get icon based on category
const getIconName = (category) => {
    const iconMap = {
        'classroom': 'ClipboardDocumentListIcon',
        'library': 'BuildingLibraryIcon',
        'laboratory': 'ComputerDesktopIcon',
        'sports': 'TrophyIcon',
        'worship': 'HomeModernIcon',
        'health': 'BeakerIcon',
        'canteen': 'BuildingStorefrontIcon',
        'infrastructure': 'WifiIcon'
    }
    return iconMap[category] || 'BuildingLibraryIcon'
}

// Helper function to get background color based on category
const getBgColor = (category) => {
    const colorMap = {
        'classroom': 'bg-blue-50',
        'library': 'bg-purple-50',
        'laboratory': 'bg-amber-50',
        'sports': 'bg-cyan-50',
        'worship': 'bg-green-50',
        'health': 'bg-emerald-50',
        'canteen': 'bg-yellow-50',
        'infrastructure': 'bg-rose-50'
    }
    return colorMap[category] || 'bg-neutral-50'
}

const getIconColor = (category) => {
    const colorMap = {
        'classroom': 'text-blue-600',
        'library': 'text-purple-600',
        'laboratory': 'text-amber-600',
        'sports': 'text-cyan-600',
        'worship': 'text-green-600',
        'health': 'text-emerald-600',
        'canteen': 'text-yellow-600',
        'infrastructure': 'text-rose-600'
    }
    return colorMap[category] || 'text-neutral-600'
}

const getBorderColor = (category) => {
    const colorMap = {
        'classroom': 'border-blue-200',
        'library': 'border-purple-200',
        'laboratory': 'border-amber-200',
        'sports': 'border-cyan-200',
        'worship': 'border-green-200',
        'health': 'border-emerald-200',
        'canteen': 'border-yellow-200',
        'infrastructure': 'border-rose-200'
    }
    return colorMap[category] || 'border-neutral-200'
}

// Set default facilities as fallback
const setDefaultFacilities = () => {
    mainFacilities.value = [
        {
            title: 'Ruang Kelas',
            description: 'Ruang kelas yang nyaman dan dilengkapi dengan fasilitas modern untuk mendukung proses belajar mengajar yang efektif.',
            icon: 'ClipboardDocumentListIcon',
            detail: '12 Ruang Kelas',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            borderColor: 'border-blue-200'
        },
        {
            title: 'Mushola',
            description: 'Tempat ibadah yang nyaman dan representatif untuk menunjang kegiatan keagamaan siswa dan guru.',
            icon: 'HomeModernIcon',
            detail: 'Terbuka untuk shalat 5 waktu',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            borderColor: 'border-green-200'
        },
        {
            title: 'Perpustakaan',
            description: 'Koleksi buku yang lengkap dan ruang baca yang nyaman untuk mendukung budaya literasi siswa.',
            icon: 'BuildingLibraryIcon',
            detail: '1,500+ Koleksi Buku',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
            borderColor: 'border-purple-200'
        },
        {
            title: 'Ruang Komputer',
            description: 'Laboratorium komputer dengan perangkat terbaru untuk mendukung pembelajaran teknologi informasi.',
            icon: 'ComputerDesktopIcon',
            detail: '25 Unit Komputer',
            bgColor: 'bg-amber-50',
            iconColor: 'text-amber-600',
            borderColor: 'border-amber-200'
        },
        {
            title: 'Internet',
            description: 'Akses internet cepat untuk mendukung pembelajaran digital dan penelitian siswa.',
            icon: 'WifiIcon',
            detail: 'WiFi Area Sekolah',
            bgColor: 'bg-rose-50',
            iconColor: 'text-rose-600',
            borderColor: 'border-rose-200'
        },
        {
            title: 'Kantin',
            description: 'Kantin sehat yang menyediakan makanan bergizi dengan harga terjangkau untuk siswa.',
            icon: 'BuildingStorefrontIcon',
            detail: 'Buka Setiap Hari Sekolah',
            bgColor: 'bg-yellow-50',
            iconColor: 'text-yellow-600',
            borderColor: 'border-yellow-200'
        },
        {
            title: 'Ruang UKS',
            description: 'Unit Kesehatan Sekolah yang lengkap untuk penanganan pertama kesehatan siswa.',
            icon: 'BeakerIcon',
            detail: 'Dokter Piket Mingguan',
            bgColor: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
            borderColor: 'border-emerald-200'
        }
    ]

    supportingFacilities.value = [
        {
            title: 'Lapangan Olahraga',
            description: 'Lapangan serbaguna untuk basket, voli, dan futsal',
            icon: 'TrophyIcon',
            iconColor: 'text-cyan-600'
        },
        {
            title: 'Laboratorium IPA',
            description: 'Peralatan praktikum sains lengkap',
            icon: 'AcademicCapIcon',
            iconColor: 'text-teal-600'
        },
        {
            title: 'Aula Serbaguna',
            description: 'Tempat kegiatan besar dan pertemuan',
            icon: 'PresentationChartBarIcon',
            iconColor: 'text-orange-600'
        },
        {
            title: 'Parkir Aman',
            description: 'Area parkir luas untuk guru dan tamu',
            icon: 'LockClosedIcon',
            iconColor: 'text-indigo-600'
        },
        {
            title: 'Toilet Bersih',
            description: 'Toilet terpisah dan terjaga kebersihannya',
            icon: 'SparklesIcon',
            iconColor: 'text-sky-600'
        },
        {
            title: 'Green House',
            description: 'Area pembelajaran lingkungan hidup',
            icon: 'BeakerIcon',
            iconColor: 'text-lime-600'
        }
    ]
}

const iconComponents = {
    ClipboardDocumentListIcon,
    HomeModernIcon,
    BuildingLibraryIcon,
    ComputerDesktopIcon,
    WifiIcon,
    BuildingStorefrontIcon,
    BeakerIcon,
    TrophyIcon,
    AcademicCapIcon,
    PresentationChartBarIcon,
    LockClosedIcon,
    SparklesIcon
}

// Fetch facilities on mount
onMounted(() => {
    fetchCategories()
    fetchFacilities()
})
</script>

<template>
    <div class="min-h-screen bg-neutral-50">
        <!-- Hero Section -->
        <section class="bg-linear-to-br from-primary to-primary-dark py-20 px-4 relative overflow-hidden">
            <div class="max-w-4xl mx-auto text-center relative z-10">
                <!-- Breadcrumb Badge -->
                <div
                    class="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-white mb-6">
                    <BuildingLibraryIcon class="w-4 h-4 mr-2" />
                    FASILITAS SEKOLAH
                </div>

                <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
                    Sarana & Prasarana
                </h1>
                <p class="text-xl text-white/90 mb-12">
                    Fasilitas Pendidikan Modern untuk Mendukung Proses Belajar Mengajar
                </p>

                <!-- Scroll Indicator -->
                <div>
                    <p class="text-white/80 text-sm mb-2">Jelajahi Fasilitas</p>
                    <ChevronDownIcon class="w-6 h-6 mx-auto text-white animate-bounce" />
                </div>
            </div>

            <!-- Decorative Circle -->
            <div class="absolute -left-20 -top-20 w-64 h-64 bg-white/5 rounded-full"></div>
            <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full"></div>
        </section>

        <!-- Main Content -->
        <section class="py-16 px-4 -mt-16 relative z-10">
            <div class="max-w-5xl mx-auto">

                <!-- Section Header -->
                <div class="bg-white rounded-3xl shadow-lg p-8 mb-8">
                    <h2 class="text-3xl font-bold text-neutral-900 mb-4 text-center">
                        Fasilitas Unggulan SD Negeri Kedungrejo
                    </h2>
                    <p class="text-neutral-600 text-center max-w-3xl mx-auto">
                        Kami menyediakan berbagai sarana dan prasarana modern untuk menunjang kegiatan belajar mengajar
                        yang optimal bagi seluruh siswa.
                    </p>
                </div>

                <!-- Loading State -->
                <div v-if="isLoading" class="text-center py-12">
                    <div class="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                        <p class="text-neutral-600">Memuat data fasilitas...</p>
                    </div>
                </div>

                <!-- Main Facilities Grid -->
                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    <div v-for="(facility, index) in mainFacilities" :key="index"
                        class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                        <!-- Icon Section -->
                        <div
                            :class="[facility.bgColor, 'p-8 flex justify-center items-center h-32 border-b-2', facility.borderColor]">
                            <component :is="iconComponents[facility.icon]"
                                :class="[facility.iconColor, 'w-16 h-16 group-hover:scale-110 transition-transform duration-300']" />
                        </div>

                        <!-- Content Section -->
                        <div class="p-6">
                            <h3 class="text-xl font-bold text-neutral-900 mb-3">
                                {{ facility.title }}
                            </h3>
                            <p class="text-neutral-600 text-sm mb-4 leading-relaxed">
                                {{ facility.description }}
                            </p>

                            <!-- Detail Badge -->
                            <div
                                :class="[facility.bgColor, facility.iconColor, 'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border', facility.borderColor]">
                                <component :is="iconComponents[facility.icon]" class="w-4 h-4 mr-1.5 shrink-0" />
                                {{ facility.detail }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Supporting Facilities -->
                <div class="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div class="bg-linear-to-r from-primary to-primary-dark p-6">
                        <h2 class="text-2xl font-bold text-white flex items-center">
                            <BuildingLibraryIcon class="w-8 h-8 mr-3" />
                            Fasilitas Pendukung Lainnya
                        </h2>
                    </div>

                    <div class="p-8 md:p-12">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div v-for="(facility, index) in supportingFacilities" :key="index"
                                class="flex items-start space-x-4 p-4 rounded-xl hover:bg-neutral-50 transition-colors duration-200">
                                <div class="shrink-0">
                                    <component :is="iconComponents[facility.icon]"
                                        :class="[facility.iconColor, 'w-8 h-8']" />
                                </div>
                                <div>
                                    <h3 class="font-bold text-neutral-900 mb-1">
                                        {{ facility.title }}
                                    </h3>
                                    <p class="text-sm text-neutral-600">
                                        {{ facility.description }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    </div>
</template>
