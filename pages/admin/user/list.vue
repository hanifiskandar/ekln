<template>
  <Container :title="title" :description="description">
    <template #default>
      <UButton label="Open" @click="isOpen = true" />

      <UModal v-model="isOpen" fullscreen>
        <UCard
          :ui="{
            base: 'h-full flex flex-col',
            rounded: '',
            divide: 'divide-y divide-gray-100 dark:divide-gray-800',
            padding: 'p-10 sm:p-0',
            body: {
              base: 'grow',
            },
          }"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <h3
                class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
              >
                Modal
              </h3>
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-x-mark-20-solid"
                class="-my-1"
                @click="isOpen = false"
              />
            </div>
          </template>

          <UserRegisterModal class="h-full" />
        </UCard>
      </UModal>

      <UserRoleList />
      <!-- <UTable
        :rows="users"
        :columns="columns"
        :loading="isLoading"
        :loading-state="{
          icon: 'i-heroicons-arrow-path-20-solid',
          label: 'Loading...',
        }"
        :progress="{ color: 'primary', animation: 'carousel' }"
      />

      <div
        class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
      >
        <UPagination
          v-model="page"
          :page-count="pageCount"
          :total="totalRows - 1"
          :per-page="perPage"
        />
      </div> -->
    </template>
  </Container>
</template>

<script setup>
definePageMeta({
  layout: "landing",
});

const title = "Senarai Pengguna";
const description = "We are a small passionate team.";

const isOpen = ref(false);
const isLoading = ref(true);
const page = ref(1);
const perPage = 3;
const totalRows = ref(0);
const pageCount = computed(() => Math.ceil(totalRows.value / perPage));

const columns = [
  { label: "Name", key: "nama", sortable: true },
  { label: "ID", key: "id", sortable: true },
  { label: "Email", key: "email_rasmi", sortable: true },
  { label: "Position", key: "jawatan", sortable: true },
  { label: "Roles", key: "roles", sortable: false },
];

const users = ref([]);

const loadUsers = async () => {
  try {
    const response = await $fetch(
      `/api/auth/user/list/${page.value}/${perPage}`,
      {
        method: "GET",
      }
    );

    if (response.success) {
      users.value = Array.isArray(response.data)
        ? response.data
        : Object.values(response.data);

      totalRows.value = response.total_count;
    }
  } catch (error) {
    console.error("Error fetching user list:", error);
    return [];
  }
};

onMounted(async () => {
  await loadUsers();
  isLoading.value = false;
});

watch(page, loadUsers);
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
