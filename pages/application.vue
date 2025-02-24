<template>
    <div class="mt-10">
        <!-- Loading -->
        <FormLoading v-if="isLoading" :isLoading="isLoading" />

        <!-- Main Content -->
        <div v-else class="flex flex-col items-center h-full mt-3 px-4">
            <LandingContainer>
                <LandingSectionhead>
                    <template v-slot:title>
                        Senarai Permohonan
                    </template>
                    <template v-slot:desc>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quae voluptate reiciendis totam pariatur aperiam, magni placeat eius sunt! Debitis dolor odio sint magnam ex. Tempore aliquam consequatur expedita! Eos, officiis!
                    </template>
                </LandingSectionhead>

                <!-- Search and Filter -->
                <div class="bg-indigo-500 shadow-lg rounded-lg p-3 mt-5">
                    <div class="flex flex-wrap gap-4">
                        <div class="flex-1">
                            <input
                                id="search"
                                v-model="searchData"
                                type="text"
                                placeholder="Carian..."
                                class="w-full px-4 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                @keyup.enter="handleSearch"
                            />
                        </div>
                    </div>
                </div>

                <!-- Status Summary Tabs -->
                <div class="flex flex-wrap justify-start gap-4 bg-white shadow-md rounded-lg p-4 mt-5">
                    <div
                    v-for="status in statusSummary"
                    :key="status.id"
                    class="cursor-pointer px-4 py-2 rounded-md border transition-all"
                    :class="getStatusClass(status.id)"
                    @click="filterByStatusTab(status.id)"
                    >
                    <span class="font-bold text-base">{{ status.label }}</span>
                    <span
                    class="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-white text-gray-800 border border-gray-300"
                    >
                    {{ status.count }}
                    </span>
                    </div>
                </div>

                <!-- Application Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 mb-8">
                    <div
                        v-for="application in applications"
                        :key="application.id"
                        class="border border-gray-200 rounded-lg shadow-md hover:shadow-lg transform transition-transform hover:scale-105 p-4 bg-white flex flex-col"
                        @click="openModal(application)"
                        >
                        <div class="flex">
                            <!-- Image Section -->
                            <div class="w-40 h-60 overflow-hidden rounded-md flex-shrink-0">
                                <img
                                    :src="application.image"
                                    alt="Student Image"
                                    class="object-cover w-full h-full"
                                    loading="lazy"
                                />
                            </div>
                            <!-- Details Section -->
                            <div class="flex flex-col justify-between ml-4 flex-grow">
                                <div>
                                    <h3 class="text-lg font-bold text-gray-800">{{ application.nama }}</h3>
                                    <p class="text-sm text-gray-500">{{ application.nokp }}</p>
                                    <p class="text-sm text-gray-500">{{ application.bangsa }}</p>
                                    <p class="text-sm text-gray-500">{{ application.agama }}</p>
                                    <p class="text-sm text-gray-500 mt-1">{{ application.institusi }}</p>
                                    <p class="text-sm text-gray-500">{{ application.program }}</p>
                                </div>

                                <div class="flex space-x-4 mt-4">
                                        <a :href="application.resume" target="_blank" class="text-gray-600 hover:text-blue-600">
                                            <i class="fas fa-file-invoice"></i>
                                        </a>
                                        <a :href="application.transkrip" target="_blank" class="text-gray-600 hover:text-blue-600">
                                            <i class="fas fa-file"></i>
                                        </a>
                                        <a :href="application.surat_universiti" target="_blank" class="text-gray-600 hover:text-blue-600">
                                            <i class="fas fa-file-alt"></i>
                                        </a>
                                </div>
                                
                                <div>
                                    <span :class="statusClasses(application.status)" class="px-3 py-1 rounded-full font-medium">
                                        {{ getStatusLabel(application.status) }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Separator Line -->
                        <hr class="border-t border-gray-300 my-3" />

                        <!-- Date and Days Count -->
                        <div class="text-sm text-gray-700 flex justify-between items-center rounded-lg w-full">
                            <span class="text-gray-800 font-semibold">{{ formatDate(application.tkh_mula, application.tkh_tamat) }}</span>
                            <span
                                v-if="daysCount(application.tkh_mula, application.tkh_tamat) >= 0"
                                :class="{ 
                                    'text-red-500 font-bold': daysCount(application.tkh_mula, application.tkh_tamat) > 90, 
                                    'text-gray-800 font-semibold': daysCount(application.tkh_mula, application.tkh_tamat) <= 90 
                                }"
                            >
                                ({{ daysCount(application.tkh_mula, application.tkh_tamat) }} hari)
                            </span>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
                    <UPagination
                        v-model="currentPage"
                        :page-count="itemsPerPage"
                        :total="totalApplication"
                        :active-button="{ color: 'indigo' }"

                    />
                </div>

                <!-- Modal -->
                <Modal
                    v-if="selectedApplication"
                    :isOpen="isModalOpen"
                    :application="selectedApplication"
                    @updateApplication="updateSelectedApplication"
                    :formatDate="formatDate"
                    :getFilename="getFilename"
                    @close="closeModal"
                />
            </LandingContainer>
        </div>
    </div>
</template>

<script setup>
import { initializeUserStore } from '@/stores/userStore.js';
import { ref, computed, onMounted } from 'vue';
import { STATUS } from '@/constants/status';

definePageMeta({
    layout: "landing",
});

initializeUserStore();

const applications = ref([]);
const isLoading = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(9);
const totalPages = ref(1);
const totalApplication = ref(0);
const statusCounts = ref({});
const searchData = ref('');
const selectedStatusTab = ref(1);
const selectedApplication = ref(null);
const isModalOpen = ref(false);

const statusSummary = computed(() => {
    const statuses = [
    { id: STATUS.New, label: 'Permohonan Baru', count: 0 },
    { id: STATUS.ScreeningApproved, label: 'Lulus Tapisan', count: 0 },
    { id: STATUS.Interview, label: 'Temuduga', count: 0 },
    { id: STATUS.InterviewAccepted, label: 'Temuduga Diterima', count: 0 },
    { id: STATUS.InterviewRejected, label: 'Temuduga Ditolak', count: 0 },
    { id: STATUS.Offer, label: 'Tawaran', count: 0 },
    { id: STATUS.OfferAccepted, label: 'Tawaran Diterima', count: 0 },
    { id: STATUS.OfferRejected, label: 'Tawaran Ditolak', count: 0 },
    { id: STATUS.Present, label: 'Hadir', count: 0 },
    { id: STATUS.Absent, label: 'Tidak Hadir', count: 0 },
    { id: STATUS.ApplicationRejected, label: 'Permohonan Ditolak', count: 0 },
    ];

  statuses.forEach((status) => {
    status.count = statusCounts.value[status.id] || 0;
  });

  return statuses;
});

const getStatusClass = (statusId) => {
  const colors = {
    [STATUS.New]: { selected: 'bg-indigo-500 text-white border-indigo-700', unselected: 'bg-white text-gray-600 border-gray-300' },
    [STATUS.ScreeningApproved]: { selected: 'bg-indigo-500 text-white border-indigo-700', unselected: 'bg-white text-gray-600 border-gray-300' },
    [STATUS.Interview]: { selected: 'bg-indigo-500 text-white border-indigo-700', unselected: 'bg-white text-gray-600 border-gray-300' },
    [STATUS.InterviewAccepted]: { selected: 'bg-indigo-500 text-white border-indigo-700', unselected: 'bg-white text-gray-600 border-gray-300' },
    [STATUS.InterviewRejected]: { selected: 'bg-indigo-500 text-white border-indigo-700', unselected: 'bg-white text-gray-600 border-gray-300' },
    [STATUS.Offer]: { selected: 'bg-indigo-500 text-white border-indigo-700', unselected: 'bg-white text-gray-600 border-gray-300' },
    [STATUS.OfferAccepted]: { selected: 'bg-indigo-500 text-white border-indigo-700', unselected: 'bg-white text-gray-600 border-gray-300' },
    [STATUS.OfferRejected]: { selected: 'bg-indigo-500 text-white border-indigo-700', unselected: 'bg-white text-gray-600 border-gray-300' },
    [STATUS.Present]: { selected: 'bg-indigo-500 text-white border-indigo-700', unselected: 'bg-white text-gray-600 border-gray-300' },
    [STATUS.Absent]: { selected: 'bg-indigo-500 text-white border-indigo-700', unselected: 'bg-white text-gray-600 border-gray-300' },
    [STATUS.ApplicationRejected]: { selected: 'bg-indigo-500 text-white border-indigo-700', unselected: 'bg-white text-gray-600 border-gray-300' },
  };

  return selectedStatusTab.value === statusId ? colors[statusId].selected : colors[statusId].unselected;
};


const loadApplications = async () => {
    try {
        const response = await $fetch('/api/internship/application', {
            params: {
                current_page: currentPage.value,
                items_per_page: itemsPerPage.value,
                status: selectedStatusTab.value,
                search: searchData.value,
            },
        });
        applications.value = response.data;
        totalPages.value = response.meta.total_pages;
        currentPage.value = response.meta.current_page;
        itemsPerPage.value = response.meta.items_per_page;
        totalApplication.value = response.meta.total_records;
        statusCounts.value = response.meta.status_counts; 

    } catch (error) {
        console.error('Error fetching applications list:', error);
    } finally {
        isLoading.value = false;
    }
};

const handleSearch = () => {
    // Reset to the first page and reload applications
    currentPage.value = 1;
    applications.value = [];
    loadApplications();
};

const filterByStatusTab = (statusId) => {
    selectedStatusTab.value = statusId;
    resetApplications();
};

const resetApplications = () => {
    searchData.value = '';
    currentPage.value = 1;
    loadApplications();
};

const openModal = (application) => {
    selectedApplication.value = application;
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    selectedApplication.value = null;
};


onMounted(async () => {
    loadApplications();
});

const updateSelectedApplication = async (id) => {
    try {
        const response = await $fetch(`/api/internship/application/${id}`);
        const updatedApp = response.data[0];
        const updatedAppStatus = updatedApp.status;
        
        // Check for both `id` and `status` match
        const index = applications.value.findIndex(app => app.id == id && app.status == updatedAppStatus);

        if (index !== -1) {
            // Use immutable update
            const updatedApplications = [...applications.value];
            updatedApplications[index] = reactive(updatedApp); // Ensure reactivity
            applications.value = updatedApplications; // Replace the array reference    
        } else {
            // Handle when the application is not found or status doesn't match
            // Remove the application with the given id
            applications.value = applications.value.filter(app => app.id !== id);
            
            // Reset modal and selected application
            isModalOpen.value = false;
            selectedApplication.value = null;
        }
    } catch (error) {
        console.error(`Error fetching application with ID ${id}:`, error);
    }
};


watch(currentPage, loadApplications);

watch(
    () => applications.value, // Watch the value of the applications ref
    (newVal) => {
        if (selectedApplication.value) {
            // Update the selected application if it exists in the new list
            const updatedApp = newVal.find(app => app.id === selectedApplication.value.id);
            if (updatedApp) {
                selectedApplication.value = updatedApp;
            }
        }
    },
    { immediate: true } // Trigger immediately on mount
);

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
