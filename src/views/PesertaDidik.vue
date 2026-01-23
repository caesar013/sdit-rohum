<script setup>
import { ref, computed } from 'vue'
import {
    AcademicCapIcon,
    MagnifyingGlassCircleIcon
} from '@heroicons/vue/24/outline'

// Filter options
const academicYears = ref([
    { value: 'all', label: 'Semua Tahun Pelajaran' },
    { value: '2020-2021', label: '2020-2021' },
    { value: '2021-2022', label: '2021-2022' },
    { value: '2022-2023', label: '2022-2023' },
    { value: '2023-2024', label: '2023-2024' },
    { value: '2024-2025', label: '2024-2025' },
    { value: '2025-2026', label: '2025-2026' }
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

// Sample student data - will be fetched from backend
const allStudents = ref([
    {
        id: 1,
        name: 'ADHA ADI GAMA',
        studentNumber: '1387',
        photo: '/placeholder-student-1.jpg',
        academicYear: '2024-2025',
        class: '4',
        gender: 'Laki-Laki'
    },
    {
        id: 2,
        name: 'ADHYASTHA PRASAJA SAMSON',
        studentNumber: '1388',
        photo: '/placeholder-student-2.jpg',
        academicYear: '2024-2025',
        class: '4',
        gender: 'Laki-Laki'
    },
    {
        id: 3,
        name: 'ALIFATANTI ISNAINI WIDARWATI',
        studentNumber: '1389',
        photo: '/placeholder-student-3.jpg',
        academicYear: '2024-2025',
        class: '4',
        gender: 'Perempuan'
    },
    {
        id: 4,
        name: 'ALYA AZIZAH',
        studentNumber: '1390',
        photo: '/placeholder-student-4.jpg',
        academicYear: '2024-2025',
        class: '4',
        gender: 'Perempuan'
    },
    {
        id: 5,
        name: 'ALYA AZIZAH RAMADHANI',
        studentNumber: '1391',
        photo: '/placeholder-student-5.jpg',
        academicYear: '2024-2025',
        class: '4',
        gender: 'Perempuan'
    },
    {
        id: 6,
        name: 'ARADHANA BRIAN NARENDRA',
        studentNumber: '1392',
        photo: '/placeholder-student-6.jpg',
        academicYear: '2024-2025',
        class: '4',
        gender: 'Perempuan'
    },
    {
        id: 7,
        name: 'AULIA ANNISA SABRINA',
        studentNumber: '1393',
        photo: '/placeholder-student-7.jpg',
        academicYear: '2024-2025',
        class: '4',
        gender: 'Perempuan'
    },
    {
        id: 8,
        name: 'DAVID SATRIYA ALDIANO',
        studentNumber: '1394',
        photo: '/placeholder-student-8.jpg',
        academicYear: '2024-2025',
        class: '4',
        gender: 'Laki-Laki'
    },
    {
        id: 9,
        name: 'DEAN NURRIZKY MAHARDIKA',
        studentNumber: '1395',
        photo: '/placeholder-student-9.jpg',
        academicYear: '2024-2025',
        class: '4',
        gender: 'Laki-Laki'
    },
    {
        id: 10,
        name: 'NADYA PUTRI KURNIASIH',
        studentNumber: '1397',
        photo: '/placeholder-student-10.jpg',
        academicYear: '2024-2025',
        class: '4',
        gender: 'Perempuan'
    },
    {
        id: 11,
        name: 'RIFKY CAHYA SETYA AJI',
        studentNumber: '1398',
        photo: '/placeholder-student-11.jpg',
        academicYear: '2024-2025',
        class: '4',
        gender: 'Laki-Laki'
    },
    {
        id: 12,
        name: 'ZAHRA NAFIATURROHMAH',
        studentNumber: '1400',
        photo: '/placeholder-student-12.jpg',
        academicYear: '2024-2025',
        class: '4',
        gender: 'Perempuan'
    }
])

// Filtered students based on selected filters
const filteredStudents = computed(() => {
    if (!showResults.value) return []

    return allStudents.value.filter(student => {
        const yearMatch = selectedYear.value === 'all' || student.academicYear === selectedYear.value
        const classMatch = selectedClass.value === 'all' || student.class === selectedClass.value
        return yearMatch && classMatch
    })
})

// Functions - will be implemented when backend is ready
const handleSearch = () => {
    // TODO: Fetch students from backend API based on filters
    showResults.value = true
}

const handleImageError = (event) => {
    event.target.src = 'https://via.placeholder.com/200x250/0d5f5f/ffffff?text=Foto+Siswa'
}
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

                <!-- No Results -->
                <div v-if="filteredStudents.length === 0" class="text-center py-12">
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
                    <div v-for="student in filteredStudents" :key="student.id"
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
                                    <span class="font-medium">No Induk Siswa:</span>
                                    <span class="text-neutral-900">{{ student.studentNumber }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="font-medium">Tahun Pelajaran:</span>
                                    <span class="text-neutral-900">{{ student.academicYear }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="font-medium">Kelas:</span>
                                    <span class="text-neutral-900">{{ student.class }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="font-medium">Jenis Kelamin:</span>
                                    <span class="text-neutral-900">{{ student.gender }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    </div>
</template>
