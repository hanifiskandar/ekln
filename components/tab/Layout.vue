<template>
    <div>
        <div class="hidden sm:block">
            <div class="border-b border-gray-200">
                <nav class="-mb-px flex" aria-label="Tabs">
                    <a v-for="tab in tabs" :key="tab.name" @click.prevent="handleTabSwitch(tab.name)"
                        :class="[
                            !tab.display ? 'hidden' : '', 
                            tab.name === activeTab ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                            'w-1/4 border-b-2 px-1 py-4 text-center text-sm font-medium'
                        ]"
                        :aria-current="tab.name === activeTab ? 'page' : undefined">{{ tab.name }}</a>
                </nav>
            </div>
        </div>

        <div v-if="showUnsavedMessage" class="modal" style="max-height: 400px;">
            <div class="modal-content">
                <p class="text-red-500">Ada perubahan belum disimpan. Klik 'Batal' atau 'Simpan' sebelum tukar tab.</p>
            </div>
        </div>

        <div class="content overflow-y-auto flex-grow" style="max-height: 600px;">
            <component
                :is="activeTabComponent"
                :application="tempApplication[`step${currentStep}`]"
                :getFilename="getFilename"
                :errors="errors[`step${currentStep}`]"
                :validForm="validForm"
                :showUnsavedMessage="showUnsavedMessage"
                :getErrorMessage="getErrorMessage"
                :markFieldTouched="markFieldTouched"
                :shouldShowError="shouldShowError"
                @updateApplication="updateApplication"
                @updateUnsavedMessage="updateUnsavedMessage"
                @tabApproval="tabApproval"
                @handleApproval="handleApproval"
            />
        </div>

    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { createReactiveForm, capitalizeFirstLetter } from '@/utils/formUtils';
import { toast } from "vue3-toastify";
import { STATUS } from '@/constants/status';
import dayjs from 'dayjs';
import StudentInfo from '@/components/tab/StudentInfo.vue';
import AcademicDetails from '@/components/tab/AcademicDetails.vue';
import CoordinatorDetails from '@/components/tab/CoordinatorDetails.vue';
import PlacementDetails from '@/components/tab/PlacementDetails.vue';
import Action from '~/components/tab/Action.vue';
import InterviewDetails from '~/components/tab/InterviewDetails.vue';

const props = defineProps({
    application: {
        type: Object,
        required: true,
    },
    getFilename: {
        type: Function,
        required: true,
    },
});

const emit = defineEmits(['updateModalApplication']);

const tabs = [
    { name: 'Maklumat Pelajar', component: StudentInfo, current: true, display: true },
    { name: 'Akademik', component: AcademicDetails, current: false, display: true },
    { name: 'Penyelaras', component: CoordinatorDetails, current: false, display: true },
    { name: 'Penempatan', component: PlacementDetails, current: false, display: true },
    { name: 'Temuduga', component: InterviewDetails, current: false, display: true },
    { name: 'Tindakan', component: Action, current: false, display: true },
];

const activeTab = ref('Maklumat Pelajar');
const currentStep = ref(1);
const validForm = ref(false);
const showUnsavedMessage = ref(false);

const activeTabComponent = computed(() => {
    const tab = tabs.find(t => t.name === activeTab.value);
    return tab ? tab.component : null;
});

const handleTabSwitch = (newTab) => {
    if ((JSON.stringify(tempApplication) !== JSON.stringify(originalApplication.value)) && activeTab.value != 'Tindakan') {
        showUnsavedMessage.value = true;
    } else {
        if (activeTab.value == 'Tindakan') {
            Object.keys(fields).forEach(step => {
                fields[step].forEach(field => {
                    tempApplication[step][field] = originalApplication.value[step][field];
                });
            });
        }
        switchTab(newTab);  // If no unsaved changes, switch tab directly
    }
};

const switchTab = (newTab) => {
    activeTab.value = newTab;
    currentStep.value = tabs.findIndex(t => t.name === newTab) + 1;
    showUnsavedMessage.value = false;
};

const fields = {
    step1: [
        'status',
        'telefon',
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
        'image',
        'image_file',
        'resume',
        'resume_file',
    ],
    step2: [
        'status',
        'peringkat_pengajian',
        'program',
        'jurusan',
        'kod',
        'institusi',
        'kemahiran',
        'aktiviti',
        'agama',
        'alamat_institusi',
        'alamat_institusi2',
        'alamat_institusi3',
        'poskod_institusi',
        'bandar_institusi',
        'negeri_institusi',
        'transkrip',
        'transkrip_file',
        'surat_universiti',
        'surat_universiti_file',
    ],
    step3: [
        'status',
        'nama_koordinator',
        'jawatan_koordinator',
        'email_koordinator',
        'tel_koordinator'
    ],
    step4: [
        'status',
        'lokasi',
        'tkh_mula',
        'tkh_tamat',
        'penafian'
    ],
    step5: [
        'status',
        'tkh_temuduga',
        'masa_temuduga',
        'tempat_temuduga',
    ],
    step6: [
        'status',
        'tindakan',
        'alasan',
        'doktaklengkap_resume',
        'doktaklengkap_transkrip',
        'doktaklengkap_suratuni',
        'ruj_surat',
        'jilid',
        'bil',
        'tkh_surat',
        'penempatan_cadangan',
        'elaun',
        'tempoh_penempatan',
        'kadar_elaun',
        'amaun_elaun',
        'nama_pelulus',
    ]
};

const tempApplication = createReactiveForm(fields, '', props.application);
// Use `ref` for `originalApplication` to control updates manually
const originalApplication = ref(JSON.parse(JSON.stringify(tempApplication))); // Deep clone for the original state

const touchedFields = createReactiveForm(fields, false);

const errors = reactive({
    step1: {
        telefon: { $message: 'No. Telefon perlu dilengkapkan.' },
        bangsa: { $message: '' },
        bangsa_lain: { $message: '' },
        agama: { $message: '' },
        agama_lain: { $message: '' },
        alamat: { $message: '' },
        alamat2: { $message: 'Alamat perlu dilengkapkan.' },
        alamat3: { $message: '' },
        poskod: { $message: '' },
        bandar: { $message: '' },
        negeri: { $message: '' },
        image_file: { $message: 'Gambar perlu dimuat naik' },
        resume_file: { $message: 'Resume perlu dimuat naik' },
    },
    step2: {
        peringkat_pengajian: { $message: 'Peringkat pengajian perlu dilengkapkan.' },
        program: { $message: '' },
        jurusan: { $message: '' },
        kod: { $message: 'Institusi perlu dilengkapkan.' },
        institusi: { $message: '' },
        kemahiran: { $message: '' },
        aktiviti: { $message: '' },
        alamat_institusi: { $message: '' },
        alamat_institusi2: { $message: '' },
        alamat_institusi3: { $message: '' },
        poskod_institusi: { $message: '' },
        bandar_institusi: { $message: '' },
        negeri_institusi: { $message: '' },
        transkrip: { $message: 'Transkrip perlu dimuat naik' },
        surat_universiti: { $message: 'Surat Universiti perlu dimuat naik' },
    },
    step3: {
        nama_koordinator: { $message: 'Nama Penyelaras perlu dilengkapkan.' },
        jawatan_koordinator: { $message: 'Jawatan Penyelaras perlu dilengkapkan.' },
        email_koordinator: { $message: 'Email Penyelaras perlu dilengkapkan.' },
        tel_koordinator: { $message: 'No Telefon Penyelaras perlu dilengkapkan.' },
    },
    step4: {
        lokasi: { $message: 'Lokasi pilihan perlu dilengkapkan.' },
        tkh_mula: { $message: 'Tarikh mula perlu dilengkapkan.' },
        tkh_tamat: { $message: 'Tarikh tamat perlu dilengkapkan.' },
        penafian: { $message: '' },
    },
    step5: {
        tkh_temuduga: { $message: '' },
        masa_temuduga: { $message: '' },
        tempat_temuduga: { $message: '' },
    },
    step6: {
        alasan: { $message: '' },
        doktaklengkap_resume: { $message: '' },
        doktaklengkap_transkrip: { $message: '' },
        doktaklengkap_suratuni: { $message: '' },
        ruj_surat: { $message: '' },
        jilid: { $message: '' },
        bil: { $message: '' },
        tkh_surat: { $message: '' },
        penempatan_cadangan: { $message: '' },
        elaun: { $message: '' },
        tempoh_penempatan: { $message: '' },
        kadar_elaun: { $message: '' },
        amaun_elaun: { $message: '' },
        nama_pelulus: { $message: '' },
    }
});

const requiredFields = ref({
    step1: {
        alamat: true,
        alamat2: true,
        alamat3: true,
        poskod: true,
        bandar: true,
        negeri: true,
        telefon: true,
        bangsa: true,
        bangsa_lain: false,
        agama: true,
        agama_lain: false,
        image: false,
        resume: false,
    },
    step2: {
        peringkat_pengajian: true,
        program: true,
        jurusan: true,
        kod: true,
        institusi: false,
        kemahiran: true,
        aktiviti: true,
        alamat_institusi: true,
        alamat_institusi2: true,
        alamat_institusi3: true,
        poskod_institusi: true,
        bandar_institusi: true,
        negeri_institusi: true,
        transkrip: false,
        surat_universiti: false,
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
        penafian: true,
    },
    step5: {
        tkh_temuduga: true,
        masa_temuduga: true,
        tempat_temuduga: true,
    },
    step6: {
        tindakan: true,
        alasan: false,
        doktaklengkap_resume: false,
        doktaklengkap_transkrip: false,
        doktaklengkap_suratuni: false,
        ruj_surat: false,
        jilid: false,
        bil: false,
        tkh_surat: false,
        penempatan_cadangan: false,
        elaun: false,
        tempoh_penempatan: false,
        kadar_elaun: false,
        amaun_elaun: false,
        nama_pelulus: false,
    }
});

// Watch for changes to the application prop
watch(() => props.application, (newVal) => {
    // Re-sync the reactive form with the new prop value
    Object.assign(tempApplication, createReactiveForm(fields, '', newVal));

    // Update originalApplication with the new value to maintain the original state
    originalApplication.value = JSON.parse(JSON.stringify(tempApplication));
},
    { immediate: true } // Trigger the watcher immediately
);


watch(activeTab, (newTab) => {
    if (newTab === 'Maklumat Pelajar') {
        currentStep.value = 1;
    } else if (newTab === 'Akademik') {
        currentStep.value = 2;
    } else if (newTab === 'Penyelaras') {
        currentStep.value = 3;
    } else if (newTab === 'Penempatan') {
        currentStep.value = 4;
    } else if (newTab === 'Temuduga') {
        currentStep.value = 5;
    } else {
        currentStep.value = 6;
    }
});

watch(() => tempApplication.step1.bangsa, (newVal) => {
    requiredFields.value.step1.bangsa_lain = newVal === 'Lain-lain';
});

watch(() => tempApplication.step1.agama, (newVal) => {
    requiredFields.value.step1.agama_lain = newVal === 'Lain-lain';
});


watch(() => props.application.status, (newStatus) => {
    console.log('New status:', newStatus);

    tabs.forEach(tab => {
        if (tab.name === 'Temuduga') {
            tab.display = (newStatus === STATUS.ScreeningApproved || newStatus === STATUS.InterviewAccepted);
        }
        if (tab.name === 'Tindakan'){
            tab.display = newStatus !== STATUS.Interview
        }
    });

    console.log('Updated tabs:', tabs);
}, { immediate: true });



watch(() => tempApplication.step6.tindakan, (newVal) => {
    requiredFields.value.step6.alasan = newVal === 'reject';
});


watch(() => tempApplication.step6.alasan, (newVal) => {
    const condition = newVal !== 'Kuota Penuh' && newVal !== 'Bidang Pengajian Di JKR';
    if (tempApplication.step6.status != STATUS.Suggested) {
        requiredFields.value.step6.ruj_surat = condition;
        requiredFields.value.step6.jilid = condition;
        requiredFields.value.step6.bil = condition;
        requiredFields.value.step6.tkh_surat = condition;
    }
});

function markFieldTouched(step, field) {
    touchedFields[step][field] = true;
}

function shouldShowError(step, field) {
    return touchedFields[step][field] && getErrorMessage(step, field);
    // touchedFields[step1][noTel] && getErrorMessage(step1, noTel);
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
    const fieldValue = tempApplication[step][field];

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
        const fieldValue = tempApplication[step][field];

        if (!fieldValue && requiredFields.value[step][field]) {
            isValid = false;
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

function clearMarkAllFieldsTouched(step) {
    const fields = Object.keys(touchedFields[step]);
    fields.forEach(field => {
        touchedFields[step][field] = false;
    });
}

function createPayload(formData, step) {
    const formDataObj = new FormData();

    formDataObj.append('step', step);
    formDataObj.append('peringkat_pengajian', formData.step2.peringkat_pengajian);
    formDataObj.append('program', formData.step2.program);
    formDataObj.append('jurusan', formData.step2.jurusan);
    formDataObj.append('id_institusi', formData.step2.kod);
    formDataObj.append('alamat_institusi', formData.step2.alamat_institusi);
    formDataObj.append('alamat_institusi2', formData.step2.alamat_institusi2);
    formDataObj.append('alamat_institusi3', formData.step2.alamat_institusi3);
    formDataObj.append('poskod_institusi', formData.step2.poskod_institusi);
    formDataObj.append('bandar_institusi', formData.step2.bandar_institusi);
    formDataObj.append('negeri_institusi', formData.step2.negeri_institusi);
    formDataObj.append('kemahiran', formData.step2.kemahiran);
    formDataObj.append('aktiviti', formData.step2.aktiviti);
    formDataObj.append('nama_koordinator', formData.step3.nama_koordinator);
    formDataObj.append('jawatan_koordinator', formData.step3.jawatan_koordinator);
    formDataObj.append('email_koordinator', formData.step3.email_koordinator);
    formDataObj.append('tel_koordinator', formData.step3.tel_koordinator);
    formDataObj.append('lokasi', formData.step4.lokasi);
    formDataObj.append('tkh_mula', dayjs(formData.step4.tkh_mula).format('YYYY-MM-DD HH:mm:ss'));
    formDataObj.append('tkh_tamat', dayjs(formData.step4.tkh_tamat).format('YYYY-MM-DD HH:mm:ss'));
    formDataObj.append('penafian', formData.step4.penafian);

    if (step == 5) { //Temuduga Tab
        formDataObj.append('status', STATUS.Interview);
        formDataObj.append('tkh_temuduga', dayjs(formData.step5.tkh_temuduga).format('YYYY-MM-DD HH:mm:ss'));
        formDataObj.append('masa_temuduga', formData.step5.masa_temuduga);
        formDataObj.append('tempat_temuduga', formData.step5.tempat_temuduga);
    }

    // Append nested student fields
    formDataObj.append('student[telefon]', formData.step1.telefon);
    formDataObj.append('student[bangsa]', formData.step1.bangsa);
    formDataObj.append('student[agama]', formData.step1.agama);
    formDataObj.append('student[alamat]', formData.step1.alamat);
    formDataObj.append('student[alamat2]', formData.step1.alamat2);
    formDataObj.append('student[alamat3]', formData.step1.alamat3);
    formDataObj.append('student[poskod]', formData.step1.poskod);
    formDataObj.append('student[bandar]', formData.step1.bandar);
    formDataObj.append('student[negeri]', formData.step1.negeri);

    if (formData.step1.image) {
        formDataObj.append('student[image_file]', formData.step1.image);
    } else if (formData.step1.image_file) {
        formDataObj.append('student[image_file]', formData.step1.image_file);
    }

    if (formData.step1.resume) {
        formDataObj.append('student[resume_file]', formData.step1.resume);
    } else if (formData.step1.resume_file) {
        formDataObj.append('student[resume_file]', formData.step1.resume_file);
    }

    if (formData.step2.transkrip) {
        formDataObj.append('student[transkrip_file]', formData.step2.transkrip);
    } else if (formData.step2.transkrip_file) {
        formDataObj.append('student[transkrip_file]', formData.step2.transkrip_file);
    }

    if (formData.step2.surat_universiti) {
        formDataObj.append('student[surat_universiti_file]', formData.step2.surat_universiti);
    } else if (formData.step2.surat_universiti) {
        formDataObj.append('student[surat_universiti]', formData.step2.surat_universiti);
    }

    return formDataObj;
}

const updateApplication = async (newData) => {
    try {
        markAllFieldsTouched(`step${currentStep.value}`);
        const isValid = validateStep(currentStep.value);
        if (isValid) {
            clearMarkAllFieldsTouched(`step${currentStep.value}`);
            tempApplication[`step${currentStep.value}`] = newData;
            const formDataObj = createPayload(tempApplication, currentStep.value);

            // console.log('Print formDataObj');
            // for (let [key, value] of formDataObj.entries()) {
            //     console.log(`${key}:`, value);
            // }

            const applicationId = props.application.id;

            try {
                const response = await $fetch(`/api/internship/application/${applicationId}`, {
                    method: 'PUT',
                    body: formDataObj,
                });

                validForm.value = true;
                
                // console.log('Final submission successful:', response);
                toast.success("Maklumat berjaya dikemas kini!");
                emit('updateModalApplication', applicationId);

            } catch (error) {
                // console.error("Error during final submission:", error);
                toast.error("Tindakan tidak berjaya, sila cuba lagi.");
            }

        } else {
            console.warn(`Validation failed for step ${currentStep.value}`);
            console.log('Current Errors:', errors);
            // validForm.value = false;
        }
    } catch (error) {
        console.error('Error in nextStep:', error);
    }
}

const handleApproval = async (newData) => {
    try {
        markAllFieldsTouched(`step${currentStep.value}`);
        const isValid = validateStep(currentStep.value);
        if (isValid) {
            clearMarkAllFieldsTouched(`step${currentStep.value}`);
            validForm.value = true;
            tempApplication[`step${currentStep.value}`] = newData;
            originalApplication.value = JSON.parse(JSON.stringify(tempApplication));
            const patchPayload = {
                status: tempApplication.step6.status,
                tindakan: tempApplication.step6.tindakan,
                penempatan_cadangan: tempApplication.step6.penempatan_cadangan,
                elaun: tempApplication.step6.elaun,
                tempoh_penempatan: tempApplication.step6.tempoh_penempatan,
                kadar_elaun: tempApplication.step6.kadar_elaun,
                amaun_elaun: tempApplication.step6.amaun_elaun,
                alasan: tempApplication.step6.alasan,
                doktaklengkap_resume: tempApplication.step6.doktaklengkap_resume ? 1 : 0,
                doktaklengkap_transkrip: tempApplication.step6.doktaklengkap_transkrip ? 1 : 0,
                doktaklengkap_suratuni: tempApplication.step6.doktaklengkap_suratuni ? 1 : 0,
                ruj_surat: tempApplication.step6.ruj_surat,
                jilid: tempApplication.step6.jilid,
                bil: tempApplication.step6.bil,
                tkh_surat: tempApplication.step6.tkh_surat ? dayjs(tempApplication.step6.tkh_surat).format('YYYY-MM-DD HH:mm:ss') : '',
                nama_pelulus: tempApplication.step6.nama_pelulus,
            }

            // console.log('payload',patchPayload);

            const applicationId = props.application.id;

            const response = await $fetch(`/api/internship/application/approval/${applicationId}`, {
                method: 'PATCH',
                body: JSON.stringify(patchPayload),
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.success) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                console.log('success');
                toast.success("Maklumat berjaya dikemas kini!XXX");
                emit('updateModalApplication', applicationId);

            }

        } else {
            console.warn(`Validation failed for step ${currentStep.value}`);
            console.log('Current Errors:', errors);
            toast.error("Tindakan tidak berjaya, sila cuba lagiXXXX");
            validForm.value = false;
        }
    } catch (error) {
        console.error('Error in nextStep:', error);
    }
}

const tabApproval = () => {
    switchTab('Tindakan');
};

function updateUnsavedMessage() {
    clearMarkAllFieldsTouched(`step${currentStep.value}`);
    showUnsavedMessage.value = false;
}

</script>

