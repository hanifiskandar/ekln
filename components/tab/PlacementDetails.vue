<template>
    <div>
        <form @submit.prevent="saveChanges">
            <div class="mt-1 border-t border-gray-100">
                <dl class="divide-y divide-gray-100">
                    <!-- Status -->
                    <div class="bg-gray-50 px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                        <dt class="text-sm font-medium leading-6 text-gray-900">                                
                            <span :class="{
                                    'bg-gray-600 text-white': application.status == STATUS.New, 
                                    'bg-blue-600 text-white': application.status == STATUS.ScreeningApproved, 
                                    'bg-blue-800 text-white': application.status == STATUS.Interview, 
                                    'bg-yellow-600 text-white': application.status == STATUS.InterviewAccepted, 
                                    'bg-green-600 text-white': application.status == STATUS.InterviewRejected,
                                    'bg-yellow-500 text-white': application.status == STATUS.Offer,
                                    'bg-green-500 text-white': application.status == STATUS.OfferAccepted,
                                    'bg-red-500 text-white': application.status == STATUS.OfferRejected,
                                    'bg-blue-400 text-white': application.status == STATUS.Present,
                                    'bg-red-400 text-white': application.status == STATUS.Absent,
                                    'bg-red-600 text-white': application.status == STATUS.ApplicationRejected,
                                }" class="px-2 py-1 mb-1 rounded-md font-semibold">
                                Status: {{ getStatusLabel(application.status) }}
                            </span>
                        </dt>
                    </div>

                    <!-- Lokasi Pilihan -->
                    <div class="bg-gray-50 px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                        <dt class="text-sm font-medium leading-6 text-gray-900">Lokasi Pilihan</dt>
                        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <template v-if="canEdit">
                                <input v-model="application.lokasi"
                                    @blur="markFieldTouched('step4', 'lokasi')"
                                    :class="[
                                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                                        shouldShowError('step4', 'lokasi') ? 'border-red-500' : 'border-gray-300',
                                    ]"
                                    placeholder="Lokasi Pilihan"
                                />
                                <p v-if="shouldShowError('step4', 'lokasi')" class="text-red-500 text-sm">
                                    {{ getErrorMessage('step4', 'lokasi') }}
                                </p>
                            </template>
                            <template v-else>
                                {{ application.lokasi }}
                            </template>
                        </dd>
                    </div>

                    <!-- Tarikh Mula -->
                    <div class="bg-gray-50 px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                        <dt class="text-sm font-medium leading-6 text-gray-900">Tarikh Mula</dt>
                        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <template v-if="canEdit">
                                <input
                                    type="date"
                                    v-model="application.tkh_mula"
                                    @blur="markFieldTouched('step4', 'tkh_mula')"
                                    :class="[
                                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                                        shouldShowError('step4', 'tkh_mula') ? 'border-red-500' : 'border-gray-300',
                                    ]"
                                />
                                <p v-if="shouldShowError('step4', 'tkh_mula')" class="text-red-500 text-sm">
                                    {{ getErrorMessage('step4', 'tkh_mula') }}
                                </p>
                            </template>
                            <template v-else>
                                {{ application.tkh_mula }}
                            </template>
                        </dd>
                    </div>

                    <!-- Tarikh Akhir -->
                    <div class="bg-gray-50 px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                        <dt class="text-sm font-medium leading-6 text-gray-900">Tarikh Akhir</dt>
                        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <template v-if="canEdit">
                                <input
                                    type="date"
                                    v-model="application.tkh_tamat"
                                    @blur="markFieldTouched('step4', 'tkh_tamat')"
                                    :class="[
                                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                                        shouldShowError('step4', 'tkh_tamat') ? 'border-red-500' : 'border-gray-300',
                                    ]"
                                />
                                <p v-if="shouldShowError('step4', 'tkh_tamat')" class="text-red-500 text-sm">
                                    {{ getErrorMessage('step4', 'tkh_tamat') }}
                                </p>
                            </template>
                            <template v-else>
                                {{ application.tkh_tamat }}
                            </template>
                        </dd>
                    </div>

                    <!-- Penafian -->
                    <div class="bg-gray-50 px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                        <dt class="text-sm font-medium leading-6 text-gray-900">Penafian</dt>
                        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <template v-if="canEdit">
                                <textarea
                                    v-model="application.penafian"
                                    @blur="markFieldTouched('step4', 'penafian')"
                                    placeholder="Penafian"
                                    :class="[
                                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                                        shouldShowError('step4', 'penafian') ? 'border-red-500' : 'border-gray-300',
                                    ]"
                                ></textarea>
                                <p v-if="shouldShowError('step4', 'penafian')" class="text-red-500 text-sm">
                                    {{ getErrorMessage('step4', 'penafian') }}
                                </p>
                            </template>
                            <template v-else>
                                {{ application.penafian }}
                            </template>
                        </dd>
                    </div>
                    <div class="flex flex-row-reverse mt-4">
                        <button v-if="canEdit" type="submit" class="bg-green-600 text-white rounded-md px-4 py-2 mr-3">
                            Simpan
                        </button>
                        <button @click.prevent="toggleEdit" class="bg-indigo-600 text-white rounded-md px-4 py-2 mr-3">
                            {{ canEdit ? 'Batal' : 'Kemaskini' }}
                        </button>
                        <button v-if="!canEdit" type="button" @click="$emit('tabApproval')" class="bg-yellow-600 text-white rounded-md px-4 py-2 mr-3">
                            Tindakan
                        </button>
                    </div>
                </dl>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { PaperClipIcon } from '@heroicons/vue/20/solid';
import { STATUS } from '@/constants/status';

const props = defineProps({
    application: {
        type: Object,
        required: true,
    },
    getFilename: {
        type: Function,
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
    validForm: {
        type: Boolean,
        required: true,
    },
    showUnsavedMessage: {
        type: Boolean,
        required: true,
    },
});

const emit = defineEmits(['updateApplication','updateUnsavedMessage','tabApproval']);

const backupApplication = ref({ ...props.application }); // Backup copy
const canEdit = ref(false);

watch(() => props.validForm, (newVal) => {
  if (newVal) {
    canEdit.value = false;
  }
});

const getStatusLabel = (status) => {
    const statusMap = {
        '1': 'Baru',
        '2': 'Lulus Tapisan',
        '3': 'Temuduga', 
        '4': 'Temuduga Diterima',
        '5': 'Temuduga Ditolak',
        '6': 'Tawaran',
        '7': 'Tawaran Diterima',
        '8': 'Tawaran Ditolak',
        '9': 'Hadir',
        '10': 'Tidak Hadir',
        '11': 'Permohonan Ditolak',
    };
  return statusMap[status] || 'Unknown';
}

const toggleEdit = () => {
    if (canEdit.value) {
        // If editing is being cancelled, restore original data
        Object.assign(props.application, backupApplication.value);
    } else {
        backupApplication.value = { ...props.application };
    }
    canEdit.value = !canEdit.value;
    emit('updateUnsavedMessage', props.showUnsavedMessage);
};

const saveChanges = () => {
    emit('updateUnsavedMessage', props.showUnsavedMessage);
    emit('updateApplication', { ...props.application });
};

</script>
