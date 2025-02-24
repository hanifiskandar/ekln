<template>
    <div class="max-w-xl p-3">
        <p class="text-left flex items-center">
            <component
                :is="iconType"
                @click="toggleEditMode"
                :class="[
                    'mr-3 h-7 w-7 cursor-pointer', 
                    iconType === SolidPencilSquareIcon ? 'text-green-500' : 'text-gray-400', 
                    'group-hover:text-gray-500'
                ]"
                aria-hidden="true" />
            <UInput v-if="editMode" v-model="formData.name" type="text" id="name" color="gray" variant="outline" size="xl" />
            <div v-else>
                <span class="text-xl text-gray-700">{{ resourceInfo.name }}</span>
                <span class="ml-3 text-orange-400">{{ resourceInfo.routeName }}</span>
            </div>
        </p>
        <p v-if="editMode" class="text-left flex flex-col">
            <input v-model="formData.path" type="hidden" id="path" />
            <UTextarea v-model="formData.description" color="white" variant="outline" placeholder="Description" class="pt-2" />
        </p>
        <p v-else class="max-w-full whitespace-normal text-justify pt-3">{{ resourceInfo.description }}</p>
        <div class="mt-3 flex rounded-md shadow-sm w-80">
            <span class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-2 text-gray-500 sm:text-sm">Path:</span>
            <input disabled type="text" 
                name="route-path" 
                id="route-path" 
                class="pl-3 block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 sm:text-sm/6" 
                :placeholder="resourceInfo.path" />
        </div>

        <!-- Status display and Enable button -->
        <div class="flex items-center mt-3 text-left">
            <span
                :class="{
                    'mr-3 inline-flex items-center rounded-md px-3 py-2 text-sm font-medium ring-1 ring-inset': true,
                    'bg-green-50 text-green-700 ring-green-600/20': resourceInfo.status === true,
                    'bg-yellow-50 text-yellow-700 ring-yellow-600/20': resourceInfo.status === false
                }"
            >
            {{ resourceInfo.id ? (resourceInfo.status ? 'Activated' : 'Inactive') : 'Unregistered' }}
            </span>
            
            <UToggle 
                v-if="resourceInfo.id"
                :loading="loading"
                size="xl" 
                :model-value="resourceInfo.status"
                @update:model-value="(newStatus) => handleStatusToggle(newStatus, resourceInfo.id)" 
            />
            <button v-if="editMode && !resourceInfo.id" @click="registerResource" class="ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                Register
            </button>
            <button v-if="editMode && resourceInfo.id" @click="updateResource(resourceInfo.id)" class="ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                Save Changes
            </button>
        </div>

    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { PencilSquareIcon as OutlinePencilSquareIcon } from '@heroicons/vue/24/outline'
import { PencilSquareIcon as SolidPencilSquareIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
    resourceInfo: {
        type: Object,
        required: true,
    },
    page: {
        type: Number,
        required: true,
    },
});

const loading = ref(false);
const iconType = ref(OutlinePencilSquareIcon);

const toggleStatus = ref(false); 
const handleToggleChange = (newStatus) => {
    props.resourceInfo.status = newStatus; 
};

const editMode = ref(false);
const formData = ref({
    name: '',
    description: '',
    path: '',
});

const isPageChanged = ref(false);

watch(() => props.page, (newPage, oldPage) => {
    if (newPage !== oldPage) {
        isPageChanged.value = true;
        resetForm();
    }
});

const toggleEditMode = () => {
    editMode.value = !editMode.value;
    iconType.value = editMode.value ? SolidPencilSquareIcon : OutlinePencilSquareIcon;

    if (editMode.value) {
        formData.value.name = props.resourceInfo.name;
        formData.value.description = props.resourceInfo.description;
        formData.value.path = props.resourceInfo.path;
    } else {
        resetForm();
    }
};

const resetForm = () => {
    formData.value = {
        name: '',
        description: '',
        path: '',
    };
    isPageChanged.value = false; 
    editMode.value = false;
};

const registerResource = async () => {
    const payload = {
        name: formData.value.name,
        description: formData.value.description,
        path: formData.value.path,
    };

    try {
        const response = await $fetch('/api/auth/permission/info/register', {
            method: 'POST',
            body: payload,
        });
        // console.log('Response', response)
        if (response.success) {
            resetForm();
            editMode.value = false;
        } else {
            console.error(response.message);
        }
    } catch (error) {
        console.error('Error registering resource info:', error);
    }
};

const updateResource = async (id) => {
    const payload = {
        id: id,
        name: formData.value.name,
        description: formData.value.description,
        path: formData.value.path,
    };
    // console.log('Payload',payload)

    try {
        const response = await $fetch('/api/auth/permission/info/update', {
            method: 'PUT',
            body: payload,
        });
        // console.log('Response', response)
        if (response.success) {
            resetForm();
            editMode.value = false;
        } else {
            console.error(response.message);
        }
    } catch (error) {
        console.error('Error registering resource info:', error);
    }
};

const handleStatusToggle = async (newStatus, id) => {
    loading.value = true;
    try {
        const response = await $fetch('/api/auth/permission/status/update', {
            method: 'PATCH',
            body: {
                id: id,
                status: newStatus,
            },
        });
        if (response.success) {
            props.resourceInfo.status = newStatus;
        } else {
            console.error('Error updating status:', response.message);
            props.resourceInfo.status = !newStatus;
        }
    } catch (error) {
        console.error('Error toggling status:', error);
        props.resourceInfo.status = !newStatus;
    } finally {
        loading.value = false;
    }
};
</script>
