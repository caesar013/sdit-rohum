<script setup>
import { ref } from 'vue'
import {
    PhoneIcon,
    EnvelopeIcon,
    MapPinIcon,
    PaperAirplaneIcon
} from '@heroicons/vue/24/outline'

// Contact information - will be fetched from backend
const contactInfo = ref({
    whatsapp: '082136781467',
    email: 'info@sdnkedungrejo.sch.id',
    address: 'Jekulo, Kudus, Jawa Tengah',
    fullAddress: 'Jl. Hastrodirono No.40, Dusun Pulutan, Kecamatan Jekulo, Kabupaten Kudus, Jawa Tengah 59382',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4643.635376492845!2d110.9177496194934!3d-6.8168365738855625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e70cf92513e9e27%3A0x99636af1c56445f5!2sTK%20IT%20-%20SD%20IT%20Rohmatul%20Ummah!5e0!3m2!1sen!2sid!4v1769167878736!5m2!1sen!2sid'
})

// Social media links - will be fetched from backend
const socialMedia = ref({
    facebook: 'https://facebook.com/sditrohum',
    instagram: 'https://instagram.com/sditrohum',
    youtube: 'https://youtube.com/@sditrohum',
    twitter: 'https://twitter.com/sditrohum'
})

// Contact form data
const contactForm = ref({
    name: '',
    email: '',
    message: ''
})

// Form submission status
const isSubmitting = ref(false)

// Functions - will be implemented when backend is ready
const submitContactForm = async () => {
    // TODO: Submit contact form to backend API
    isSubmitting.value = true

    try {
        console.log('Submitting contact form:', contactForm.value)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Reset form after successful submission
        contactForm.value = {
            name: '',
            email: '',
            message: ''
        }

        alert('Pesan Anda telah terkirim. Kami akan segera menghubungi Anda.')
    } catch (error) {
        console.error('Error submitting form:', error)
        alert('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
        isSubmitting.value = false
    }
}

const openWhatsApp = () => {
    window.open(`https://wa.me/${contactInfo.value.whatsapp}`, '_blank')
}

const openGoogleMaps = () => {
    window.open('https://maps.google.com/?q=SD+Negeri+Kedungrejo', '_blank')
}

const openSocialMedia = (platform) => {
    if (socialMedia.value[platform]) {
        window.open(socialMedia.value[platform], '_blank')
    }
}
</script>

<template>
    <div class="min-h-screen bg-neutral-50">
        <!-- Hero Section -->
        <section class="bg-linear-to-br from-primary to-primary-dark py-20 px-4">
            <div class="max-w-4xl mx-auto text-center">
                <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
                    Hubungi Kami
                </h1>
                <p class="text-xl text-white/90">
                    Silahkan hubungi kami jika ada pertanyaan atau informasi yang dibutuhkan
                </p>
            </div>
        </section>

        <!-- Contact Section -->
        <section class="py-16 px-4 -mt-12 relative z-10">
            <div class="max-w-6xl mx-auto">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    <!-- Left Side - Contact Information -->
                    <div
                        class="bg-linear-to-br from-primary to-primary-dark rounded-3xl shadow-2xl p-8 md:p-12 text-white">
                        <h2 class="text-2xl font-bold mb-6 flex items-center gap-3">
                            <PhoneIcon class="w-8 h-8" />
                            Informasi Kontak
                        </h2>

                        <p class="text-white/90 mb-8 leading-relaxed">
                            Jangan ragu untuk menghubungi kami melalui berbagai saluran berikut. Kami berkomitmen untuk
                            merespons setiap pertanyaan dalam waktu 24 jam.
                        </p>

                        <!-- Contact Details -->
                        <div class="space-y-6 mb-10">
                            <!-- WhatsApp -->
                            <div @click="openWhatsApp"
                                class="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors cursor-pointer">
                                <div class="shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                    <PhoneIcon class="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 class="font-bold text-lg mb-1">WhatsApp</h3>
                                    <p class="text-white/90">{{ contactInfo.whatsapp }}</p>
                                </div>
                            </div>

                            <!-- Email -->
                            <div class="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                                <div class="shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                    <EnvelopeIcon class="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 class="font-bold text-lg mb-1">Email</h3>
                                    <p class="text-white/90">{{ contactInfo.email }}</p>
                                </div>
                            </div>

                            <!-- Address -->
                            <div class="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                                <div class="shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                    <MapPinIcon class="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 class="font-bold text-lg mb-1">Alamat</h3>
                                    <p class="text-white/90">{{ contactInfo.address }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Social Media -->
                        <div class="border-t border-white/20 pt-8">
                            <h3 class="font-bold text-lg mb-4">Ikuti Kami</h3>
                            <div class="flex gap-4">
                                <button @click="openSocialMedia('facebook')"
                                    class="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                                    aria-label="Facebook">
                                    <svg class="w-6 h-6 fill-white" viewBox="0 0 24 24">
                                        <path
                                            d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </button>
                                <button @click="openSocialMedia('instagram')"
                                    class="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                                    aria-label="Instagram">
                                    <svg class="w-6 h-6 fill-white" viewBox="0 0 24 24">
                                        <path
                                            d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </button>
                                <button @click="openSocialMedia('youtube')"
                                    class="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                                    aria-label="YouTube">
                                    <svg class="w-6 h-6 fill-white" viewBox="0 0 24 24">
                                        <path
                                            d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                </button>
                                <button @click="openSocialMedia('twitter')"
                                    class="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                                    aria-label="Twitter">
                                    <svg class="w-6 h-6 fill-white" viewBox="0 0 24 24">
                                        <path
                                            d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <!-- Google Maps Button -->
                        <button @click="openGoogleMaps"
                            class="w-full mt-8 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer">
                            <MapPinIcon class="w-6 h-6" />
                            Lihat di Gmaps
                        </button>
                    </div>

                    <!-- Right Side - Contact Form -->
                    <div class="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                        <h2 class="text-2xl font-bold text-neutral-900 mb-3">Kirim Pesan</h2>
                        <p class="text-neutral-600 mb-8">
                            Isi formulir berikut dan kami akan segera membalas Anda melalui email yang ada tulskan.
                        </p>

                        <form @submit.prevent="submitContactForm" class="space-y-6">
                            <!-- Nama Lengkap -->
                            <div>
                                <label class="block text-sm font-semibold text-neutral-700 mb-2">
                                    Nama Lengkap
                                </label>
                                <div class="relative">
                                    <input v-model="contactForm.name" type="text" required placeholder="Nama Anda"
                                        class="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                                    <div class="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <!-- Alamat Email -->
                            <div>
                                <label class="block text-sm font-semibold text-neutral-700 mb-2">
                                    Alamat Email
                                </label>
                                <div class="relative">
                                    <input v-model="contactForm.email" type="email" required
                                        placeholder="email@contoh.com"
                                        class="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                                    <div class="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                                        <EnvelopeIcon class="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            <!-- Pesan -->
                            <div>
                                <label class="block text-sm font-semibold text-neutral-700 mb-2">
                                    Pesan
                                </label>
                                <div class="relative">
                                    <textarea v-model="contactForm.message" required rows="6"
                                        placeholder="Tulis pesan Anda di sini..."
                                        class="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"></textarea>
                                    <div class="absolute left-4 top-4 text-neutral-400">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <!-- Submit Button -->
                            <button type="submit" :disabled="isSubmitting"
                                class="w-full px-6 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                <PaperAirplaneIcon class="w-6 h-6" />
                                {{ isSubmitting ? 'Mengirim...' : 'Kirim Pesan' }}
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </section>

        <!-- Map Section -->
        <section class="py-16 px-4">
            <div class="max-w-6xl mx-auto">
                <h2 class="text-3xl font-bold text-neutral-900 text-center mb-12">Lokasi Kami</h2>

                <div class="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <iframe :src="contactInfo.mapEmbedUrl" width="100%" height="500" style="border:0;"
                        allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
                        class="w-full"></iframe>
                </div>
            </div>
        </section>
    </div>
</template>
