<script setup>
import { ref, onMounted, watch } from 'vue'
import {
    MagnifyingGlassIcon,
    UserGroupIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    XMarkIcon
} from '@heroicons/vue/24/outline'
import { getTeachers } from '@/services/api'

// Modal state
const showModal = ref(false)
const selectedTeacher = ref(null)

// Status options (based on API documentation)
const statusOptions = ref([
    { value: 'all', label: 'Semua Status' },
    { value: 'active', label: 'Aktif' },
    { value: 'inactive', label: 'Non-Aktif' },
    { value: 'retired', label: 'Pensiun' }
])

// Search and filter
const searchQuery = ref('')
const selectedStatus = ref('all')

// Pagination
const currentPage = ref(1)
const itemsPerPage = 8
const totalPages = ref(1)
const isLoading = ref(false)

// Teachers data from API
const allTeachers = ref([])

// Fetch teachers from API
const fetchTeachers = async () => {
    isLoading.value = true
    try {
        const params = {
            page: currentPage.value,
            limit: itemsPerPage,
            search: searchQuery.value || undefined,
            status: selectedStatus.value !== 'all' ? selectedStatus.value : undefined
        }

        const response = await getTeachers(params)

        if (response.success) {
            allTeachers.value = response.data
            if (response.pagination) {
                totalPages.value = response.pagination.totalPages
            }
        }
    } catch (error) {
        console.error('Error fetching teachers:', error)
        allTeachers.value = []
    } finally {
        isLoading.value = false
    }
}

// Sample GTK data - old stub (will be removed)
const _oldTeachers = ref([
    {
        id: 1,
        name: 'Ade Chea Annisa Noor,S.Pd.',
        nip: '198501012010012001',
        photo: '/placeholder-teacher-1.jpg',
        status: 'aktif',
        position: 'GTK',
        gender: 'Perempuan',
        statusInduk: 'NON INDUK'
    },
    {
        id: 2,
        name: 'Aris Wibowo,S.Pd.',
        nip: '198601012010012002',
        photo: '/placeholder-teacher-2.jpg',
        status: 'aktif',
        position: 'GTK',
        gender: 'Laki-laki',
        statusInduk: 'NON INDUK'
    },
    {
        id: 3,
        name: 'Isnaini Nur Safitri,S.Pd.',
        nip: '198701012010012003',
        photo: '/placeholder-teacher-3.jpg',
        status: 'aktif',
        position: 'GTK',
        gender: 'Perempuan',
        statusInduk: 'INDUK'
    },
    {
        id: 4,
        name: 'Mae Sri Harkitiani,S.Pd.',
        nip: '198801012010012004',
        photo: '/placeholder-teacher-4.jpg',
        status: 'aktif',
        position: 'GTK',
        gender: 'Perempuan',
        statusInduk: 'INDUK'
    },
    {
        id: 5,
        name: 'Paniyem,S.Pd.',
        nip: '198901012010012005',
        photo: '/placeholder-teacher-5.jpg',
        status: 'aktif',
        position: 'GTK',
        gender: 'Perempuan',
        statusInduk: 'NON INDUK'
    },
    {
        id: 6,
        name: 'Rekha Dwi Kusuma Wardani,S.Pd.',
        nip: '199001012010012006',
        photo: '/placeholder-teacher-6.jpg',
        status: 'aktif',
        position: 'GTK',
        gender: 'Perempuan',
        statusInduk: 'INDUK'
    },
    {
        id: 7,
        name: 'Rudiyat Nugroho,S.Pd.SD.',
        nip: '199101012010012007',
        photo: '/placeholder-teacher-7.jpg',
        status: 'aktif',
        position: 'GTK',
        gender: 'Laki-laki',
        statusInduk: 'INDUK'
    },
    {
        id: 8,
        name: 'Sarjiyanto',
        nip: '199201012010012008',
        photo: '/placeholder-teacher-8.jpg',
        status: 'aktif',
        position: 'GTK',
        gender: 'Laki-laki',
        statusInduk: 'NON INDUK'
    },
    {
        id: 9,
        name: 'Siti Nurjanah,S.Pd.',
        nip: '199301012010012009',
        photo: '/placeholder-teacher-9.jpg',
        status: 'non-aktif',
        position: 'GTK',
        gender: 'Perempuan',
        statusInduk: 'INDUK'
    },
    {
        id: 10,
        name: 'Sri Lestari,S.Pd.',
        nip: '199401012010012010',
        photo: '/placeholder-teacher-10.jpg',
        status: 'mutasi',
        position: 'GTK',
        gender: 'Perempuan',
        statusInduk: 'INDUK'
    },
    {
        id: 11,
        name: 'Sugiarto,S.Pd.',
        nip: '199501012010012011',
        photo: '/placeholder-teacher-11.jpg',
        status: 'pensiun',
        position: 'GTK',
        gender: 'Laki-laki',
        statusInduk: 'NON INDUK'
    },
    {
        id: 12,
        name: 'Tri Wahyuni,S.Pd.',
        nip: '199601012010012012',
        photo: '/placeholder-teacher-12.jpg',
        status: 'aktif',
        position: 'GTK',
        gender: 'Perempuan',
        statusInduk: 'INDUK'
    }
])

// Note: Filtering and pagination now handled by API
// No need for computed properties as API returns paginated data

// Status badge color (updated for API values)
const getStatusBadgeColor = (status) => {
    const colors = {
        'active': 'bg-green-500',
        'inactive': 'bg-red-500',
        'retired': 'bg-amber-500'
    }
    return colors[status] || 'bg-neutral-500'
}

// Status label (updated for API values)
const getStatusLabel = (status) => {
    const labels = {
        'active': 'Aktif',
        'inactive': 'Non-Aktif',
        'retired': 'Pensiun'
    }
    return labels[status] || status
}

// Functions
const handleSearch = () => {
    currentPage.value = 1
    fetchTeachers()
}

const handleStatusChange = () => {
    currentPage.value = 1
    fetchTeachers()
}

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
}

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        goToPage(currentPage.value + 1)
    }
}

const previousPage = () => {
    if (currentPage.value > 1) {
        goToPage(currentPage.value - 1)
    }
}

const viewDetail = (teacher) => {
    selectedTeacher.value = teacher
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    selectedTeacher.value = null
}

const handleImageError = (event) => {
    event.target.src = 'https://via.placeholder.com/200/0d5f5f/ffffff?text=GTK'
}

// Watch for page changes
watch(currentPage, () => {
    fetchTeachers()
})

// Fetch on mount
onMounted(() => {
    fetchTeachers()
})
</script>

<template>
    <div class="min-h-screen bg-neutral-50">
        <!-- Hero Section -->
        <section class="bg-linear-to-br from-primary to-primary-dark py-20 px-4">
            <div class="max-w-4xl mx-auto text-center">
                <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
                    Direktori GTK
                </h1>
                <p class="text-xl text-white/90">
                    Daftar Pendidik dan Tenaga Kependidikan SD Negeri Kedungrejo
                </p>
            </div>
        </section>

        <!-- Search and Filter Section -->
        <section class="py-8 px-4 -mt-12 relative z-10">
            <div class="max-w-7xl mx-auto">
                <div class="bg-white rounded-2xl shadow-xl p-6">
                    <div class="flex flex-col md:flex-row gap-4">

                        <!-- Search Bar -->
                        <div class="grow">
                            <div class="relative">
                                <MagnifyingGlassIcon
                                    class="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                <input v-model="searchQuery" @input="handleSearch" type="text"
                                    placeholder="Cari GTK (Nama/NIP)..."
                                    class="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                            </div>
                        </div>

                        <!-- Status Filter -->
                        <div class="md:w-64">
                            <select v-model="selectedStatus" @change="handleStatusChange"
                                class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer">
                                <option v-for="status in statusOptions" :key="status.value" :value="status.value">
                                    {{ status.label }}
                                </option>
                            </select>
                        </div>

                    </div>
                </div>
            </div>
        </section>

        <!-- Teachers Grid -->
        <section class="py-12 px-4">
            <div class="max-w-7xl mx-auto">

                <!-- Loading State -->
                <div v-if="isLoading" class="text-center py-12">
                    <div class="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                        <p class="text-neutral-600">Memuat data GTK...</p>
                    </div>
                </div>

                <!-- No Results -->
                <div v-else-if="allTeachers.length === 0" class="text-center py-12">
                    <div class="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                        <UserGroupIcon class="w-16 h-16 mx-auto text-neutral-300 mb-4" />
                        <h3 class="text-xl font-bold text-neutral-900 mb-2">Tidak ada data</h3>
                        <p class="text-neutral-600" v-if="searchQuery">
                            Tidak ditemukan GTK dengan pencarian "{{ searchQuery }}"
                        </p>
                        <p class="text-neutral-600" v-else>
                            Belum ada data GTK yang tersedia
                        </p>
                    </div>
                </div>

                <!-- Teachers Grid -->
                <div v-else>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div v-for="teacher in allTeachers" :key="teacher.id"
                            class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 relative">
                            <!-- Status Badge -->
                            <div class="absolute top-4 right-4 z-10">
                                <span :class="[
                                    getStatusBadgeColor(teacher.status),
                                    'px-3 py-1 rounded-full text-white text-xs font-bold'
                                ]">
                                    {{ getStatusLabel(teacher.status) }}
                                </span>
                            </div>

                            <!-- Teacher Photo Background -->
                            <div class="relative overflow-hidden bg-linear-to-br from-primary/5 to-blue-50 h-40">
                                <div class="absolute inset-0 bg-linear-to-br from-transparent to-white/30"></div>
                            </div>

                            <!-- Teacher Photo (Circular, overlapping) -->
                            <div class="flex justify-center -mt-20 mb-4 relative z-10">
                                <div
                                    class="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                                    <img :src="teacher.photo" :alt="teacher.name" @error="handleImageError"
                                        class="w-full h-full object-cover" />
                                </div>
                            </div>

                            <!-- Teacher Info -->
                            <div class="px-6 pb-6 text-center">
                                <h3 class="text-lg font-bold text-neutral-900 mb-2">
                                    {{ teacher.name }}
                                </h3>

                                <div class="text-sm text-primary font-semibold mb-1">
                                    {{ teacher.subject || 'GTK' }}
                                </div>

                                <div class="text-xs text-neutral-500 mb-4">
                                    NIP: {{ teacher.nip || '-' }}
                                </div>

                                <!-- Detail Button -->
                                <button @click="viewDetail(teacher)"
                                    class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors cursor-pointer">
                                    Lihat Detail
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Pagination Controls -->
                    <div v-if="totalPages > 1" class="mt-12 flex justify-center">
                        <nav class="inline-flex items-center gap-2">
                            <!-- Previous Button -->
                            <button @click="previousPage" :disabled="currentPage === 1" :class="[
                                'px-3 py-2 rounded-lg font-medium transition-colors',
                                currentPage === 1
                                    ? 'text-neutral-400 cursor-not-allowed'
                                    : 'text-primary hover:bg-primary hover:text-white cursor-pointer'
                            ]">
                                <ChevronLeftIcon class="w-5 h-5" />
                            </button>

                            <!-- Page Numbers -->
                            <button v-for="page in Math.min(totalPages, 10)" :key="page" @click="goToPage(page)" :class="[
                                'min-w-10 px-3 py-2 rounded-lg font-medium transition-all cursor-pointer',
                                currentPage === page
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-neutral-700 hover:bg-neutral-100'
                            ]">
                                {{ page }}
                            </button>

                            <!-- Next Button -->
                            <button @click="nextPage" :disabled="currentPage === totalPages" :class="[
                                'px-3 py-2 rounded-lg font-medium transition-colors',
                                currentPage === totalPages
                                    ? 'text-neutral-400 cursor-not-allowed'
                                    : 'text-primary hover:bg-primary hover:text-white cursor-pointer'
                            ]">
                                <ChevronRightIcon class="w-5 h-5" />
                            </button>
                        </nav>
                    </div>
                </div>

            </div>
        </section>

        <!-- Modal Detail -->
        <Transition name="modal">
            <div v-if="showModal && selectedTeacher"
                class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                @click="closeModal">
                <!-- Modal Container -->
                <div class="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
                    <!-- Modal Header -->
                    <div class="relative bg-linear-to-br from-primary/10 to-primary/5 p-8 border-b border-neutral-200">
                        <!-- Close Button -->
                        <button @click="closeModal"
                            class="absolute top-6 right-6 p-2 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer">
                            <XMarkIcon class="w-6 h-6 text-neutral-600" />
                        </button>

                        <div class="flex items-center gap-6">
                            <!-- Small Circular Photo -->
                            <div
                                class="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white shrink-0">
                                <img :src="selectedTeacher.photo" :alt="selectedTeacher.name" @error="handleImageError"
                                    class="w-full h-full object-cover" />
                            </div>

                            <!-- Name and Info -->
                            <div>
                                <h2 class="text-2xl font-bold text-neutral-900 mb-2">
                                    {{ selectedTeacher.name }}
                                </h2>
                                <p class="text-primary font-semibold">
                                    {{ selectedTeacher.subject || 'GTK' }} • {{ getStatusLabel(selectedTeacher.status)
                                    }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Modal Body -->
                    <div class="p-8">
                        <div class="grid grid-cols-1 md:grid-cols-5 gap-8">
                            <!-- Left Side - Info -->
                            <div class="md:col-span-3">
                                <h3 class="text-lg font-bold text-neutral-700 uppercase mb-6 tracking-wide">
                                    Informasi Pribadi
                                </h3>

                                <div class="space-y-4">
                                    <!-- NIP -->
                                    <div class="flex justify-between items-center py-3 border-b border-neutral-100">
                                        <span class="text-neutral-600 font-medium">NIP</span>
                                        <span class="text-neutral-900 font-semibold">{{ selectedTeacher.nip || '-'
                                            }}</span>
                                    </div>

                                    <!-- Subject -->
                                    <div class="flex justify-between items-center py-3 border-b border-neutral-100">
                                        <span class="text-neutral-600 font-medium">Mata Pelajaran</span>
                                        <span class="text-neutral-900 font-semibold">{{ selectedTeacher.subject || '-'
                                            }}</span>
                                    </div>

                                    <!-- Jenis Kelamin -->
                                    <div class="flex justify-between items-center py-3 border-b border-neutral-100">
                                        <span class="text-neutral-600 font-medium">Jenis Kelamin</span>
                                        <span class="text-neutral-900 font-semibold">{{ selectedTeacher.gender || '-'
                                            }}</span>
                                    </div>

                                    <!-- Status -->
                                    <div class="flex justify-between items-center py-3">
                                        <span class="text-neutral-600 font-medium">Status</span>
                                        <span class="text-green-600 font-bold">{{ getStatusLabel(selectedTeacher.status)
                                        }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Right Side - Large Photo -->
                            <div class="md:col-span-2">
                                <div class="relative">
                                    <div
                                        class="aspect-3/4 rounded-2xl overflow-hidden shadow-xl border-4 border-primary/20">
                                        <img :src="selectedTeacher.photo" :alt="selectedTeacher.name"
                                            @error="handleImageError" class="w-full h-full object-cover" />
                                    </div>
                                    <!-- Status Badge Below Photo -->
                                    <div class="mt-4 flex justify-center">
                                        <span
                                            :class="[getStatusBadgeColor(selectedTeacher.status), 'px-6 py-2 rounded-full text-white font-bold text-sm']">
                                            Status: {{ getStatusLabel(selectedTeacher.status) }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
