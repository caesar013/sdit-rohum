<script setup>
const stats = [
    {
        value: '63+',
        label: 'Siswa Aktif',
        color: 'from-teal-500 to-teal-600'
    },
    {
        value: '11',
        label: 'Guru dan Tendik',
        color: 'from-blue-500 to-blue-600'
    },
    {
        value: '55',
        label: 'Alumni',
        color: 'from-purple-500 to-purple-600'
    },
    {
        value: 'A',
        label: 'Akreditasi',
        color: 'from-green-500 to-green-600'
    }
]
</script>

<template>
    <section class="py-16 px-4 -mt-20 relative z-10">
        <div class="max-w-7xl mx-auto">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div v-for="stat in stats" :key="stat.label"
                    :class="`bg-gradient-to-br ${stat.color} rounded-2xl p-8 text-center text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`">
                    <div class="text-5xl font-bold mb-3">{{ stat.value }}</div>
                    <div class="text-lg font-medium opacity-90">{{ stat.label }}</div>
                    <div class="mt-4 w-full h-1 bg-white/30 rounded-full">
                        <div class="h-full bg-white/60 rounded-full" style="width: 85%"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
