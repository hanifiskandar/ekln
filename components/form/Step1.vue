<template>
    <div class="pt-10">
        <h2 class="text-xl font-bold mb-4">Maklumat Peribadi</h2>
        <div class="mb-5 flex flex-wrap mr-2">
            <input
                v-model="formData.nama"
                @blur="markFieldTouched('step1', 'nama')"
                placeholder="Nama Penuh"
                :class="[
                    'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                    shouldShowError('step1', 'nama') ? 'border-red-500' : 'border-gray-300',
                ]"
            />
            <p v-if="shouldShowError('step1', 'nama')" class="text-red-500 text-sm">
                {{ getErrorMessage('step1', 'nama') }}
            </p>
        </div>
        <div class="mb-5 flex flex-wrap mr-2">
            <div class="flex-1 mr-2">
                <input
                    v-model="formData.nokp"
                    @blur="markFieldTouched('step1', 'nokp')"
                    id="nokp" 
                    placeholder="No. Kad Pengenalan"
                    :class="[
                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                        shouldShowError('step1', 'nokp') ? 'border-red-500' : 'border-gray-300',
                    ]"
                    @input="applyMaskNokp"
                />
                <p v-if="shouldShowError('step1', 'nokp')" class="text-red-500 text-sm">
                    {{ getErrorMessage('step1', 'nokp') }}
                </p>
            </div>
            <div class="flex-1 mx-2">
                <input
                    v-model="formData.email"
                    @blur="markFieldTouched('step1', 'email')"
                    placeholder="Email"
                    :class="[
                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                        shouldShowError('step1', 'email') ? 'border-red-500' : 'border-gray-300',
                    ]"
                />
                <p v-if="shouldShowError('step1', 'email')" class="text-red-500 text-sm">
                    {{ getErrorMessage('step1', 'email') }}
                </p>
            </div>
            <div class="flex-1 ml-2">
                <input
                    v-model="formData.telefon"
                    @blur="markFieldTouched('step1', 'telefon')"
                    placeholder="No. Telefon"
                    :class="[
                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                        shouldShowError('step1', 'telefon') ? 'border-red-500' : 'border-gray-300',
                    ]"
                />
                <p v-if="shouldShowError('step1', 'telefon')" class="text-red-500 text-sm">
                    {{ getErrorMessage('step1', 'telefon') }}
                </p>
            </div>
        </div>
        <div class="mb-5 flex flex-wrap mr-2">
            <div class="flex-1 mr-2">
                <select 
                    v-model="formData.jantina"
                    @blur="markFieldTouched('step1', 'jantina')" 
                    :class="[
                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100 appearance-none',
                        shouldShowError('step1', 'jantina') ? 'border-red-500' : 'border-gray-300',
                    ]"
                >
                    <option disabled value="">Jantina</option>
                    <option value="L">Lelaki</option>
                    <option value="P">Perempuan</option>
                </select>
                <p v-if="shouldShowError('step1', 'jantina')" class="text-red-500 text-sm">
                    {{ getErrorMessage('step1', 'jantina') }}
                </p>
            </div>
            <div class="flex-1 mx-2">
                <select 
                    v-model="formData.agama" 
                    :class="[
                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100 appearance-none',
                        shouldShowError('step1', 'agama') ? 'border-red-500' : 'border-gray-300',
                    ]"
                >
                    <option disabled value="">Agama</option>
                    <option value="Islam">Islam</option>
                    <option value="Kristian">Kristian</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Lain-lain">Lain-lain</option>
                </select>
                <p v-if="shouldShowError('step1', 'agama')" class="text-red-500 text-sm">
                    {{ getErrorMessage('step1', 'agama') }}
                </p>
            </div>
            <div class="flex-1 ml-2">
                <select 
                    v-model="formData.bangsa"
                    :class="[
                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100 appearance-none',
                        shouldShowError('step1', 'bangsa') ? 'border-red-500' : 'border-gray-300',
                    ]"
                >
                    <option disabled value="">Bangsa</option>
                    <option value="Melayu">Melayu</option>
                    <option value="Cina">Cina</option>
                    <option value="India">India</option>
                    <option value="Lain-lain">Lain-lain</option>
                </select>
                <p v-if="shouldShowError('step1', 'bangsa')" class="text-red-500 text-sm">
                    {{ getErrorMessage('step1', 'bangsa') }}
                </p>
            </div>
        </div>
        <div class="mb-5 flex flex-wrap mr-2" v-if="formData.agama == 'Lain-lain'">
                <input  v-model="formData.agama_lain" 
                    :class="[
                         'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100 appearance-none',
                         shouldShowError('step1', 'agama_lain') ? 'border-red-500' : 'border-gray-300',
                    ]" 
                    placeholder="Agama Lain"
                />
                <p v-if="shouldShowError('step1', 'agama_lain')" class="text-red-500 text-sm">
                    {{ getErrorMessage('step1', 'agama_lain') }}
                </p>
        </div>
        <div class="mb-5 flex flex-wrap mr-2" v-if="formData.bangsa == 'Lain-lain'">
                <input  v-model="formData.bangsa_lain" 
                    :class="[
                         'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100 appearance-none',
                         shouldShowError('step1', 'bangsa_lain') ? 'border-red-500' : 'border-gray-300',
                    ]" 
                    placeholder="Bangsa Lain"
                />
                <p v-if="shouldShowError('step1', 'bangsa_lain')" class="text-red-500 text-sm">
                    {{ getErrorMessage('step1', 'bangsa_lain') }}
                </p>
        </div>
        <div class="mb-5 flex flex-wrap mr-2">
            <input
                v-model="formData.alamat"
                @blur="markFieldTouched('step1', 'alamat')"
                placeholder="Alamat"
                :class="[
                    'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                    shouldShowError('step1', 'alamat') ? 'border-red-500' : 'border-gray-300',
                ]"
            />
            <p v-if="shouldShowError('step1', 'alamat')" class="text-red-500 text-sm">
                {{ getErrorMessage('step1', 'alamat') }}
            </p>
        </div>
        <div class="mb-5 flex flex-wrap mr-2">
            <input
                v-model="formData.alamat2"
                @blur="markFieldTouched('step1', 'alamat2')"
                placeholder=""
                :class="[
                    'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                    shouldShowError('step1', 'alamat2') ? 'border-red-500' : 'border-gray-300',
                ]"
            />
            <p v-if="shouldShowError('step1', 'alamat2')" class="text-red-500 text-sm">
                {{ getErrorMessage('step1', 'alamat2') }}
            </p>
        </div>
        <div class="mb-5 flex flex-wrap mr-2">
            <input
                v-model="formData.alamat3"
                @blur="markFieldTouched('step1', 'alamat3')"
                placeholder=""
                :class="[
                    'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                    shouldShowError('step1', 'alamat3') ? 'border-red-500' : 'border-gray-300',
                ]"
            />
            <p v-if="shouldShowError('step1', 'alamat3')" class="text-red-500 text-sm">
                {{ getErrorMessage('step1', 'alamat3') }}
            </p>
        </div>
        <div class="mb-5 flex flex-wrap mr-2">
            <div class="flex-1 mr-2">
                <input
                    v-model="formData.poskod"
                    @blur="markFieldTouched('step1', 'poskod')"
                    placeholder="Poskod"
                    :class="[
                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                        shouldShowError('step1', 'poskod') ? 'border-red-500' : 'border-gray-300',
                    ]"
                />
                <p v-if="shouldShowError('step1', 'poskod')" class="text-red-500 text-sm">
                    {{ getErrorMessage('step1', 'poskod') }}
                </p>
            </div>
            <div class="flex-1 mx-2">
                <input
                    v-model="formData.bandar"
                    @blur="markFieldTouched('step1', 'bandar')"
                    placeholder="Bandar"
                    :class="[
                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                        shouldShowError('step1', 'bandar') ? 'border-red-500' : 'border-gray-300',
                    ]"
                />
                <p v-if="shouldShowError('step1', 'bandar')" class="text-red-500 text-sm">
                    {{ getErrorMessage('step1', 'bandar') }}
                </p>
            </div>
            <div class="flex-1 ml-2">
                <select 
                    v-model="formData.negeri" 
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
                <div v-if="error">
                </div>
                <p v-if="shouldShowError('step1', 'negeri')" class="text-red-500 text-sm">
                    {{ getErrorMessage('step1', 'negeri') }}
                </p>
            </div>
        </div>
        <div :class="[
                'card border rounded-lg bg-gray-100 mr-2',
                shouldShowError('step1', 'image_file') ? 'border-2 border-red-500' : 'border-gray-300 mb-5'
            ]">
            <div class="toolbar flex justify-between items-center bg-transparent rounded-md p-2 text-dark border-b-2 border-gray-300">
                <h2 class="toolbar-title text-md font-medium text-gray-700 py-1 pl-2">Gambar</h2>
                <input
                    type="file"
                    id="document1"
                    ref="document1"
                    accept=".png, .jpeg, .jpg"
                    @change="handleFileUpload('image_file', $event)"
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
                <li v-for="(item, index) in documentsForm1Files" :key="index" class="list-item flex justify-between items-center p-2 border-b border-gray-300">
                    <span class="pl-2">{{ item.file.name }}</span>
                    <button type="button" @click="removeUpload(index, 'image_file')" class="delete-btn text-gray-500 hover:text-gray-700 pl-2">
                        <i class="fas fa-trash"></i> <!-- FontAwesome trash icon -->
                    </button>
                </li>
            </ul>
        </div>
        <p v-if="shouldShowError('step1', 'image_file')" class="text-red-500 text-sm mb-4">
            {{ getErrorMessage('step1', 'image_file') }}
        </p>


        <div :class="[
            'card border rounded-lg bg-gray-100 mr-2',
            shouldShowError('step1', 'resume_file') ? 'border-2 border-red-500' : 'border-gray-300 mb-5'
        ]">
            <div class="toolbar flex justify-between items-center bg-transparent rounded-md p-2 text-dark border-b-2 border-gray-300">
                    <h2 class="toolbar-title text-md font-medium text-gray-700 py-1 pl-2">Resume</h2>
                <input
                type="file"
                id="document2"
                ref="document2"
                accept=".pdf"
                @change="handleFileUpload('resume_file', $event)"
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
                <li v-for="(item, index) in documentsForm2Files" :key="index" class="list-item flex justify-between items-center p-2 border-b border-gray-300">
                <span class="pl-2">{{ item.file.name }}</span>
                <button type="button" @click="removeUpload(index, 'resume_file')" class="delete-btn text-gray-500 hover:text-gray-700 pl-2">
                    <i class="fas fa-trash"></i> <!-- FontAwesome trash icon -->
                </button>
                </li>
            </ul>
        </div>

        <p v-if="shouldShowError('step1', 'resume_file')" class="text-red-500 text-sm mb-4">
            {{ getErrorMessage('step1', 'resume_file') }}
        </p>


        <button type="button" @click="$emit('next')" class="btn mt-2  bg-indigo-500 text-white px-4 py-2 rounded-md">Seterusnya</button>

    </div>
</template>

<script setup>  
import { ref, onMounted, defineEmits } from 'vue';
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
    documentsForm1Files:{
        type: Array,
        required: true
    },
    documentsForm2Files:{
        type: Array,
        required: true
    }
});
const emit = defineEmits();

const { negeriList, fetchState, error } = useFetchStates();

onMounted(async () => {
    await fetchState();
});

const applyMaskNokp = (event) => {
    const rawInput = event.target.value.replace(/\D/g, ''); 
    let formattedValue = '';

    // Apply formatting
    if (rawInput.length > 0) {
        formattedValue = rawInput.slice(0, 6);
        if (rawInput.length > 6) {
            formattedValue += '-' + rawInput.slice(6, 8); 
        }
        if (rawInput.length > 8) {
            formattedValue += '-' + rawInput.slice(8, 12); 
        }
    }
    event.target.value = formattedValue;
    props.formData.nokp = formattedValue;
};

const handleFileUpload = (field, event) => {
  const file = event.target.files[0];

  if (!file) {
    props.formData[field] = null;
    return;
  }

  props.formData[field] = file;
  
  const fileObject = { file };

  if (field === 'image_file') {
    props.documentsForm1Files.splice(0, props.documentsForm1Files.length, fileObject);

} else {
    props.documentsForm2Files.splice(0, props.documentsForm2Files.length, fileObject);
  }

};

const removeUpload = (index, field) => {
    if (field === 'image_file') {
        props.documentsForm1Files.splice(index, 1);
    } else {
        props.documentsForm2Files.splice(index, 1);
    }
    props.formData[field] = null;
}


</script>

<style scoped>
input[type="file"] {
    padding: 0.5rem;
    height: 3.0rem; 
}

.input {
    @apply w-full border border-gray-300 p-2 rounded mb-2;
}

</style>
