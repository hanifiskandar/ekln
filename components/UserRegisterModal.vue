<template>
  <div>
    <div class="p-4">
        <div class="mb-2 ml-1">
        <label for="organisations-dropdown">Pilih Organisasi</label>
        </div>

        <Multiselect
            v-model="selectedOrganisation"
            :options="dropdownOptions"
            :searchable="true"
            placeholder="Carian nama atau kod pejabat"
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

        <div class="pt-2">
            <UButton
                icon="i-heroicons-pencil-square"
                size="lg"
                color="primary"
                variant="solid"
                label="Daftar"
                :trailing="false"
            />
        </div>
        
    </div>

    <div class="p-4">
        <UInput
            v-model="searchKeyword" 
            icon="i-heroicons-magnifying-glass-20-solid"
            size="xl"
            color="white"
            trailing
            placeholder="Search by name..."
            @input="onSearch" 
        />
    </div>
    

    <UserList :org-id="selectedOrganisation ? selectedOrganisation.id : null" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Multiselect from "vue-multiselect";

const title = "Mengenai Kami";
const description = "Kami tak ramai. Tapi kami ada.";

const isOpen = ref(false);
const dropdownOptions = ref([]);
const selectedOrganisation = ref(null);
const searchKeyword = ref("");

const onSearch = () => {
  if (searchKeyword.value.trim() !== "") {
    fetchUsers();
  } else {
    // If search is cleared, you might want to fetch all users or do something else
    fetchUsers();
  }
};

const fetchUsers = async () => {
  try {
    const response = await fetch(`/api/user/search/${searchKeyword.value}`);
    const data = await response.json();

    if (data.success) {
      // Handle the success response and update users list (You can pass the data to UserList)
      console.log(data);  // For testing
    } else {
      // Handle error (e.g., show a message if no results)
      console.error("No users found");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const processOrganisations = (organisations, depth = 0, seen = new Set()) => {
  let result = [];

  organisations.forEach((org) => {
    const formattedKodPejabat = org.kod_pejabat;

    const orgIdentifier = `${org.id}-${formattedKodPejabat}`;

    if (seen.has(orgIdentifier)) {
      return;
    }

    result.push({
      id: org.id,
      kod_pejabat: formattedKodPejabat,
      nama_pejabat: org.nama_pejabat,
      parent_id: org.parent_id,
      depth: depth,
      displayName: `${org.kod_pejabat} - ${org.nama_pejabat}`,
    });

    seen.add(orgIdentifier);

    if (org.children && org.children.length > 0) {
      result = result.concat(processOrganisations(org.children, depth + 1, seen));
    }
  });

  return result;
};

const fetchOrganisation = async () => {
  try {
    const response = await fetch("/api/ref_hr/organisations");
    const data = await response.json();

    if (data.success) {
      dropdownOptions.value = processOrganisations(data.data);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(async () => {
    
});

const customLabel = (option) => {
  return `${option.kod_pejabat} - ${option.nama_pejabat}`;
};

watch(searchKeyword, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    onSearch();
  }
});
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
