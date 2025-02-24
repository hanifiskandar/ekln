 <template>
    <div v-if="isLoading" class="mt-20">
        <FormLoading :isLoading="isLoading" />
    </div>

    <div v-else class="flex items-center justify-center h-full mt-1">
        <LandingContainer>
            <LandingSectionhead>
                <template v-slot:title>Senarai Permohonan</template>
                <template v-slot:desc>
                    Senarai permohonan pelajar.
                </template>
            </LandingSectionhead>
            <!-- HERE SEARCH AND FILTER STATUS -->

            <div class="flex justify-center items-center mt-5">
                <!-- Search Field -->
                
                <div class="flex items-center space-x-2">
                    <input 
                        id="search" 
                        v-model="searchData" 
                        type="text" 
                        placeholder="Carian..." 
                        class="border border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500 w-full" 
                    />
                </div>

                <!-- Status Filter Dropdown -->
                <div class="flex items-center space-x-2 ml-2">
                    <select 
                        id="status" 
                        v-model="selectedStatus" 
                        class="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 ring-gray-100 appearance-none"
                    >
                        <option value="1">Baru</option>
                        <option value="2">Sah</option>
                        <option value="3">Terima Semakan</option>
                        <option value="4">Cadangan</option>
                        <option value="5">Terima</option>
                        <option value="6">Tolak KKR</option>
                        <option value="7">Tolak Pelajar</option>
                        <option value="8">Arkib</option>
                        <option value="9">Hapus</option>
                    </select>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                <div v-for="application in filteredApplications" :key="application.id"
                    class="border p-2 rounded shadow hover:shadow-lg transition-shadow flex flex-col"
                    @click="openModal(application)">
                    <div class="grid grid-cols-2 gap-4 flex-grow">
                        <div class="flex items-top justify-center sm:w-2/3">
                            <img :src="application.image" alt="Student Image"
                                class="h-full w-auto object-cover max-h-40 overflow-hidden" />
                        </div>
                        <div class="flex flex-col ml-[-40px]">
                            <h2 class="text-md font-semibold">{{ application.nama }}</h2>
                            <p class="text-gray-700 text-xs">{{ application.nokp }}</p>
                            <p class="text-gray-700 text-xs font-semibold mt-1">{{ application.institusi }}</p>
                            <p class="text-gray-700 text-xs">{{ application.program }}</p>

                            <div class="flex space-x-4 justify-start mb-4">
                                <a :href="application.resume" target="_blank"
                                    class="flex items-center text-gray-600 hover:text-blue-600 relative group mt-3">
                                    <i class="fas fa-file-invoice"></i>
                                    <span
                                        class="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Resume</span>
                                </a>
                                <a :href="application.transkrip" target="_blank"
                                    class="flex items-center text-gray-600 hover:text-blue-600 relative group mt-3">
                                    <i class="fas fa-file"></i>
                                    <span
                                        class="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Transkrip</span>
                                </a>
                                <a :href="application.surat_universiti" target="_blank"
                                    class="flex items-center text-gray-600 hover:text-blue-600 relative group mt-3">
                                    <i class="fas fa-file-alt"></i>
                                    <span
                                        class="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Surat
                                        Universiti</span>
                                </a>

                            </div>
                            <div>
                                <span :class="{
                                        'bg-gray-600 text-white text-xs': application.status == '1', // Baru
                                        'bg-blue-600 text-white text-xs': application.status == '2', // Sah
                                        'bg-blue-800 text-white text-xs': application.status == '3', // Terima untuk Semakan
                                        'bg-yellow-600 text-white text-xs': application.status == '4', // Cadangan
                                        'bg-green-600 text-white text-xs': application.status == '5', // Terima
                                        'bg-red-600 text-white text-xs': application.status == '6' || application.status == '7', // Tolak KKR / Tolak Pelajar
                                        'bg-gray-400 text-white text-xs': application.status == '8', // Arkib
                                        'bg-gray-800 text-white text-xs': application.status == '9', // Hapus
                                    }" class="px-2 py-1 mb-1 rounded-md font-semibold">
                                    {{ getStatusLabel(application.status) }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-baseline text-gray-700 text-sm justify-end mt-auto font-semibold">
                        {{ formatDate(application.tkh_mula, application.tkh_tamat) }}
                        <span v-if="daysCount(application.tkh_mula, application.tkh_tamat) >= 0"
                            :class="{ 'text-red-500': daysCount(application.tkh_mula, application.tkh_tamat) > 90, 'text-gray-700': daysCount(application.tkh_mula, application.tkh_tamat) <= 90 }"
                            class="mx-1">
                            ({{ daysCount(application.tkh_mula, application.tkh_tamat) }} hari)
                        </span>
                    </div>
                </div>

                <Modal v-if="selectedApplication" :isOpen="isModalOpen" :application="selectedApplication" @updateApplication="loadApplications"
                    :formatDate="formatDate" :getFilename="getFilename" :canAppEdit="canEdit" @close="closeModal" />

            </div>

        </LandingContainer>
    </div>
</template>

<script setup>
import { initializeUserStore } from '@/stores/userStore.js';
import { ref, onMounted } from 'vue';

definePageMeta({
    layout: "landing",
});

initializeUserStore();

const applications = ref([]);
const isLoading = ref(false);
const isModalOpen = ref(false);
const selectedApplication = ref(null);
const canEdit = ref(false);
const searchData = ref('');
const selectedStatus = ref("1");


const openModal = (application) => {
    selectedApplication.value = application;
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    selectedApplication.value = null;
    canEdit.value = false;
};

const handleActionButtonClick = (action, application) => {
    if (action === 'edit') {
        isModalOpen.value = true;
        selectedApplication.value = application;
        canEdit.value = true;
    } else {
        //put api for terima,tolak,delete here
        console.log('Other action selected');
    }
}

const loadApplications = async () => {
    try {
        const response = await $fetch('/api/internship/application');
        applications.value = response.data; 
    } catch (error) {
        console.error('Error fetching applications list:', error);
    }
};

watch([isLoading], ([newIsLoading]) => {
    
});

onMounted(async () => {
    loadApplications();
});

const filteredApplications = computed(() => {
  return applications.value.filter(application => {
    const matchesStatus = application.status == selectedStatus.value;
    const matchesSearch = application.nama.toLowerCase().includes(searchData.value.toLowerCase());
    return matchesStatus && matchesSearch;
  });
});

// Helper function to map status codes to readable text
const getStatusLabel = (status) => {
  const statusMap = {
    '1': 'Baru', //  (Baru didaftarkan dan belum membuat pengesah melalui email)
    '2': 'Sah', // (Telah membuat pengesahan melalui email)
    '3': 'Terima Semakan', // (Diterima untuk semakan)
    '4': 'Cadangan', // (Telah dihantar kepada penyelaras bahagian untuk tindakan)
    '5': 'Terima', // (Telah diterima oleh penyelaras bahagian)
    '6': 'Tolak KKR', // (Telah ditolak oleh admin atau penyelaras)
    '7': 'Tolak Pelajar',// (Telah ditolak oleh pelajar)
    '8': 'Arkib', // Arkib (Admin mengemaskini status pelajar kepada arkib)
    '9': 'Hapus' // (Admin menghapus pelajar)
  };
  return statusMap[status] || 'Unknown';
}

const formatDate = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const dayStart = String(start.getDate()).padStart(2, '0');
    const monthStart = start.toLocaleString('en-US', { month: 'short' });

    const dayEnd = String(end.getDate()).padStart(2, '0');
    const monthEnd = end.toLocaleString('en-US', { month: 'short' });

    const yearStart = start.getFullYear();
    const yearEnd = end.getFullYear();

    // Check if the years are the same
    if (yearStart === yearEnd) {
        return `${dayStart} ${monthStart} - ${dayEnd} ${monthEnd} ${yearEnd}`;
    } else {
        return `${dayStart} ${monthStart} ${yearStart} - ${dayEnd} ${monthEnd} ${yearEnd}`;
    }
}

const daysCount = (startStr, endStr) => {
    const startDate = new Date(startStr);
    const endDate = new Date(endStr);
    const timeDiff = endDate - startDate; // Difference in milliseconds
    return Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // Convert to days
};

const getFilename = (url) => {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1]; // Get the last part of the URL
};
</script>

<style scoped>
.text-xxs {
    font-size: 0.625rem;
    /* 10px */
}
</style>
