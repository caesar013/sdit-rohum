<script setup>
import { ref, onMounted } from 'vue'
import { HomeIcon, ChevronRightIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'
import { getSchoolProfile } from '@/services/api'

// Active accordion section
const activeSection = ref('visi')

// Data from API
const visionData = ref(null)
const missionData = ref([])
const goalsData = ref([])
const isLoading = ref(true)

// Toggle accordion
const toggleSection = (section) => {
    if (activeSection.value === section) {
        activeSection.value = null
    } else {
        activeSection.value = section
    }
}

// Fetch school profile data
const fetchSchoolProfile = async () => {
    isLoading.value = true
    try {
        const response = await getSchoolProfile()

        if (response.success && response.data) {
            // The API returns data as an object, use it directly
            const profileData = response.data

            // Process vision
            if (profileData.vision) {
                visionData.value = {
                    value: profileData.vision,
                    description: profileData.vision_description || ''
                }
            }

            // Process mission
            if (profileData.mission) {
                // Mission is a semicolon-separated string
                const missionString = profileData.mission.trim()
                missionData.value = missionString
                    .split(';')
                    .map(m => m.trim())
                    .filter(m => m.length > 0)
            }

            // Process goals
            if (profileData.goals) {
                try {
                    const goals = typeof profileData.goals === 'string'
                        ? JSON.parse(profileData.goals)
                        : profileData.goals
                    goalsData.value = Array.isArray(goals) ? goals : [goals]
                } catch (e) {
                    goalsData.value = profileData.goals.includes('\n')
                        ? profileData.goals.split('\n').filter(g => g.trim())
                        : [profileData.goals]
                }
            }
        }

        // Set default data if API doesn't return data
        if (!visionData.value) {
            setDefaultData()
        }
    } catch (error) {
        console.error('Error fetching school profile:', error)
        setDefaultData()
    } finally {
        isLoading.value = false
    }
}

// Set default data as fallback
const setDefaultData = () => {
    visionData.value = {
        value: '"Beriman, kreatif, berprestasi, berkarakter, dan berbudaya"'
    }

    missionData.value = [
        'Menumbuhkembangkan penghayatan dan pengamalan ajaran agama',
        'Melaksanakan pembelajaran yang berorientasi pada keterampilan abad 21',
        'Melaksanakan pembinaan intensif untuk mencapai prestasi akademik dan non akademik',
        'Menumbuhkembangkan keterampilan memanfaatkan Teknologi Informasi dan Komunikasi',
        'Menumbuhkembangkan rasa cinta seni dan keterampilan',
        'Membudayakan lima nilai utama karakter',
        'Mengembangkan pembelajaran berwawasan lingkungan hidup dan berbasis budaya',
        'Mengembangkan pembelajaran untuk membentuk Profil Pelajar Pancasila'
    ]

    goalsData.value = [
        'Terwujudnya peserta didik yang beriman dan bertakwa kepada Tuhan Yang Maha Esa',
        'Terwujudnya pembelajaran yang inovatif dan kreatif',
        'Terwujudnya prestasi akademik dan non akademik',
        'Terwujudnya pemanfaatan Teknologi Informasi dan Komunikasi dalam pembelajaran',
        'Terwujudnya pengembangan seni dan keterampilan',
        'Terwujudnya lima nilai utama karakter',
        'Terwujudnya pembelajaran berwawasan lingkungan hidup dan berbasis budaya',
        'Terwujudnya Profil Pelajar Pancasila'
    ]
}

onMounted(() => {
    fetchSchoolProfile()
})
</script>

<template>
    <div class="min-h-screen bg-neutral-50">
        <!-- Header with Hero Section -->
        <section class="bg-linear-to-br from-primary to-primary-dark py-20 px-4">
            <div class="max-w-7xl mx-auto">
                <!-- Page Title -->
                <div class="text-center text-white">
                    <h1 class="text-4xl md:text-5xl font-bold mb-4">
                        Visi, Misi & Tujuan <span class="text-secondary">Sekolah</span>
                    </h1>
                    <p class="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
                        Informasi terbaru dari SD Negeri Kedungrejo
                    </p>
                </div>

                <!-- Scroll Down Indicator -->
                <div class="text-center mt-12">
                    <p class="text-white/80 text-sm mb-2">Lihat Detail</p>
                    <svg class="w-6 h-6 mx-auto text-white/60 animate-bounce" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </div>
        </section>

        <!-- Main Content -->
        <section class="py-16 px-4 -mt-12 relative z-10">
            <div class="max-w-7xl mx-auto">
                <!-- Introduction Card -->
                <div class="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-8">
                    <h2 class="text-3xl font-bold text-neutral-900 text-center mb-4">
                        Landasan & Arah Tujuan Sekolah
                    </h2>
                    <p class="text-neutral-600 text-center text-lg">
                        Komitmen kami dalam menciptakan lingkungan belajar yang inspiratif, berkarakter, dan berprestasi
                        tertuang dalam visi, misi, dan tujuan sekolah.
                    </p>
                </div>

                <!-- Loading State -->
                <div v-if="isLoading" class="bg-white rounded-3xl shadow-2xl p-12">
                    <div class="flex flex-col items-center justify-center">
                        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
                        <p class="text-neutral-600">Memuat data...</p>
                    </div>
                </div>

                <!-- Accordion Sections -->
                <div v-else class="space-y-6">
                    <!-- VISI Section -->
                    <div class="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300"
                        :class="{ 'ring-2 ring-primary': activeSection === 'visi' }">
                        <button @click="toggleSection('visi')"
                            class="w-full px-8 py-6 flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer">
                            <div class="flex items-center gap-4">
                                <div
                                    class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                    <CheckCircleIcon class="w-6 h-6 text-primary" />
                                </div>
                                <h3 class="text-2xl font-bold text-neutral-900">VISI</h3>
                            </div>
                            <svg class="w-6 h-6 text-neutral-600 transition-transform duration-300"
                                :class="{ 'rotate-180': activeSection === 'visi' }" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <!-- VISI Content -->
                        <div v-show="activeSection === 'visi'" class="px-8 pb-8">
                            <div class="bg-primary/5 rounded-xl p-6 mb-6">
                                <p class="text-xl text-primary font-semibold italic text-center">
                                    {{ visionData?.value ||
                                        '"Beriman, kreatif, berprestasi, berkarakter, dan berbudaya"' }}
                                </p>
                            </div>

                            <div v-if="visionData?.description">
                                <h4 class="font-bold text-neutral-900 mb-4">Indikator Ketercapaian:</h4>
                                <div class="space-y-3">
                                    <div v-for="(indicator, index) in visionData.description.split('\n')" :key="index"
                                        class="flex items-start gap-3">
                                        <CheckCircleIcon class="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                        <p class="text-neutral-700">{{ indicator }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- MISI Section -->
                    <div class="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300"
                        :class="{ 'ring-2 ring-primary': activeSection === 'misi' }">
                        <button @click="toggleSection('misi')"
                            class="w-full px-8 py-6 flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer">
                            <div class="flex items-center gap-4">
                                <div
                                    class="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0">
                                    <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 class="text-2xl font-bold text-neutral-900">MISI</h3>
                            </div>
                            <svg class="w-6 h-6 text-neutral-600 transition-transform duration-300"
                                :class="{ 'rotate-180': activeSection === 'misi' }" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <!-- MISI Content -->
                        <div v-show="activeSection === 'misi'" class="px-8 pb-8">
                            <div class="space-y-4">
                                <div v-for="(mission, index) in missionData" :key="index"
                                    class="flex items-start gap-4 p-4 bg-neutral-50 rounded-lg hover:bg-blue-50 transition-colors">
                                    <div
                                        class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                                        {{ index + 1 }}
                                    </div>
                                    <p class="text-neutral-700 leading-relaxed pt-1">{{ mission }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- TUJUAN SEKOLAH Section -->
                    <div class="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300"
                        :class="{ 'ring-2 ring-primary': activeSection === 'tujuan' }">
                        <button @click="toggleSection('tujuan')"
                            class="w-full px-8 py-6 flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer">
                            <div class="flex items-center gap-4">
                                <div
                                    class="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center shrink-0">
                                    <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 class="text-2xl font-bold text-neutral-900">TUJUAN SEKOLAH</h3>
                            </div>
                            <svg class="w-6 h-6 text-neutral-600 transition-transform duration-300"
                                :class="{ 'rotate-180': activeSection === 'tujuan' }" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <!-- TUJUAN Content -->
                        <div v-show="activeSection === 'tujuan'" class="px-8 pb-8">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div v-for="(goal, index) in goalsData" :key="index"
                                    class="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
                                    <div
                                        class="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                        <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                    <p class="text-neutral-700 text-sm leading-relaxed">{{ goal }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.rotate-180 {
    transform: rotate(180deg);
}
</style>
