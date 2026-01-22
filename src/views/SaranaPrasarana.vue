<script setup>
import { ref } from 'vue'
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

// Facilities data - will be fetched from backend in the future
const mainFacilities = ref([
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
])

const supportingFacilities = ref([
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
])

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

                <!-- Main Facilities Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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
