<script setup>
import { ref, onMounted } from 'vue'
import {
    AcademicCapIcon,
    MagnifyingGlassCircleIcon
} from '@heroicons/vue/24/outline'
import { getStudents, getAcademicYears } from '@/services/api'

// Filter options
const academicYears = ref([
    { value: 'all', label: 'Semua Tahun Pelajaran' }
])

const classes = ref([
    { value: 'all', label: 'Semua Kelas' },
    { value: '1', label: 'Kelas 1' },
    { value: '2', label: 'Kelas 2' },
    { value: '3', label: 'Kelas 3' },
    { value: '4', label: 'Kelas 4' },
    { value: '5', label: 'Kelas 5' },
    { value: '6', label: 'Kelas 6' }
])

// Selected filters
const selectedYear = ref('all')
const selectedClass = ref('all')
const showResults = ref(false)
const isLoading = ref(false)

// Students data from API
const allStudents = ref([])

// Fetch academic years on mount
const fetchAcademicYears = async () => {
    try {
        const response = await getAcademicYears()
        if (response.success && response.data) {
            // Add fetched years to options
            const yearOptions = response.data.map(year => ({
                value: year.year,
                label: year.year
            }))
            academicYears.value = [
                { value: 'all', label: 'Semua Tahun Pelajaran' },
                ...yearOptions
            ]
        }
    } catch (error) {
        console.error('Error fetching academic years:', error)
    }
}

// Fetch students from API
const fetchStudents = async () => {
    isLoading.value = true
    showResults.value = true
    try {
        const params = {
            academic_year: selectedYear.value !== 'all' ? selectedYear.value : undefined,
            grade: selectedClass.value !== 'all' ? selectedClass.value : undefined,
            status: 'active' // Only show active students
        }

        const response = await getStudents(params)

        if (response.success) {
            allStudents.value = response.data
        }
    } catch (error) {
        console.error('Error fetching students:', error)
        allStudents.value = []
    } finally {
        isLoading.value = false
    }
}

// Functions
const handleSearch = () => {
    fetchStudents()
}

const handleImageError = (event) => {
    event.target.src = 'https://via.placeholder.com/200x250/0d5f5f/ffffff?text=Foto+Siswa'
}

// Fetch academic years on mount
onMounted(() => {
    fetchAcademicYears()
})
</script>

<template>
    <div class="min-h-screen bg-neutral-50">
        <!-- Hero Section -->
        <section class="bg-linear-to-br from-primary to-primary-dark py-20 px-4">
            <div class="max-w-4xl mx-auto text-center">
                <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
                    Direktori Peserta Didik
                </h1>
                <p class="text-xl text-white/90">
                    Daftar Peserta Didik SD Negeri Kedungrejo
                </p>
            </div>
        </section>

        <!-- Filter Section -->
        <section class="py-8 px-4 -mt-12 relative z-10">
            <div class="max-w-6xl mx-auto">
                <div class="bg-white rounded-2xl shadow-xl p-6">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">

                        <!-- Tahun Pelajaran -->
                        <div>
                            <label class="block text-sm font-semibold text-neutral-700 mb-2">
                                Tahun Pelajaran
                            </label>
                            <select v-model="selectedYear"
                                class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer">
                                <option v-for="year in academicYears" :key="year.value" :value="year.value">
                                    {{ year.label }}
                                </option>
                            </select>
                        </div>

                        <!-- Kelas -->
                        <div>
                            <label class="block text-sm font-semibold text-neutral-700 mb-2">
                                Kelas
                            </label>
                            <select v-model="selectedClass"
                                class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer">
                                <option v-for="cls in classes" :key="cls.value" :value="cls.value">
                                    {{ cls.label }}
                                </option>
                            </select>
                        </div>

                        <!-- Tampilkan Button -->
                        <div>
                            <button @click="handleSearch"
                                class="w-full px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors flex items-center justify-center cursor-pointer">
                                <MagnifyingGlassCircleIcon class="w-5 h-5 mr-2" />
                                Tampilkan
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </section>

        <!-- Students Grid -->
        <section v-if="showResults" class="py-12 px-4">
            <div class="max-w-6xl mx-auto">

                <!-- Loading State -->
                <div v-if="isLoading" class="text-center py-12">
                    <div class="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                        <p class="text-neutral-600">Memuat data peserta didik...</p>
                    </div>
                </div>

                <!-- No Results -->
                <div v-else-if="allStudents.length === 0" class="text-center py-12">
                    <div class="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                        <AcademicCapIcon class="w-16 h-16 mx-auto text-neutral-300 mb-4" />
                        <h3 class="text-xl font-bold text-neutral-900 mb-2">Tidak ada data</h3>
                        <p class="text-neutral-600">
                            Tidak ditemukan peserta didik dengan filter yang dipilih
                        </p>
                    </div>
                </div>

                <!-- Students Grid -->
                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="student in allStudents" :key="student.id"
                        class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                        <!-- Student Photo -->
                        <div class="relative overflow-hidden bg-linear-to-br from-primary/10 to-primary/5">
                            <img :src="student.photo" :alt="student.name" @error="handleImageError"
                                class="w-full h-64 object-cover object-top" />
                        </div>

                        <!-- Student Info -->
                        <div class="p-6">
                            <h3 class="text-lg font-bold text-neutral-900 mb-3">
                                {{ student.name }}
                            </h3>

                            <div class="space-y-2 text-sm text-neutral-600">
                                <div class="flex justify-between">
                                    <span class="font-medium">NISN:</span>
                                    <span class="text-neutral-900">{{ student.nisn || '-' }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="font-medium">NIS:</span>
                                    <span class="text-neutral-900">{{ student.nis || '-' }}</span>
                                </div>
                                <div v-if="student.grade" class="flex justify-between">
                                    <span class="font-medium">Kelas:</span>
                                    <span class="text-neutral-900">Kelas {{ student.grade }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="font-medium">Jenis Kelamin:</span>
                                    <span class="text-neutral-900">{{ student.gender || '-' }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    </div>
</template>
