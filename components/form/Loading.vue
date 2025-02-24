<template>
    <div v-if="isLoading" class="mt-4 text-center">
        <img 
            src="@/assets/img/loading-pineapple.gif" 
            alt="Loading..." 
            class="mx-auto max-h-20" 
        />
    </div>
</template>

<script setup>
const props = defineProps({
    isLoading: {
        type: Boolean,
        required: true,
    },
});
</script>