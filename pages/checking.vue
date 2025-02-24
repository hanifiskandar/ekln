<template>
  <div class="mt-10">
    <div class="flex flex-col items-center h-full mt-3 px-4">
      <LandingContainer>
        <LandingSectionhead>
          <template v-slot:title>Semak Permohonan Pelajar</template>
          <template v-slot:desc>
            Halaman ini membolehkan anda menyemak status permohonan pelajar. Masukkan No. Kad Pengenalan dan PIN untuk melihat maklumat permohonan serta status kelulusan.
          </template>
        </LandingSectionhead>

        <!-- No. Kad Pengenalan (nokp) -->
        <div class="my-4">
          <input
            v-model="form.nokp"
            @blur="markFieldTouched('nokp')"
            :class="[
              'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
              shouldShowError('nokp') ? 'border-red-500' : 'border-gray-300 mb-4',
            ]"
            placeholder="Masukkan No. Kad Pengenalan"
          />
          <p v-if="shouldShowError('nokp')" class="text-red-500 text-sm mb-1">
            {{ getErrorMessage('nokp') }}
          </p>
        </div>

        <!-- PIN Input -->
        <div class="mb-4">
          <input
            type="password"
            v-model="form.pin"
            @blur="markFieldTouched('pin')"
            :class="[
              'w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100',
              shouldShowError('pin') ? 'border-red-500' : 'border-gray-300 mb-4',
            ]"
            placeholder="Masukkan Pin"
          />
          <p v-if="shouldShowError('pin')" class="text-red-500 text-sm mb-1">
            {{ getErrorMessage('pin') }}
          </p>
        </div>

        <!-- Button -->
        <button
          class="w-full py-3 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all"
          @click="checkUserApplication"
        >
          Semak
        </button>

        <!-- Result Display -->
        <div v-if="application && errorMessage == ''" class="relative mt-8 p-6 border border-gray-200 rounded-lg shadow-md">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Maklumat Ditemui</h2>
          <div class="flex">
            <div class="w-40 h-40 overflow-hidden rounded-md flex-shrink-0">
              <img :src="application.image" :alt="application.nama" class="object-cover w-full h-full" loading="lazy" />
            </div>
            <div class="flex flex-col justify-between ml-4 flex-grow">
              <div>
                <h3 class="text-lg font-bold text-gray-800">{{ application.nama }}</h3>
                <p class="text-sm text-gray-500">{{ application.nokp }}</p>
                <p class="text-sm text-gray-500">{{ application.bangsa }}</p>
                <p class="text-sm text-gray-500">{{ application.agama }}</p>
                <p class="text-sm text-gray-500 mt-1"><strong>Institusi:</strong> {{ application.institusi }}</p>
                <p class="text-sm text-gray-500"><strong>Program:</strong> {{ application.program }}</p>
              </div>
              <div>
                  <span :class="statusClasses(application.status)" class="px-3 py-1 rounded-full font-medium">
                      {{ getStatusLabel(application.status) }}
                  </span>
              </div>
            </div>
          </div>
          
          <!-- Buttons at Bottom Right -->
          <div v-if="application.status == STATUS.Interview || application.status == STATUS.Offer" class="absolute bottom-4 right-4 flex space-x-4">
            <button
              class="py-2 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all"
              @click="submitUserApproval('accept')"
            >
              Terima
            </button>
            <button
              class="py-2 px-4 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all"
              @click="submitUserApproval('reject')"
            >
              Tolak
            </button>
          </div>
        </div>

        <div v-else>
          <p class="pt-2 text-sm text-red-500">{{ errorMessage }}</p>
        </div>
      </LandingContainer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import useValidation from "@/composables/useValidation";
import { STATUS } from '@/constants/status';


definePageMeta({
    layout: "landing",
    path: "/semak-permohonan",
});

const {
  form,
  touchedFields,
  errors,
  markFieldTouched,
  shouldShowError,
  getErrorMessage,
  validateAll,
} = useValidation(
  {
    nokp: "",
    pin: "",
  },
  {
    nokp: (value) => (!value ? "No. Kad Pengenalan diperlukan" : ""),
    pin: (value) => (!value ? "PIN diperlukan" : ""),
  }
);


const errorMessage = ref('');

const application = ref(null);


const checkUserApplication = async () => {
  
  Object.keys(form).forEach(markFieldTouched);

  if (!validateAll()) {
    return;
  }

  try {
      const response = await $fetch('/api/internship/application/check-application', {
          params: {
              nokp: form.nokp,
              pin: form.pin,
          },
      });
      
      if(response.data){
        application.value = response.data;
        errorMessage.value = "";
      }
      else
      {
        application.value = null;
        errorMessage.value = "Rekod bagi maklumat yang dimasukkan tidak ditemui dalam sistem.";
      }

  } catch (error) {
      
      console.error('Error fetching applications list:', error);
  } 

};

const submitUserApproval = async (action) => {
  try {
    // Send the update to the backend
    const response = await $fetch(`/api/internship/application/user-approval`, {
      method: 'PATCH',
      body: { id: application.id, action: action }, // 'accept' or 'reject'
    });

    application.value = response.data;
    console.log(`User approval (${action}) updated successfully`);
    
  } catch (error) {
    console.error(`Error during ${action} of application:`, error);
  }
};

const getStatusLabel = (status) => statusMap[status] || 'Unknown';

const statusMap = {
  [STATUS.New]: 'Baru',
  [STATUS.ScreeningApproved]: 'Lulus Tapisan',
  [STATUS.Interview]: 'Temuduga',
  [STATUS.InterviewAccepted]: 'Temuduga Diterima',
  [STATUS.InterviewRejected]: 'Temuduga Ditolak',
  [STATUS.Offer]: 'Tawaran',
  [STATUS.OfferAccepted]: 'Tawaran Diterima',
  [STATUS.OfferRejected]: 'Tawaran Ditolak',
  [STATUS.Present]: 'Hadir',
  [STATUS.Absent]: 'Tidak Hadir',
  [STATUS.ApplicationRejected]: 'Permohonan Ditolak',
};

const statusClasses = (status) => {
  switch (status) {
    case STATUS.New: return 'bg-gray-600 text-white text-xs';
    case STATUS.ScreeningApproved: return 'bg-blue-600 text-white text-xs';
    case STATUS.Interview: return 'bg-blue-800 text-white text-xs';
    case STATUS.InterviewAccepted: return 'bg-yellow-600 text-white text-xs';
    case STATUS.InterviewRejected: return 'bg-green-600 text-white text-xs';
    case STATUS.Offer: return 'bg-yellow-500 text-white text-xs';
    case STATUS.OfferAccepted: return 'bg-green-500 text-white text-xs';
    case STATUS.OfferRejected: return 'bg-red-500 text-white text-xs';
    case STATUS.Present: return 'bg-blue-400 text-white text-xs';
    case STATUS.Absent: return 'bg-red-400 text-white text-xs';
    case STATUS.ApplicationRejected: return 'bg-red-600 text-white text-xs';
    default: return 'bg-gray-500 text-white text-xs';
  }
};

// Function to submit data (example functionality)
const submitData = () => {
  alert('Data submitted successfully!');
};
  
// Function to close the result display
const closeResult = () => {
  application.value = false;
  nokp.value = "";
  pin.value = "";
};


</script>
