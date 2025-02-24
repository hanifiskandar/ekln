<template>
    <Container
        :title="title"
        :description="description"
      >
      <template #default>
        <UTable 
          :columns="columns" 
          :rows="rows"
          :loading="isLoading"
          :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
          :progress="{ color: 'primary', animation: 'carousel' }"
        >
          <template #name-data="{ row }">
            <div class="text-center">
              <ResourcesPermissionsInfo :resourceInfo="row" :page="page"/>
            </div>
          </template>

          <template #roles-data="{ row }">
            <div class="text-center">
              <ResourcesRolesActions :resourceInfo="row" />
            </div>
          </template>
  
          <template #actions-data="{ row }">
            <div v-if="row.isRegistered" class="max-w-lg pl-10" title="row.actions">
              <ResourcesAssignPermission 
                :resourceInfo="row"
              />
            </div>
          </template>
        </UTable>
  
        <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
          <UPagination
            v-model="page"
            :page-count="pageCount"
            :total="totalRows"
          />
        </div>
        
      </template>
    </Container>
</template>
  
<script setup>
definePageMeta({
  layout: "landing",
});

import { useResourcesStore } from '@/stores/resPermissionStore.ts'
import { ref, computed } from 'vue'

const store = useResourcesStore()
const isLoading = ref(true);

const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Resource info" },
    { key: "roles", label: "Roles/Permission" },
    { key: "actions", label: "Actions" },
];

const title = "Senarai Resources"
const description = "Senarai resources (capaian) yang telah didaftarkan."

const page = ref(1)
const pageCount = ref(5) 

const totalRows = computed(() => Object.keys(store.resourcesPermissions).length)

const { getRoutes } = useRoutes()
const allRoutes = getRoutes()

const rows = computed(() => {
    const resources = Object.values(store.resourcesPermissions);
    
    return resources.slice(
        (page.value - 1) * pageCount.value,
        page.value * pageCount.value
    );
});


onMounted(async () => {
    await store.populateResourcesState(allRoutes)
    isLoading.value = false;
})
</script>