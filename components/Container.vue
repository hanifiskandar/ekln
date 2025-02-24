<template>
  <div v-if="isLoading" class="mt-20 text-center">
    <FormLoading :isLoading="isLoading" />
  </div>
  <div v-else>
    <div 
      v-if="($route.path.startsWith('/admin') || $route.path.startsWith('/auth') ? permissions.canView : true)" 
      class="flex items-center justify-center h-full mt-1 w-full"
    >
      <LandingContainer>
        <LandingSectionhead>
          <template v-slot:title>{{ title }}</template>
          <template v-slot:desc>{{ description }}</template>
        </LandingSectionhead>
        <div class="mt-10 w-full">
          <slot />
        </div>
      </LandingContainer>
    </div>
    <div v-else>
      <Auth403 />
    </div>
  </div>
  
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { userPermissionsStore } from '~/stores/userPermissions.js';


const userPermissions = userPermissionsStore();
const permissions = userPermissions.permissions;

const isLoading = ref(true);

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
});

const loadItems = async () => {
  console.log('permissions canView', permissions.canView)
  console.log('permissions canEdit', permissions.canEdit)
  console.log('permissions canDelete', permissions.canDelete)
}

onMounted(async () => {
  await loadItems();
  isLoading.value = false;
});

</script>




