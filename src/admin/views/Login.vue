<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/services/api'

const router = useRouter()

const loginForm = ref({
    email: '',
    password: ''
})

const rememberMe = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
    isLoading.value = true
    errorMessage.value = ''

    try {
        const response = await login(loginForm.value)

        // Debug: Log the entire response
        console.log('Login response:', response)

        if (response.success && response.data?.token) {
            // Store token in localStorage
            localStorage.setItem('token', response.data.token)
            console.log('Token stored:', localStorage.getItem('token'))

            // Store user info if provided
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user))
            }

            // Redirect to admin dashboard
            console.log('Redirecting to /admin/dashboard')
            router.push('/admin/dashboard')
        } else {
            errorMessage.value = response.message || 'Login failed. Please try again.'
        }
    } catch (error) {
        console.error('Login error:', error)
        errorMessage.value = error.message || 'An error occurred. Please try again.'
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <main class="min-h-screen">
        <div class="flex min-h-screen">
            <!-- Left Side - Login Form -->
            <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-100">
                <div class="w-full max-w-md">
                    <div class="bg-white shadow-2xl rounded-2xl p-8">
                        <div class="mb-6">
                            <h4 class="font-bold text-2xl text-gray-800">Admin Sign In</h4>
                            <p class="text-gray-600">Enter your credentials to access admin panel</p>
                        </div>

                        <!-- Error Message -->
                        <div v-if="errorMessage"
                            class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {{ errorMessage }}
                        </div>

                        <form @submit.prevent="handleLogin">
                            <div class="mb-4">
                                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input v-model="loginForm.email" id="email" type="email" placeholder="admin@example.com"
                                    required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>

                            <div class="mb-4">
                                <label for="password"
                                    class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                <input v-model="loginForm.password" id="password" type="password"
                                    placeholder="Enter password" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>

                            <div class="flex items-center mb-4">
                                <input v-model="rememberMe" id="rememberMe" type="checkbox"
                                    class="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500" />
                                <label for="rememberMe" class="ml-2 text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>

                            <button type="submit" :disabled="isLoading"
                                class="w-full py-3 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                {{ isLoading ? 'Signing in...' : 'Sign in' }}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Right Side - Gradient Background -->
            <div
                class="hidden lg:flex lg:w-1/2 items-center justify-center bg-linear-to-br from-blue-500 to-violet-500">
                <div class="text-center text-white px-12">
                    <h4 class="font-bold text-4xl mb-4">SD IT Rohmatul Ummah</h4>
                    <p class="text-xl">Admin Dashboard - Manage your school's digital presence with ease</p>
                </div>
            </div>
        </div>
    </main>
</template>
