<script setup>
import { ref } from 'vue'
import {
    ShieldCheckIcon,
    ChevronDownIcon,
    CalendarIcon,
    CheckCircleIcon,
    BuildingOffice2Icon,
    ArrowDownTrayIcon,
    DocumentTextIcon
} from '@heroicons/vue/24/outline'

// Accreditation data - will be fetched from backend in the future
const accreditationData = ref({
    status: {
        grade: 'A',
        title: 'UNGGUL',
        visitDate: '02-03 Agustus 2023',
        issuedDate: '10 Oktober 2022',
        validUntil: '10 Oktober 2028',
        assessor: 'BAN S/M DIY'
    },
    certificate: {
        title: 'Sertifikat Akreditasi',
        description: 'Dokumen ini ditandatangani secara elektronik dengan menggunakan sertifikat elektronik yang diterbitkan oleh BSrE. Berdasarkan pasal 11 UU ITE Tahun 2018, tanda tangan elektronik memiliki kekuatan hukum dan akibat hukum yang sah.',
        downloadUrl: '#'
    },
    meaning: {
        title: 'Makna Akreditasi',
        description: 'Akreditasi peringkat A (Unggul) yang diraih oleh SD Negeri Kedungrejo menunjukkan bahwa sekolah ini telah memenuhi standar mutu pendidikan yang ditetapkan oleh Badan Akreditasi Nasional Sekolah/Madrasah (BAN S/M).',
        whatItMeans: [
            'Memenuhi 8 Standar Nasional Pendidikan',
            'Memiliki sistem penjaminan mutu pendidikan',
            'Layanan pendidikan yang berkualitas'
        ],
        benefits: [
            'Proses pembelajaran yang terstandar',
            'Fasilitas pendidikan yang memadai',
            'Pengakuan nasional atas ijazah'
        ]
    }
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
                    <ShieldCheckIcon class="w-4 h-4 mr-2" />
                    PRESTASI SEKOLAH
                </div>

                <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
                    Akreditasi Sekolah
                </h1>
                <p class="text-xl text-white/90 mb-12">
                    Pengakuan Resmi atas Mutu Pendidikan di SD Negeri Kedungrejo
                </p>

                <!-- Scroll Indicator -->
                <div>
                    <p class="text-white/80 text-sm mb-2">Lihat Sertifikat</p>
                    <ChevronDownIcon class="w-6 h-6 mx-auto text-white animate-bounce" />
                </div>
            </div>

            <!-- Decorative Circle -->
            <div class="absolute -left-20 -top-20 w-64 h-64 bg-white/5 rounded-full"></div>
            <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full"></div>
        </section>

        <!-- Main Content -->
        <section class="py-16 px-4 -mt-16 relative z-10">
            <div class="max-w-5xl mx-auto space-y-8">
                <div class="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div class="bg-linear-to-r from-primary to-primary-dark p-6">
                        <h2 class="text-2xl font-bold text-white flex items-center">
                            <CheckCircleIcon class="w-8 h-8 mr-3" />
                            Status Akreditasi Terkini
                        </h2>
                    </div>

                    <div class="p-8 md:p-12">
                        <div class="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
                            <!-- Large Accreditation Badge -->
                            <div class="md:col-span-2 flex justify-center">
                                <div class="relative">
                                    <div
                                        class="w-48 h-48 rounded-full border-8 border-amber-400 bg-linear-to-br from-amber-50 to-amber-100 flex flex-col items-center justify-center shadow-xl">
                                        <span class="text-6xl font-bold text-amber-600">{{
                                            accreditationData.status.grade }}</span>
                                        <span class="text-lg font-semibold text-amber-700 mt-2">{{
                                            accreditationData.status.title }}</span>
                                    </div>
                                    <div
                                        class="absolute -top-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                        <CheckCircleIcon class="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            </div>

                            <!-- Accreditation Details -->
                            <div class="md:col-span-3 space-y-4">
                                <div class="flex items-start space-x-3">
                                    <CalendarIcon class="w-6 h-6 text-primary shrink-0 mt-1" />
                                    <div>
                                        <p class="text-sm font-semibold text-primary uppercase">Tanggal Visitasi</p>
                                        <p class="text-lg text-neutral-900">{{ accreditationData.status.visitDate }}</p>
                                    </div>
                                </div>

                                <div class="flex items-start space-x-3">
                                    <CheckCircleIcon class="w-6 h-6 text-green-600 shrink-0 mt-1" />
                                    <div>
                                        <p class="text-sm font-semibold text-green-700 uppercase">Ditetapkan</p>
                                        <p class="text-lg text-neutral-900">{{ accreditationData.status.issuedDate }}
                                        </p>
                                    </div>
                                </div>

                                <div class="flex items-start space-x-3">
                                    <CalendarIcon class="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                                    <div>
                                        <p class="text-sm font-semibold text-amber-700 uppercase">Berlaku Sampai</p>
                                        <p class="text-lg text-neutral-900">{{ accreditationData.status.validUntil }}
                                        </p>
                                    </div>
                                </div>

                                <div class="flex items-start space-x-3">
                                    <BuildingOffice2Icon class="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                                    <div>
                                        <p class="text-sm font-semibold text-blue-700 uppercase">Lembaga Penilai</p>
                                        <p class="text-lg text-neutral-900">{{ accreditationData.status.assessor }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sertifikat Akreditasi -->
                <div class="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div class="bg-linear-to-r from-amber-500 to-amber-600 p-6">
                        <h2 class="text-2xl font-bold text-white flex items-center">
                            <DocumentTextIcon class="w-8 h-8 mr-3" />
                            Sertifikat Akreditasi
                        </h2>
                    </div>

                    <div class="p-8 md:p-12">
                        <!-- Certificate Preview -->
                        <div
                            class="bg-linear-to-br from-amber-50 to-orange-50 rounded-2xl p-8 mb-6 border-2 border-amber-200 relative overflow-hidden">
                            <div class="absolute top-0 right-0 w-32 h-32 bg-amber-200/30 rounded-full -mr-16 -mt-16">
                            </div>
                            <div class="absolute bottom-0 left-0 w-40 h-40 bg-orange-200/30 rounded-full -ml-20 -mb-20">
                            </div>

                            <div class="relative z-10 text-center">
                                <div
                                    class="w-24 h-24 bg-amber-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <ShieldCheckIcon class="w-14 h-14 text-white" />
                                </div>
                                <h3 class="text-2xl font-bold text-neutral-900 mb-2">Sertifikat Akreditasi</h3>
                                <p class="text-lg text-neutral-700 mb-4">Peringkat A (Unggul)</p>
                                <div class="inline-block bg-white px-6 py-3 rounded-lg shadow-md mb-6">
                                    <p class="text-sm font-mono text-neutral-600">No. Sertifikat: 123/BAN-SM/SK/2022</p>
                                </div>

                                <!-- QR Code Placeholder -->
                                <div
                                    class="w-32 h-32 bg-white mx-auto rounded-lg shadow-md flex items-center justify-center mb-4">
                                    <div class="w-28 h-28 bg-neutral-900 rounded"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Certificate Description -->
                        <div class="bg-blue-50 rounded-xl p-6 mb-6 border-l-4 border-blue-500">
                            <p class="text-neutral-700 leading-relaxed text-center">
                                {{ accreditationData.certificate.description }}
                            </p>
                        </div>

                        <!-- Download Button -->
                        <div class="text-center">
                            <a :href="accreditationData.certificate.downloadUrl"
                                class="inline-flex items-center bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <ArrowDownTrayIcon class="w-6 h-6 mr-2" />
                                Unduh Sertifikat
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Makna Akreditasi -->
                <div class="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div class="bg-linear-to-r from-primary to-primary-dark p-6">
                        <h2 class="text-2xl font-bold text-white flex items-center">
                            <ShieldCheckIcon class="w-8 h-8 mr-3" />
                            Makna Akreditasi
                        </h2>
                    </div>

                    <div class="p-8 md:p-12">
                        <p class="text-lg text-neutral-700 leading-relaxed mb-8">
                            {{ accreditationData.meaning.description }}
                        </p>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <!-- Apa Artinya -->
                            <div
                                class="bg-linear-to-br from-cyan-50 to-cyan-100 rounded-2xl p-8 border-l-4 border-cyan-500">
                                <h3 class="text-2xl font-bold text-cyan-900 mb-6">Apa Artinya?</h3>
                                <ul class="space-y-4">
                                    <li v-for="(item, index) in accreditationData.meaning.whatItMeans" :key="index"
                                        class="flex items-start space-x-3">
                                        <CheckCircleIcon class="w-6 h-6 text-cyan-600 shrink-0 mt-0.5" />
                                        <span class="text-neutral-800">{{ item }}</span>
                                    </li>
                                </ul>
                            </div>

                            <!-- Manfaat untuk Siswa -->
                            <div
                                class="bg-linear-to-br from-amber-50 to-amber-100 rounded-2xl p-8 border-l-4 border-amber-500">
                                <h3 class="text-2xl font-bold text-amber-900 mb-6">Manfaat untuk Siswa</h3>
                                <ul class="space-y-4">
                                    <li v-for="(item, index) in accreditationData.meaning.benefits" :key="index"
                                        class="flex items-start space-x-3">
                                        <CheckCircleIcon class="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                                        <span class="text-neutral-800">{{ item }}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    </div>
</template>
