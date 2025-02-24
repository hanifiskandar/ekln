<template>
    <LandingContainer>
        <LandingSectionhead>
            <template v-slot:title>Borang Permohonan</template>
            <template v-slot:desc>
                Semua maklumat perlu dilengkapkan.
                Email maklumbalas akan dihantar setelah permohonan diproses. <br />
                Semakan secara atas talian juga boleh dilakukan.
            </template>
        </LandingSectionhead>
        <span class="p-10"></span>
        <!-- Progress Navigation -->
        <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Progress">
            <ol role="list"
                class="overflow-hidden rounded-md lg:flex lg:rounded-none lg:border-l lg:border-r lg:border-gray-200">
                <li v-for="(step, stepIdx) in steps" :key="step.id" class="relative overflow-hidden lg:flex-1">
                    <div :class="[
                        stepIdx === 0 ? 'rounded-t-md border-b-0' : '',
                        stepIdx === steps.length - 1 ? 'rounded-b-md border-t-0' : '',
                        'overflow-hidden border border-gray-200 lg:border-0'
                    ]">
                        <a v-if="step.status === 'complete'" :href="step.href" class="group">
                            <span
                                class="absolute left-0 top-0 h-full w-1 bg-transparent group-hover:bg-gray-200 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
                                aria-hidden="true"></span>
                            <span
                                :class="[stepIdx !== 0 ? 'lg:pl-9' : '', 'flex items-start px-6 py-5 text-sm font-medium']">
                                <span class="flex-shrink-0">
                                    <span class="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600">
                                        <CheckIcon class="h-6 w-6 text-white" aria-hidden="true" />
                                    </span>
                                </span>
                                <span class="ml-4 mt-0.5 flex min-w-0 flex-col">
                                    <span class="text-sm font-medium">{{ step.name }}</span>
                                    <span class="text-sm font-medium text-gray-500">{{ step.description }}</span>
                                </span>
                            </span>
                        </a>
                        <a v-else-if="step.status === 'current'" :href="step.href" aria-current="step">
                            <span
                                class="absolute left-0 top-0 h-full w-1 bg-indigo-600 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
                                aria-hidden="true"></span>
                            <span
                                :class="[stepIdx !== 0 ? 'lg:pl-9' : '', 'flex items-start px-6 py-5 text-sm font-medium']">
                                <span class="flex-shrink-0">
                                    <span
                                        class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-indigo-600">
                                        <span class="text-indigo-600">{{ step.id }}</span>
                                    </span>
                                </span>
                                <span class="ml-4 mt-0.5 flex min-w-0 flex-col">
                                    <span class="text-sm font-medium text-indigo-600">{{ step.name }}</span>
                                    <span class="text-sm font-medium text-gray-500">{{ step.description }}</span>
                                </span>
                            </span>
                        </a>
                        <a v-else :href="step.href" class="group">
                            <span
                                class="absolute left-0 top-0 h-full w-1 bg-transparent group-hover:bg-gray-200 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
                                aria-hidden="true"></span>
                            <span
                                :class="[stepIdx !== 0 ? 'lg:pl-9' : '', 'flex items-start px-6 py-5 text-sm font-medium']">
                                <span class="flex-shrink-0">
                                    <span
                                        class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300">
                                        <span class="text-gray-500">{{ step.id }}</span>
                                    </span>
                                </span>
                                <span class="ml-4 mt-0.5 flex min-w-0 flex-col">
                                    <span class="text-sm font-medium text-gray-500">{{ step.name }}</span>
                                    <span class="text-sm font-medium text-gray-500">{{ step.description }}</span>
                                </span>
                            </span>
                        </a>
                        <template v-if="stepIdx !== 0">
                            <div class="absolute inset-0 left-0 top-0 hidden w-3 lg:block" aria-hidden="true">
                                <svg class="h-full w-full text-gray-300" viewBox="0 0 12 82" fill="none"
                                    preserveAspectRatio="none">
                                    <path d="M0.5 0V31L10.5 41L0.5 51V82" stroke="currentcolor"
                                        vector-effect="non-scaling-stroke" />
                                </svg>
                            </div>
                        </template>
                    </div>
                </li>
            </ol>
        </nav>

        <form @submit.prevent="handleSubmit">
            <Step1 
                v-if="currentStep === 1" 
                @next="nextStep" 
                :formData="step1"
                :errors="errors.step1" 
                :getErrorMessage="getErrorMessage"
                :markFieldTouched="markFieldTouched"
                :shouldShowError="shouldShowError"
                :documentsForm1Files="documentsForm1Files"
                :documentsForm2Files="documentsForm2Files" 
            />
            <Step2 
                v-if="currentStep === 2" 
                @previous="prevStep" 
                @next="nextStep" 
                :formData="step2" 
                :errors="errors.step2" 
                :getErrorMessage="getErrorMessage"
                :markFieldTouched="markFieldTouched"
                :shouldShowError="shouldShowError"
                :documentsForm3Files="documentsForm3Files"
                :documentsForm4Files="documentsForm4Files" 
            />
            <Step3
                v-if="currentStep === 3" 
                @previous="prevStep" 
                @next="nextStep" 
                :formData="step3" 
                :errors="errors.step3" 
                :getErrorMessage="getErrorMessage"
                :markFieldTouched="markFieldTouched"
                :shouldShowError="shouldShowError"
            />
            <Step4
                v-if="currentStep === 4" 
                @previous="prevStep" 
                @submit="handleSubmit" 
                :formData="step4" 
                :errors="errors.step4" 
                :getErrorMessage="getErrorMessage"
                :markFieldTouched="markFieldTouched"
                :shouldShowError="shouldShowError"
            />
        </form>

        <Success v-if="submissionStatus === 'success'" />
        <!-- <Error v-if="submissionStatus === 'error'" /> -->
    </LandingContainer>
</template>

<script setup>
definePageMeta({
    layout: "landing",
});

import { ref, reactive, toRefs } from 'vue';
import { toast } from "vue3-toastify";
import { navigateTo } from 'nuxt/app';
import { CheckIcon } from '@heroicons/vue/24/solid';
import { createReactiveForm, capitalizeFirstLetter } from '@/utils/formUtils';
import dayjs from 'dayjs';


import Step1 from '@/components/form/Step1.vue';
import Step2 from '@/components/form/Step2.vue';
import Step3 from '@/components/form/Step3.vue';
import Step4 from '@/components/form/Step4.vue';
import Success from '@/components/form/Success.vue';
import Error from '~/components/auth/500.vue';

const currentStep = ref(1);
const submissionStatus = ref(null);
const documentsForm1Files = ref([]);
const documentsForm2Files = ref([]);
const documentsForm3Files = ref([]);
const documentsForm4Files = ref([]);

const steps = reactive([
    { id: '01', name: 'Peribadi', description: 'Maklumat peribadi anda.', status: 'current' },
    { id: '02', name: 'Akademik', description: 'Maklumat akademik anda.', status: 'upcoming' },
    { id: '03', name: 'Penyelaras', description: 'Maklumat penyelaras anda.', status: 'upcoming' },
    { id: '04', name: 'Lokasi & Penafian', description: 'Maklumat lokasi dan penafian.', status: 'upcoming' },
]);

// Masukkan fields yg terlibat untuk setiap step borang
// Tambahkan sufix _file untuk elemen 'file' (upload file)
const fields = {
    step1: [
        'nama',
        'nokp',
        'email',
        'telefon',
        'jantina',
        'bangsa',
        'bangsa_lain',
        'agama',
        'agama_lain',
        'alamat',
        'alamat2',
        'alamat3',
        'poskod',
        'bandar',
        'negeri',
        'image_file',
        'resume_file',
    ],
    step2: [
        'peringkat_pengajian',
        'program',
        'jurusan',
        'kemahiran',
        'aktiviti',
        'institusi',
        'alamat_institusi',
        'alamat_institusi2',
        'alamat_institusi3',
        'poskod_institusi',
        'bandar_institusi',
        'negeri_institusi',
        'transkrip_file',
        'surat_universiti_file',
    ],
    step3: [
        'nama_koordinator',
        'jawatan_koordinator',
        'email_koordinator',
        'tel_koordinator'
    ],
    step4: [
        'lokasi',
        'tkh_mula',
        'tkh_tamat',
        'penafian'
    ]
};

const formData = createReactiveForm(fields);
const touchedFields = createReactiveForm(fields, false);

const { step1, step2, step3, step4 } = toRefs(formData);

// Set untuk custom error message
// Default error message `${capitalizeFirstLetter(field)} perlu dilengkapkan.`
const errors = reactive({
    step1: {
        nama: { $message: ''},
        nokp: { $message: ''},
        jantina: { $message: ''},
        bangsa: { $message: ''},
        bangsa_lain: { $message: ''},
        agama: { $message: ''},
        agama_lain: { $message: ''},
        alamat: { $message: ''},
        alamat2: { $message: 'Alamat perlu dilengkapkan.'},
        alamat3: { $message: ''},
        poskod: { $message: ''},
        bandar: { $message: ''},
        negeri: { $message: ''},
        email: { $message: ''},
        telefon: { $message: 'No. Telefon perlu dilengkapkan.'},
        image_file: { $message: 'Gambar perlu dimuat naik'},
        resume_file: { $message: 'Resume perlu dimuat naik'},
    },
    step2: {
        peringkat_pengajian: { $message: 'Peringkat pengajian perlu dilengkapkan.' },
        program: { $message: '' },
        jurusan: { $message: '' },
        kemahiran: { $message: ''},
        aktiviti: { $message: ''},
        institusi: { $message: '' },
        alamat_institusi: { $message: 'Alamat Institusi perlu dilengkapkan.' },
        alamat_institusi2: { $message: 'Alamat Institusi 2 perlu dilengkapkan.' },
        alamat_institusi3: { $message: 'Alamat Institusi 3 perlu dilengkapkan.' },
        poskod_institusi: { $message: 'Poskod Institusi perlu dilengkapkan.' },
        bandar_institusi: { $message: 'Bandar Institusi perlu dilengkapkan.' },
        negeri_institusi: { $message: 'Negeri Institusi perlu dilengkapkan.' },
        transkrip_file: { $message: 'Transkrip perlu dimuat naik' },
        surat_universiti_file: { $message: 'Surat Universiti perlu dimuat naik' },
    },
    step3: {
        nama_koordinator: { $message: 'Nama Penyelaras perlu dilengkapkan.'},
        jawatan_koordinator: { $message: 'Jawatam Penyelaras perlu dilengkapkan.'},
        email_koordinator: { $message: 'Email Penyelaras perlu dilengkapkan.'},
        tel_koordinator: { $message: 'No Telefon Penyelaras perlu dilengkapkan.'},
    },
    step4: {
        lokasi: { $message: 'Lokasi pilihan perlu dilengkapkan.'},
        tkh_mula: { $message: 'Tarikh mula perlu dilengkapkan.'},
        tkh_tamat: { $message: 'Tarikh tamat perlu dilengkapkan.'},
        penafian: { $message: ''},
    },
});

// Update untuk medan-medan wajib
// Value true/false tidak akan reflect apa-apa
const requiredFields = ref({
    step1: {
        nama: true,
        nokp: true,
        email: true,
        telefon: true,
        jantina: true,
        agama: true,
        agama_lain: false,
        bangsa: true,
        bangsa_lain: false,
        alamat: true,
        alamat2: true,
        alamat3: true,
        poskod: true,
        bandar: true,
        negeri: true,
        image_file: true,
        resume_file: true,
    },
    step2: {
        peringkat_pengajian: true,
        program: true,
        jurusan: true,
        kemahiran: true,
        aktiviti: true,
        institusi: true,
        alamat_institusi: true,
        alamat_institusi2: true,
        alamat_institusi3: true,
        poskod_institusi: true,
        bandar_institusi: true,
        negeri_institusi: true,
        transkrip_file: true,
        surat_universiti_file: true,
    },
    step3: {
        nama_koordinator: true,
        jawatan_koordinator: true,
        email_koordinator: true,
        tel_koordinator: true,
    },
    step4: {
        lokasi: true,
        tkh_mula: true,
        tkh_tamat: true,
        // penafian: true,
    }
});

watch(() => formData.step1.bangsa, (newVal) => {
  requiredFields.value.step1.bangsa_lain = newVal === 'Lain-lain';
});

watch(() => formData.step1.agama, (newVal) => {
  requiredFields.value.step1.agama_lain = newVal === 'Lain-lain';
});

// Update step status on click sebelum/seterusnya/hantar
const updateStepStatus = () => {
    steps[currentStep.value - 1].status = 'complete'; 
    if (currentStep.value < steps.length) {
        steps[currentStep.value].status = 'current';
    }
};

function nextStep() {
    try {
        markAllFieldsTouched(`step${currentStep.value}`);
        const isValid = validateStep(currentStep.value);

        if (isValid) {
            updateStepStatus();
            clearErrors(`step${currentStep.value}`);
            currentStep.value++;
        } else {
            console.warn(`Validation failed for step ${currentStep.value}`);
            console.log('Current Errors:', errors);
        }
    } catch (error) {
        console.error('Error in nextStep:', error);
    }
}

const prevStep = () => {
    if (currentStep.value > 1) {
        clearErrors(`step${currentStep.value}`); 
        steps[currentStep.value - 1].status = 'upcoming';
        currentStep.value--;
        steps[currentStep.value - 1].status = 'current';
    }
};

function markFieldTouched(step, field) {
    touchedFields[step][field] = true;
}

function shouldShowError(step, field) {
    return touchedFields[step][field] && getErrorMessage(step, field);
}

const VALIDATION_RULES = {
    nokp: (value) => /^\d{6}-\d{2}-\d{4}$/.test(value) ? '' : 'Format NOKP tidak tepat.',
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Format Email tidak tepat',
    telefon: (value) => /^01\d{8,9}$/.test(value) ? '' : 'Nombor Telefon tidak sah',
    tel_koordinator: (value) => /^01\d{8,9}$/.test(value) ? '' : 'Nombor Telefon tidak sah',
    poskod: (value) => /^\d{5}$/.test(value) ? '' : 'Poskod tidak sah',
    poskod_institusi: (value) => /^\d{5}$/.test(value) ? '' : 'Poskod tidak sah',
};

function getErrorMessage(step, field) {
    const currentErrors = errors[`step${currentStep.value}`];
    const fieldValue = formData[step][field];

    if (requiredFields.value[step][field]) {
        if (!fieldValue) {
            return currentErrors && currentErrors[field]?.$message 
                ? currentErrors[field].$message 
                : `${capitalizeFirstLetter(field)} perlu dilengkapkan.`;
        }

        // Validate using VALIDATION_RULES directly
        if (VALIDATION_RULES[field]) {
            const errorMessage = VALIDATION_RULES[field](fieldValue);
            if (errorMessage) return errorMessage;
        }
    }

    return '';
}


function validateRequiredFields(step, fields) {
    let isValid = true;
    
    for (const field of fields) {
        const fieldValue = formData[step][field];

        if (!fieldValue && requiredFields.value[step][field]) {

            if (errors[step] && errors[step][field]) {
                errors[step][field].$message = `${capitalizeFirstLetter(field)} perlu dilengkapkan.`;
            }
            isValid = false;
        } else {
            if (errors[step] && errors[step][field] && errors[step][field].$message !== undefined) {
                errors[step][field].$message = ''; 
            }
        }
    }
    return isValid;
}


function validateStep(step) {
    let isValid = true;
    const stepFields = Object.keys(errors[`step${step}`]);
    
    isValid = validateRequiredFields(`step${step}`, stepFields) && isValid;

    return isValid;
}

function markAllFieldsTouched(step) {
    const fields = Object.keys(touchedFields[step]);
    fields.forEach(field => {
        touchedFields[step][field] = true; // Mark field yg telah diusik untuk trigger validation
    });
}

function clearErrors(step) {
    for (const key in errors[step]) {
        errors[step][key] = '';
    }
}

function createPayload(formData) {
  const formDataObj = new FormData();

  // Append regular form fields
  formDataObj.append('peringkat_pengajian', formData.step2.peringkat_pengajian);
  formDataObj.append('program', formData.step2.program);
  formDataObj.append('jurusan', formData.step2.jurusan);
  formDataObj.append('kemahiran', formData.step2.kemahiran);
  formDataObj.append('aktiviti', formData.step2.aktiviti);
  formDataObj.append('id_institusi', formData.step2.institusi);
  formDataObj.append('alamat_institusi', formData.step2.alamat_institusi);
  formDataObj.append('alamat_institusi2', formData.step2.alamat_institusi2);
  formDataObj.append('alamat_institusi3', formData.step2.alamat_institusi3);
  formDataObj.append('poskod_institusi', formData.step2.poskod_institusi);
  formDataObj.append('bandar_institusi', formData.step2.bandar_institusi);
  formDataObj.append('negeri_institusi', formData.step2.negeri_institusi);
  formDataObj.append('nama_koordinator', formData.step3.nama_koordinator);
  formDataObj.append('jawatan_koordinator', formData.step3.jawatan_koordinator);
  formDataObj.append('email_koordinator', formData.step3.email_koordinator);
  formDataObj.append('tel_koordinator', formData.step3.tel_koordinator);
  formDataObj.append('lokasi', formData.step4.lokasi);
  formDataObj.append('tkh_mula', dayjs(formData.step4.tkh_mula).format('YYYY-MM-DD HH:mm:ss'));
  formDataObj.append('tkh_tamat', dayjs(formData.step4.tkh_tamat).format('YYYY-MM-DD HH:mm:ss')); 
  formDataObj.append('penafian', formData.step4.penafian);

  // Append nested student fields
  formDataObj.append('student[nama]', formData.step1.nama);
  formDataObj.append('student[nokp]', formData.step1.nokp.replace(/[\s-]/g, ''));
  formDataObj.append('student[email]', formData.step1.email);
  formDataObj.append('student[telefon]', formData.step1.telefon);
  formDataObj.append('student[jantina]', formData.step1.jantina);

  formDataObj.append('student[bangsa]', formData.step1.bangsa);
  formDataObj.append('student[agama]', formData.step1.agama);
  
  formDataObj.append('student[alamat]', formData.step1.alamat);
  formDataObj.append('student[alamat2]', formData.step1.alamat2);
  formDataObj.append('student[alamat3]', formData.step1.alamat3);
  formDataObj.append('student[poskod]', formData.step1.poskod);
  formDataObj.append('student[bandar]', formData.step1.bandar);
  formDataObj.append('student[negeri]', formData.step1.negeri);

  // Append files if they exist
  if (formData.step1.image_file) {
    formDataObj.append('student[image_file]', formData.step1.image_file);
  }
  if (formData.step1.resume_file) {
    formDataObj.append('student[resume_file]', formData.step1.resume_file);
  }
  if (formData.step2.transkrip_file) {
    formDataObj.append('student[transkrip_file]', formData.step2.transkrip_file);
  }
  if (formData.step2.surat_universiti_file) {
    formDataObj.append('student[surat_universiti_file]', formData.step2.surat_universiti_file);
  }

  return formDataObj;
}

const updateErrorsFromBackend = (backendErrors) => {

    // Reset all error messages
    Object.keys(errors).forEach((step) => {
        Object.keys(errors[step]).forEach((key) => {
            errors[step][key] = { $message: "" };
        });
    });

    // Populate error messages based on backend response
    Object.keys(backendErrors).forEach((field) => {
        Object.keys(errors).forEach((step) => {
            if (field in errors[step]) {
                errors[step][field].$message = backendErrors[field];
                markAllFieldsTouched(step);
                const isValid = validateStep(1);
            }
        });
    });
};


const handleSubmit = async () => {
    markAllFieldsTouched(`step${currentStep.value}`);
    const isValid = validateStep(currentStep.value);
    
    if (!isValid) {
        console.error("Current step is invalid:", errors[`step${currentStep.value}`]);
        return; 
    }

    steps[currentStep.value - 1].status = 'complete';

    if (currentStep.value === steps.length) {
        const formDataObj = createPayload(formData); 

        console.log('form data obj content:');
        for (let [key, value] of formDataObj.entries()) {
            console.log(`${key}:`, value);
        }

        try {
            const response = await $fetch('/api/internship/application',{
                method: 'POST',
                body: formDataObj,
            });

            console.log('Final submission successful:', response);
            currentStep.value++;
            toast.success("Maklumat berjaya disimpan!");
            submissionStatus.value = 'success';

        } catch (error) {
            console.error("Error during final submission:", error);
            console.log('Error details:', error);
            console.log('Error details data dalam:', error.data);
            console.log('Error details data data dalam:', error.data.data);

            const errorMessage = error.data?.data;

            if (errorMessage && errorMessage.errors) {
                updateErrorsFromBackend(errorMessage.errors);
            }

            toast.error("Tindakan tidak berjaya, sila cuba lagi.");
            submissionStatus.value = 'error';
        }
    } else {
        currentStep.value++;
    }
};

</script> 


<style scoped>
/* Add your custom styles here */
</style>