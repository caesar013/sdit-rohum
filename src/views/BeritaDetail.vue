<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
    HomeIcon,
    ChevronRightIcon,
    CalendarIcon,
    UserIcon,
    EyeIcon,
    ArrowLeftIcon,
    ShareIcon,
    ChatBubbleLeftIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()

// Article data - will be fetched from backend based on route.params.slug
const article = ref({
    id: 2,
    title: 'Serunya Outing Class SD Negeri Kedungrejo ke Yogyakarta: Belajar Sambil Berwisata!',
    slug: 'outing-class-yogyakarta',
    date: 'Senin, 27 Oktober 2025',
    author: 'SDN Kedungrejo Pengasih',
    views: 426,
    image: '/placeholder-news-outing.jpg',
    content: `
    <p>Sabtu, 25 Oktober 2025 menjadi hari penuh keceriaan bagi siswa SD Negeri Kedungrejo Kapanewon Pengasih. Hari itu, para siswa mengikuti <strong>Outing Class</strong> ke Yogyakarta, sebuah kegiatan belajar sambil berwisata yang menghadirkan pengalaman berbeda dari pelajaran di kelas.</p>
    
    <p>Rombongan berangkat <strong>pagi-pagi dari Stasiun Wates pukul 08.01</strong> menggunakan <strong>Kereta Api Bandara</strong>. Suasana di gerbong dipenuhi tawa dan antusiasme anak-anak, sambil belajar mengenal cara naik kereta dan aturan keselamatan dari <strong>petugas KAI Stasiun Tugu</strong>. Berkat bimbingan petugas, pulangnya rombongan bisa nyaman <strong>satu gerbong penuh bersama</strong>.</p>
    
    <p>Setibanya di Yogyakarta, petualangan edukatif dimulai. Destinasi pertama adalah <strong>Taman Pintar</strong>, di mana siswa diajak belajar sains secara seru di <strong>Gedung Oval dan Kotak</strong>. Mereka mencoba eksperimen, menyaksikan atraksi interaktif, dan belajar sambil bermain.</p>
    
    <p>Salah satu peserta didik, <strong>Adha Adi Gama</strong>, juga berbagi keseruan, <em>"Seru banget! Bisa naik kereta, main di Taman Pintar, dan lihat Benteng Vredeburg. Belajar jadi lebih asik karena bisa langsung dicoba sendiri!"</em></p>
    
    <p>Setelah seharlan penuh belajar dan bermain, rombongan kembali ke <strong>Stasiun Wates pukul 16.07</strong>, membawa pulang pengalaman baru yang berkesan. Outing Class ini membuktikan bahwa <strong>belajar tidak harus selalu di kelas—tapi bisa sambil berpetualang!</strong></p>
  `,
    tags: ['Berita', '2025', 'Pembelajaran']
})

// Comments - will be fetched from backend
const comments = ref([
    {
        id: 1,
        name: 'Sumardi',
        date: '1 bulan yang lalu',
        avatar: 'S',
        comment: 'Saya sangat berkerja keras Adi guru'
    }
])

// Related news - will be fetched from backend
const relatedNews = ref([
    {
        id: 1,
        title: 'ANBK Utama SD Negeri Kedungrejo Berjalan Lancar, Hari Kedua Sempat Mengalami Penundaan Teknis',
        image: '/placeholder-related-1.jpg',
        date: '25 Sep 2025',
        slug: 'anbk-utama-2025'
    },
    {
        id: 2,
        title: 'PPDB 2021/2022',
        image: '/placeholder-related-2.jpg',
        date: '15 Jun 2021',
        slug: 'ppdb-2021-2022'
    }
])

// Comment form
const commentForm = ref({
    name: '',
    email: '',
    comment: ''
})

// Functions - will be implemented when backend is ready
const goBack = () => {
    router.push('/berita')
}

const submitComment = () => {
    // TODO: Implement comment submission to backend API
    console.log('Submitting comment:', commentForm.value)
    // Reset form after submission
    commentForm.value = {
        name: '',
        email: '',
        comment: ''
    }
}

const shareArticle = (platform) => {
    // TODO: Implement share functionality
    console.log('Sharing to:', platform)
}

const handleImageError = (event) => {
    event.target.src = 'https://via.placeholder.com/1200x600/0d5f5f/ffffff?text=Berita+Sekolah'
}
</script>

<template>
    <div class="min-h-screen bg-neutral-50">
        <!-- Header with Breadcrumb -->
        <section class="bg-linear-to-br from-primary to-primary-dark py-8 px-4">
            <div class="max-w-5xl mx-auto">
                <!-- Back Button -->
                <button @click="goBack"
                    class="inline-flex items-center text-white/90 hover:text-white mb-4 transition-colors cursor-pointer">
                    <ArrowLeftIcon class="w-5 h-5 mr-2" />
                    Kembali ke Indeks
                </button>

                <!-- Breadcrumb -->
                <nav class="flex items-center text-sm text-white/80 mb-6">
                    <HomeIcon class="w-4 h-4 mr-2" />
                    <router-link to="/" class="hover:text-white transition-colors cursor-pointer">Home</router-link>
                    <ChevronRightIcon class="w-4 h-4 mx-2" />
                    <router-link to="/berita"
                        class="hover:text-white transition-colors cursor-pointer">Berita</router-link>
                    <ChevronRightIcon class="w-4 h-4 mx-2" />
                    <span class="text-white line-clamp-1">{{ article.title }}</span>
                </nav>
            </div>
        </section>

        <!-- Article Content -->
        <article class="py-12 px-4 -mt-4 relative z-10">
            <div class="max-w-5xl mx-auto">
                <div class="bg-white rounded-3xl shadow-2xl overflow-hidden">

                    <!-- Article Header -->
                    <div class="p-8 md:p-12 border-b border-neutral-200">
                        <h1 class="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                            {{ article.title }}
                        </h1>

                        <!-- Article Meta -->
                        <div class="flex flex-wrap gap-6 text-sm text-neutral-600">
                            <div class="flex items-center">
                                <CalendarIcon class="w-5 h-5 mr-2 text-primary" />
                                {{ article.date }}
                            </div>
                            <div class="flex items-center">
                                <UserIcon class="w-5 h-5 mr-2 text-primary" />
                                {{ article.author }}
                            </div>
                            <div class="flex items-center">
                                <EyeIcon class="w-5 h-5 mr-2 text-primary" />
                                {{ article.views }}
                            </div>
                        </div>
                    </div>

                    <!-- Featured Image -->
                    <div class="relative w-full h-96 md:h-[500px] overflow-hidden">
                        <img :src="article.image" :alt="article.title" @error="handleImageError"
                            class="w-full h-full object-cover" />
                    </div>

                    <!-- Article Body -->
                    <div class="p-8 md:p-12">
                        <div class="prose prose-lg max-w-none" v-html="article.content"></div>
                    </div>

                    <!-- Share Buttons -->
                    <div class="px-8 md:px-12 pb-8 border-b border-neutral-200">
                        <div class="flex items-center gap-3">
                            <button @click="shareArticle('facebook')"
                                class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors cursor-pointer">
                                <ShareIcon class="w-4 h-4" />
                                <span class="text-sm">Berita</span>
                            </button>
                            <button @click="shareArticle('twitter')"
                                class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm cursor-pointer">
                                2025
                            </button>
                            <button @click="shareArticle('whatsapp')"
                                class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors text-sm cursor-pointer">
                                Pembelajaran
                            </button>
                        </div>
                    </div>

                    <!-- Comment Section -->
                    <div class="p-8 md:p-12">
                        <h2 class="text-2xl font-bold text-neutral-900 mb-8">Tinggalkan Komentar</h2>

                        <!-- Comment Form -->
                        <form @submit.prevent="submitComment" class="mb-12">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="block text-sm font-semibold text-neutral-700 mb-2">
                                        Nama*
                                    </label>
                                    <input v-model="commentForm.name" type="text" placeholder="Nama Anda" required
                                        class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                                </div>
                                <div>
                                    <label class="block text-sm font-semibold text-neutral-700 mb-2">
                                        Email*
                                    </label>
                                    <input v-model="commentForm.email" type="email" placeholder="Email Anda" required
                                        class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                                </div>
                            </div>
                            <div class="mb-6">
                                <label class="block text-sm font-semibold text-neutral-700 mb-2">
                                    Komentar*
                                </label>
                                <textarea v-model="commentForm.comment" placeholder="Tulis komentar Anda di sini..."
                                    required rows="6"
                                    class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"></textarea>
                            </div>
                            <button type="submit"
                                class="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors cursor-pointer">
                                Kirim Komentar
                            </button>
                        </form>

                        <!-- Comments List -->
                        <div>
                            <div class="flex items-center gap-2 mb-6">
                                <ChatBubbleLeftIcon class="w-6 h-6 text-primary" />
                                <h3 class="text-xl font-bold text-neutral-900">
                                    Komentar ({{ comments.length }})
                                </h3>
                            </div>

                            <div class="space-y-6">
                                <div v-for="comment in comments" :key="comment.id" class="flex gap-4">
                                    <!-- Avatar -->
                                    <div class="shrink-0">
                                        <div
                                            class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                                            {{ comment.avatar }}
                                        </div>
                                    </div>

                                    <!-- Comment Content -->
                                    <div class="flex-grow">
                                        <div class="bg-neutral-50 rounded-xl p-4">
                                            <div class="flex items-center gap-3 mb-2">
                                                <h4 class="font-bold text-neutral-900">{{ comment.name }}</h4>
                                                <span class="text-sm text-neutral-500">{{ comment.date }}</span>
                                            </div>
                                            <p class="text-neutral-700">{{ comment.comment }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- Related News -->
                <div class="mt-12">
                    <div class="flex items-center gap-2 mb-6">
                        <div class="h-1 w-12 bg-primary rounded"></div>
                        <h2 class="text-2xl font-bold text-neutral-900">Berita Terkait</h2>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <router-link v-for="news in relatedNews" :key="news.id" :to="`/berita/${news.slug}`"
                            class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer">
                            <!-- Image -->
                            <div class="relative overflow-hidden h-48">
                                <img :src="news.image" :alt="news.title" @error="handleImageError"
                                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                            </div>

                            <!-- Content -->
                            <div class="p-6">
                                <div class="text-sm font-semibold text-primary mb-2">
                                    {{ news.date }}
                                </div>
                                <h3
                                    class="text-lg font-bold text-neutral-900 line-clamp-2 group-hover:text-primary transition-colors">
                                    {{ news.title }}
                                </h3>
                            </div>
                        </router-link>
                    </div>
                </div>

            </div>
        </article>
    </div>
</template>

<style scoped>
/* Prose styling for article content */
.prose {
    color: #374151;
    line-height: 1.75;
}

.prose p {
    margin-bottom: 1.25em;
}

.prose strong {
    color: #0d5f5f;
    font-weight: 600;
}

.prose em {
    font-style: italic;
    color: #6b7280;
}

.prose h2 {
    font-size: 1.5em;
    font-weight: 700;
    margin-top: 2em;
    margin-bottom: 1em;
    color: #111827;
}

.prose h3 {
    font-size: 1.25em;
    font-weight: 600;
    margin-top: 1.5em;
    margin-bottom: 0.75em;
    color: #111827;
}
</style>
