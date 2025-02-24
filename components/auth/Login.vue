<template>
    <div class="relative min-h-screen bg-gray-100 ">
        <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-lg absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h2 class="text-2xl font-bold mb-6 text-center">Log Masuk</h2>
            <form @submit.prevent="login">
                <div class="mb-4">
                    <input 
                        ref="usernameInput"
                        v-model="formData.username" 
                        @blur="markFieldTouched('username')" 
                        placeholder="Masukkan ID Pengguna"
                        :class="[
                            'mt-1 block w-full p-3 border border-gray-300 placeholder:text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500',
                            shouldShowError('username') ? 'border-red-500' : 'border-gray-300',
                        ]" />
                    <p v-if="shouldShowError('username')" class="text-red-500 text-sm">
                        {{ getErrorMessage('username') }}
                    </p>
                </div>
                <div class="mb-4">
                    <input 
                        id="password" 
                        v-model="formData.password" 
                        type="password" 
                        placeholder="Masukkan katalaluan"
                        @blur="markFieldTouched('password')" 
                        :class="[
                            'mt-1 block w-full p-3 border border-gray-300 placeholder:text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500',
                            shouldShowError('password') ? 'border-red-500' : 'border-gray-300',
                        ]" />
                    <p v-if="shouldShowError('password')" class="text-red-500 text-sm">
                        {{ getErrorMessage('password') }}
                    </p>
                </div>
                <button type="submit"
                    class="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition duration-200">
                    Masuk
                </button>
            </form>
            <FormLoading :isLoading="isLoading" />
            <p v-if="authErrorMessage" class="mt-4 text-center text-red-600 text-sm">
                {{ authErrorMessage }}
            </p>
            <p class="mt-4 text-center text-sm text-gray-600">
                Lupa katalaluan? <a href="/register" class="text-blue-600 hover:underline">Saya Pelupa</a>
            </p>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import { capitalizeFirstLetter } from '@/utils/formUtils.js';
import { useUserStore } from '@/stores/userStore.js';

const user = useUserStore();
const isLoading = ref(false);
const authErrorMessage = ref('');

const formData = reactive({
    username: '',
    password: '',
});

const errors = reactive({
    username: 'ID Pengguna perlu dilengkapkan.',
    password: 'Katalaluan perlu dilengkapkan.',
});

const touchedFields = reactive({
    username: false,
    password: false,
});

const requiredFields = {
    username: true,
    password: true,
};

const usernameInput = ref(null)

onMounted(() => {
    if (usernameInput.value) {
      usernameInput.value.focus();
    }

    window.scrollTo(0, 0);
})

function shouldShowError(field) {
    return touchedFields[field] && getErrorMessage(field) !== '';
}

function getErrorMessage(field) {
    const fieldValue = formData[field];

    if (requiredFields[field] && !fieldValue) {
        return errorMessage(field);
    }
    return '';
}

function validateForm() {
    let isValid = true;

    Object.keys(requiredFields).forEach(field => {
        const fieldValue = formData[field];

        if (!fieldValue && requiredFields[field]) {
            errors[field] = errorMessage(field);
            isValid = false;
        } else {
            errors[field] = ''; 
        }
    });

    return isValid;
}

function errorMessage(field) {
    return errors[field] || `${capitalizeFirstLetter(field)} perlu dilengkapkan.`;
}

function markFieldTouched(field) {
    touchedFields[field] = true;
}

function markAllFieldsTouched() {
    Object.keys(touchedFields).forEach(field => {
        touchedFields[field] = true; 
    });
}

async function login() {
    markAllFieldsTouched();
    if (validateForm()) {
        isLoading.value = true;
        try {
            const body = {
                    username: formData.username,
                    password: formData.password,
            };
            // console.log('Login body', body);
            const response = await $fetch('/api/auth/login', {
                method: 'POST', 
                body: body,
            });
            
            console.log('Login Response', response.data);
                
            if(response.success){
                const userProfile = response.data;
                if (userProfile && userProfile.email_rasmi && userProfile.id) {
                    // Set user profile
                    user.setUser(userProfile);

                    // Set cookie for access token
                    useCookie('tokenCookie', {
                        // httpOnly: true,
                        sameSite: 'Strict',
                        maxAge: 60 * 60 * 24, // Valid 24 jam
                        secure: false, // Dah guna HTTPS nanti letak true
                        path: '/',
                    }).value = userProfile.token;
                    // Set cookie for refresh token
                    useCookie('refreshTokenCookie', {
                        // httpOnly: true,
                        sameSite: 'Strict',
                        maxAge: 60 * 60 * 24 * 7, // Valid 7 hari
                        secure: false, // Dah guna HTTPS nanti letak true
                        path: '/',
                    }).value = userProfile.refresh_token;
                    useCookie('userProfileCookie', {
                        // httpOnly: true,
                        sameSite: 'Strict',
                        maxAge: 60 * 60 * 24, // Valid 24 jam
                        secure: false, // Dah guna HTTPS nanti letak true
                        path: '/',
                    }).value = userProfile;

                    navigateTo('/') 
                }
            } else {
                authErrorMessage.value = 'Log masuk tidak berjaya. Sila semak ID Pengguna dan katalaluan.'
            }
        } catch (error) {
            console.log('Error occurred:', error);
            authErrorMessage.value = 'Log masuk tidak berjaya. Sila semak ID Pengguna dan katalaluan.'
            errors.username = 'Login failed. Please check your credentials.';
        } finally {
            isLoading.value = false;
        }
    } else {
        console.log('Validation failed:', errors);
    }
}
</script>
