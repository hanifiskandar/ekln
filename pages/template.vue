<template>
  <Container 
    :title="title" 
    :description="description" 
    :authRequired="authRequired" 
  >

    <template #default>
      <!-- #### Masukkan content dekat sini #### -->
    </template>

  </Container>
</template>

<script setup>
definePageMeta({
  layout: "landing",
});

import { userPermissionsStore } from '~/stores/userPermissions.js';

const userPermissions = userPermissionsStore();
const permissions = userPermissions.permissions;

const title = "Senarai Resources";
const description = "Senarai resources (capaian) yang telah didaftarkan.";

const loadItems = async () => {
  try {
    // Wujudkan API call dalam server/api/nama_api.js
    // Untuk method GET tanpa parameter
    const { data } = await $fetch('/api/nama_api');

    // Untuk method GET dengan parameter
    // const { data } = await $fetch('/api/nama_api', { 
    //   method: 'GET',
    //   params: {
    //     param_1: value_1,
    //   },
    // });

    // Untuk method POST dan ada body
    // const { data } = await $fetch('/api/nama_api', {
    //   method: 'POST',
    //   body: {
    //     medan_body_1: value_medan_1,
    //     medan_body_2: value_medan_2,
    //   },
    // });
    namaData.value = data;

    // Include this in all pages
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

onMounted(async () => {
  await loadItems();
});
</script>