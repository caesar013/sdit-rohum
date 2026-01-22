<script setup>
</script>

<template>
    <section class="py-20 px-4 bg-light-gray">
        <div class="max-w-6xl mx-auto">
            <!-- Section Header -->
            <div class="text-center mb-4">
                <p class="text-primary font-semibold text-sm uppercase tracking-wide mb-2">PROFILE SEKOLAH</p>
                <h2 class="text-4xl font-bold text-neutral-900 mb-4">
                    Video Profil Sekolah
                </h2>
                <p class="text-neutral-600 text-lg">
                    Mengenal lebih dekat SD IT Rohmatul Ummah melalui video profile kami.
                </p>
            </div>

            <!-- Video Container -->
            <div class="bg-white rounded-3xl shadow-xl overflow-hidden p-6 md:p-8">
                <div class="aspect-video bg-neutral-900 rounded-2xl overflow-hidden mb-6 relative">
                    <!-- Placeholder for video - replace with actual YouTube embed -->
                    <!-- <img src="/video-thumbnail.jpg" alt="Video Profile Sekolah" class="w-full h-full object-cover" -->
                    <img src="" alt="Video Profile Sekolah" class="w-full h-full object-cover"
                        @error="$event.target.src = 'https://placehold.co/1920x1080/0d5f5f/white?text=Video+Profil+Sekolah'" />
                    <!-- Play Button Overlay -->
                    <div class="absolute inset-0 flex items-center justify-center">
                        <button
                            class="w-20 h-20 bg-primary hover:bg-primary-dark rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl">
                            <svg class="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </button>
                    </div>

                    <!-- Video Caption Overlay -->
                    <div class="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-6">
                        <p class="text-white font-bold text-lg">Pemanfaatan Sarana dan Prasarana Sekolah</p>
                    </div>
                </div>

                <!-- Video Info -->
                <div class="border-t border-neutral-200 pt-6">
                    <h3 class="text-2xl font-bold text-neutral-900 mb-3">
                        Profil Resmi SD IT Rohmatul Ummah
                    </h3>
                    <p class="text-neutral-600 mb-6">
                        Video lengkap tentang fasilitas, program unggulan, dan kegiatan siswa kami.
                    </p>

                    <div class="flex flex-wrap items-center gap-4">
                        <div class="flex items-center text-neutral-600">
                            <svg class="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span class="font-medium">Channel Sekolah</span>
                        </div>
                        <div class="flex items-center text-neutral-600">
                            <svg class="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span class="font-medium">5:32 menit</span>
                        </div>
                        <a href="https://youtube.com" target="_blank"
                            class="ml-auto bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-2 rounded-lg transition-colors inline-flex items-center">
                            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                            </svg>
                            Buka di YouTube
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
