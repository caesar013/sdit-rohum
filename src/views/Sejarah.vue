<script setup>
import { ref } from 'vue'
import { BookOpenIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'

// School history data - will be fetched from backend in the future
const historyData = ref({
    title: 'Sejarah Sekolah',
    subtitle: 'Perjalanan panjang SD Negeri Kedungrejo',
    introduction: {
        text: 'SD Negeri Kedungrejo memiliki sejarah panjang yang dimulai sejak tahun 1960. Berdiri dengan tekad untuk memberikan pendidikan berkualitas bagi anak-anak di wilayah Kedungrejo dan sekitarnya.'
    },
    timeline: [
        {
            year: '1960',
            title: 'Pendirian Sekolah',
            description: 'SD Negeri Kedungrejo didirikan pertama kali dengan fasilitas sederhana namun semangat yang tinggi untuk mencerdaskan anak bangsa.',
            icon: 'foundation'
        },
        {
            year: '1975',
            title: 'Renovasi Pertama',
            description: 'Dilakukan renovasi besar-besaran untuk meningkatkan kualitas fasilitas belajar mengajar dan menambah ruang kelas baru.',
            icon: 'building'
        },
        {
            year: '1990',
            title: 'Peningkatan Akreditasi',
            description: 'Sekolah berhasil meningkatkan akreditasi menjadi Akreditasi A berkat dedikasi guru dan prestasi siswa yang gemilang.',
            icon: 'award'
        },
        {
            year: '2005',
            title: 'Era Digital',
            description: 'Memulai transformasi digital dengan memperkenalkan komputer dan internet sebagai bagian dari proses pembelajaran.',
            icon: 'computer'
        },
        {
            year: '2015',
            title: 'Modernisasi Fasilitas',
            description: 'Pembangunan laboratorium komputer, perpustakaan modern, dan fasilitas olahraga yang lebih lengkap.',
            icon: 'upgrade'
        },
        {
            year: '2020',
            title: 'Adaptasi Pembelajaran Online',
            description: 'Sukses beradaptasi dengan pembelajaran jarak jauh selama pandemi dengan sistem pembelajaran online yang efektif.',
            icon: 'online'
        },
        {
            year: '2026',
            title: 'Era Baru Pendidikan',
            description: 'Terus berinovasi dengan mengintegrasikan teknologi modern dalam pembelajaran sambil mempertahankan nilai-nilai luhur pendidikan.',
            icon: 'future'
        }
    ],
    achievements: [
        {
            title: '60+ Tahun',
            description: 'Pengabdian dalam dunia pendidikan',
            color: 'from-blue-400 to-blue-800'
        },
        {
            title: 'Akreditasi A',
            description: 'Sejak tahun 1990',
            color: 'from-green-400 to-green-800'
        },
        {
            title: '1000+',
            description: 'Alumni tersebar di seluruh Indonesia',
            color: 'from-violet-400 to-violet-800'
        }
    ]
})
</script>

<template>
    <div class="min-h-screen bg-neutral-50">
        <!-- Hero Section -->
        <section class="bg-linear-to-br from-primary to-primary-dark py-20 px-4">
            <div class="max-w-4xl mx-auto text-center">
                <!-- Breadcrumb -->
                <div
                    class="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-white mb-6">
                    <BookOpenIcon class="w-4 h-4 mr-2" />
                    Profil Institusi
                </div>

                <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
                    {{ historyData.title }}
                </h1>
                <p class="text-xl text-white/90">
                    {{ historyData.subtitle }}
                </p>

                <!-- Scroll Indicator -->
                <div class="mt-12">
                    <p class="text-white/80 text-sm mb-2">Scroll untuk melanjutkan</p>
                    <ChevronDownIcon class="w-6 h-6 mx-auto text-white animate-bounce" />
                </div>
            </div>
        </section>

        <!-- Introduction -->
        <section class="py-16 px-4 -mt-16 relative z-10">
            <div class="max-w-5xl mx-auto">
                <div class="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-12">
                    <div class="flex items-start space-x-4 mb-6">
                        <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                            <BookOpenIcon class="w-10 h-10 text-primary" />
                        </div>
                        <div>
                            <h2 class="text-3xl font-bold text-neutral-900 mb-4">Tentang Sejarah Kami</h2>
                            <p class="text-lg text-neutral-700 leading-relaxed">
                                {{ historyData.introduction.text }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Timeline -->
                <div class="mb-12">
                    <h2 class="text-3xl font-bold text-neutral-900 text-center mb-12">
                        Perjalanan Waktu
                    </h2>

                    <div class="relative max-w-4xl mx-auto">
                        <!-- Timeline Line -->
                        <div
                            class="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 bg-primary/20 hidden md:block">
                        </div>

                        <!-- Timeline Items -->
                        <div class="space-y-12">
                            <div v-for="(item, index) in historyData.timeline" :key="index" class="relative">
                                <!-- Desktop Layout -->
                                <div class="hidden md:grid md:grid-cols-2 md:gap-8 items-center">
                                    <!-- Left Side Content (for even index) -->
                                    <div v-if="index % 2 === 0" class="text-right pr-8">
                                        <div class="bg-white rounded-2xl shadow-lg p-6 inline-block text-left">
                                            <h3 class="text-2xl font-bold text-neutral-900 mb-3">
                                                {{ item.title }}
                                            </h3>
                                            <p class="text-neutral-700 leading-relaxed">
                                                {{ item.description }}
                                            </p>
                                        </div>
                                    </div>
                                    <div v-else></div>

                                    <!-- Year Circle (center) - Now in between columns -->
                                    <div
                                        class="absolute left-1/2 transform -translate-x-1/2 w-24 h-24 bg-linear-to-br from-green-300 to-green-700 rounded-full flex items-center justify-center shadow-xl z-10">
                                        <span class="text-white font-bold text-lg">{{ item.year }}</span>
                                    </div>

                                    <!-- Right Side Content (for odd index) -->
                                    <div v-if="index % 2 === 1" class="pl-8">
                                        <div class="bg-white rounded-2xl shadow-lg p-6 inline-block">
                                            <h3 class="text-2xl font-bold text-neutral-900 mb-3">
                                                {{ item.title }}
                                            </h3>
                                            <p class="text-neutral-700 leading-relaxed">
                                                {{ item.description }}
                                            </p>
                                        </div>
                                    </div>
                                    <div v-else></div>
                                </div>

                                <!-- Mobile Layout -->
                                <div class="md:hidden flex items-start gap-4">
                                    <div
                                        class="w-16 h-16 bg-linear-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-xl shrink-0">
                                        <span class="text-white font-bold text-sm">{{ item.year }}</span>
                                    </div>
                                    <div class="bg-white rounded-2xl shadow-lg p-6 flex-1">
                                        <h3 class="text-xl font-bold text-neutral-900 mb-3">
                                            {{ item.title }}
                                        </h3>
                                        <p class="text-neutral-700 leading-relaxed">
                                            {{ item.description }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Achievements -->
                <div class="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                    <h2 class="text-3xl font-bold text-neutral-900 text-center mb-8">
                        Pencapaian Kami
                    </h2>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div v-for="(achievement, index) in historyData.achievements" :key="index"
                            :class="`bg-linear-to-br ${achievement.color} rounded-2xl p-8 text-center text-white transform hover:scale-105 transition-transform duration-300`">
                            <p class="text-4xl font-bold mb-2">{{ achievement.title }}</p>
                            <p class="text-lg opacity-90">{{ achievement.description }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
