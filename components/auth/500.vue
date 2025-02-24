<template>
    <div class="flex flex-col items-center justify-center mt-4 text-center">
        <img src="~/assets/img/error.png" alt="500 Error" class="w-full max-w-2xl" />
        <p class="mt-2 text-xl">Internal Server Error!</p>
        <p class="mt-2 text-gray-600">You don't have permission to access this page.</p>
        <nuxt-link to="/" class="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md">
            Laman Utama
        </nuxt-link>
    </div>
</template>

<script setup>

</script>

<style scoped>

</style>