export const userPermissionsStore = defineStore('userPermissions', () => {
    const permissions = ref({});
  
    const setPermissions = (actions) => {
      if (!permissions.value) {
        permissions.value = {
          canView: false,
          canEdit: false,
          canDelete: false,
        };
      }
  
      permissions.value.canView = actions.includes('view');
      permissions.value.canEdit = actions.includes('edit');
      permissions.value.canDelete = actions.includes('delete');
    };
  
    const getUserPermissions = () => {
      return permissions.value || { canView: false, canEdit: false, canDelete: false };
    };
  
    const removeUserPermissions = () => {
      if (permissions.value) {
        permissions.value = { canView: false, canEdit: false, canDelete: false };
      }
    };

    return {
      permissions,
      setPermissions,
      getUserPermissions,
      removeUserPermissions,
    };
  });
  