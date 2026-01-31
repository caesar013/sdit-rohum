<script setup>
import { ref, computed, onMounted } from 'vue'
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
import { getAlumni, registerAlumni, getAlumniGraduationYears, submitContact } from '@/services/api'

// Modals state
const showAlumniFormModal = ref(false)
const showContactAdminModal = ref(false)

// Loading state
const isLoading = ref(false)
const isSubmitting = ref(false)

// Years for filter
const years = ref([
    { value: 'all', label: 'Semua Tahun' }
])

// Search and filter
const searchQuery = ref('')
const selectedYear = ref('all')

// Alumni form data
const alumniForm = ref({
    photo: null,
    photoPreview: null,
    nisn: '',
    full_name: '',
    graduation_year: '',
    birth_place: '',
    birth_date: '',
    email: '',
    phone: '',
    gender: '',
    current_address: '',
    current_occupation: '',
    current_institution: ''
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
    { value: 'male', label: 'Laki-laki' },
    { value: 'female', label: 'Perempuan' }
])

// Alumni data from API
const allAlumni = ref([])

// Filtered alumni based on search and year
const filteredAlumni = computed(() => {
    let result = allAlumni.value

    // Filter by year
    if (selectedYear.value !== 'all') {
        result = result.filter(alumni => String(alumni.graduation_year) === selectedYear.value)
    }

    // Filter by search query
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(alumni =>
            alumni.full_name?.toLowerCase().includes(query) ||
            alumni.nisn?.includes(query)
        )
    }

    return result
})

// Status badge color
const getStatusBadgeColor = (status) => {
    return status === 'verified' ? 'bg-green-500' : 'bg-yellow-500'
}

const getStatusLabel = (status) => {
    return status === 'verified' ? 'Terverifikasi' : 'Menunggu Verifikasi'
}

// Fetch graduation years from API
const fetchGraduationYears = async () => {
    try {
        const response = await getAlumniGraduationYears()
        if (response.success && response.data) {
            const yearOptions = response.data.map(year => ({
                value: String(year),
                label: String(year)
            }))
            years.value = [
                { value: 'all', label: 'Semua Tahun' },
                ...yearOptions
            ]
        }
    } catch (error) {
        console.error('Error fetching graduation years:', error)
    }
}

// Fetch alumni from API
const fetchAlumni = async () => {
    isLoading.value = true
    try {
        const params = {
            search: searchQuery.value || undefined,
            graduation_year: selectedYear.value !== 'all' ? selectedYear.value : undefined,
            status: 'verified' // Can be changed to fetch all
        }

        const response = await getAlumni(params)
        if (response.success) {
            allAlumni.value = response.data
        }
    } catch (error) {
        console.error('Error fetching alumni:', error)
        allAlumni.value = []
    } finally {
        isLoading.value = false
    }
}

const handleSearch = () => {
    fetchAlumni()
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
        alumniForm.value.photo = file
        // Create preview URL
        alumniForm.value.photoPreview = URL.createObjectURL(file)
    }
}

const submitAlumniForm = async () => {
    isSubmitting.value = true
    try {
        // Create FormData for file upload
        const formData = new FormData()

        // Add photo if uploaded
        if (alumniForm.value.photo) {
            formData.append('photo', alumniForm.value.photo)
        }

        // Add required fields
        formData.append('nisn', alumniForm.value.nisn || '')
        formData.append('name', alumniForm.value.full_name || '')
        formData.append('graduation_year', alumniForm.value.graduation_year || '')
        formData.append('gender', alumniForm.value.gender || '')
        formData.append('phone', alumniForm.value.phone || '')
        formData.append('email', alumniForm.value.email || '')

        // Add optional fields only if they have values
        if (alumniForm.value.current_address) formData.append('address', alumniForm.value.current_address) // Backend expects 'address'
        if (alumniForm.value.current_occupation) formData.append('current_occupation', alumniForm.value.current_occupation)
        if (alumniForm.value.current_institution) formData.append('current_school', alumniForm.value.current_institution) // Backend expects 'current_school'

        // Log what we're sending
        console.log('Form data being sent:')
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value)
        }

        const response = await registerAlumni(formData)

        console.log('API Response:', response)

        if (response.success) {
            alert('Pendaftaran alumni berhasil! Data Anda akan diverifikasi oleh admin.')
            closeAlumniForm()
            fetchAlumni() // Refresh list
        } else {
            alert(response.message || 'Gagal mendaftar sebagai alumni. Silakan coba lagi.')
        }
    } catch (error) {
        console.error('Full error object:', error)
        console.error('Error response:', error.response)
        alert('Gagal mendaftar sebagai alumni. Silakan coba lagi. Error: ' + (error.message || 'Unknown error'))
    } finally {
        isSubmitting.value = false
    }
}

const submitContactForm = async () => {
    isSubmitting.value = true
    try {
        const response = await submitContact(contactForm.value)

        if (response.success) {
            alert('Pesan Anda berhasil dikirim! Admin akan menghubungi Anda segera.')
            closeContactAdmin()
        }
    } catch (error) {
        console.error('Error submitting contact form:', error)
        alert('Gagal mengirim pesan. Silakan coba lagi.')
    } finally {
        isSubmitting.value = false
    }
}

const resetAlumniForm = () => {
    // Revoke the preview URL to avoid memory leaks
    if (alumniForm.value.photoPreview) {
        URL.revokeObjectURL(alumniForm.value.photoPreview)
    }

    alumniForm.value = {
        photo: null,
        photoPreview: null,
        nisn: '',
        full_name: '',
        graduation_year: '',
        birth_place: '',
        birth_date: '',
        email: '',
        phone: '',
        gender: '',
        current_address: '',
        current_occupation: '',
        current_institution: ''
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

// Fetch data on mount
onMounted(() => {
    fetchGraduationYears()
    fetchAlumni()
})
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
                        <div class="grow">
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

                <!-- Loading State -->
                <div v-if="isLoading" class="text-center py-12">
                    <div class="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                        <p class="text-neutral-600">Memuat data alumni...</p>
                    </div>
                </div>

                <!-- No Results -->
                <div v-else-if="filteredAlumni.length === 0" class="text-center py-12">
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
                            <div class="grow">
                                <h3 class="text-xl font-bold text-neutral-900 mb-4">
                                    {{ alumni.full_name }}
                                </h3>

                                <div class="space-y-3 text-sm">
                                    <!-- Student Number -->
                                    <div class="flex items-center gap-2">
                                        <div
                                            class="w-6 h-6 bg-blue-100 rounded flex items-center justify-center shrink-0">
                                            <span class="text-blue-600 text-xs font-bold">ID</span>
                                        </div>
                                        <span class="text-blue-600 font-semibold">{{ alumni.nisn || '-' }}</span>
                                    </div>

                                    <!-- Graduation Year -->
                                    <div class="flex items-center gap-2">
                                        <CalendarIcon class="w-6 h-6 text-neutral-500 shrink-0" />
                                        <div>
                                            <p class="text-neutral-500 text-xs">Tahun Lulus</p>
                                            <p class="text-neutral-900 font-semibold">{{ alumni.graduation_year }}</p>
                                        </div>
                                    </div>

                                    <!-- Email -->
                                    <div class="flex items-center gap-2">
                                        <EnvelopeIcon class="w-6 h-6 text-neutral-500 shrink-0" />
                                        <div>
                                            <p class="text-neutral-500 text-xs">Email</p>
                                            <p class="text-neutral-900 font-medium truncate">{{ alumni.email || '-' }}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Graduation Badge -->
                                <div class="mt-4 flex items-center gap-2">
                                    <CalendarIcon class="w-4 h-4 text-neutral-500" />
                                    <span class="text-xs text-neutral-500">Tahun {{ alumni.graduation_year }}</span>
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
                                    <div v-if="!alumniForm.photoPreview" class="text-center">
                                        <PhotoIcon class="w-12 h-12 mx-auto text-neutral-400 mb-2" />
                                        <span class="text-sm text-neutral-500">Upload Foto</span>
                                    </div>
                                    <img v-else :src="alumniForm.photoPreview" class="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>

                        <!-- Form Grid -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- NISN -->
                            <div>
                                <label class="block text-sm font-semibold text-neutral-700 mb-2">
                                    NISN <span class="text-red-500">*</span>
                                </label>
                                <input v-model="alumniForm.nisn" type="text" required
                                    placeholder="Nomor Induk Siswa Nasional"
                                    class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                            </div>

                            <!-- Nama Lengkap -->
                            <div>
                                <label class="block text-sm font-semibold text-neutral-700 mb-2">
                                    Nama Lengkap <span class="text-red-500">*</span>
                                </label>
                                <input v-model="alumniForm.full_name" type="text" required
                                    class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                            </div>

                            <!-- Tahun Lulus -->
                            <div>
                                <label class="block text-sm font-semibold text-neutral-700 mb-2">
                                    Tahun Lulus <span class="text-red-500">*</span>
                                </label>
                                <input v-model="alumniForm.graduation_year" type="text" required
                                    class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                            </div>

                            <!-- Tempat Lahir -->
                            <div>
                                <label class="block text-sm font-semibold text-neutral-700 mb-2">
                                    Tempat Lahir
                                </label>
                                <input v-model="alumniForm.birth_place" type="text"
                                    class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                            </div>

                            <!-- Tanggal Lahir -->
                            <div>
                                <label class="block text-sm font-semibold text-neutral-700 mb-2">
                                    Tanggal Lahir
                                </label>
                                <input v-model="alumniForm.birth_date" type="date"
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
                                    Nomor Handphone <span class="text-red-500">*</span>
                                </label>
                                <input v-model="alumniForm.phone" type="tel" required placeholder="08xxxxxxxxxx"
                                    class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                            </div>

                            <!-- Jenis Kelamin -->
                            <div>
                                <label class="block text-sm font-semibold text-neutral-700 mb-2">
                                    Jenis Kelamin <span class="text-red-500">*</span>
                                </label>
                                <select v-model="alumniForm.gender" required
                                    class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer">
                                    <option v-for="option in genderOptions" :key="option.value" :value="option.value">
                                        {{ option.label }}
                                    </option>
                                </select>
                            </div>

                            <!-- Alamat Saat Ini -->
                            <div class="md:col-span-2">
                                <label class="block text-sm font-semibold text-neutral-700 mb-2">
                                    Alamat Saat Ini
                                </label>
                                <input v-model="alumniForm.current_address" type="text"
                                    class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                            </div>

                            <!-- Pekerjaan Saat Ini -->
                            <div>
                                <label class="block text-sm font-semibold text-neutral-700 mb-2">
                                    Pekerjaan Saat Ini
                                </label>
                                <input v-model="alumniForm.current_occupation" type="text"
                                    class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                            </div>

                            <!-- Institusi/Perusahaan Saat Ini -->
                            <div>
                                <label class="block text-sm font-semibold text-neutral-700 mb-2">
                                    Institusi/Perusahaan Saat Ini
                                </label>
                                <input v-model="alumniForm.current_institution" type="text"
                                    class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                            </div>
                        </div>

                        <!-- Form Actions -->
                        <div class="flex justify-end gap-4 mt-8">
                            <button type="button" @click="closeAlumniForm"
                                class="px-6 py-3 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-semibold rounded-lg transition-colors cursor-pointer">
                                Batal
                            </button>
                            <button type="submit" :disabled="isSubmitting"
                                class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                <PlusCircleIcon class="w-5 h-5" />
                                {{ isSubmitting ? 'Mengirim...' : 'Kirim Data' }}
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
