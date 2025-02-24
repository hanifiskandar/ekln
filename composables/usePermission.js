import { ref } from "vue";
import { useRuntimeConfig } from "#imports";
import { useUserStore } from "@/stores/userStore.js";

export function usePermission(
        authRequired,
        RESOURCE_ROUTE,
        RESOURCE_IDENTIFIER,
        ACTION
    ) {
    const isLoading = ref(true);
    const hasPermission = ref(false);
    const user = useUserStore();
    const useUserSessions = ref(false); // set true kalau nak guna user sessions utk authorizations. Default backend.
    const userProfile = user.userProfile;

    function hasAccess(route, action) {
        const decryptedPathString = decryptData(userProfile.paths);
        const paths = JSON.parse(decryptedPathString);
        
        // console.log('Decrypted path:', paths);
        return paths[route] === action;
    }

    const checkPermissions = async () => {
        if (authRequired) {
            if (!user.isAuthenticated) {
                return navigateTo('/login');
            }

            if(useUserSessions.value) {
                console.log("Use user session's authorization");
                hasPermission.value = hasAccess(RESOURCE_ROUTE, ACTION);
                isLoading.value = false;
                return;
            } 

            const config = useRuntimeConfig();
            const SYSTEM_IDENTIFIER_HASH = config.public.systemIdentifier;
            const user_token = user.userProfile?.token;

            if (!user_token) {
                console.error("User token is undefined. User may not be authenticated.");
                return;
            }

            try { 
                const payload = {
                    SYSTEM_IDENTIFIER_HASH,
                    RESOURCE_ROUTE,
                    RESOURCE_IDENTIFIER,
                    ACTION,
                    user_token,
                };

                const base64_payload = btoa(JSON.stringify(payload));

                const response = await $fetch("/api/auth/permissions", {
                    method: "POST",
                    body: { 
                        payload: base64_payload 
                    },
                });

                if (response.data?.allowed !== undefined) {
                    console.log("Use backend's authorization");
                    hasPermission.value = response.data.allowed;
                } else {
                    console.error('Response does not contain "allowed" field:', response);
                    hasPermission.value = false;
                }
            } catch (error) {
                console.error("Failed to fetch permissions:", error);
                hasPermission.value = false;
            } finally {
                isLoading.value = false;
            }
        } else {
            // Kalau page tak perlu authenticate / authorize
            hasPermission.value = true;
            isLoading.value = false;
        }
    };

  return { isLoading, hasPermission, checkPermissions };
}
