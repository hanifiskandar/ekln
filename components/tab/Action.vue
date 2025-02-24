<template>
    <div>
        <form @submit.prevent="saveChanges">
            <div class="mt-1 border-t border-gray-100">
                <dl class="divide-y divide-gray-100" v-if="canEdit">
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

                    <!-- Tindakan -->
                    <div class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                        <dt class="text-sm font-medium leading-6 text-gray-900">Tindakan</dt>
                        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            <template v-if="canEdit">
                               <select
                                    v-model="application.tindakan"
                                    :class="[
                                        'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100 appearance-none border-gray-300',
                                    ]"
                                >
                                    <option value="accept">Terima</option>
                                    <option value="reject">Tolak</option>      
                                </select>
                            </template>
                        </dd>
                    </div>

                    <!-- Accept -->
                    <div v-if="application.tindakan == 'accept' && application.status != STATUS.New">
                        <div class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Cadangan Penempatan</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                <template v-if="canEdit">
                                <select
                                        v-model="application.penempatan_cadangan"
                                        @blur="markFieldTouched('step6', 'penempatan_cadangan')"
                                        :class="[
                                            'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100 appearance-none',
                                            shouldShowError('step6', 'penempatan_cadangan') ? 'border-red-500' : 'border-gray-300',
                                        ]" 
                                    >
                                        <option value="Pejabat Menteri">Pejabat Menteri</option>
                                        <option value="Bahagian Pengurusan Maklumat">Bahagian Pengurusan Maklumat</option>
                                        <option value="Bahagian Khidmat Pengurusan">Bahagian Khidmat Pengurusan</option>
                                        <option value="Bahagian Kewangan">Bahagian Kewangan</option>
                                        <option value="Bahagian Pengurusan Sumber Manusia">Bahagian Pengurusan Sumber Manusia</option>
                                    </select>
                                    <p v-if="shouldShowError('step6', 'penempatan_cadangan')" class="text-red-500 text-sm mb-1">
                                        {{ getErrorMessage('step6', 'penempatan_cadangan') }}
                                    </p>
                                </template>
                            </dd>
                        </div>

                        <div class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Ketua Bahagian</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                <ul class="list-disc list-inside space-y-2 pl-0">
                                    <li
                                        v-for="head in headDepartment"
                                        :key="head.id"
                                        class="flex justify-start items-center py-2 rounded-md"
                                    >
                                        <span class="font-semibold pr-2">{{ head.name }}</span> 
                                        <span class="text-gray-500 text-sm">({{ head.email }})</span>
                                    </li>
                                </ul>
                            </dd>
                        </div>

                        <div class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Elaun</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                <template v-if="canEdit">
                                <select
                                        v-model="application.elaun"
                                        @blur="markFieldTouched('step6', 'elaun')"
                                        :class="[
                                            'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100 appearance-none',
                                            shouldShowError('step6', 'elaun') ? 'border-red-500' : 'border-gray-300',
                                        ]" 
                                    >
                                        <option disabled value="">Silih Pilih</option>
                                        <option value="0">Tanpa Kemudahan Elaun</option>
                                        <option value="1">Dengan Kemudahan Elaun</option>
                                        <option value="2">Tanpa Kemudahan Elaun (Tajaan)</option>
                                    </select>
                                    <p v-if="shouldShowError('step6', 'elaun')" class="text-red-500 text-sm mb-1">
                                        {{ getErrorMessage('step6', 'elaun') }}
                                    </p>
                                </template>
                            </dd>
                        </div>

                        <div class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Tempoh Penempatan</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                <template v-if="canEdit">
                                    <input v-model="application.tempoh_penempatan"
                                        @blur="markFieldTouched('step6', 'tempoh_penempatan')" 
                                        :class="[
                                            'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                                            shouldShowError('step6', 'tempoh_penempatan') ? 'border-red-500' : 'border-gray-300',
                                        ]"
                                        placeholder="Tempoh Penempatan" 
                                    />
                                    <p v-if="shouldShowError('step6', 'tempoh_penempatan')" class="text-red-500 text-sm">
                                        {{ getErrorMessage('step6', 'tempoh_penempatan') }}
                                    </p>
                                </template>
                            </dd>
                        </div>

                        <div class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Kadar Elaun</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                <template v-if="canEdit">
                                    <input v-model="application.kadar_elaun"
                                        @blur="markFieldTouched('step6', 'kadar_elaun')" 
                                        :class="[
                                            'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                                            shouldShowError('step6', 'kadar_elaun') ? 'border-red-500' : 'border-gray-300',
                                        ]"
                                        placeholder="Kadar Elaun" 
                                    />
                                    <p v-if="shouldShowError('step6', 'kadar_elaun')" class="text-red-500 text-sm">
                                        {{ getErrorMessage('step6', 'kadar_elaun') }}
                                    </p>
                                </template>
                            </dd>
                        </div>

                        <div class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Jumlah Elaun</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                <template v-if="canEdit">
                                    <input v-model="application.amaun_elaun"
                                        @blur="markFieldTouched('step6', 'amaun_elaun')" 
                                        :class="[
                                            'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                                            shouldShowError('step6', 'amaun_elaun') ? 'border-red-500' : 'border-gray-300',
                                        ]"
                                        placeholder="Jumlah Elaun" 
                                    />
                                    <p v-if="shouldShowError('step6', 'amaun_elaun')" class="text-red-500 text-sm">
                                        {{ getErrorMessage('step6', 'amaun_elaun') }}
                                    </p>
                                </template>
                            </dd>
                        </div>

                        <!-- Rujukan Surat-->
                        <div class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Rujukan Surat</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                <template v-if="canEdit">
                                    <div class="flex flex-row space-x-2">
                                        <div class="flex-1">
                                            <input 
                                                v-model="application.ruj_surat"
                                                @blur="markFieldTouched('step6', 'ruj_surat')"
                                                :class="[
                                                    'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                                                    shouldShowError('step6', 'ruj_surat') ? 'border-red-500' : 'border-gray-300 mb-1',
                                                ]"
                                                placeholder="Ruj Surat"
                                            />
                                            <p v-if="shouldShowError('step6', 'ruj_surat')" class="text-red-500 text-sm mt-1">
                                                {{ getErrorMessage('step6', 'ruj_surat') }}
                                            </p>
                                        </div>

                                        <div class="flex-1">
                                            <input 
                                                v-model="application.jilid"
                                                @blur="markFieldTouched('step6', 'jilid')"
                                                :class="[
                                                    'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                                                    shouldShowError('step6', 'jilid') ? 'border-red-500' : 'border-gray-300 mb-1',
                                                ]"
                                                placeholder="JLD"
                                            />
                                            <p v-if="shouldShowError('step6', 'jilid')" class="text-red-500 text-sm mt-1">
                                                {{ getErrorMessage('step6', 'jilid') }}
                                            </p>
                                        </div>

                                        <div class="flex-1">
                                            <input 
                                                v-model="application.bil"
                                                @blur="markFieldTouched('step6', 'bil')"
                                                :class="[
                                                    'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                                                    shouldShowError('step6', 'bil') ? 'border-red-500' : 'border-gray-300 mb-1',
                                                ]"
                                                placeholder="BIL"
                                            />
                                            <p v-if="shouldShowError('step6', 'bil')" class="text-red-500 text-sm mt-1">
                                                {{ getErrorMessage('step6', 'bil') }}
                                            </p>
                                        </div>
                                    </div>
                                </template>
                            </dd>
                        </div>
                        
                        <div class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Tarikh Surat</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                <template v-if="canEdit">
                                    <input
                                        type="date"
                                        v-model="application.tkh_surat"
                                        @blur="markFieldTouched('step6', 'tkh_surat')"
                                        :class="[
                                            'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                                            shouldShowError('step6', 'tkh_surat') ? 'border-red-500' : 'border-gray-300',
                                        ]"
                                    />
                                    <p v-if="shouldShowError('step6', 'tkh_surat')" class="text-red-500 text-sm">
                                        {{ getErrorMessage('step6', 'tkh_surat') }}
                                    </p>
                                </template>
                            </dd>
                        </div>
                        <div class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Nama Pelulus</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                <template v-if="canEdit">
                                    <select
                                        v-model="application.nama_pelulus"
                                        @blur="markFieldTouched('step6', 'nama_pelulus')"
                                        :class="[
                                            'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100 appearance-none',
                                            shouldShowError('step6', 'nama_pelulus') ? 'border-red-500' : 'border-gray-300',
                                        ]" 
                                    >
                                        <option value="Nur Hamizah Bt Mahat">Nur Hamizah Bt Mahat</option>
                                        <option value="Megat Bin Ismail">Megat Bin Ismail</option>
                                        <option value="Nur Syahirah Bt Yakup">Nur Syahirah Bt Yakup</option>
                                    </select>
                                    <p v-if="shouldShowError('step6', 'nama_pelulus')" class="text-red-500 text-sm mb-1">
                                        {{ getErrorMessage('step6', 'nama_pelulus') }}
                                    </p>
                                </template>
                            </dd>
                        </div>
                    </div>

                    <!-- Reject -->
                    <div v-if="application.tindakan == 'reject'">
                        <div class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Alasan Tolak</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                <template v-if="canEdit">
                                    <select
                                        v-model="application.alasan"
                                        @blur="markFieldTouched('step6', 'alasan')"
                                        :class="[
                                            'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100 appearance-none',
                                            shouldShowError('step6', 'alasan') ? 'border-red-500' : 'border-gray-300',
                                        ]" 
                                    >
                                        <option value="Kuota Penuh">Kuota Penuh</option>
                                        <option value="Bidang Pengajian Tidak Sesuai">Bidang Pengajian Tidak Sesuai</option>
                                        <option value="Dokumen Tidak Lengkap">Dokumen Tidak Lengkap</option>
                                        <option value="Tidak Mematuhi Syarat Surat">Tidak Mematuhi Syarat Surat</option>
                                        <option value="Tidak Mematuhi Syarat">Tidak Mematuhi Syarat</option>
                                        <option value="Tiada Peruntukan">Tiada Peruntukan</option>
                                        <option value="Bidang Pengajian Di JKR">Bidang Pengajian Di JKR</option>
                                        
                                    </select>
                                    <p v-if="shouldShowError('step6', 'alasan')" class="text-red-500 text-sm mb-1">
                                        {{ getErrorMessage('step6', 'alasan') }}
                                    </p>
                                </template>
                            </dd>
                        </div>

                        <!-- Senarai Dokumen Tidak Lengkap -->
                        <div v-if="application.alasan && (application.alasan != 'Kuota Penuh' && application.alasan != 'Bidang Pengajian Di JKR') && [STATUS.New].includes(application.status)" class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Senarai Dokumen Tidak Lengkap</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                <template v-if="canEdit">
                                    <div class="flex flex-col space-y-2">
                                        <label class="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                v-model="application.doktaklengkap_resume"
                                                class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            />
                                            <span class="text-sm text-gray-700">No Resume</span>                                       
                                        </label>
                                        <label class="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                v-model="application.doktaklengkap_transkrip"
                                                class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            />
                                            <span class="text-sm text-gray-700">No Transkrip</span>
                                        </label>

                                        <label class="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                v-model="application.doktaklengkap_suratuni"
                                                class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            />
                                            <span class="text-sm text-gray-700">Surat Universiti</span>
                                        </label>
                                    </div>
                                </template>
                            </dd>
                        </div>
                        
                        <!-- Rujukan Surat-->
                        <div v-if="application.alasan && (application.alasan != 'Kuota Penuh' && application.alasan != 'Bidang Pengajian Di JKR') && [STATUS.New,STATUS.ScreeningApproved,STATUS.InterviewAccepted].includes(application.status)" class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Rujukan Surat</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                <template v-if="canEdit">
                                    <div class="flex flex-row space-x-2">
                                        <div class="flex-1">
                                            <input 
                                                v-model="application.ruj_surat"
                                                @blur="markFieldTouched('step6', 'ruj_surat')"
                                                :class="[
                                                    'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                                                    shouldShowError('step6', 'ruj_surat') ? 'border-red-500' : 'border-gray-300 mb-1',
                                                ]"
                                                placeholder="Ruj Surat"
                                            />
                                            <p v-if="shouldShowError('step6', 'ruj_surat')" class="text-red-500 text-sm mt-1">
                                                {{ getErrorMessage('step6', 'ruj_surat') }}
                                            </p>
                                        </div>

                                        <div class="flex-1">
                                            <input 
                                                v-model="application.jilid"
                                                @blur="markFieldTouched('step6', 'jilid')"
                                                :class="[
                                                    'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                                                    shouldShowError('step6', 'jilid') ? 'border-red-500' : 'border-gray-300 mb-1',
                                                ]"
                                                placeholder="JLD"
                                            />
                                            <p v-if="shouldShowError('step6', 'jilid')" class="text-red-500 text-sm mt-1">
                                                {{ getErrorMessage('step6', 'jilid') }}
                                            </p>
                                        </div>

                                        <div class="flex-1">
                                            <input 
                                                v-model="application.bil"
                                                @blur="markFieldTouched('step6', 'bil')"
                                                :class="[
                                                    'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                                                    shouldShowError('step6', 'bil') ? 'border-red-500' : 'border-gray-300 mb-1',
                                                ]"
                                                placeholder="BIL"
                                            />
                                            <p v-if="shouldShowError('step6', 'bil')" class="text-red-500 text-sm mt-1">
                                                {{ getErrorMessage('step6', 'bil') }}
                                            </p>
                                        </div>
                                    </div>
                                </template>
                            </dd>
                            <dt class="text-sm font-medium leading-6 text-gray-900">Tarikh Surat</dt>
                                <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    <template v-if="canEdit">
                                        <input
                                            type="date"
                                            v-model="application.tkh_surat"
                                            @blur="markFieldTouched('step6', 'tkh_surat')"
                                            :class="[
                                                'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                                                shouldShowError('step6', 'tkh_surat') ? 'border-red-500' : 'border-gray-300',
                                            ]"
                                        />
                                        <p v-if="shouldShowError('step6', 'tkh_surat')" class="text-red-500 text-sm">
                                            {{ getErrorMessage('step6', 'tkh_surat') }}
                                        </p>
                                    </template>
                                </dd>
                        </div>

                        <!-- If status Terima Semakan -->

                        <!-- Rujukan Surat-->
                        <!-- <div v-if="application.alasan && (application.alasan != 'Tiada Peruntukan' && application.alasan != 'Bidang Pengajian Di JKR') && [STATUS.Interview].includes(application.status)" class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Rujukan Surat</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                <template v-if="canEdit">
                                    <div class="flex flex-row space-x-2">
                                        <div class="flex-1">
                                            <input 
                                                v-model="application.ruj_surat"
                                                @blur="markFieldTouched('step6', 'ruj_surat')"
                                                :class="[
                                                    'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                                                    shouldShowError('step6', 'ruj_surat') ? 'border-red-500' : 'border-gray-300 mb-1',
                                                ]"
                                                placeholder="Ruj Surat"
                                            />
                                            <p v-if="shouldShowError('step6', 'ruj_surat')" class="text-red-500 text-sm mt-1">
                                                {{ getErrorMessage('step6', 'ruj_surat') }}
                                            </p>
                                        </div>

                                        <div class="flex-1">
                                            <input 
                                                v-model="application.jilid"
                                                @blur="markFieldTouched('step6', 'jilid')"
                                                :class="[
                                                    'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                                                    shouldShowError('step6', 'jilid') ? 'border-red-500' : 'border-gray-300 mb-1',
                                                ]"
                                                placeholder="JLD"
                                            />
                                            <p v-if="shouldShowError('step6', 'jilid')" class="text-red-500 text-sm mt-1">
                                                {{ getErrorMessage('step6', 'jilid') }}
                                            </p>
                                        </div>

                                        <div class="flex-1">
                                            <input 
                                                v-model="application.bil"
                                                @blur="markFieldTouched('step6', 'bil')"
                                                :class="[
                                                    'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                                                    shouldShowError('step6', 'bil') ? 'border-red-500' : 'border-gray-300 mb-1',
                                                ]"
                                                placeholder="BIL"
                                            />
                                            <p v-if="shouldShowError('step6', 'bil')" class="text-red-500 text-sm mt-1">
                                                {{ getErrorMessage('step6', 'bil') }}
                                            </p>
                                        </div>
                                    </div>
                                </template>
                            </dd>
                            <dt class="text-sm font-medium leading-6 text-gray-900">Tarikh Surat</dt>
                                <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    <template v-if="canEdit">
                                        <input
                                            type="date"
                                            v-model="application.tkh_surat"
                                            @blur="markFieldTouched('step6', 'tkh_surat')"
                                            :class="[
                                                'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
                                                shouldShowError('step6', 'tkh_surat') ? 'border-red-500' : 'border-gray-300',
                                            ]"
                                        />
                                        <p v-if="shouldShowError('step6', 'tkh_surat')" class="text-red-500 text-sm">
                                            {{ getErrorMessage('step6', 'tkh_surat') }}
                                        </p>
                                    </template>
                                </dd>
                        </div> -->

                    </div>
                </dl>
                <dl class="divide-y divide-gray-100" v-else>
                    <!-- Status -->
                    <div class="bg-gray-50 px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                        <dt class="text-sm font-medium leading-6 text-gray-900">                                
                            <span :class="{
                                    'bg-gray-600 text-white': application.status == STATUS.New, // Baru
                                    'bg-blue-600 text-white': application.status == STATUS.ScreeningApproved, // Sah
                                    'bg-blue-800 text-white': application.status == STATUS.Interview, // Terima Semakan
                                    'bg-yellow-600 text-white': application.status == STATUS.offer, // Cadangan
                                    'bg-green-600 text-white': application.status == STATUS.Accepted, // Terima
                                    'bg-red-600 text-white': application.status == STATUS.RejectedByKKR || application.status == STATUS.RejectedByStudent, // Tolak KKR / Tolak Pelajar
                                    'bg-gray-400 text-white': application.status == STATUS.Archived, // Arkib
                                    'bg-gray-800 text-white': application.status == STATUS.Deleted, // Hapus
                                }" class="px-2 py-1 mb-1 rounded-md font-semibold ">
                                        Status:  {{ getStatusLabel(application.status) }}
                            </span>
                        </dt>
                    </div>

                    <!-- Accept -->
                    <div>
                        <div v-if="application.penempatan_cadangan" class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Cadangan Penempatan</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                {{ application.penempatan_cadangan }}
                            </dd>
                        </div>

                        <div v-if="application.penempatan_cadangan" class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Ketua Bahagian</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                <ul class="list-disc list-inside space-y-2 pl-0">
                                    <li
                                        v-for="head in headDepartment"
                                        :key="head.id"
                                        class="flex justify-start items-center py-2 rounded-md"
                                    >
                                        <span class="font-semibold pr-2">{{ head.name }}</span> 
                                        <span class="text-gray-500 text-sm">({{ head.email }})</span>
                                    </li>
                                </ul>
                            </dd>
                        </div>

                        <div v-if="application.elaun" class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Elaun</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    {{ application.elaun }}
                            </dd>
                        </div>

                        <div v-if="application.tempoh_penempatan"class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Tempoh Penempatan</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    {{ application.tempoh_penempatan }}
                            </dd>
                        </div>

                        <div v-if="application.kadar_elaun" class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Kadar Elaun</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    {{ application.kadar_elaun }}
                            </dd>
                        </div>

                        <div v-if="application.amaun_elaun" class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Jumlah Elaun</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    {{ application.amaun_elaun }}
                            </dd>
                        </div>

                        <div v-if="application.nama_pelulus" class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Nama Pelulus</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    {{ application.nama_pelulus }}
                            </dd>
                        </div>
                    </div>

                    <!-- Reject -->
                    <div>
                        <div v-if="application.alasan" class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Alasan Tolak</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    {{ application.alasan }}
                            </dd>
                        </div>

                        <!-- Senarai Dokumen Tidak Lengkap -->
                        <div v-if="application.alasan" class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Senarai Dokumen Tidak Lengkap</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                <div class="flex flex-col space-y-2">
                                    <label class="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            :checked="application.doktaklengkap_resume ? true : false"
                                            class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            @click.prevent
                                        />
                                        <span class="text-sm text-gray-700">No Resume</span>
                                    </label>
                                    <label class="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            :checked="application.doktaklengkap_transkrip ? true : false"
                                            class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            @click.prevent
                                        />
                                        <span class="text-sm text-gray-700">No Transkrip</span>
                                    </label>
                                    <label class="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            :checked="application.doktaklengkap_suratuni ? true : false"
                                            class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            @click.prevent
                                        />
                                        <span class="text-sm text-gray-700">Surat Universiti</span>
                                    </label>
                                </div>
                            </dd>
                        </div>
                        
                        <!-- Rujukan Surat-->
                        <div v-if="application.ruj_surat"  class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Rujukan Surat</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    <div class="flex flex-row space-x-2">
                                        <div class="flex-1">
                                            {{ application.ruj_surat }} Jilid: {{ application.jilid }}  {{ application.bil }}
                                        </div>
                                    </div>
                            </dd>
                        </div>

                        <!-- Tarikh Surat-->
                        <div v-if="application.tkh_surat" class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Tarikh Surat</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    {{ application.tkh_surat }}
                            </dd>
                        </div>
                    </div>
                </dl>
            </div>

            <div class="flex flex-row-reverse mt-4">
                <button v-if="canEdit" type="submit" class="bg-green-600 text-white rounded-md px-4 py-2 mr-3">
                    Hantar
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { STATUS } from '@/constants/status';
import { PaperClipIcon } from '@heroicons/vue/20/solid';

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

const emit = defineEmits(['updateApplication','updateUnsavedMessage','handleApproval']);
const backupApplication = ref({ ...props.application }); // Backup copy
const selectedAction = ref('')

const headDepartment = ref([
  { id: 1, name: 'Alice Smith', email: 'Alice@gmail.com'},
  { id: 2, name: 'Bob Johnson', email: 'Bob@gmail.com'},
])

const canEdit = computed(() => {
    return [1,2,3,4].includes(props.application.status);
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

watch(() => props.application.status, (newStatus) => {

    if ((newStatus == "6" || newStatus == "7")) {
        props.application.tindakan = "reject";
    } else if ((newStatus == "4" || newStatus == "5")){
        props.application.tindakan = "accept";
    }
},
{ immediate: true }
);

watch(selectedAction, () => {
    Object.assign(props.application, backupApplication.value);
})

const saveChanges = () => {
    emit('handleApproval', { ...props.application });
};

</script>
