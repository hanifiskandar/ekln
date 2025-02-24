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

                    <!-- Peringkat Pengajian -->
                    <div class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                        <dt class="text-sm font-medium leading-6 text-gray-900">Peringkat Pengajian</dt>
                        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <template v-if="canEdit">
                                <select
                                    v-model="application.peringkat_pengajian"
                                    @blur="markFieldTouched('step2', 'peringkat_pengajian')"
                                    :class="[
                                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100 appearance-none',
                                        shouldShowError('step2', 'peringkat_pengajian') ? 'border-red-500' : 'border-gray-300',
                                    ]" 
                                >
                                    <!-- <option disabled value="">Peringkat Pengajian</option> -->
                                    <option value="1">Sijil</option>
                                    <option value="2">Diploma</option>
                                    <option value="3">Ijazah</option>
                                </select>
                                <p v-if="shouldShowError('step2', 'peringkat_pengajian')" class="text-red-500 text-sm mb-1">
                                    {{ getErrorMessage('step2', 'peringkat_pengajian') }}
                                </p>
                            </template>
                            <template v-else>
                                {{ application.peringkat_pengajian == '1' ? 'Sijil' : (application.peringkat_pengajian == '2' ? 'Diploma' : 'Ijazah') }}
                            </template>
                        </dd>
                    </div>

                    <!-- Institusi -->
                    <div class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                        <dt class="text-sm font-medium leading-6 text-gray-900">Institusi</dt>
                        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <template v-if="canEdit">
                                <select
                                    v-model="application.kod"
                                    @blur="markFieldTouched('step2', 'kod')"
                                    :class="[
                                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100 appearance-none',
                                        shouldShowError('step2', 'kod') ? 'border-red-500' : 'border-gray-300',
                                    ]"    
                                >
                                    <option disabled value="">Institusi</option>
                                    <option v-for="institusi in institusiList" :key="institusi.kod" :value="institusi.kod">{{
                                        institusi.institusi }}
                                    </option>
                                </select>
                                <p v-if="shouldShowError('step2', 'kod')" class="text-red-500 text-sm mb-1">
                                    {{ getErrorMessage('step2', 'kod') }}
                                </p>
                            </template>
                            <template v-else>
                                {{ application.institusi }}
                            </template>
                        </dd>
                    </div>

                    <!-- Program -->
                    <div class="bg-gray-50 px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                        <dt class="text-sm font-medium leading-6 text-gray-900">Program</dt>
                        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <template v-if="canEdit">
                                <input v-model="application.program" 
                                    @blur="markFieldTouched('step2', 'program')"
                                    :class="[
                                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                                        shouldShowError('step2', 'program') ? 'border-red-500' : 'border-gray-300',
                                    ]"
                                    placeholder="Program" 
                                />
                                <p v-if="shouldShowError('step2', 'program')" class="text-red-500 text-sm mb-1">
                                    {{ getErrorMessage('step2', 'program') }}
                                </p>
                            </template>
                            <template v-else>
                                {{ application.program }}
                            </template>
                        </dd>
                    </div>

                    <!-- Bidang -->
                    <div class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                        <dt class="text-sm font-medium leading-6 text-gray-900">Bidang</dt>
                        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <template v-if="canEdit">
                                <select
                                    v-model="application.jurusan"
                                    @blur="markFieldTouched('step2', 'jurusan')"
                                    :class="[
                                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100 appearance-none',
                                        shouldShowError('step2', 'jurusan') ? 'border-red-500' : 'border-gray-300',
                                    ]"  
                                >
                                    <option value="Sains">Sains</option>
                                    <option value="Seni">Seni</option>
                                </select>
                                <p v-if="shouldShowError('step2', 'jurusan')" class="text-red-500 text-sm mb-1">
                                    {{ getErrorMessage('step2', 'jurusan') }}
                                </p>
                            </template>
                            <template v-else>
                                {{ application.jurusan }}
                            </template>
                        </dd>
                    </div>

                    <!-- Kemahiran -->
                    <div class="bg-gray-50 px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                        <dt class="text-sm font-medium leading-6 text-gray-900">Kemahiran</dt>
                        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <template v-if="canEdit">
                                <input v-model="application.kemahiran"
                                    @blur="markFieldTouched('step2', 'kemahiran')"
                                    :class="[
                                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                                        shouldShowError('step2', 'kemahiran') ? 'border-red-500' : 'border-gray-300',
                                    ]"
                                    placeholder="Kemahiran" 
                                />
                                <p v-if="shouldShowError('step2', 'kemahiran')" class="text-red-500 text-sm mb-1">
                                    {{ getErrorMessage('step2', 'kemahiran') }}
                                </p>
                            </template>
                            <template v-else>
                                {{ application.kemahiran }}
                            </template>
                        </dd>
                    </div>

                    <!-- Aktiviti -->
                    <div class="bg-gray-50 px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                        <dt class="text-sm font-medium leading-6 text-gray-900">Aktiviti</dt>
                        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <template v-if="canEdit">
                                <input v-model="application.aktiviti"
                                    @blur="markFieldTouched('step2', 'aktiviti')"
                                    :class="[
                                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                                        shouldShowError('step2', 'aktiviti') ? 'border-red-500' : 'border-gray-300',
                                    ]"
                                    placeholder="Aktiviti" 
                                />
                                <p v-if="shouldShowError('step2', 'aktiviti')" class="text-red-500 text-sm mb-1">
                                    {{ getErrorMessage('step2', 'aktiviti') }}
                                </p>
                            </template>
                            <template v-else>
                                {{ application.aktiviti }}
                            </template>
                        </dd>
                    </div>

                    <!-- Alamat -->
                    <div class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                        <dt class="text-sm font-medium leading-6 text-gray-900">Alamat</dt>
                        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <template v-if="canEdit">
                                <input v-model="application.alamat_institusi" 
                                    @blur="markFieldTouched('step2', 'alamat_institusi')"
                                    :class="[
                                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                                        shouldShowError('step2', 'alamat_institusi') ? 'border-red-500' : 'border-gray-300 mb-4',
                                    ]"
                                    placeholder="Alamat 1"
                                />
                                <p v-if="shouldShowError('step2', 'alamat_institusi')" class="text-red-500 text-sm mb-1">
                                    {{ getErrorMessage('step2', 'alamat_institusi') }}
                                </p>
                                <input v-model="application.alamat_institusi2"
                                    @blur="markFieldTouched('step2', 'alamat_institusi2')"
                                    :class="[
                                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                                        shouldShowError('step2', 'alamat_institusi2') ? 'border-red-500' : 'border-gray-300 mb-4',
                                    ]"
                                    placeholder="Alamat 2"
                                />
                                <input v-model="application.alamat_institusi3"
                                    @blur="markFieldTouched('step2', 'alamat_institusi3')"
                                    :class="[
                                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                                        shouldShowError('step2', 'alamat_institusi3') ? 'border-red-500' : 'border-gray-300 mb-4',
                                    ]"
                                    placeholder="Alamat 3"
                                />
                                <p v-if="shouldShowError('step2', 'alamat_institusi3')" class="text-red-500 text-sm mb-1">
                                    {{ getErrorMessage('step2', 'alamat_institusi3') }}
                                </p>
                                <input v-model="application.poskod_institusi" 
                                    @blur="markFieldTouched('step2', 'poskod_institusi')"
                                    :class="[
                                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                                        shouldShowError('step2', 'poskod_institusi') ? 'border-red-500' : 'border-gray-300 mb-4',
                                    ]"
                                    placeholder="Poskod"
                                />
                                <p v-if="shouldShowError('step2', 'poskod_institusi')" class="text-red-500 text-sm mb-1">
                                    {{ getErrorMessage('step2', 'poskod_institusi') }}
                                </p>
                                <input v-model="application.bandar_institusi" 
                                    @blur="markFieldTouched('step2', 'bandar_institusi')"
                                    :class="[
                                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                                        shouldShowError('step2', 'bandar_institusi') ? 'border-red-500' : 'border-gray-300 mb-4',
                                    ]"
                                    placeholder="Bandar"
                                />
                                <p v-if="shouldShowError('step2', 'bandar_institusi')" class="text-red-500 text-sm mb-1">
                                    {{ getErrorMessage('step2', 'bandar_institusi') }}
                                </p>
                                <select 
                                    v-model="application.negeri_institusi" 
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
                                <p v-if="shouldShowError('step2', 'negeri_institusi')" class="text-red-500 text-sm mb-1">
                                    {{ getErrorMessage('step2', 'negeri_institusi') }}
                                </p>
                            </template>
                            <template v-else>
                                {{ application.alamat_institusi }} {{ application.alamat_institusi2 }} {{ application.alamat_institusi3 }} {{ application.poskod_institusi }} {{
                                    application.bandar_institusi }} {{ application.negeri_institusi }}
                            </template>
                        </dd>
                    </div>

                    <!-- Transkrip -->
                    <div class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                        <dt class="text-sm font-medium leading-6 text-gray-900">Transkrip</dt>
                        <dd class="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            <!-- Editable Section -->
                            <template v-if="canEdit">
                                <div :class="[
                                    'border rounded-lg bg-gray-100',
                                    shouldShowError('step1', 'transkrip_file') ? 'border-2 border-red-500' : 'border-gray-300'
                                ]">
                                    <div
                                        class="toolbar flex justify-between items-center bg-transparent rounded-md p-2 text-dark border-b-2 border-gray-300">
                                        <h2 class="toolbar-title text-md font-medium text-gray-700 py-1 pl-2">Upload
                                            Transkrip</h2>
                                        <input type="file" id="document1" ref="document1"
                                            @change="handleFileUpload('transkrip_file', $event)" class="hidden" />
                                        <button type="button" @click="$refs.document1.click()"
                                            class="upload-btn bg-transparent text-gray-700 font-medium text-dark">
                                            Upload
                                        </button>
                                    </div>

                                    <!-- Current File -->
                                    <template v-if="application.transkrip">
                                        <ul role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200">
                                            <li class="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                                                <div class="flex w-0 flex-1 items-center">
                                                <PaperClipIcon class="h-5 w-5 flex-shrink-0 text-gray-400"
                                                    aria-hidden="true" />
                                                <div class="ml-4 flex min-w-0 flex-1 gap-2">
                                                    <a :href="application.transkrip" target="_blank">
                                                        {{ getFilename(application.transkrip) }}
                                                    </a>
                                                </div>
                                                </div>
                                                <button type="button" @click="removeExistingFile('transkrip')" 
                                                    class="text-gray-500 hover:text-gray-700 pl-2">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </li>
                                        </ul>
                                    </template>

                                    <!-- Uploaded File List -->
                                    <ul role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200">
                                        <li v-for="(item, index) in documentsForm3Files" :key="index"
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
                                            <button type="button" @click="removeUpload(index, 'transkrip_file')"
                                                class="delete-btn text-gray-500 hover:text-gray-700 pl-2">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </li>
                                    </ul>

                                    <p v-if="shouldShowError('step1', 'transkrip_file')" class="text-red-500 text-sm mb-4">
                                        {{ getErrorMessage('step1', 'transkrip_file') }}
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
                                                <span class="truncate font-medium">{{ getFilename(application.transkrip)
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

                    <!-- Surat Universiti -->
                    <div class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                        <dt class="text-sm font-medium leading-6 text-gray-900">Surat Universiti</dt>
                        <dd class="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            <!-- Editable Section -->
                            <template v-if="canEdit">
                                <div :class="[
                                    'border rounded-lg bg-gray-100',
                                    shouldShowError('step1', 'surat_universiti_file') ? 'border-2 border-red-500' : 'border-gray-300'
                                ]">
                                    <div
                                        class="toolbar flex justify-between items-center bg-transparent rounded-md p-2 text-dark border-b-2 border-gray-300">
                                        <h2 class="toolbar-title text-md font-medium text-gray-700 py-1 pl-2">Upload
                                            Surat Universiti</h2>
                                        <input type="file" id="document2" ref="document2"
                                            @change="handleFileUpload('surat_universiti_file', $event)" class="hidden" />
                                        <button type="button" @click="$refs.document2.click()"
                                            class="upload-btn bg-transparent text-gray-700 font-medium text-dark">
                                            Upload
                                        </button>
                                    </div>

                                    <!-- Current File -->
                                    <template v-if="application.surat_universiti">
                                        <ul role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200">
                                            <li class="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                                                <div class="flex w-0 flex-1 items-center">
                                                <PaperClipIcon class="h-5 w-5 flex-shrink-0 text-gray-400"
                                                    aria-hidden="true" />
                                                <div class="ml-4 flex min-w-0 flex-1 gap-2">
                                                    <a :href="application.surat_universiti" target="_blank">
                                                        {{ getFilename(application.surat_universiti) }}
                                                    </a>
                                                </div>
                                                </div>
                                                <button type="button" @click="removeExistingFile('surat_universiti')" 
                                                    class="text-gray-500 hover:text-gray-700 pl-2">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </li>
                                        </ul>
                                    </template>


                                    <!-- Uploaded File List -->
                                    <ul role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200">
                                        <li v-for="(item, index) in documentsForm4Files" :key="index"
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
                                            <button type="button" @click="removeUpload(index, 'surat_universiti_file')"
                                                class="delete-btn text-gray-500 hover:text-gray-700 pl-2">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </li>
                                    </ul>

                                    <p v-if="shouldShowError('step1', 'surat_universiti_file')" class="text-red-500 text-sm mb-4">
                                        {{ getErrorMessage('step1', 'surat_universiti_file') }}
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
                                                <span class="truncate font-medium">{{ getFilename(application.surat_universiti)
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
const documentsForm3Files = ref([]);
const documentsForm4Files = ref([]);
const { negeriList, fetchState, error } = useFetchStates();

onMounted(async () => {
    await fetchState();
});

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

    const oldField = field.endsWith('_file') ? field.replace('_file', '') : field;

    if (!file) {
        props.application[field] = null;
        return;
    }

    props.application[field] = file;

    const fileObject = { file };

    if (field === 'transkrip_file') {
        documentsForm3Files.value.splice(0, documentsForm3Files.value.length, fileObject);

    } else {
        documentsForm4Files.value.splice(0, documentsForm4Files.value.length, fileObject);
    }

};

const removeUpload = (index, field) => {
    if (field === 'transkrip_file') {
        documentsForm3Files.value.splice(index, 1);
    } else {
        documentsForm4Files.value.splice(index, 1);
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

</script>
