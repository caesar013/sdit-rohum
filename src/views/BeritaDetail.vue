<script setup>
import { ref, onMounted } from 'vue'
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
import { getNewsBySlug, getNews, getNewsComments, submitNewsComment } from '@/services/api'

const route = useRoute()
const router = useRouter()

// Article data
const article = ref(null)
const isLoading = ref(true)
const isSubmittingComment = ref(false)

// Comments - will be implemented later
const comments = ref([])

// Related news
const relatedNews = ref([])

// Comment form
const commentForm = ref({
    name: '',
    email: '',
    comment: ''
})

// Fetch article by slug
const fetchArticle = async () => {
    isLoading.value = true
    try {
        const response = await getNewsBySlug(route.params.slug)

        if (response.success) {
            article.value = response.data
            // Fetch related news and comments
            await Promise.all([
                fetchRelatedNews(),
                fetchComments()
            ])
        } else {
            // Article not found, redirect to news page
            router.push('/berita')
        }
    } catch (error) {
        console.error('Error fetching article:', error)
        router.push('/berita')
    } finally {
        isLoading.value = false
    }
}

// Fetch related news
const fetchRelatedNews = async () => {
    try {
        const response = await getNews({
            limit: 3,
            status: 'published'
        })

        if (response.success) {
            // Filter out current article
            relatedNews.value = response.data.filter(news => news.id !== article.value.id)
        }
    } catch (error) {
        console.error('Error fetching related news:', error)
    }
}

// Fetch comments for the article
const fetchComments = async () => {
    if (!article.value?.id) return

    try {
        const response = await getNewsComments(article.value.id)

        if (response.success && response.data) {
            comments.value = response.data.map(comment => ({
                id: comment.id,
                name: comment.name,
                email: comment.email,
                comment: comment.comment,
                date: formatDate(comment.created_at),
                avatar: comment.name.charAt(0).toUpperCase()
            }))
        }
    } catch (error) {
        console.error('Error fetching comments:', error)
        // If API not implemented yet, keep empty array
        comments.value = []
    }
}

// Functions
const goBack = () => {
    router.push('/berita')
}

const goToNewsDetail = (slug) => {
    router.push(`/berita/${slug}`)
    // Scroll to top and refetch
    window.scrollTo({ top: 0, behavior: 'smooth' })
    fetchArticle()
}

const submitComment = async () => {
    if (!article.value?.id) return

    isSubmittingComment.value = true
    try {
        const response = await submitNewsComment(article.value.id, {
            name: commentForm.value.name,
            email: commentForm.value.email,
            comment: commentForm.value.comment
        })

        if (response.success) {
            alert('Komentar berhasil dikirim! Menunggu persetujuan admin.')
            // Reset form
            commentForm.value = {
                name: '',
                email: '',
                comment: ''
            }
            // Refresh comments
            await fetchComments()
        }
    } catch (error) {
        console.error('Error submitting comment:', error)
        alert('Gagal mengirim komentar. Fitur komentar belum tersedia atau terjadi kesalahan.')
    } finally {
        isSubmittingComment.value = false
    }
}

const shareArticle = (platform) => {
    const url = window.location.href
    const text = article.value.title

    let shareUrl = ''
    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
            break
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
            break
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
            break
    }

    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400')
    }
}

const handleImageError = (event) => {
    event.target.src = 'https://via.placeholder.com/1200x600/0d5f5f/ffffff?text=Berita+Sekolah'
}

const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    return date.toLocaleDateString('id-ID', options)
}

// Fetch article on mount
onMounted(() => {
    fetchArticle()
})
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
                    <span class="text-white line-clamp-1">{{ article?.title || 'Loading...' }}</span>
                </nav>
            </div>
        </section>

        <!-- Loading State -->
        <div v-if="isLoading" class="py-12 px-4 -mt-4 relative z-10">
            <div class="max-w-5xl mx-auto">
                <div class="bg-white rounded-3xl shadow-2xl p-12">
                    <div class="flex flex-col items-center justify-center">
                        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
                        <p class="text-neutral-600">Memuat artikel...</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Article Content -->
        <article v-else-if="article" class="py-12 px-4 -mt-4 relative z-10">
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
                    <div class="relative w-full h-96 md:h-125 overflow-hidden">
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
                            <button type="submit" :disabled="isSubmittingComment"
                                class="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                {{ isSubmittingComment ? 'Mengirim...' : 'Kirim Komentar' }}
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
                                    <div class="grow">
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
