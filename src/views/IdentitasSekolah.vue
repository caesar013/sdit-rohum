<script setup>
import { ref } from 'vue'
import {
    BuildingLibraryIcon,
    ChevronDownIcon,
    UserIcon,
    MapPinIcon,
    PhoneIcon,
    EnvelopeIcon,
    InformationCircleIcon,
    MapIcon
} from '@heroicons/vue/24/outline'

// School identity data - will be fetched from backend in the future
const schoolData = ref({
    name: 'SD Negeri Kedungrejo',
    npsn: '20403001',
    principal: {
        name: 'Sri Mardiyati, S.Pd.',
        label: 'KEPALA SEKOLAH'
    },
    contact: {
        phone: '082136781467',
        fax: '-',
        label: 'KONTAK'
    },
    email: {
        email: 'info@sditrohmatulummah.sch.id',
        website: 'https://sditrohmatulummah.sch.id',
        label: 'EMAIL & WEBSITE'
    },
    address: {
        label: 'ALAMAT LENGKAP',
        street: 'Jl. Hastrodirono No.40',
        village: 'Dusun Pulutan',
        district: 'Kecematan Jekulo',
        subdistrict: 'Kabupaten Kudus',
        postalCode: 'Kode Pos: 59382',
        city: 'Jawa Tengah',
    },
    additionalInfo: {
        status: {
            label: 'STATUS SEKOLAH',
            value: 'Negeri'
        },
        accreditation: {
            label: 'AKREDITASI',
            value: 'A (Unggul)'
        },
        established: {
            label: 'TAHUN BERDIRI',
            value: '1960'
        }
    }
})
</script>

<template>
    <div class="min-h-screen bg-neutral-50">
        <!-- Hero Section -->
        <section class="bg-gradient-to-br from-primary to-primary-dark py-20 px-4">
            <div class="max-w-4xl mx-auto text-center">
                <!-- Breadcrumb -->
                <div
                    class="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-white mb-6">
                    <BuildingLibraryIcon class="w-4 h-4 mr-2" />
                    Profil Institusi
                </div>

                <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
                    Identitas Sekolah
                </h1>
                <p class="text-xl text-white/90">
                    Profil lengkap SD Negeri Kedungrejo
                </p>

                <!-- Scroll Indicator -->
                <div class="mt-12">
                    <p class="text-white/80 text-sm mb-2">Scroll untuk melanjutkan</p>
                    <ChevronDownIcon class="w-6 h-6 mx-auto text-white animate-bounce" />
                </div>
            </div>
        </section>

        <!-- Main Content -->
        <section class="py-16 px-4 -mt-16 relative z-10">
            <div class="max-w-5xl mx-auto">
                <!-- School Identity Card -->
                <div class="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <!-- Header -->
                    <div class="bg-gradient-to-r from-primary to-primary-dark p-8 text-white">
                        <div class="flex items-center space-x-4">
                            <div
                                class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                <BuildingLibraryIcon class="w-10 h-10" />
                            </div>
                            <div>
                                <h2 class="text-3xl font-bold">{{ schoolData.name }}</h2>
                                <p class="text-white/80">NPSN: {{ schoolData.npsn }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Contact Information Grid -->
                    <div class="p-8 md:p-12">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <!-- Principal -->
                            <div class="flex items-start space-x-4">
                                <div
                                    class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <UserIcon class="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p class="text-sm font-semibold text-primary uppercase mb-1">{{
                                        schoolData.principal.label }}</p>
                                    <p class="text-lg font-bold text-neutral-900">{{ schoolData.principal.name }}</p>
                                </div>
                            </div>

                            <!-- Address -->
                            <div class="flex items-start space-x-4">
                                <div
                                    class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <MapPinIcon class="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p class="text-sm font-semibold text-primary uppercase mb-1">{{
                                        schoolData.address.label }}</p>
                                    <p class="text-neutral-700">{{ schoolData.address.street }}</p>
                                    <p class="text-neutral-700">{{ schoolData.address.village }}</p>
                                    <p class="text-neutral-700">{{ schoolData.address.district }}</p>
                                    <p class="text-neutral-700">{{ schoolData.address.subdistrict }}</p>
                                    <p class="text-neutral-700">{{ schoolData.address.city }}</p>
                                    <p class="text-neutral-700 font-medium">{{ schoolData.address.postalCode }}</p>
                                </div>
                            </div>

                            <!-- Contact -->
                            <div class="flex items-start space-x-4">
                                <div
                                    class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <PhoneIcon class="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p class="text-sm font-semibold text-primary uppercase mb-1">{{
                                        schoolData.contact.label }}</p>
                                    <p class="text-lg font-bold text-neutral-900">{{ schoolData.contact.phone }}</p>
                                    <p class="text-neutral-600">Fax: {{ schoolData.contact.fax }}</p>
                                </div>
                            </div>

                            <!-- Email & Website -->
                            <div class="flex items-start space-x-4">
                                <div
                                    class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <EnvelopeIcon class="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p class="text-sm font-semibold text-primary uppercase mb-1">{{
                                        schoolData.email.label }}</p>
                                    <p class="text-lg font-bold text-neutral-900 break-all">{{ schoolData.email.email }}
                                    </p>
                                    <a :href="schoolData.email.website" target="_blank"
                                        class="text-primary hover:text-primary-dark underline">
                                        {{ schoolData.email.website }}
                                    </a>

                                    <a href="#"
                                        class="mt-3 inline-flex items-center text-primary hover:text-primary-dark font-semibold transition-colors">
                                        <MapIcon class="w-5 h-5 mr-2" />
                                        Lihat di Peta
                                    </a>
                                </div>
                            </div>
                        </div>

                        <!-- Additional Information -->
                        <div class="border-t border-neutral-200 pt-8">
                            <h3 class="text-xl font-bold text-neutral-900 mb-6 flex items-center">
                                <InformationCircleIcon class="w-6 h-6 mr-2 text-primary" />
                                Informasi Tambahan
                            </h3>

                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <!-- Status -->
                                <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                                    <p class="text-sm font-semibold text-blue-700 uppercase mb-2">
                                        {{ schoolData.additionalInfo.status.label }}
                                    </p>
                                    <p class="text-2xl font-bold text-blue-900">
                                        {{ schoolData.additionalInfo.status.value }}
                                    </p>
                                </div>

                                <!-- Accreditation -->
                                <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                                    <p class="text-sm font-semibold text-green-700 uppercase mb-2">
                                        {{ schoolData.additionalInfo.accreditation.label }}
                                    </p>
                                    <p class="text-2xl font-bold text-green-900">
                                        {{ schoolData.additionalInfo.accreditation.value }}
                                    </p>
                                </div>

                                <!-- Year Established -->
                                <div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6">
                                    <p class="text-sm font-semibold text-amber-700 uppercase mb-2">
                                        {{ schoolData.additionalInfo.established.label }}
                                    </p>
                                    <p class="text-2xl font-bold text-amber-900">
                                        {{ schoolData.additionalInfo.established.value }}
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
