<template>
    <div class="pt-10">
        <h2 class="text-xl font-bold mb-4">Akademik</h2>

        <div class="mb-5 flex flex-wrap mr-2">
            <div class="flex-1 mr-2">
                <select
                    v-model="formData.peringkat_pengajian"
                    @blur="markFieldTouched('step2', 'peringkat_pengajian')"
                    :class="[
                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100 appearance-none',
                        shouldShowError('step2', 'peringkat_pengajian') ? 'border-red-500' : 'border-gray-300',
                    ]"
                    
                >
                    <option disabled value="">Peringkat Pengajian</option>
                    <option value="1">Sijil</option>
                    <option value="2">Diploma</option>
                    <option value="3">Ijazah</option>
                </select>
                <p v-if="shouldShowError('step2', 'peringkat_pengajian')" class="text-red-400 text-sm mt-1">
                    {{ getErrorMessage('step2', 'peringkat_pengajian') }}
                </p>
            </div>
            <div class="flex-1 ml-2">
                <select
                    v-model="formData.jurusan"
                    @blur="markFieldTouched('step2', 'jurusan')"
                    :class="[
                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100 appearance-none',
                        shouldShowError('step2', 'jurusan') ? 'border-red-500' : 'border-gray-300',
                    ]"
                    
                >
                    <option disabled value="">Bidang</option>
                    <option value="Sains">Sains</option>
                    <option value="Seni">Seni</option>
                </select>
                <p v-if="shouldShowError('step2', 'jurusan')" class="text-red-400 text-sm mt-1">
                    {{ getErrorMessage('step2', 'jurusan') }}
                </p>
            </div>
        </div>

        <div class="mb-5 flex flex-wrap">
            <div class="flex-1 mr-2">
                <input
                    v-model="formData.program"
                    @blur="markFieldTouched('step2', 'program')"
                    placeholder="Program"
                    
                    :class="[
                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                        shouldShowError('step2', 'program') ? 'border-red-500' : 'border-gray-300',
                    ]"
                />
                <p v-if="shouldShowError('step2', 'program')" class="text-red-400 text-sm mt-1">
                    {{ getErrorMessage('step2', 'program') }}
                </p>
            </div>
        </div>

        <div class="mb-5 flex flex-wrap mr-2">
            <input
                v-model="formData.kemahiran"
                @blur="markFieldTouched('step2', 'kemahiran')"
                placeholder="Kemahiran"
                :class="[
                    'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                    shouldShowError('step2', 'kemahiran') ? 'border-red-500' : 'border-gray-300',
                ]"
            />
            <p v-if="shouldShowError('step2', 'kemahiran')" class="text-red-500 text-sm">
                {{ getErrorMessage('step2', 'kemahiran') }}
            </p>
        </div>

        <div class="mb-5 flex flex-wrap mr-2">
            <input
                v-model="formData.aktiviti"
                @blur="markFieldTouched('step2', 'aktiviti')"
                placeholder="Aktiviti"
                :class="[
                    'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                    shouldShowError('step2', 'aktiviti') ? 'border-red-500' : 'border-gray-300',
                ]"
            />
            <p v-if="shouldShowError('step2', 'aktiviti')" class="text-red-500 text-sm">
                {{ getErrorMessage('step2', 'aktiviti') }}
            </p>
        </div>


        <div class="mb-5 flex flex-wrap">
            <div class="flex-1 mr-2">
                <select
                    v-model="formData.institusi"
                    @blur="markFieldTouched('step2', 'institusi')"
                    :class="[
                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100 appearance-none',
                        shouldShowError('step2', 'institusi') ? 'border-red-500' : 'border-gray-300',
                    ]"
                    
                >
                <option disabled value="">Institusi</option>
                <option v-for="institusi in institusiList" :key="institusi.kod" :value="institusi.kod">{{
                        institusi.institusi }}
                    </option>
                </select>
                <p v-if="shouldShowError('step2', 'institusi')" class="text-red-400 text-sm mt-1">
                    {{ getErrorMessage('step2', 'institusi') }}
                </p>
            </div>
        </div>

        <div class="mb-5 flex flex-wrap">
            <div class="flex-1 mr-2">
                <input
                    v-model="formData.alamat_institusi"
                    @blur="markFieldTouched('step2', 'alamat_institusi')"
                    placeholder="Alamat Institusi"
                    
                    :class="[
                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100 mb-2',
                        shouldShowError('step2', 'alamat_institusi') ? 'border-red-500' : 'border-gray-300',
                    ]" 
                />
                <p v-if="shouldShowError('step2', 'alamat_institusi')" class="text-red-400 text-sm mt-1">
                    {{ getErrorMessage('step2', 'alamat_institusi') }}
                </p>
            </div>
        </div>

        <div class="mb-5 flex flex-wrap">
            <div class="flex-1 mr-2">
                <input
                    v-model="formData.alamat_institusi2"
                    @blur="markFieldTouched('step2', 'alamat_institusi2')"
                    placeholder=""
                    
                    :class="[
                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100 mb-2',
                        shouldShowError('step2', 'alamat_institusi2') ? 'border-red-500' : 'border-gray-300',
                    ]" 
                />
                <p v-if="shouldShowError('step2', 'alamat_institusi2')" class="text-red-400 text-sm mt-1">
                    {{ getErrorMessage('step2', 'alamat_institusi2') }}
                </p>
            </div>
        </div>

        <div class="mb-5 flex flex-wrap">
            <div class="flex-1 mr-2">
                <input
                    v-model="formData.alamat_institusi3"
                    @blur="markFieldTouched('step2', 'alamat_institusi3')"
                    placeholder=""
                    
                    :class="[
                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100 mb-2',
                        shouldShowError('step2', 'alamat_institusi3') ? 'border-red-500' : 'border-gray-300',
                    ]" 
                />
                <p v-if="shouldShowError('step2', 'alamat_institusi3')" class="text-red-400 text-sm mt-1">
                    {{ getErrorMessage('step2', 'alamat_institusi3') }}
                </p>
            </div>
        </div>

        <div class="mb-5 flex flex-wrap mr-2">
            <div class="flex-1 mr-2">
                <input
                    v-model="formData.poskod_institusi"
                    @blur="markFieldTouched('step2', 'poskod_institusi')"
                    placeholder="Poskod"
                    
                    :class="[
                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                        shouldShowError('step2', 'poskod_institusi') ? 'border-red-500' : 'border-gray-300',
                    ]"
                />
                <p v-if="shouldShowError('step2', 'poskod_institusi')" class="text-red-400 text-sm mt-1">
                    {{ getErrorMessage('step2', 'poskod_institusi') }}
                </p>
            </div>
            <div class="flex-1 mx-2">
                <input
                    v-model="formData.bandar_institusi"
                    @blur="markFieldTouched('step2', 'bandar_institusi')"
                    placeholder="Bandar"
                    
                    :class="[
                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                        shouldShowError('step2', 'bandar_institusi') ? 'border-red-500' : 'border-gray-300',
                    ]"
                />
                <p v-if="shouldShowError('step2', 'bandar_institusi')" class="text-red-400 text-sm mt-1">
                    {{ getErrorMessage('step2', 'bandar_institusi') }}
                </p>
            </div>
            <div class="flex-1 ml-2">
                <select 
                    v-model="formData.negeri_institusi" 
                    :class="[
                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100 appearance-none',
                        shouldShowError('step2', 'negeri_institusi') ? 'border-red-500' : 'border-gray-300',
                    ]"
                >
                    <option disabled value="">Negeri</option> 
                    <option v-for="negeri in negeriList" :key="negeri.kod_negeri" :value="negeri.kod_negeri">{{
                        negeri.negeri }}
                    </option>
                </select>
                <p v-if="shouldShowError('step2', 'negeri_institusi')" class="text-red-500 text-sm">
                    {{ getErrorMessage('step2', 'negeri_institusi') }}
                </p>
            </div>
        </div>

        <div :class="[
                'card border rounded-lg bg-gray-100 mr-2',
                shouldShowError('step2', 'transkrip_file') ? 'border-2 border-red-500' : 'border-gray-300 mb-5'
            ]">
            <div class="toolbar flex justify-between items-center bg-transparent rounded-md p-2 text-dark border-b-2 border-gray-300">
                <h2 class="toolbar-title text-md font-medium text-gray-700 py-1 pl-2">Transkrip</h2>
                <input
                    type="file"
                    id="document1"
                    ref="document1"
                    accept=".pdf"
                    @change="handleFileUpload('transkrip_file', $event)"
                    class="hidden"
                />
                <button
                    type="button"
                    @click="$refs.document1.click()"
                    class="upload-btn bg-transparent text-gray-700 font-medium text-dark"
                >
                    Upload
                </button>
            </div>

            <!-- Documents in Upload -->
            <ul class="list space-y-2">
                <li v-for="(item, index) in documentsForm3Files" :key="index" class="list-item flex justify-between items-center p-2 border-b border-gray-300">
                    <span class="pl-2">{{ item.file.name }}</span>
                    <button type="button" @click="removeUpload(index, 'transkrip_file')" class="delete-btn text-gray-500 hover:text-gray-700 pl-2">
                        <i class="fas fa-trash"></i> <!-- FontAwesome trash icon -->
                    </button>
                </li>
            </ul>
        </div>
        <p v-if="shouldShowError('step2', 'transkrip_file')" class="text-red-500 text-sm mb-4">
            {{ getErrorMessage('step2', 'transkrip_file') }}
        </p>

        <div :class="[
                'card border rounded-lg bg-gray-100 mr-2',
                shouldShowError('step2', 'surat_universiti_file') ? 'border-2 border-red-500' : 'border-gray-300 mb-5'
            ]">
            <div class="toolbar flex justify-between items-center bg-transparent rounded-md p-2 text-dark border-b-2 border-gray-300">
                <h2 class="toolbar-title text-md font-medium text-gray-700 py-1 pl-2">Surat Universiti</h2>
                <input
                    type="file"
                    id="document2"
                    ref="document2"
                    accept=".pdf"
                    @change="handleFileUpload('surat_universiti_file', $event)"
                    class="hidden"
                />
                <button
                    type="button"
                    @click="$refs.document2.click()"
                    class="upload-btn bg-transparent text-gray-700 font-medium text-dark"
                >
                    Upload
                </button>
            </div>

            <!-- Documents in Upload -->
            <ul class="list space-y-2">
                <li v-for="(item, index) in documentsForm4Files" :key="index" class="list-item flex justify-between items-center p-2 border-b border-gray-300">
                    <span class="pl-2">{{ item.file.name }}</span>
                    <button type="button" @click="removeUpload(index, 'surat_universiti_file')" class="delete-btn text-gray-500 hover:text-gray-700 pl-2">
                        <i class="fas fa-trash"></i> <!-- FontAwesome trash icon -->
                    </button>
                </li>
            </ul>
        </div>
        <p v-if="shouldShowError('step2', 'surat_universiti_file')" class="text-red-500 text-sm mb-4">
            {{ getErrorMessage('step2', 'surat_universiti_file') }}
        </p>

        <button type="button" @click="$emit('previous')" class="btn mt-2 mr-2 bg-gray-500 text-white px-4 py-2 rounded-md">Sebelum</button>
        <button type="button" @click="$emit('next')" class="btn mt-2  bg-indigo-500 text-white px-4 py-2 rounded-md">Seterusnya</button>

    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useFetchStates } from '@/composables/useFetchStates';

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
    documentsForm3Files:{
        type: Array,
        required: true
    },
    documentsForm4Files:{
        type: Array,
        required: true
    }
});

const institusiList = [
  { kod: "0903", institusi: "Universiti Malaysia Kelantan" },
  { kod: "0904", institusi: "Universiti Malaysia Pahang" },
  { kod: "0905", institusi: "Universiti Malaysia Perlis" },
  { kod: "0906", institusi: "Universiti Malaysia Sabah" },
  { kod: "0907", institusi: "Universiti Malaysia Sarawak" },
  { kod: "0908", institusi: "Universiti Malaysia Terengganu" },
];

const handleFileUpload = (field, event) => {
  const file = event.target.files[0];

  if (!file) {
    props.formData[field] = null;
    return;
  }

  props.formData[field] = file;
  
  const fileObject = { file };

  if (field === 'transkrip_file') {
    props.documentsForm3Files.splice(0, props.documentsForm3Files.length, fileObject);
} else {
    props.documentsForm4Files.splice(0, props.documentsForm4Files.length, fileObject);
  }

};

 const removeUpload = (index, field) => {
    if (field === 'transkrip_file') {
        props.documentsForm3Files.splice(index, 1);
    } else {
        props.documentsForm4Files.splice(index, 1);
    }
    props.formData[field] = null;
  }


const emit = defineEmits();

const { negeriList, fetchState, error } = useFetchStates();

onMounted(async () => {
    await fetchState();
});

</script>

<style scoped>
.input {
    @apply w-full border border-gray-300 p-2 rounded mb-2;
}
</style>
