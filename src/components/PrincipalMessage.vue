<script setup>
import { ref, onMounted } from 'vue'
import { getSchoolProfileByKey } from '@/services/api'

const principalName = ref('Sri Mardiyati, S.Pd.')
const principalMessage = ref('')
const principalPhoto = ref('')

// Fetch principal message from API
const fetchPrincipalMessage = async () => {
    try {
        // Fetch principal name
        const nameResponse = await getSchoolProfileByKey('principal_name')
        if (nameResponse.success && nameResponse.data) {
            principalName.value = nameResponse.data.value
        }

        // Fetch principal message
        const messageResponse = await getSchoolProfileByKey('principal_message')
        if (messageResponse.success && messageResponse.data) {
            principalMessage.value = messageResponse.data.value
        }

        // Fetch principal photo if available
        const photoResponse = await getSchoolProfileByKey('principal_photo')
        if (photoResponse.success && photoResponse.data) {
            principalPhoto.value = photoResponse.data.value
        }
    } catch (error) {
        console.error('Error fetching principal message:', error)
        // Use default message if API fails
        principalMessage.value = `Di masa sekarang penyampaian informasi tidak terbatas hanya pada surat, namun juga media sosial juga sangat berpengaruh, untuk itu SD IT Rohmatul Ummah telah merilis website resmi SD IT Rohmatul Ummah Kapanewon Pengasih. Dengan adanya website ini semoga informasi-informasi dapat dengan mudah diakses. Kegiatan-kegiatan yang dilaksanakan di SD IT Rohmatul Ummah juga dapat diketahui oleh publik yang lebih luas lagi.`
    }
}

onMounted(() => {
    fetchPrincipalMessage()
})
</script>

<template>
    <section class="py-20 px-4 bg-light-gray">
        <div class="max-w-6xl mx-auto">
            <!-- Section Header -->
            <div class="text-center mb-12">
                <h2 class="text-4xl font-bold text-primary mb-2">
                    Sambutan Kepala Sekolah
                </h2>
                <div class="w-20 h-1 bg-secondary mx-auto"></div>
            </div>

            <!-- Message Card -->
            <div class="bg-white rounded-3xl shadow-lg border-2 border-primary/20 p-8 md:p-12 relative">
                <!-- Principal Photo -->
                <div class="flex justify-center -mt-24 mb-8">
                    <div
                        class="w-40 h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-linear-to-br from-primary to-primary-light">
                        <img :src="principalPhoto || ''" alt="Kepala Sekolah" class="w-full h-full object-cover"
                            @error="$event.target.src = 'https://ui-avatars.com/api/?name=Kepala+Sekolah&size=400&background=0d5f5f&color=fff&bold=true'" />
                    </div>
                </div>

                <!-- Message Content -->
                <div class="text-center md:text-left space-y-4">
                    <p class="text-lg text-neutral-700 leading-relaxed">
                        <strong>Assalamu'alaikum Wr. Wb.</strong>
                    </p>
                    <p class="text-neutral-700 leading-relaxed whitespace-pre-line">
                        {{ principalMessage || 'Pesan kepala sekolah akan segera hadir.' }}
                    </p>
                    <p class="text-lg text-neutral-700 leading-relaxed">
                        <strong>Wassalamu'alaikum Wr. Wb.</strong>
                    </p>
                </div>

                <!-- Signature -->
                <div class="mt-8 pt-8 border-t border-neutral-200">
                    <div class="text-center md:text-right">
                        <p class="text-xl font-bold text-neutral-900">{{ principalName }}</p>
                        <p class="text-neutral-600">Kepala SD IT Rohmatul Ummah</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
