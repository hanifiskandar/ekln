<template>
    <div class="pt-10">
        <h2 class="text-xl font-bold mb-4">Lokasi, Perakuan & Penafian</h2>

        <div class="mb-5 flex flex-wrap">
            <div class="flex-1 mr-2">
                <input
                    v-model="formData.lokasi"
                    @blur="markFieldTouched('step4', 'lokasi')"
                    placeholder="Lokasi Pilihan"
                    :class="[
                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                        shouldShowError('step4', 'lokasi') ? 'border-red-500' : 'border-gray-300',
                    ]"
                    required
                />
                <p v-if="shouldShowError('step4', 'lokasi')" class="text-red-400 text-sm mt-1">
                    {{ getErrorMessage('step4', 'lokasi') }}
                </p>
            </div>
        </div>

        <div class="mb-5 flex flex-wrap">
            <div class="flex-1 mr-2">
                <input
                    type="date"
                    v-model="formData.tkh_mula"
                    @blur="markFieldTouched('step4', 'tkh_mula')"
                    :class="[
                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                        shouldShowError('step4', 'tkh_mula') ? 'border-red-500' : 'border-gray-300',
                    ]"
                    required
                />
                <p v-if="shouldShowError('step4', 'tkh_mula')" class="text-red-400 text-sm mt-1">
                    {{ getErrorMessage('step4', 'tkh_mula') }}
                </p>
            </div>
        </div>

        <div class="mb-5 flex flex-wrap">
            <div class="flex-1 mr-2">
                <input
                    type="date"
                    v-model="formData.tkh_tamat"
                    @blur="markFieldTouched('step4', 'tkh_tamat')"
                    :class="[
                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                        shouldShowError('step4', 'tkh_tamat') ? 'border-red-500' : 'border-gray-300',
                    ]"
                    required
                />
                <p v-if="shouldShowError('step4', 'tkh_tamat')" class="text-red-400 text-sm mt-1">
                    {{ getErrorMessage('step4', 'tkh_tamat') }}
                </p>
            </div>
        </div>

        <div class="mb-5 flex flex-wrap">
            <div class="flex-1 mr-2">
                <textarea
                    v-model="formData.penafian"
                    @blur="markFieldTouched('step4', 'penafian')"
                    placeholder="Penafian"
                    :class="[
                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                        shouldShowError('step4', 'penafian') ? 'border-red-500' : 'border-gray-300',
                    ]"
                    required
                ></textarea>
                <p v-if="shouldShowError('step4', 'penafian')" class="text-red-400 text-sm mt-1">
                    {{ getErrorMessage('step4', 'penafian') }}
                </p>
            </div>
        </div>

        <button type="button" @click="$emit('previous')" class="btn mt-2 mr-2 bg-gray-500 text-white px-4 py-2 rounded-md">Sebelum</button>
        <button type="button" @click="$emit('submit')" class="btn mt-2 bg-blue-500 text-white px-4 py-2 rounded-md">Hantar</button>
    </div>
</template>


<script setup>

const props = defineProps({
    formData: {
        type: Object,
        required: true,
    },
    errors: {
        type: Object,
        required: true,
    },
    getErrorMessage: {
        type: Function,
        required: true,
    },
    shouldShowError: {
        type: Function,
        required: true,
    },
    markFieldTouched: {
        type: Function,
        required: true,
    },
});

const emit = defineEmits();
</script>

<style scoped>
.input {
    @apply w-full border border-gray-300 p-2 rounded mb-2;
}
</style>
