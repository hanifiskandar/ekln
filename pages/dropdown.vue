<template>
  <Container :title="title" :description="description">
    <div>
      <label for="organisations-dropdown">Select Organisation</label>
      <Multiselect
        v-model="selectedOrganisation"
        :options="dropdownOptions"
        :searchable="true"
        placeholder="Search by name or code"
        label="displayName"
        track-by="id"
        :custom-label="customLabel"
        :search-keys="['nama_pejabat', 'kod_pejabat']"
      >
        <template #option="{ option, search }">
          <span :style="{ paddingLeft: option.depth * 20 + 'px' }">
            {{ option.kod_pejabat }} - {{ option.nama_pejabat }}
          </span>
        </template>
      </Multiselect>
    </div>
  </Container>
</template>

<script setup>
definePageMeta({
  layout: "landing",
});

import { ref, onMounted } from "vue";
import Multiselect from "vue-multiselect";

const title = "Mengenai Kami";
const description = "Kami tak ramai. Tapi kami ada.";

const isOpen = ref(false)
const dropdownOptions = ref([]);
const selectedOrganisation = ref(null);

const processOrganisations = (organisations, depth = 0) => {
  let result = [];

  organisations.forEach((org) => {
    const formattedKodPejabat = org.kod_pejabat;

    result.push({
      id: org.id,
      kod_pejabat: formattedKodPejabat,
      nama_pejabat: org.nama_pejabat,
      parent_id: org.parent_id,
      depth: depth,
      displayName: `${org.kod_pejabat} - ${org.nama_pejabat}`,
    });

    if (org.children && org.children.length > 0) {
      result = result.concat(processOrganisations(org.children, depth + 1));
    }
  });

  return result;
};

onMounted(async () => {
  try {
    const response = await fetch("/api/ref_hr/organisations");
    const data = await response.json();

    if (data.success) {
      dropdownOptions.value = processOrganisations(data.data);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

const customLabel = (option) => {
  return `${option.kod_pejabat} - ${option.nama_pejabat}`;
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped>
.indent-depth-1 {
  padding-left: 20px;
}
.indent-depth-2 {
  padding-left: 40px;
}
.indent-depth-3 {
  padding-left: 60px;
}
.indent-depth-4 {
  padding-left: 80px;
}
.indent-depth-5 {
  padding-left: 100px;
}
</style>
