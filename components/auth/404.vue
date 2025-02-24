<template>
    <div class="flex flex-col items-center justify-center mt-10 text-center">
        <img src="~/assets/img/error404.svg" alt="404 Error" class="w-1/2 max-w-md" />
        <p class="mt-4 text-xl">Oops! Page not found.</p>
        <p class="mt-2 text-gray-600">The page you are looking for might have been removed, had its name changed, or is
            temporarily unavailable.</p>
        <nuxt-link to="/" class="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md">
            Laman Utama
        </nuxt-link>
    </div>
</template>

<script setup>

</script>

<style scoped>

</style>