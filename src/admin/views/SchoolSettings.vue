<script setup>
import { ref, onMounted } from 'vue'
import {
    PencilIcon,
    CheckIcon,
    XMarkIcon,
    PlusIcon,
    TrashIcon,
    CogIcon
} from '@heroicons/vue/24/outline'
import { getSchoolProfile } from '@/services/api'
import { updateSchoolProfileBulk, createSchoolProfile, deleteSchoolProfile } from '@/services/adminApi'

// State
const settings = ref({})
const originalSettings = ref({})
const isLoading = ref(false)
const isSaving = ref(false)
const editingKey = ref(null)
const showAddModal = ref(false)

// New key-value form
const newKeyValue = ref({
    key: '',
    value: '',
    type: 'text'
})

// Data types
const dataTypes = [
    { value: 'text', label: 'Teks Pendek' },
    { value: 'longtext', label: 'Teks Panjang' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Telepon' },
    { value: 'url', label: 'URL' },
    { value: 'image', label: 'Gambar/Logo' }
]

// Fetch all school profile settings
const fetchSettings = async () => {
    isLoading.value = true
    try {
        const response = await getSchoolProfile()

        if (response.success) {
            // response.data is already an object with key-value pairs
            settings.value = response.data
            originalSettings.value = JSON.parse(JSON.stringify(response.data))
        }
    } catch (error) {
        console.error('Error fetching settings:', error)
        alert('Gagal memuat pengaturan profil sekolah')
    } finally {
        isLoading.value = false
    }
}

// Check if settings have changed
const hasChanges = () => {
    return JSON.stringify(settings.value) !== JSON.stringify(originalSettings.value)
}

// Save all settings
const saveSettings = async () => {
    if (!hasChanges()) {
        alert('Tidak ada perubahan untuk disimpan')
        return
    }

    if (!confirm('Simpan semua perubahan?')) {
        return
    }

    isSaving.value = true
    try {
        await updateSchoolProfileBulk(settings.value)

        originalSettings.value = JSON.parse(JSON.stringify(settings.value))
        alert('Pengaturan berhasil disimpan')
    } catch (error) {
        console.error('Error saving settings:', error)
        alert('Gagal menyimpan pengaturan')
    } finally {
        isSaving.value = false
    }
}

// Reset changes
const resetChanges = () => {
    if (!hasChanges()) {
        return
    }

    if (confirm('Batalkan semua perubahan?')) {
        settings.value = JSON.parse(JSON.stringify(originalSettings.value))
    }
}

// Add new key-value
const handleAddKeyValue = async () => {
    if (!newKeyValue.value.key.trim() || !newKeyValue.value.value.trim()) {
        alert('Nama kunci dan nilai harus diisi')
        return
    }

    // Check if key already exists
    if (settings.value[newKeyValue.value.key]) {
        alert('Kunci sudah ada')
        return
    }

    try {
        await createSchoolProfile({
            key: newKeyValue.value.key.trim(),
            value: newKeyValue.value.value.trim()
        })

        // Add to local state
        settings.value[newKeyValue.value.key.trim()] = newKeyValue.value.value.trim()
        originalSettings.value[newKeyValue.value.key.trim()] = newKeyValue.value.value.trim()

        // Reset form and close modal
        newKeyValue.value = { key: '', value: '', type: 'text' }
        showAddModal.value = false

        alert('Kunci berhasil ditambahkan')
    } catch (error) {
        console.error('Error adding key-value:', error)
        alert('Gagal menambahkan kunci')
    }
}

// Delete key
const handleDeleteKey = async (key) => {
    if (!confirm(`Hapus kunci "${key}"?`)) {
        return
    }

    try {
        await deleteSchoolProfile(key)

        // Remove from local state
        delete settings.value[key]
        delete originalSettings.value[key]

        alert('Kunci berhasil dihapus')
    } catch (error) {
        console.error('Error deleting key:', error)
        alert('Gagal menghapus kunci')
    }
}

// Format key for display
const formatKeyLabel = (key) => {
    return key
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

// Get input type based on key
const getInputType = (key) => {
    if (key.toLowerCase().includes('email')) return 'email'
    if (key.toLowerCase().includes('phone') || key.toLowerCase().includes('telp')) return 'tel'
    if (key.toLowerCase().includes('url') || key.toLowerCase().includes('website')) return 'url'
    return 'text'
}

// Check if value is long text
const isLongText = (value) => {
    return value && value.length > 100
}

// Check if value is an image URL
const isImageUrl = (key, value) => {
    if (!value) return false

    // Check if key suggests it's an image
    const imageKeywords = ['logo', 'image', 'img', 'photo', 'picture', 'banner', 'icon', 'avatar']
    const keyLower = key.toLowerCase()
    const hasImageKeyword = imageKeywords.some(keyword => keyLower.includes(keyword))

    // Check if value looks like an image URL
    const valueLower = value.toLowerCase()
    const hasImageExtension = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/i.test(valueLower)
    const hasImagePath = valueLower.includes('/images/') || valueLower.includes('/uploads/') || valueLower.includes('/logos/')

    return hasImageKeyword || hasImageExtension || hasImagePath
}

// Handle image file selection
const handleImageUpload = async (key, event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate image type
    if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar')
        return
    }

    // For now, show a base64 preview
    // In production, you should upload to server first
    const reader = new FileReader()
    reader.onload = (e) => {
        settings.value[key] = e.target.result
    }
    reader.readAsDataURL(file)

    // TODO: Upload to server and get URL
    // const formData = new FormData()
    // formData.append('image', file)
    // formData.append('key', key)
    // const response = await uploadSchoolProfileImage(formData)
    // settings.value[key] = response.data.url
}

onMounted(() => {
    fetchSettings()
})
</script>

<template>
    <div class="p-6">
        <!-- Header -->
        <div class="mb-6">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-800 mb-2">Pengaturan Profil Sekolah</h1>
                    <p class="text-gray-600">Kelola informasi dan konfigurasi profil sekolah</p>
                </div>
                <button @click="showAddModal = true"
                    class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
                    <PlusIcon class="w-5 h-5" />
                    Tambah Kunci
                </button>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="bg-white rounded-lg shadow-sm p-8 text-center">
            <p class="text-gray-500">Memuat pengaturan...</p>
        </div>

        <!-- Settings Form -->
        <div v-else class="bg-white rounded-lg shadow-sm">
            <!-- Action Bar -->
            <div v-if="hasChanges()" class="bg-yellow-50 border-b border-yellow-200 px-6 py-4">
                <div class="flex items-center justify-between">
                    <p class="text-sm text-yellow-800">
                        <strong>Ada perubahan yang belum disimpan!</strong>
                    </p>
                    <div class="flex gap-2">
                        <button @click="resetChanges"
                            class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                            Batalkan
                        </button>
                        <button @click="saveSettings" :disabled="isSaving"
                            class="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50">
                            {{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Settings List -->
            <div class="divide-y divide-gray-200">
                <div v-if="Object.keys(settings).length === 0" class="p-8 text-center text-gray-500">
                    Belum ada pengaturan. Klik "Tambah Kunci" untuk menambahkan pengaturan baru.
                </div>

                <div v-for="(value, key) in settings" :key="key" class="p-6 hover:bg-gray-50">
                    <div class="flex items-start gap-4">
                        <div class="flex-1">
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                {{ formatKeyLabel(key) }}
                            </label>
                            <p class="text-xs text-gray-500 mb-2">Kunci: {{ key }}</p>

                            <!-- Image preview and upload -->
                            <div v-if="isImageUrl(key, value)">
                                <div class="mb-3">
                                    <img v-if="value" :src="value" :alt="key"
                                        class="max-w-xs max-h-48 rounded-lg border border-gray-300 object-contain bg-gray-50"
                                        @error="(e) => e.target.style.display = 'none'" />
                                    <div v-else
                                        class="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <span class="text-gray-400 text-sm">No image</span>
                                    </div>
                                </div>
                                <div class="space-y-2">
                                    <input v-model="settings[key]" type="url" placeholder="URL gambar"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
                                    <div class="flex items-center gap-2">
                                        <label
                                            class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer text-center text-sm">
                                            <input type="file" accept="image/*" @change="handleImageUpload(key, $event)"
                                                class="hidden" />
                                            📁 Upload Gambar Baru
                                        </label>
                                    </div>
                                    <p class="text-xs text-yellow-600">⚠️ Upload gambar akan disimpan sebagai base64.
                                        Untuk produksi, gunakan server upload.</p>
                                </div>
                            </div>

                            <!-- Textarea for long text -->
                            <textarea v-else-if="isLongText(value)" v-model="settings[key]" rows="4"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                            </textarea>

                            <!-- Input for short text -->
                            <input v-else v-model="settings[key]" :type="getInputType(key)"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
                        </div>

                        <!-- Delete Button -->
                        <button @click="handleDeleteKey(key)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Hapus kunci">
                            <TrashIcon class="w-5 h-5" />
                        </button>
                    </div>

                    <!-- Change Indicator -->
                    <div v-if="settings[key] !== originalSettings[key]" class="mt-2">
                        <div class="flex items-center gap-2 text-sm">
                            <div class="flex items-center gap-1 text-gray-500">
                                <span class="font-medium">Sebelumnya:</span>
                                <span class="line-through">{{ originalSettings[key] }}</span>
                            </div>
                            <span class="text-gray-300">→</span>
                            <div class="flex items-center gap-1 text-green-600">
                                <span class="font-medium">Baru:</span>
                                <span>{{ settings[key] }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer Action Bar -->
            <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div class="flex items-center justify-between">
                    <p class="text-sm text-gray-600">
                        Total: {{ Object.keys(settings).length }} pengaturan
                    </p>
                    <div class="flex gap-2">
                        <button @click="resetChanges" :disabled="!hasChanges()"
                            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                            Batalkan
                        </button>
                        <button @click="saveSettings" :disabled="!hasChanges() || isSaving"
                            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed">
                            {{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Key Modal -->
        <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-lg max-w-md w-full">
                <!-- Modal Header -->
                <div class="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 class="text-xl font-bold text-gray-800">Tambah Kunci Baru</h2>
                    <button @click="showAddModal = false" class="text-gray-400 hover:text-gray-600">
                        <XMarkIcon class="w-6 h-6" />
                    </button>
                </div>

                <!-- Modal Body -->
                <div class="p-6 space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nama Kunci</label>
                        <input v-model="newKeyValue.key" type="text" placeholder="contoh: school_name, school_logo"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
                        <p class="text-xs text-gray-500 mt-1">Gunakan huruf kecil dan underscore (_). Tambahkan '_logo'
                            atau '_image' untuk gambar.</p>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Tipe Data</label>
                        <select v-model="newKeyValue.type"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                            <option v-for="type in dataTypes" :key="type.value" :value="type.value">
                                {{ type.label }}
                            </option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nilai</label>
                        <textarea v-if="newKeyValue.type === 'longtext'" v-model="newKeyValue.value" rows="4"
                            placeholder="Masukkan nilai"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                        </textarea>
                        <input v-else v-model="newKeyValue.value"
                            :type="newKeyValue.type === 'email' ? 'email' : newKeyValue.type === 'phone' ? 'tel' : newKeyValue.type === 'url' || newKeyValue.type === 'image' ? 'url' : 'text'"
                            :placeholder="newKeyValue.type === 'image' ? 'https://example.com/logo.png' : 'Masukkan nilai'"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
                        <p v-if="newKeyValue.type === 'image'" class="text-xs text-gray-500 mt-1">Masukkan URL gambar
                            atau upload nanti setelah dibuat</p>
                    </div>
                </div>

                <!-- Modal Footer -->
                <div class="flex justify-end gap-2 p-6 border-t border-gray-200">
                    <button @click="showAddModal = false"
                        class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Batal
                    </button>
                    <button @click="handleAddKeyValue"
                        class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
                        Tambah
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
