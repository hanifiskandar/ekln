<template>
    <div>
      <UTable
        :rows="users"
        :columns="columns"
        :loading="isLoading"
        :loading-state="{
          icon: 'i-heroicons-arrow-path-20-solid',
          label: 'Loading...',
        }"
        :progress="{ color: 'primary', animation: 'carousel' }"
      />
  
      <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
        <UPagination
          v-model="page"
          :page-count="pageCount"
          :total="totalRows - 1"
          :per-page="perPage"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue';
  
  const props = defineProps({
  orgId: {
    type: Number,
    default: null,
  },
});

  const users = ref([]);
  const isLoading = ref(true);
  const page = ref(1);
  const perPage = 3;
  const totalRows = ref(0);
  const pageCount = computed(() => Math.ceil(totalRows.value / perPage));
  
  const columns = [
    { label: 'Name', key: 'nama', sortable: true },
    { label: 'ID', key: 'id', sortable: true },
    { label: 'Email', key: 'email_rasmi', sortable: true },
    { label: 'Position', key: 'jawatan', sortable: true },
    { label: 'Roles', key: 'roles', sortable: false },
  ];
  
  const loadUsers = async () => {
    try {
      const response = await $fetch(
        `/api/auth/user/list/${page.value}/${perPage}`,
        {
          method: 'GET',
        }
      );
  
      if (response.success) {
        users.value = Array.isArray(response.data)
          ? response.data
          : Object.values(response.data);
  
        totalRows.value = response.total_count;
      }
    } catch (error) {
      console.error('Error fetching user list:', error);
      return [];
    }
  };
  
  watch(page, loadUsers);
  
  onMounted(async () => {
    await loadUsers();
    isLoading.value = false;
  });
  </script>
  
  <style scoped>
  .modal-content {
    max-width: 100vw;
    max-height: 100vh;
    width: 90vw;
    height: 90vh;
    margin: 0 auto;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 8px;
    overflow: auto;
  }
  
  .modal-content .h-full {
    height: 100%;
  }
  </style>
  