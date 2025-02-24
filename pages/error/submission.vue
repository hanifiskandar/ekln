<template>
    <div class="flex flex-col items-center justify-center mt-10 text-center">
        <img src="~/assets/img/error.png" alt="Error" class="w-1/2 max-w-md" />
        <h1 class="text-4xl font-bold text-red-600">Ralat!</h1>
        <p class="mt-4 text-xl">Your submission has not received.</p>
        <p>There was a problem with your submission. Please try again.</p>
        <nuxt-link to="/" class="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md">
            Laman Utama
        </nuxt-link>
    </div>
</template>

<script setup>

</script>

<style scoped>
.error-container {
    text-align: center;
    padding: 20px;
}
</style>
