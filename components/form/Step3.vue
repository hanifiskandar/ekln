<template>
    <div class="pt-10">
        <h2 class="text-xl font-bold mb-4">Penyelaras</h2>

        <div class="mb-5 flex flex-wrap">
            <div class="flex-1 mr-2">
                <input
                    v-model="formData.nama_koordinator"
                    @blur="markFieldTouched('step3', 'nama_koordinator')"
                    placeholder="Nama"
                    :class="[
                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                        shouldShowError('step3', 'nama_koordinator') ? 'border-red-500' : 'border-gray-300',
                    ]"
                    required
                />
                <p v-if="shouldShowError('step3', 'nama_koordinator')" class="text-red-400 text-sm mt-1">
                    {{ getErrorMessage('step3', 'nama_koordinator') }}
                </p>
            </div>
        </div>

        <div class="mb-5 flex flex-wrap">
            <div class="flex-1 mr-2">
                <input
                    v-model="formData.jawatan_koordinator"
                    @blur="markFieldTouched('step3', 'jawatan_koordinator')"
                    placeholder="Jawatan"
                    :class="[
                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                        shouldShowError('step3', 'jawatan_koordinator') ? 'border-red-500' : 'border-gray-300',
                    ]"
                    required
                />
                <p v-if="shouldShowError('step3', 'jawatan_koordinator')" class="text-red-400 text-sm mt-1">
                    {{ getErrorMessage('step3', 'jawatan_koordinator') }}
                </p>
            </div>
        </div>

        <div class="mb-5 flex flex-wrap">
            <div class="flex-1 mr-2">
                <input
                    type="email"
                    v-model="formData.email_koordinator"
                    @blur="markFieldTouched('step3', 'email_koordinator')"
                    placeholder="Email"
                    :class="[
                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                        shouldShowError('step3', 'email_koordinator') ? 'border-red-500' : 'border-gray-300',
                    ]"
                    required
                />
                <p v-if="shouldShowError('step3', 'email_koordinator')" class="text-red-400 text-sm mt-1">
                    {{ getErrorMessage('step3', 'email_koordinator') }}
                </p>
            </div>
        </div>

        <div class="mb-5 flex flex-wrap">
            <div class="flex-1 mr-2">
                <input
                    v-model="formData.tel_koordinator"
                    @blur="markFieldTouched('step3', 'tel_koordinator')"
                    placeholder="No. Telefon"
                    :class="[
                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                        shouldShowError('step3', 'tel_koordinator') ? 'border-red-500' : 'border-gray-300',
                    ]"
                    required
                />
                <p v-if="shouldShowError('step3', 'tel_koordinator')" class="text-red-400 text-sm mt-1">
                    {{ getErrorMessage('step3', 'tel_koordinator') }}
                </p>
            </div>
        </div>

        <button type="button" @click="$emit('previous')" class="btn mt-2 mr-2 bg-gray-500 text-white px-4 py-2 rounded-md">Sebelum</button>
        <button type="button" @click="$emit('next')" class="btn mt-2 bg-indigo-500 text-white px-4 py-2 rounded-md">Seterusnya</button>

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
