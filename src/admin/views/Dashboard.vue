<script setup>
import { ref, onMounted } from 'vue'
import { useSchoolProfile } from '@/services/schoolProfile'

const { schoolProfile } = useSchoolProfile()

const stats = ref([
    { title: 'Total News', value: '0', icon: '📰', color: 'bg-gradient-to-br from-blue-400 to-blue-600' },
    { title: 'Total Teachers', value: '0', icon: '👨‍🏫', color: 'bg-gradient-to-br from-green-400 to-green-600' },
    { title: 'Total Students', value: '0', icon: '👨‍🎓', color: 'bg-gradient-to-br from-orange-400 to-orange-600' },
    { title: 'Contact Messages', value: '0', icon: '✉️', color: 'bg-gradient-to-br from-purple-400 to-purple-600' },
])

onMounted(() => {
    // TODO: Fetch actual stats from API
})
</script>

<template>
    <div>
        <!-- Page Header -->
        <div class="flex flex-wrap -mx-3 mb-6">
            <div class="w-full px-3">
                <h1 class="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
                <p class="text-gray-600">Welcome to {{ schoolProfile.school_name }} Admin Panel</p>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="flex flex-wrap -mx-3">
            <div v-for="(stat, index) in stats" :key="index"
                class="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
                <div class="relative flex flex-col min-w-0 wrap-break-words bg-white shadow-xl rounded-2xl bg-clip-border">
                    <div class="flex-auto p-4">
                        <div class="flex flex-row -mx-3">
                            <div class="flex-none w-2/3 max-w-full px-3">
                                <div>
                                    <p
                                        class="mb-0 font-sans text-sm font-semibold leading-normal uppercase text-gray-600">
                                        {{ stat.title }}</p>
                                    <h5 class="mb-2 font-bold text-3xl text-gray-800">{{ stat.value }}</h5>
                                </div>
                            </div>
                            <div class="px-3 text-right basis-1/3">
                                <div :class="stat.color" class="inline-block w-12 h-12 text-center rounded-circle">
                                    <span class="text-2xl leading-none text-white">{{ stat.icon }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="flex flex-wrap -mx-3 mt-6">
            <div class="w-full px-3">
                <div class="relative flex flex-col min-w-0 wrap-break-words bg-white shadow-xl rounded-2xl bg-clip-border">
                    <div class="border-black/12.5 rounded-t-2xl border-b-0 border-solid p-6">
                        <h6 class="text-xl font-bold text-gray-800">Quick Actions</h6>
                    </div>
                    <div class="flex-auto p-6">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <router-link to="/admin/news/create"
                                class="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center">
                                <span class="text-3xl mb-2 block">📝</span>
                                <p class="font-semibold text-gray-800">Create News</p>
                            </router-link>
                            <router-link to="/admin/teachers"
                                class="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-center">
                                <span class="text-3xl mb-2 block">👨‍🏫</span>
                                <p class="font-semibold text-gray-800">Manage Teachers</p>
                            </router-link>
                            <router-link to="/admin/students"
                                class="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-center">
                                <span class="text-3xl mb-2 block">👨‍🎓</span>
                                <p class="font-semibold text-gray-800">Manage Students</p>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
