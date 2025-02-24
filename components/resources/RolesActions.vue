<template>
    <div class="max-w-lg p-3">
        <table  v-show="!state.isEmpty" class="min-w-full mt-2" :key="resourceInfo.path">
            <thead>
            <tr class="bg-gray-100">
                <th class="px-4 py-2 text-left">Role</th>
                <th class="px-4 py-2 text-left">Permissions</th>
            </tr>
            </thead>
            <tbody>
                <tr v-for="(perms, role) in resourceInfo.actions" :key="role">
                    <td class="border px-4 py-2 font-semibold">{{ role }}</td>
                    <td class="border px-4 py-2">
                    <div class="flex flex-wrap">
                        <span 
                            v-for="(permission, permission_id) in perms"
                            :key="permission_id"
                            :id="`permission-${permission_id}`"
                            :class="getClassForPermission(permission, 'badge')">
                                {{ permission }}
                                <button 
                                    type="button" 
                                    :class="getClassForPermission(permission, 'hover')" 
                                    :title="`Remove permission ${permission} for ID ${permission_id}`"
                                    @click="removePermission(resourceInfo.path, role, permission_id)"
                                    >
                                    <span class="sr-only">Remove</span>
                                    <svg 
                                        viewBox="0 0 14 14" 
                                        :class="getClassForPermission(permission, 'x')"
                                    >
                                        <path d="M4 4l6 6m0-6l-6 6" />
                                    </svg>
                                    <span class="absolute -inset-1" ></span>
                                </button>
                        </span>
                    </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { useResourcesStore } from '@/stores/resPermissionStore'

type TypeCategory = 'badge' | 'hover' | 'x';
type PermissionType = 'view' | 'edit' | 'delete';

const props = defineProps({
    resourceInfo: {
        type: Object,
        required: true,
    },
});

const store = useResourcesStore()

const state = reactive({
    isEmpty: false
})

watch(() => store.resourcesPermissions[props.resourceInfo.path], (newResourceInfo) => {
    
    if(!newResourceInfo || !newResourceInfo.actions || Object.keys(newResourceInfo.actions).length === 0) {
        state.isEmpty = true
    } else {
        state.isEmpty = false
    }

}, { immediate: true, deep: true })

const getClassForPermission = (permission: PermissionType, type: TypeCategory) => {
    const colorSet = {
        badge: {
            view: "inline-flex items-center gap-x-0.5 rounded-md bg-green-50 px-2 py-1 m-1 text-sm font-medium text-green-600 ring-1 ring-inset ring-green-500/10",
            edit: "inline-flex items-center gap-x-0.5 rounded-md bg-yellow-50 px-2 py-1 m-1 text-sm font-medium text-yellow-600 ring-1 ring-inset ring-yellow-500/10",
            delete: "inline-flex items-center gap-x-0.5 rounded-md bg-red-50 px-2 py-1 m-1 text-sm font-medium text-red-600 ring-1 ring-inset ring-red-500/10",
            default: "inline-flex items-center gap-x-0.5 rounded-md bg-gray-50 px-2 py-1 m-1 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10",
        },
        hover: {
            view: "group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-green-500/20",
            edit: "group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-yellow-500/20",
            delete: "group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-red-500/20",
            default: "group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-gray-500/20",
        },
        x: {
            view: "h-3.5 w-3.5 stroke-green-600/50 group-hover:stroke-green-600/75",
            edit: "h-3.5 w-3.5 stroke-yellow-600/50 group-hover:stroke-yellow-600/75",
            delete: "h-3.5 w-3.5 stroke-red-600/50 group-hover:stroke-red-600/75",
            default: "h-3.5 w-3.5 stroke-gray-600/50 group-hover:stroke-gray-600/75",
        },
    };

    return colorSet[type][permission] || colorSet[type].default;
};

const removePermission = async (path: any, role:any, permission_id: number) => {
    try{
        const resourceInfo = props.resourceInfo as { path: string; id: number }
        const success = await store.removePermissionById(resourceInfo, path, role, permission_id);
        
        if (success) {
            const remainingPermissions = props.resourceInfo.actions[role];

            if (remainingPermissions && typeof remainingPermissions === 'object') {
                if (Object.keys(remainingPermissions).length > 0) {
                    const element = document.getElementById(`permission-${permission_id}`);
                    if (element) {
                        element.remove();
                    }
                }
            } else {
                // If remainingPermissions is undefined or not an object, log an error
                console.warn(`No permissions remaining for role ${role}`);
            }
        } else {
            console.error('Failed to remove permission from backend');
            alert(`Failed to remove permission: ${permission_id}`); 
        }
    } catch (error) {
        console.error('Error removing permission:', error);
        alert('An error occurred while removing the permission. Please try again later.');
    }
};
</script>
