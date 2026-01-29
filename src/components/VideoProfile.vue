<script setup>
import { ref, onMounted } from 'vue'
import { getVideos } from '@/services/api'

const profileVideo = ref(null)

// Fetch profile video from API
const fetchProfileVideo = async () => {
    try {
        const response = await getVideos({
            category: 'profile',
            limit: 1
        })

        if (response.success && response.data.length > 0) {
            profileVideo.value = response.data[0]
        }
    } catch (error) {
        console.error('Error fetching profile video:', error)
    }
}

// Get YouTube embed URL
const getEmbedUrl = (video) => {
    if (!video) return ''
    return video.platform === 'youtube'
        ? `https://www.youtube.com/embed/${video.video_url}`
        : `https://player.vimeo.com/video/${video.video_url}`
}

// Get YouTube watch URL
const getWatchUrl = (video) => {
    if (!video) return '#'
    return video.platform === 'youtube'
        ? `https://www.youtube.com/watch?v=${video.video_url}`
        : `https://vimeo.com/${video.video_url}`
}

onMounted(() => {
    fetchProfileVideo()
})
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
            <div v-if="profileVideo" class="bg-white rounded-3xl shadow-xl overflow-hidden p-6 md:p-8">
                <div class="aspect-video bg-neutral-900 rounded-2xl overflow-hidden mb-6 relative">
                    <!-- YouTube/Vimeo Embed -->
                    <iframe :src="getEmbedUrl(profileVideo)" :title="profileVideo.title" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen class="w-full h-full"></iframe>
                </div>

                <!-- Video Info -->
                <div class="border-t border-neutral-200 pt-6">
                    <h3 class="text-2xl font-bold text-neutral-900 mb-3">
                        {{ profileVideo.title }}
                    </h3>
                    <p class="text-neutral-600 mb-6">
                        {{ profileVideo.description }}
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
                        <div v-if="profileVideo.duration" class="flex items-center text-neutral-600">
                            <svg class="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span class="font-medium">{{ profileVideo.duration }}</span>
                        </div>
                        <a :href="getWatchUrl(profileVideo)" target="_blank"
                            class="ml-auto bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-2 rounded-lg transition-colors inline-flex items-center">
                            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                            </svg>
                            Buka di {{ profileVideo.platform === 'youtube' ? 'YouTube' : 'Vimeo' }}
                        </a>
                    </div>
                </div>
            </div>

            <!-- Fallback if no video -->
            <div v-else class="bg-white rounded-3xl shadow-xl overflow-hidden p-6 md:p-8">
                <div class="aspect-video bg-neutral-900 rounded-2xl overflow-hidden mb-6 relative">
                    <img src="" alt="Video Profile Sekolah" class="w-full h-full object-cover"
                        @error="$event.target.src = 'https://placehold.co/1920x1080/0d5f5f/white?text=Video+Profil+Sekolah'" />
                </div>
                <p class="text-center text-neutral-600">Video profil akan segera hadir</p>
            </div>
        </div>
    </section>
</template>
