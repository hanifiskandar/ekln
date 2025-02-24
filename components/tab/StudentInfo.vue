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

                    <!-- Alamat -->
                    <div class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                        <dt class="text-sm font-medium leading-6 text-gray-900">Alamat</dt>
                        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <template v-if="canEdit">
                                <input v-model="application.alamat"
                                    @blur="markFieldTouched('step1', 'alamat')"
                                    :class="[
                                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                                        shouldShowError('step1', 'alamat') ? 'border-red-500' : 'border-gray-300 mb-4',
                                    ]" 
                                    placeholder="Alamat 1" 
                                />
                                <p v-if="shouldShowError('step1', 'alamat')" class="text-red-500 text-sm mb-1">
                                    {{ getErrorMessage('step1', 'alamat') }}
                                </p>
                                <input v-model="application.alamat2"
                                    @blur="markFieldTouched('step1', 'alamat2')"
                                    :class="[
                                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                                        shouldShowError('step1', 'alamat2') ? 'border-red-500' : 'border-gray-300 mb-4',
                                    ]" 
                                    placeholder="Alamat 2"
                                />
                                <input v-model="application.alamat3"
                                    @blur="markFieldTouched('step1', 'alamat3')"
                                    :class="[
                                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                                        shouldShowError('step1', 'alamat3') ? 'border-red-500' : 'border-gray-300 mb-4',
                                    ]" 
                                    placeholder="Alamat 3"
                                />
                                <p v-if="shouldShowError('step1', 'alamat2')" class="text-red-500 text-sm mb-1">
                                    {{ getErrorMessage('step1', 'alamat2') }}
                                </p>
                                <input v-model="application.poskod"
                                    @blur="markFieldTouched('step1', 'poskod')"
                                    :class="[
                                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                                        shouldShowError('step1', 'poskod') ? 'border-red-500' : 'border-gray-300 mb-4',
                                    ]"
                                    placeholder="Poskod"
                                />
                                <p v-if="shouldShowError('step1', 'poskod')" class="text-red-500 text-sm mb-1">
                                    {{ getErrorMessage('step1', 'poskod') }}
                                </p>
                                <input v-model="application.bandar"
                                    @blur="markFieldTouched('step1', 'bandar')"
                                    :class="[
                                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                                        shouldShowError('step1', 'bandar') ? 'border-red-500' : 'border-gray-300 mb-4',
                                    ]" 
                                    placeholder="Bandar" 
                                />
                                <p v-if="shouldShowError('step1', 'bandar')" class="text-red-500 text-sm mb-1">
                                    {{ getErrorMessage('step1', 'bandar') }}
                                </p>
                                <select 
                                    v-model="application.negeri" 
                                    :class="[
                                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100 appearance-none',
                                        shouldShowError('step1', 'negeri') ? 'border-red-500' : 'border-gray-300',
                                    ]"
                                >
                                    <option disabled value="">Negeri</option>
                                    <option v-for="negeri in negeriList" :key="negeri.kod_negeri" :value="negeri.kod_negeri">{{
                                        negeri.negeri }}
                                    </option>
                                </select>
                                <p v-if="shouldShowError('step1', 'negeri')" class="text-red-500 text-sm mb-1">
                                    {{ getErrorMessage('step1', 'negeri') }}
                                </p>
                            </template>
                            <template v-else>
                                {{ application.alamat }} {{ application.alamat2 }} {{ application.alamat3 }} {{ application.poskod }} {{
                                    application.bandar }} {{ application.negeri }}
                            </template>
                        </dd>
                    </div>

                    <!-- No. Telefon -->
                    <div class="bg-gray-50 px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                        <dt class="text-sm font-medium leading-6 text-gray-900">No. Telefon</dt>
                        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <template v-if="canEdit">
                                <input v-model="application.telefon"
                                    @blur="markFieldTouched('step1', 'telefon')"
                                    :class="[
                                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                                        shouldShowError('step1', 'telefon') ? 'border-red-500' : 'border-gray-300',
                                    ]"
                                    placeholder="No. Telefon" 
                                />
                                <p v-if="shouldShowError('step1', 'telefon')" class="text-red-500 text-sm mb-1">
                                    {{ getErrorMessage('step1', 'telefon') }}
                                </p>
                            </template>
                            <template v-else>
                                {{ application.telefon }}
                            </template>
                        </dd>
                    </div>

                    <!-- Agama -->
                    <div class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                        <dt class="text-sm font-medium leading-6 text-gray-900">Agama</dt>
                        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <template v-if="canEdit">
                                <input 
                                    v-model="application.agama"
                                    @blur="markFieldTouched('step1', 'agama')"
                                    readonly
                                    :class="[
                                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100 bg-gray-200',
                                        shouldShowError('step1', 'agama') ? 'border-red-500' : 'border-gray-300',
                                    ]"
                                />
                            </template>
                            <template v-else>
                                {{ application.agama === 'Lain-lain' ? application.agama_lain : application.agama }}
                            </template>
                        </dd>
                    </div>

                    <!-- Bangsa -->
                    <div class="bg-gray-50 px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                        <dt class="text-sm font-medium leading-6 text-gray-900">Bangsa</dt>
                        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <template v-if="canEdit">
                                <input 
                                    v-model="application.bangsa"
                                    @blur="markFieldTouched('step1', 'bangsa')"
                                    readonly
                                    :class="[
                                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100 bg-gray-200',
                                        shouldShowError('step1', 'bangsa') ? 'border-red-500' : 'border-gray-300',
                                    ]"
                                />
                            </template>
                            <template v-else>
                                {{ application.bangsa === 'Lain-lain' ? application.bangsa_lain : application.bangsa }}
                            </template>
                        </dd>
                    </div>

                    <!-- Gambar -->
                    <div class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                        <dt class="text-sm font-medium leading-6 text-gray-900">Gambar</dt>
                        <dd class="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            <!-- Editable Section -->
                            <template v-if="canEdit">
                                <div :class="[
                                    'border rounded-lg bg-gray-100',
                                    shouldShowError('step1', 'image_file') ? 'border-2 border-red-500' : 'border-gray-300'
                                ]">
                                    <div
                                        class="toolbar flex justify-between items-center bg-transparent rounded-md p-2 text-dark border-b-2 border-gray-300">
                                        <h2 class="toolbar-title text-md font-medium text-gray-700 py-1 pl-2">Upload
                                            Gambar</h2>
                                        <input type="file" id="document1" ref="document1" accept=".png, .jpeg, .jpg"
                                            @change="handleFileUpload('image_file', $event)" class="hidden" />
                                        <button type="button" @click="$refs.document1.click()"
                                            class="upload-btn bg-transparent text-gray-700 font-medium text-dark">
                                            Upload
                                        </button>
                                    </div>

                                    <!-- Current File -->
                                    <template v-if="application.image">
                                        <ul role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200">
                                            <li class="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                                                <div class="flex w-0 flex-1 items-center">
                                                <PaperClipIcon class="h-5 w-5 flex-shrink-0 text-gray-400"
                                                    aria-hidden="true" />
                                                <div class="ml-4 flex min-w-0 flex-1 gap-2">
                                                    <a :href="application.image" target="_blank">
                                                        {{ getFilename(application.image) }}
                                                    </a>
                                                </div>
                                                </div>
                                                <button type="button" @click="removeExistingFile('image')" 
                                                    class="text-gray-500 hover:text-gray-700 pl-2">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </li>
                                        </ul>
                                    </template>

                                    <!-- Uploaded File List -->
                                    <ul role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200">
                                        <li v-for="(item, index) in documentsForm1Files" :key="index"
                                            class="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                                            <div class="flex w-0 flex-1 items-center">
                                                <PaperClipIcon class="h-5 w-5 flex-shrink-0 text-gray-400"
                                                    aria-hidden="true" />
                                                <div class="ml-4 flex min-w-0 flex-1 gap-2">
                                                    <span class="truncate font-medium">{{ item.file.name }}</span>
                                                    <span class="flex-shrink-0 text-gray-400">{{ (item.file.size / (1024
                                                        * 1024)).toFixed(1) }} MB</span>
                                                </div>
                                            </div>
                                            <button type="button" @click="removeUpload(index, 'image_file')"
                                                class="delete-btn text-gray-500 hover:text-gray-700 pl-2">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </li>
                                    </ul>

                                    <p v-if="shouldShowError('step1', 'image_file')" class="text-red-500 text-sm mb-4">
                                        {{ getErrorMessage('step1', 'image_file') }}
                                    </p>
                                </div>
                            </template>

                            <!-- Non-editable Section -->
                            <template v-else>
                                <ul role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200">
                                    <li class="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                                        <div class="flex w-0 flex-1 items-center">
                                            <PaperClipIcon class="h-5 w-5 flex-shrink-0 text-gray-400"
                                                aria-hidden="true" />
                                            <div class="ml-4 flex min-w-0 flex-1 gap-2">
                                                <span class="truncate font-medium">{{ getFilename(application.image)
                                                    }}</span>
                                                <span class="flex-shrink-0 text-gray-400">2.4 MB</span>
                                            </div>
                                        </div>
                                        <div class="ml-4 flex-shrink-0">
                                            <a :href="application.image" target="_blank"
                                                class="font-medium text-indigo-600 hover:text-indigo-500">
                                                Download
                                            </a>
                                        </div>
                                    </li>
                                </ul>
                            </template>
                        </dd>
                    </div>

                    <!-- Resume -->
                    <div class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                        <dt class="text-sm font-medium leading-6 text-gray-900">Resume</dt>
                        <dd class="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            <!-- Editable Section -->
                            <template v-if="canEdit">
                                <div :class="[
                                    'border rounded-lg bg-gray-100',
                                    shouldShowError('step1', 'resume_file') ? 'border-2 border-red-500' : 'border-gray-300'
                                ]">
                                    <div
                                        class="toolbar flex justify-between items-center bg-transparent rounded-md p-2 text-dark border-b-2 border-gray-300">
                                        <h2 class="toolbar-title text-md font-medium text-gray-700 py-1 pl-2">Upload
                                            Resume</h2>
                                        <input type="file" id="document2" ref="document2" accept=".pdf"
                                            @change="handleFileUpload('resume_file', $event)" class="hidden" />
                                        <button type="button" @click="$refs.document2.click()"
                                            class="upload-btn bg-transparent text-gray-700 font-medium text-dark">
                                            Upload
                                        </button>
                                    </div>

                                    <!-- Current File -->
                                    <template v-if="application.resume">
                                        <ul role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200">
                                            <li class="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                                                <div class="flex w-0 flex-1 items-center">
                                                <PaperClipIcon class="h-5 w-5 flex-shrink-0 text-gray-400"
                                                    aria-hidden="true" />
                                                <div class="ml-4 flex min-w-0 flex-1 gap-2">
                                                    <a :href="application.resume" target="_blank">
                                                        {{ getFilename(application.resume) }}
                                                    </a>
                                                </div>
                                                </div>
                                                <button type="button" @click="removeExistingFile('resume')" 
                                                    class="text-gray-500 hover:text-gray-700 pl-2">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </li>
                                        </ul>
                                    </template>

                                    <!-- Uploaded File List -->
                                    <ul role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200">
                                        <li v-for="(item, index) in documentsForm2Files" :key="index"
                                            class="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                                            <div class="flex w-0 flex-1 items-center">
                                                <PaperClipIcon class="h-5 w-5 flex-shrink-0 text-gray-400"
                                                    aria-hidden="true" />
                                                <div class="ml-4 flex min-w-0 flex-1 gap-2">
                                                    <span class="truncate font-medium">{{ item.file.name }}</span>
                                                    <span class="flex-shrink-0 text-gray-400">{{ (item.file.size / (1024
                                                        * 1024)).toFixed(1) }} MB</span>
                                                </div>
                                            </div>
                                            <button type="button" @click="removeUpload(index, 'resume_file')"
                                                class="delete-btn text-gray-500 hover:text-gray-700 pl-2">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </li>
                                    </ul>

                                    <p v-if="shouldShowError('step1', 'resume_file')" class="text-red-500 text-sm mb-4">
                                        {{ getErrorMessage('step1', 'resume_file') }}
                                    </p>
                                </div>
                            </template>

                            <!-- Non-editable Section -->
                            <template v-else>
                                <ul role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200">
                                    <li class="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                                        <div class="flex w-0 flex-1 items-center">
                                            <PaperClipIcon class="h-5 w-5 flex-shrink-0 text-gray-400"
                                                aria-hidden="true" />
                                            <div class="ml-4 flex min-w-0 flex-1 gap-2">
                                                <span class="truncate font-medium">{{ getFilename(application.resume)
                                                    }}</span>
                                                <span class="flex-shrink-0 text-gray-400">2.4 MB</span>
                                            </div>
                                        </div>
                                        <div class="ml-4 flex-shrink-0">
                                            <a :href="application.resume" target="_blank"
                                                class="font-medium text-indigo-600 hover:text-indigo-500">
                                                Download
                                            </a>
                                        </div>
                                    </li>
                                </ul>
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
import { useFetchStates } from '@/composables/useFetchStates';
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
const documentsForm1Files = ref([]);
const documentsForm2Files = ref([]);
const { negeriList, fetchState, error } = useFetchStates();

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

const handleFileUpload = (field, event) => {
    const file = event.target.files[0];

    const oldField = field.endsWith('_file') ? field.replace('_file', '') : field;

    if (!file) {
        props.application[field] = null;
        return;
    }

    props.application[field] = file;
    props.application[oldField] = null;

    const fileObject = { file };

    if (field === 'image_file') {
        documentsForm1Files.value.splice(0, documentsForm1Files.value.length, fileObject);

    } else {
        documentsForm2Files.value.splice(0, documentsForm2Files.value.length, fileObject);
    }

};

const removeUpload = (index, field) => {
    if (field === 'image_file') {
        documentsForm1Files.value.splice(index, 1);
    } else {
        documentsForm2Files.value.splice(index, 1);
    }
    props.application[field] = null;
}

const removeExistingFile = (field) => {
    props.application[field] = null
}

const toggleEdit = () => {
    if (canEdit.value) {
        // If editing is being cancelled, restore original data
        Object.assign(props.application, backupApplication.value);
    } else {
        // Save a copy of the original data before editing
        backupApplication.value = { ...props.application };
    }
    canEdit.value = !canEdit.value;
    emit('updateUnsavedMessage', props.showUnsavedMessage);
};

const saveChanges = () => {
    emit('updateUnsavedMessage', props.showUnsavedMessage);
    emit('updateApplication', { ...props.application });
};

onMounted(async () => {
    await fetchState();
});


</script>
