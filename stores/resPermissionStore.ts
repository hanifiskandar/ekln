import { defineStore } from 'pinia'
import { ref } from 'vue'

// Define types for the state and resources
interface ResourceAction {
    [permId: string]: string; // actionId -> actionName (e.g., 'view', 'edit')
}

interface ResourcePermissions {
    id: number | null;
    name: string;
    description: string;
    path: string;
    routeName: string;
    actions: { [role: string]: ResourceAction }; // role -> { permId -> action }
    isRegistered: boolean;
    status: boolean;
}

interface ResourcesState {
    resourcesPermissions: Record<string, ResourcePermissions>; // path -> ResourcePermissions
    loading: boolean;
    error: string | null;
    rolesList: { label: string; value: number }[];
}

interface ResourceAPIResponse {
    id: number;
    path: string;
    name: string;
    description: string;
    actions: Array<{ role: string; perm_id: string; action_name: string }>;
    status: boolean;
}

interface ResourcesAPIResponse {
    data: ResourceAPIResponse[];
    success: boolean;
    status: string;
    message: string;
}

interface Role {
    id: number;
    role: string;
}

interface RolesAPIResponse {
    data: Role[];
}

interface PermissionAPIResponse {
    success: boolean;
    data: {
        permission_id: number;
    };
    message: string;
}

interface PermissionsForPath {
    [role: string]: { [permId: string]: string }; // role -> { permId -> action }
  }

export const useResourcesStore = defineStore('resourcesPermissions', {
    state: (): ResourcesState => ({
        resourcesPermissions: {},
        loading: false,
        error: null,
        rolesList: [],
    }),

    actions: {
        async populateResourcesState(allRoutes: Array<{ path: string; name: string }>) {
            if (this.loading) return

            this.loading = true
            this.error = null

            try {
                const response = await $fetch<ResourcesAPIResponse>('/api/auth/resources')

                if (response.success && Array.isArray(response.data)) {
                    allRoutes.forEach(route => {
                        if (!route.path.startsWith('/error')) {
                            const path = route.path
                            const routeName = route.name
                            let resource = response.data.find((resource) => resource.path === path)

                            if (!this.resourcesPermissions[path]) {
                                this.resourcesPermissions[path] = {
                                    id: null,
                                    name: route.name,
                                    path: path,
                                    routeName: routeName,
                                    description: '',
                                    actions: {},
                                    isRegistered: false,
                                    status: false,
                                }
                            }

                            if (resource) {

                                this.resourcesPermissions[path] = {
                                    ...this.resourcesPermissions[path],
                                    id: resource.id,
                                    name: resource.name,
                                    path: path,
                                    routeName: routeName,
                                    description: resource.description,
                                    isRegistered: true,
                                    status: resource.status,
                                }

                                if (resource.actions) {

                                    for (const [role, perms] of Object.entries(resource.actions)) {
                                        if (!this.resourcesPermissions[path].actions[role]) {
                                            this.resourcesPermissions[path].actions[role] = {};
                                        }

                                        for (const [perm_id, action_name] of Object.entries(perms)) {
                                            this.resourcesPermissions[path].actions[role][perm_id] = action_name;
                                        }
                                    }
                                }
                            } else {
                                this.resourcesPermissions[path].status = false
                            }
                        }
                    })
                } else {
                    throw new Error('Failed to fetch resources or invalid response format.')
                }
            } catch (error) {
                console.error('Error fetching resources:', error)
                this.error = (error instanceof Error) ? error.message : 'Unknown error'
            } finally {
                this.loading = false
            }
        },

        async addPermission(resourceInfo: { path: string; id: number; }, role: { label: string; value: number }, action: string) {
            try {
                const roleLabel = role.label;
                const roleID = role.value;
                const path = resourceInfo.path;
                const payload = {
                    resource_id: resourceInfo.id,
                    role_id: roleID,
                    action: action,
                }

                // console.log('payload', payload)

                const data = await $fetch<PermissionAPIResponse>('/api/auth/permission/register', {
                    method: 'POST',
                    body: payload,
                });

                if (!data.success) {
                    throw new Error('Failed to add permission');
                }

                const permission_id = data.data.permission_id;

                if (!this.resourcesPermissions[path]) {
                    this.resourcesPermissions[path] = {
                        id: null,
                        name: '',
                        path: path,
                        routeName: '',
                        description: '',
                        actions: {},
                        isRegistered: false,
                        status: false,
                    };
                }

                if (!this.resourcesPermissions[path].actions[roleLabel]) {
                    this.resourcesPermissions[path].actions[roleLabel] = {};
                }

                this.resourcesPermissions[path].actions[roleLabel][permission_id] = action;

                console.log(`Permission ${action} added for role ${roleLabel} on path ${path}`);

            } catch (error) {
                console.error('Error adding permission:', error);
                this.error = (error instanceof Error) ? error.message : 'Unknown error';
            } finally {
                this.loading = false;
            }
        },

        async updatePermissions(
            resourceInfo: { path: string; id: number },
            role: string,
            permission_id: string,
            newActionName: string
        ) {
            try {
                const path = resourceInfo.path;

                if (!this.resourcesPermissions[path]) {
                    console.warn(`Resource ${path} not found in state`);
                    return;
                }

                const rolePermissions = this.resourcesPermissions[path].actions[role];

                if (!rolePermissions) {
                    console.warn(`Role ${role} not found for resource ${path}`);
                    return;
                }

                if (!rolePermissions[permission_id]) {
                    console.warn(`Permission ${permission_id} not found for role ${role} on path ${path}`);
                    return;
                }

                // Update the permission action
                rolePermissions[permission_id] = newActionName;

                console.log(`Permission ${permission_id} updated to ${newActionName} for role ${role} on path ${path}`);

                // If needed, you can make an API call to persist the changes
                // For example, using a $fetch call to update the permission on the backend:
                // const response = await $fetch('/api/auth/permission/update', { method: 'PUT', body: { ... } });

                return true;

            } catch (error) {
                console.error('Error updating permission:', error);
                this.error = (error instanceof Error) ? error.message : 'Unknown error';
                return false;
            } finally {
                this.loading = false;
            }
        },

        async removePermissionById(resourceInfo: { path: string; id: number; }, path: string, role: string, permission_id: number) {
            try {
                const data = await $fetch<PermissionAPIResponse>(`/api/auth/permission/delete/${permission_id}`, {
                    method: 'DELETE',
                });

                console.log('Response data', data)

                if (!data.success) {
                    throw new Error('Failed to remove permission');
                }

                if (!this.resourcesPermissions[path]) {
                    console.warn(`Resource ${path} not found in state`);
                    return;
                }

                const actions = this.resourcesPermissions[path].actions;
                console.log('actions',actions);
                console.log('role',role);
                const rolePermissions = actions[role];
                console.log('rolePermissions',rolePermissions);

                if (rolePermissions && rolePermissions[permission_id]) {
                    delete rolePermissions[permission_id];

                    if (Object.keys(rolePermissions).length === 0) {
                        delete this.resourcesPermissions[path].actions[role];
                    }

                    if (Object.keys(this.resourcesPermissions[path].actions).length === 0) {
                        this.resourcesPermissions[path].status = false;
                    }

                    console.log(`Permission ${permission_id} removed for role ${role} on path ${path}`);
                    return true;
                } else {
                    console.warn(`Permission ${permission_id} not found for role ${role} on path ${path}`);
                    return false;
                }

            } catch (error) {
                console.error('Error removing permission:', error);
                this.error = (error instanceof Error) ? error.message : 'Unknown error';
                return false;
            } finally {
                this.loading = false;
            }
        },

        getPermissionsForPath(path: string): PermissionsForPath | null {
            return this.resourcesPermissions[path]?.actions ?? null;
        },

        // async updateStore(
        //     resourceInfo: { path: string; id: number },
        //     role: string,
        //     permission_id: string,
        //     newAction: string
        // ) {
        //     // Find the resource by path in the store
        //     const path = resourceInfo.path;
        //     const resource = this.resourcesPermissions[path];

        //     // Check if the resource exists in the store
        //     if (!resource) {
        //         console.warn(`Resource ${path} not found in store`);
        //         return;
        //     }

        //     // Check if the role exists in the resource's actions
        //     const rolePermissions = resource.actions[role];

        //     if (!rolePermissions) {
        //         console.warn(`Role ${role} not found for resource ${path}`);
        //         return;
        //     }

        //     // Check if the permission exists for the given role
        //     if (!rolePermissions[permission_id]) {
        //         console.warn(`Permission ${permission_id} not found for role ${role} on path ${path}`);
        //         return;
        //     }

        //     // Update the permission with the new action name
        //     rolePermissions[permission_id] = newAction;

        //     console.log(`Permission ${permission_id} updated to ${newAction} for role ${role} on path ${path}`);

        //     // Optionally, you can update the `status` of the resource if needed
        //     // For example, re-enable the resource if any actions exist
        //     if (Object.keys(resource.actions).length > 0) {
        //         resource.status = 'Enabled';
        //     }

        //     // If the resource has no actions left, disable the resource
        //     if (Object.keys(resource.actions).every(role => Object.keys(resource.actions[role]).length === 0)) {
        //         resource.status = 'Disabled';
        //     }

        //     // Return true to indicate that the store has been updated
        //     return true;
        // },

        async getRolesList() {
            this.loading = true;
            try {
                const response = await $fetch<RolesAPIResponse>('/api/auth/role/list', {
                    method: 'GET',
                });

                if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                    this.rolesList = response.data.map(item => ({
                        label: item.role,
                        value: item.id,
                    }));
                } else {
                    throw new Error('No roles found');
                }
            } catch (error) {
                console.error('Error fetching roles list:', error);
                this.error = error instanceof Error ? error.message : 'Unknown error';
                return [];
            } finally {
                this.loading = false;
            }
        },
    },
})
