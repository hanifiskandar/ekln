<template>
    <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div class="bg-white rounded w-full max-w-7xl relative mt-4">
            <div class="bg-indigo-500 text-white pl-10 pt-6 h-20 flex justify-between">
                <div class="flex items-start">
                    <img v-if="application.image" :src="application.image" alt="Student Image"
                        class="h-20 w-20 object-cover rounded-full border border-gray-200 mr-4" />
                    <div class="flex flex-col mt-[-10px] max-h-2">
                        <h2 class="text-2xl font-semibold">{{ application.nama }}</h2>
                        <p class="text-md">{{ application.nokp }}</p>
                        <div class="flex items-center text-gray-600 mt-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span class="text-xl mx-2">{{ application.email }}</span>
                        </div>
                    </div>
                </div>

                <!-- Close Button (X) -->
                <button @click="closeModal" class="absolute top-4 right-4 text-white bg-transparent hover:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div class="modal-body pb-10 pl-10 pt-10">
                <Layout :application="application" :getFilename="getFilename" @updateModalApplication="handleUpdateApplication" />
            </div>
        </div>
    </div>
</template>

<script setup>
import Layout from '@/components/tab/Layout.vue';

const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true,
    },
    application: {
        type: Object,
        required: true,
    },
    formatDate: {
        type: Function,
        required: true,
    },
    getFilename: {
        type: Function,
        required: true,
    },
});
const emit = defineEmits(['close','updateApplication']);

const handleUpdateApplication = (id) => {
    emit('updateApplication', id);
};

const closeModal = () => {
    emit('close');
};

</script>

<style scoped>
.modal-body {
    max-height: 80vh;
    overflow-y: hidden;
}
</style>
