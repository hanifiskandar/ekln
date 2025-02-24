<template>
    <div class="flex flex-col items-center justify-center mt-5 text-center">
        <img src="~/assets/img/success.png" alt="Success" class="w-1/2 max-w-md" />
        <h1 class="text-4xl font-bold text-green-600">Berjaya!</h1>
        <p class="mt-4 text-xl">Your submission has been received.</p>
        <p class="mt-2 text-gray-600">Thank you for your application. We will get back to you shortly.</p>
        <nuxt-link to="/" class="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md">
            Laman Utama
        </nuxt-link>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'default' // Adjust layout if necessary
});
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>    