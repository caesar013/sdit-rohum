<script setup>
import { ref, computed } from 'vue'
import {
    MagnifyingGlassIcon,
    UserGroupIcon,
    PlusCircleIcon,
    EnvelopeIcon,
    XMarkIcon,
    CalendarIcon,
    PhotoIcon,
    ChevronDownIcon
} from '@heroicons/vue/24/outline'

// Modals state
const showAlumniFormModal = ref(false)
const showContactAdminModal = ref(false)

// Years for filter - from 2017 to current year (2026)
const currentYear = new Date().getFullYear()
const years = ref([
    { value: 'all', label: 'Semua Tahun' },
    ...Array.from({ length: currentYear - 2017 + 1 }, (_, i) => ({
        value: String(2017 + i),
        label: String(2017 + i)
    })).reverse()
])

// Search and filter
const searchQuery = ref('')
const selectedYear = ref('all')

// Alumni form data
const alumniForm = ref({
    photo: null,
    fullName: '',
    graduationYear: '',
    birthPlace: '',
    birthDate: '',
    email: '',
    phone: '',
    gender: '',
    address: ''
})

// Contact admin form data
const contactForm = ref({
    name: '',
    email: '',
    subject: 'Meminta Informasi Alumni',
    message: ''
})

// Subject options for contact form
const subjectOptions = ref([
    'Meminta Informasi Alumni',
    'Pertanyaan Umum',
    'Verifikasi Data Alumni',
    'Lainnya'
])

// Gender options
const genderOptions = ref([
    { value: '', label: 'Pilih Jenis Kelamin' },
    { value: 'Laki-laki', label: 'Laki-laki' },
    { value: 'Perempuan', label: 'Perempuan' }
])

// Sample alumni data - will be fetched from backend
const allAlumni = ref([
    {
        id: 1,
        name: 'Alvaro Prawira Putro Santoso',
        studentNumber: '1369',
        photo: '/placeholder-alumni-1.jpg',
        graduationYear: '2025',
        email: 'alvaro.prawira.putro.sant...',
        status: 'tidak-aktif'
    },
    {
        id: 2,
        name: 'Andhika Martino',
        studentNumber: '1370',
        photo: '/placeholder-alumni-2.jpg',
        graduationYear: '2025',
        email: 'andhika.martino@sdnked...',
        status: 'lulus'
    },
    {
        id: 3,
        name: 'Fajar Nofriyanto',
        studentNumber: '1371',
        photo: '/placeholder-alumni-3.jpg',
        graduationYear: '2025',
        email: 'fajar.nofriyanto@sdnked...',
        status: 'tidak-aktif'
    },
    {
        id: 4,
        name: 'Gilang Radinka Timur',
        studentNumber: '1372',
        photo: '/placeholder-alumni-4.jpg',
        graduationYear: '2025',
        email: 'gilang.radinka@sdnked...',
        status: 'tidak-aktif'
    }
])

// Filtered alumni based on search and year
const filteredAlumni = computed(() => {
    let result = allAlumni.value

    // Filter by year
    if (selectedYear.value !== 'all') {
        result = result.filter(alumni => alumni.graduationYear === selectedYear.value)
    }

    // Filter by search query
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(alumni =>
            alumni.name.toLowerCase().includes(query) ||
            alumni.studentNumber.includes(query)
        )
    }

    return result
})

// Status badge color
const getStatusBadgeColor = (status) => {
    return status === 'lulus' ? 'bg-green-500' : 'bg-red-500'
}

const getStatusLabel = (status) => {
    return status === 'lulus' ? 'Lulus' : 'Tidak Aktif'
}

// Functions - will be implemented when backend is ready
const handleSearch = () => {
    // TODO: Implement search functionality with backend API
}

const openAlumniForm = () => {
    showAlumniFormModal.value = true
}

const closeAlumniForm = () => {
    showAlumniFormModal.value = false
    resetAlumniForm()
}

const openContactAdmin = () => {
    showContactAdminModal.value = true
}

const closeContactAdmin = () => {
    showContactAdminModal.value = false
    resetContactForm()
}

const handlePhotoUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        // TODO: Handle photo upload
        alumniForm.value.photo = URL.createObjectURL(file)
    }
}

const submitAlumniForm = () => {
    // TODO: Submit alumni form to backend API
    console.log('Submitting alumni form:', alumniForm.value)
    closeAlumniForm()
}

const submitContactForm = () => {
    // TODO: Submit contact form to backend API
    console.log('Submitting contact form:', contactForm.value)
    closeContactAdmin()
}

const resetAlumniForm = () => {
    alumniForm.value = {
        photo: null,
        fullName: '',
        graduationYear: '',
        birthPlace: '',
        birthDate: '',
        email: '',
        phone: '',
        gender: '',
        address: ''
    }
}

const resetContactForm = () => {
    contactForm.value = {
        name: '',
        email: '',
        subject: 'Meminta Informasi Alumni',
        message: ''
    }
}

const handleImageError = (event) => {
    event.target.src = 'https://via.placeholder.com/200x250/dc2626/ffffff?text=Alumni'
}
</script>

<template>
    <div class="min-h-screen bg-neutral-50">
        <!-- Hero Section -->
        <section class="bg-linear-to-br from-primary to-primary-dark py-20 px-4">
            <div class="max-w-4xl mx-auto text-center">
                <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
                    Direktori PD Non Aktif
                </h1>
                <p class="text-xl text-white/90">
                    Daftar Peserta Didik Non Aktif dan Alumni SD Negeri Kedungrejo
                </p>
            </div>
        </section>

        <!-- Alumni Network Banner -->
        <section class="py-8 px-4 -mt-12 relative z-10">
            <div class="max-w-7xl mx-auto">
                <div class="bg-linear-to-r from-blue-600 to-blue-700 rounded-3xl shadow-2xl p-8 md:p-12">
                    <div class="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div class="text-white">
                            <h2 class="text-3xl font-bold mb-3">Alumni Network</h2>
                            <p class="text-blue-100 text-lg">
                                Temukan dan terhubung dengan alumni SD Negeri Kedungrejo lainnya.<br />
                                Jalin jaringan profesional dan kenangan masa sekolah.
                            </p>
                        </div>
                        <button @click="openAlumniForm"
                            class="shrink-0 bg-white hover:bg-blue-50 text-blue-700 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 cursor-pointer">
                            <PlusCircleIcon class="w-6 h-6" />
                            Daftar Sebagai Alumni
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Search and Filter Section -->
        <section class="py-8 px-4">
            <div class="max-w-7xl mx-auto">
                <div class="bg-white rounded-2xl shadow-xl p-6">
                    <div class="flex flex-col md:flex-row gap-4">

                        <!-- Search Bar -->
                        <div class="flex-grow">
                            <div class="relative">
                                <MagnifyingGlassIcon
                                    class="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                <input v-model="searchQuery" @input="handleSearch" type="text"
                                    placeholder="Cari alumni berdasarkan nama..."
                                    class="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                            </div>
                        </div>

                        <!-- Year Filter -->
                        <div class="md:w-48">
                            <select v-model="selectedYear" @change="handleSearch"
                                class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer">
                                <option v-for="year in years" :key="year.value" :value="year.value">
                                    {{ year.label }}
                                </option>
                            </select>
                        </div>

                        <!-- Contact Admin Button -->
                        <button @click="openContactAdmin"
                            class="md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer">
                            <EnvelopeIcon class="w-5 h-5" />
                            Hubungi Admin
                        </button>

                    </div>
                </div>
            </div>
        </section>

        <!-- Alumni Grid -->
        <section class="py-8 px-4">
            <div class="max-w-7xl mx-auto">

                <!-- No Results -->
                <div v-if="filteredAlumni.length === 0" class="text-center py-12">
                    <div class="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                        <UserGroupIcon class="w-16 h-16 mx-auto text-neutral-300 mb-4" />
                        <h3 class="text-xl font-bold text-neutral-900 mb-2">Tidak ada data</h3>
                        <p class="text-neutral-600">
                            Tidak ditemukan alumni dengan pencarian "{{ searchQuery }}"
                        </p>
                    </div>
                </div>

                <!-- Alumni Grid -->
                <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div v-for="alumni in filteredAlumni" :key="alumni.id"
                        class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 relative">
                        <!-- Status Badge -->
                        <div class="absolute top-4 right-4 z-10">
                            <span :class="[
                                getStatusBadgeColor(alumni.status),
                                'px-3 py-1.5 rounded-full text-white text-xs font-bold'
                            ]">
                                {{ getStatusLabel(alumni.status) }}
                            </span>
                        </div>

                        <div class="flex gap-6 p-6">
                            <!-- Alumni Photo -->
                            <div class="shrink-0">
                                <div class="w-32 h-40 rounded-xl overflow-hidden shadow-md bg-red-600">
                                    <img :src="alumni.photo" :alt="alumni.name" @error="handleImageError"
                                        class="w-full h-full object-cover" />
                                </div>
                            </div>

                            <!-- Alumni Info -->
                            <div class="flex-grow">
                                <h3 class="text-xl font-bold text-neutral-900 mb-4">
                                    {{ alumni.name }}
                                </h3>

                                <div class="space-y-3 text-sm">
                                    <!-- Student Number -->
                                    <div class="flex items-center gap-2">
                                        <div
                                            class="w-6 h-6 bg-blue-100 rounded flex items-center justify-center shrink-0">
                                            <span class="text-blue-600 text-xs font-bold">ID</span>
                                        </div>
                                        <span class="text-blue-600 font-semibold">{{ alumni.studentNumber }}</span>
                                    </div>

                                    <!-- Graduation Year -->
                                    <div class="flex items-center gap-2">
                                        <CalendarIcon class="w-6 h-6 text-neutral-500 shrink-0" />
                                        <div>
                                            <p class="text-neutral-500 text-xs">Tahun Lulus</p>
                                            <p class="text-neutral-900 font-semibold">{{ alumni.graduationYear }}</p>
                                        </div>
                                    </div>

                                    <!-- Email -->
                                    <div class="flex items-center gap-2">
                                        <EnvelopeIcon class="w-6 h-6 text-neutral-500 shrink-0" />
                                        <div>
                                            <p class="text-neutral-500 text-xs">Email</p>
                                            <p class="text-neutral-900 font-medium truncate">{{ alumni.email }}</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Graduation Badge -->
                                <div class="mt-4 flex items-center gap-2">
                                    <CalendarIcon class="w-4 h-4 text-neutral-500" />
                                    <span class="text-xs text-neutral-500">1 Juli {{ alumni.graduationYear }}</span>
                                    <span :class="[
                                        getStatusBadgeColor(alumni.status),
                                        'px-2 py-0.5 rounded text-white text-xs font-semibold ml-auto'
                                    ]">
                                        {{ getStatusLabel(alumni.status) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>

        <!-- Alumni Form Modal -->
        <Transition name="modal">
            <div v-if="showAlumniFormModal"
                class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                @click="closeAlumniForm">
                <div class="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
                    <!-- Modal Header -->
                    <div class="relative bg-neutral-50 p-6 border-b border-neutral-200">
                        <button @click="closeAlumniForm"
                            class="absolute top-6 right-6 p-2 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer">
                            <XMarkIcon class="w-6 h-6 text-neutral-600" />
                        </button>
                        <h2 class="text-2xl font-bold text-neutral-900">Formulir Data Alumni</h2>
                    </div>

                    <!-- Modal Body -->
                    <form @submit.prevent="submitAlumniForm" class="p-8">
                        <!-- Photo Upload -->
                        <div class="flex justify-center mb-8">
                            <div class="relative">
                                <div
                                    class="w-32 h-32 rounded-full border-4 border-dashed border-neutral-300 overflow-hidden bg-neutral-50 flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                                    <input type="file" accept="image/*" @change="handlePhotoUpload"
                                        class="absolute inset-0 opacity-0 cursor-pointer" />
                                    <div v-if="!alumniForm.photo" class="text-center">
                                        <PhotoIcon class="w-12 h-12 mx-auto text-neutral-400 mb-2" />
                                        <span class="text-sm text-neutral-500">Upload Foto</span>
                                    </div>
                                    <img v-else :src="alumniForm.photo" class="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>

                        <!-- Form Grid -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Nama Lengkap -->
                            <div>
                                <label class="block text-sm font-semibold text-neutral-700 mb-2">
                                    Nama Lengkap <span class="text-red-500">*</span>
                                </label>
                                <input v-model="alumniForm.fullName" type="text" required
                                    class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                            </div>

                            <!-- Tahun Lulus -->
                            <div>
                                <label class="block text-sm font-semibold text-neutral-700 mb-2">
                                    Tahun Lulus <span class="text-red-500">*</span>
                                </label>
                                <input v-model="alumniForm.graduationYear" type="text" required
                                    class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                            </div>

                            <!-- Tempat Lahir -->
                            <div>
                                <label class="block text-sm font-semibold text-neutral-700 mb-2">
                                    Tempat Lahir
                                </label>
                                <input v-model="alumniForm.birthPlace" type="text"
                                    class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                            </div>

                            <!-- Tanggal Lahir -->
                            <div>
                                <label class="block text-sm font-semibold text-neutral-700 mb-2">
                                    Tanggal Lahir
                                </label>
                                <input v-model="alumniForm.birthDate" type="date"
                                    class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                            </div>

                            <!-- Email Aktif -->
                            <div>
                                <label class="block text-sm font-semibold text-neutral-700 mb-2">
                                    Email Aktif <span class="text-red-500">*</span>
                                </label>
                                <input v-model="alumniForm.email" type="email" required
                                    class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                            </div>

                            <!-- Nomor Handphone -->
                            <div>
                                <label class="block text-sm font-semibold text-neutral-700 mb-2">
                                    Nomor Handphone
                                </label>
                                <input v-model="alumniForm.phone" type="tel"
                                    class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                            </div>

                            <!-- Jenis Kelamin -->
                            <div>
                                <label class="block text-sm font-semibold text-neutral-700 mb-2">
                                    Jenis Kelamin
                                </label>
                                <select v-model="alumniForm.gender"
                                    class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer">
                                    <option v-for="option in genderOptions" :key="option.value" :value="option.value">
                                        {{ option.label }}
                                    </option>
                                </select>
                            </div>

                            <!-- Alamat -->
                            <div>
                                <label class="block text-sm font-semibold text-neutral-700 mb-2">
                                    Alamat
                                </label>
                                <input v-model="alumniForm.address" type="text"
                                    class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                            </div>
                        </div>

                        <!-- Form Actions -->
                        <div class="flex justify-end gap-4 mt-8">
                            <button type="button" @click="closeAlumniForm"
                                class="px-6 py-3 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-semibold rounded-lg transition-colors cursor-pointer">
                                Batal
                            </button>
                            <button type="submit"
                                class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer">
                                <PlusCircleIcon class="w-5 h-5" />
                                Kirim Data
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Transition>

        <!-- Contact Admin Modal -->
        <Transition name="modal">
            <div v-if="showContactAdminModal"
                class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                @click="closeContactAdmin">
                <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full" @click.stop>
                    <!-- Modal Header -->
                    <div class="relative bg-neutral-50 p-6 border-b border-neutral-200">
                        <button @click="closeContactAdmin"
                            class="absolute top-6 right-6 p-2 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer">
                            <XMarkIcon class="w-6 h-6 text-neutral-600" />
                        </button>
                        <h2 class="text-2xl font-bold text-neutral-900">Hubungi Admin Sekolah</h2>
                    </div>

                    <!-- Modal Body -->
                    <form @submit.prevent="submitContactForm" class="p-8">
                        <!-- Nama Anda -->
                        <div class="mb-6">
                            <label class="block text-sm font-semibold text-neutral-700 mb-2">
                                Nama Anda
                            </label>
                            <input v-model="contactForm.name" type="text" required
                                class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                        </div>

                        <!-- Email Anda -->
                        <div class="mb-6">
                            <label class="block text-sm font-semibold text-neutral-700 mb-2">
                                Email Anda
                            </label>
                            <input v-model="contactForm.email" type="email" required
                                class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                        </div>

                        <!-- Subjek -->
                        <div class="mb-6">
                            <label class="block text-sm font-semibold text-neutral-700 mb-2">
                                Subjek
                            </label>
                            <select v-model="contactForm.subject"
                                class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer">
                                <option v-for="subject in subjectOptions" :key="subject" :value="subject">
                                    {{ subject }}
                                </option>
                            </select>
                        </div>

                        <!-- Pesan -->
                        <div class="mb-6">
                            <label class="block text-sm font-semibold text-neutral-700 mb-2">
                                Pesan
                            </label>
                            <textarea v-model="contactForm.message" required rows="6"
                                class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"></textarea>
                        </div>

                        <!-- Form Actions -->
                        <div class="flex justify-end gap-4">
                            <button type="button" @click="closeContactAdmin"
                                class="px-6 py-3 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-semibold rounded-lg transition-colors cursor-pointer">
                                Batal
                            </button>
                            <button type="submit"
                                class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors cursor-pointer">
                                Kirim Pesan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
/* Modal transition */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
    transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
    transform: scale(0.9);
}
</style>
