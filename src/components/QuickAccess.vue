<script setup>
const contactInfo = {
    address: {
        street: 'Jl. Hastrodirono No.40,',
        detail: 'Pulutan, Kec. Jekulo, Kab. Kudus,',
        city: 'Jawa Tengah 59382',
        country: 'Indonesia'
    },
    phone: '082136781467',
    email: 'info@sditrohmatulummah.sch.id',
    // Coordinates for SD IT Rohmatul Ummah (approximate)
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d247.6022741462647!2d110.91723483055827!3d-6.814004779397993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e70cf92513e9e27%3A0x99636af1c56445f5!2sTK%20IT%20-%20SD%20IT%20Rohmatul%20Ummah!5e0!3m2!1sen!2sid!4v1768990498248!5m2!1sen!2sid'
}
</script>

<template>
    <section class="py-20 px-4 bg-gradient-to-br from-primary to-primary-dark">
        <div class="max-w-7xl mx-auto">
            <!-- Section Header -->
            <div class="text-center mb-12">
                <h2 class="text-4xl font-bold text-white mb-4">
                    Akses Cepat
                </h2>
                <p class="text-white/90 text-lg">
                    Temukan layanan utama kami dengan cepat dan mudah
                </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-10 gap-8">
                <!-- Contact Information Card (Left - 3 columns) -->
                <div class="lg:col-span-3 bg-white rounded-2xl p-8 shadow-xl">
                    <h3 class="text-2xl font-bold text-primary mb-6">Informasi Kontak</h3>

                    <div class="space-y-4">
                        <!-- Address -->
                        <div class="flex items-start">
                            <div
                                class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <p class="font-semibold text-neutral-900 mb-1">Alamat</p>
                                <p class="text-neutral-600 text-sm">{{ contactInfo.address.street }}</p>
                                <p class="text-neutral-600 text-sm">{{ contactInfo.address.detail }}</p>
                                <p class="text-neutral-600 text-sm">{{ contactInfo.address.city }}</p>
                                <p class="text-neutral-600 text-sm">{{ contactInfo.address.country }}</p>
                            </div>
                        </div>

                        <!-- Phone -->
                        <div class="flex items-start">
                            <div
                                class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <div>
                                <p class="font-semibold text-neutral-900 mb-1">Telepon</p>
                                <p class="text-neutral-600">{{ contactInfo.phone }}</p>
                            </div>
                        </div>

                        <!-- Email -->
                        <div class="flex items-start">
                            <div
                                class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p class="font-semibold text-neutral-900 mb-1">Email</p>
                                <p class="text-neutral-600">{{ contactInfo.email }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Google Maps Button -->
                    <a :href="contactInfo.mapEmbedUrl" target="_blank"
                        class="mt-6 w-full bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors inline-flex items-center justify-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Lihat di Google Maps
                    </a>
                </div>

                <!-- Google Maps Preview (Right - 7 columns) -->
                <div class="lg:col-span-7 bg-white rounded-2xl overflow-hidden shadow-xl">
                    <iframe :src="contactInfo.mapEmbedUrl" width="100%" height="500" style="border:0;"
                        allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
                        class="w-full h-full min-h-[500px]"></iframe>
                </div>
            </div>
        </div>
    </section>
</template>
