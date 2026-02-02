<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { logout } from '@/services/api'
import {
    HomeIcon,
    NewspaperIcon,
    UserGroupIcon,
    AcademicCapIcon,
    BuildingLibraryIcon,
    TrophyIcon,
    PhotoIcon,
    VideoCameraIcon,
    EnvelopeIcon,
    ChatBubbleLeftRightIcon,
    CogIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const sidebarOpen = ref(false)

const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: HomeIcon },
    { name: 'News', path: '/admin/news', icon: NewspaperIcon },
    { name: 'Teachers', path: '/admin/teachers', icon: UserGroupIcon },
    { name: 'Students', path: '/admin/students', icon: AcademicCapIcon },
    { name: 'Alumni', path: '/admin/alumni', icon: AcademicCapIcon },
    { name: 'Facilities', path: '/admin/facilities', icon: BuildingLibraryIcon },
    { name: 'Achievements', path: '/admin/achievements', icon: TrophyIcon },
    { name: 'Photo Gallery', path: '/admin/gallery', icon: PhotoIcon },
    { name: 'Videos', path: '/admin/videos', icon: VideoCameraIcon },
    { name: 'Contact Messages', path: '/admin/contact', icon: EnvelopeIcon },
    { name: 'Comments', path: '/admin/comments', icon: ChatBubbleLeftRightIcon },
    { name: 'Settings', path: '/admin/settings', icon: CogIcon },
]

const isActive = (path) => {
    return route.path.startsWith(path)
}

const handleLogout = async () => {
    try {
        await logout()
    } catch (error) {
        console.error('Logout error:', error)
    } finally {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/admin/login')
    }
}
</script>

<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Background decoration -->
        <div class="absolute w-full bg-blue-500 min-h-75"></div>

        <!-- Sidebar -->
        <aside
            class="fixed inset-y-0 flex-wrap items-center justify-between block w-full p-0 my-4 overflow-y-auto antialiased transition-transform duration-200 bg-white border-0 shadow-xl max-w-64 ease-nav-brand z-990 xl:ml-6 rounded-2xl xl:left-0"
            :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'">
            <!-- Logo -->
            <div class="h-19 px-8 py-6">
                <router-link to="/admin/dashboard"
                    class="flex items-center m-0 text-sm whitespace-nowrap text-slate-700">
                    <span class="ml-1 font-semibold text-lg transition-all duration-200 ease-nav-brand">SD IT Rohmatul
                        Ummah</span>
                </router-link>
            </div>

            <hr class="h-px mt-0 bg-transparent bg-linear-to-r from-transparent via-black/40 to-transparent" />

            <!-- Menu Items -->
            <div class="items-center block w-auto max-h-screen overflow-auto h-sidenav grow basis-full">
                <ul class="flex flex-col pl-0 mb-0">
                    <li v-for="item in menuItems" :key="item.path" class="mt-0.5 w-full">
                        <router-link :to="item.path"
                            class="py-2.7 text-sm ease-nav-brand my-0 mx-2 flex items-center whitespace-nowrap px-4 transition-colors rounded-lg"
                            :class="isActive(item.path)
                                ? 'bg-blue-500/13 font-semibold text-slate-700'
                                : 'text-slate-700 hover:bg-gray-100'">
                            <div
                                class="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center">
                                <component :is="item.icon" class="w-5 h-5"
                                    :class="isActive(item.path) ? 'text-blue-500' : 'text-gray-500'" />
                            </div>
                            <span class="ml-1 duration-300 opacity-100 pointer-events-none ease">{{ item.name }}</span>
                        </router-link>
                    </li>

                    <!-- Logout -->
                    <li class="mt-0.5 w-full">
                        <button @click="handleLogout"
                            class="w-full py-2.7 text-sm ease-nav-brand my-0 mx-2 flex items-center whitespace-nowrap px-4 transition-colors rounded-lg text-slate-700 hover:bg-gray-100">
                            <div
                                class="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center">
                                <ArrowRightOnRectangleIcon class="w-5 h-5 text-gray-500" />
                            </div>
                            <span class="ml-1 duration-300 opacity-100 pointer-events-none ease">Logout</span>
                        </button>
                    </li>
                </ul>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="relative h-full max-h-screen transition-all duration-200 ease-in-out xl:ml-68 rounded-xl">
            <!-- Navbar -->
            <nav
                class="relative flex flex-wrap items-center justify-between px-0 py-2 mx-6 transition-all ease-in shadow-none duration-250 rounded-2xl lg:flex-nowrap lg:justify-start">
                <div class="flex items-center justify-between w-full px-4 py-1 mx-auto flex-wrap-inherit">
                    <!-- Breadcrumb -->
                    <nav>
                        <h6 class="mb-0 font-bold text-white capitalize">Admin Panel</h6>
                    </nav>

                    <!-- Mobile Menu Toggle -->
                    <button @click="sidebarOpen = !sidebarOpen" class="xl:hidden px-3 py-1 ml-2 text-white">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </nav>

            <!-- Page Content -->
            <div class="w-full px-6 py-6 mx-auto">
                <router-view />
            </div>
        </main>
    </div>
</template>
