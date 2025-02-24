<template>
  <UForm
    :validate="validate"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormGroup name="roles" label="Role">
      <USelectMenu
        v-model="state[resourceInfo.path].roles"
        placeholder="Select..."
        :options="options"
      />
    </UFormGroup>

    <UFormGroup name="checkbox" label="Permissions">
      <UCheckbox
        v-model="state[resourceInfo.path].view"
        class="mb-1"
        label="View"
        :disabled="state[resourceInfo.path].viewDisabled"
      />
      <UCheckbox
        v-model="state[resourceInfo.path].edit"
        class="mb-1"
        label="Edit"
        :disabled="state[resourceInfo.path].editDisabled"
      />
      <UCheckbox
        v-model="state[resourceInfo.path].delete"
        class="mb-1"
        label="Delete"
        :disabled="state[resourceInfo.path].deleteDisabled"
      />
    </UFormGroup>

    <UButton type="submit" :disabled="isSubmitDisabled"> Submit</UButton>
  </UForm>
</template>

<script setup lang="ts">
const props = defineProps({
  resourceInfo: {
    type: Object,
    required: true,
  },
});

import type { FormError, FormSubmitEvent } from "#ui/types";
import { useResourcesStore } from '@/stores/resPermissionStore'

const store = useResourcesStore();
const options = ref<{ label: string; value: number }[]>([]);
const selectedRole = ref();

const state = reactive<{
  [key: string]: {
    roles: { label: string; value: string };
    view: boolean;
    edit: boolean;
    delete: boolean;
    viewDisabled: boolean;
    editDisabled: boolean;
    deleteDisabled: boolean;
  };
}>({
  [props.resourceInfo.path]: {
    roles: { label: "", value: "0" },
    view: false,
    edit: false,
    delete: false,
    viewDisabled: false,
    editDisabled: false,
    deleteDisabled: false,
  },
});

const validate = (state: any): FormError[] => {
  const resourceInfo = props.resourceInfo;
  const errors = [];
  if (!state[resourceInfo.path].roles['value']) {
    errors.push({ path: 'roles', message: 'Required' });
  }
  if (!state[resourceInfo.path].view && !state[resourceInfo.path].edit && !state[resourceInfo.path].delete) {
    errors.push({ path: 'checkbox', message: 'Required' })
  }

  return errors;
};

const onSubmit = () => {
  const selectedPermissions = [];

  if (state[props.resourceInfo.path].view && !state[props.resourceInfo.path].viewDisabled) {
    selectedPermissions.push('view');
  }
  if (state[props.resourceInfo.path].edit && !state[props.resourceInfo.path].editDisabled) {
    selectedPermissions.push('edit');
  }
  if (state[props.resourceInfo.path].delete && !state[props.resourceInfo.path].deleteDisabled) {
    selectedPermissions.push('delete');
  }

  if (!selectedRole.value) {
    console.warn('Role is null, cannot add permissions.');
    return;
  }

  selectedPermissions.forEach(action => {
    const resourceInfo = props.resourceInfo as { path: string; id: number }
    store.addPermission(resourceInfo, selectedRole.value, action);
  });

  resetState();
};

const resetState = () => {
  state[props.resourceInfo.path] = {
    roles: { label: "", value: "0" },
    view: false,
    edit: false,
    delete: false,
    viewDisabled: false,
    editDisabled: false,
    deleteDisabled: false,
  };
}

onMounted(async () => {
  if(props.resourceInfo.id){
    await store.getRolesList();
    options.value = store.rolesList;
  }
  
  if (!state[props.resourceInfo.path]) {
    state[props.resourceInfo.path] = {
      roles: { label: "", value: "0" },
      view: false,
      edit: false,
      delete: false,
      viewDisabled: false,
      editDisabled: false,
      deleteDisabled: false,
    };
  }
});

watch(() => store.resourcesPermissions[props.resourceInfo.path], (newResourceInfo) => {

})

watch(() => props.resourceInfo.path, (newPath) => {
  if (!state[newPath]) {
    state[newPath] = {
      roles: { label: "", value: "0" },
      view: false,
      edit: false,
      delete: false,
      viewDisabled: false,
      editDisabled: false,
      deleteDisabled: false,
    }
  }
})

watch(() => state[props.resourceInfo.path].roles, (newRole) => {
  if (newRole && newRole.label) {
    selectedRole.value = newRole;

    state[props.resourceInfo.path].view = false;
    state[props.resourceInfo.path].edit = false;
    state[props.resourceInfo.path].delete = false;

    state[props.resourceInfo.path].viewDisabled = false;
    state[props.resourceInfo.path].editDisabled = false;
    state[props.resourceInfo.path].deleteDisabled = false;

    const perms = store.getPermissionsForPath(props.resourceInfo.path) || {};

    if (perms) {
      for (const role in perms) {
        if (role === selectedRole.value.label) { 
          for (const permId in perms[role]) {
            const action = perms[role][permId];

            if (action === "view") {
              state[props.resourceInfo.path].view = true;
              state[props.resourceInfo.path].viewDisabled = true;
            }
            if (action === "edit") {
              state[props.resourceInfo.path].edit = true;
              state[props.resourceInfo.path].editDisabled = true;
            }
            if (action === "delete") {
              state[props.resourceInfo.path].delete = true;
              state[props.resourceInfo.path].deleteDisabled = true;
            }
          }
        }
      }
    }

  } else {
    state[props.resourceInfo.path].view = false;
    state[props.resourceInfo.path].edit = false;
    state[props.resourceInfo.path].delete = false;
  }
});

const isSubmitDisabled = computed(() => {
  const { view, edit, delete: del, viewDisabled, editDisabled, deleteDisabled } = state[props.resourceInfo.path];

  return !(view && !viewDisabled) && !(edit && !editDisabled) && !(del && !deleteDisabled);
});
</script>
