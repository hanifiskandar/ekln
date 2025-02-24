import { useCookie } from '#app';
import { initializeUserStore, useUserStore } from '@/stores/userStore.js';

export default defineNuxtRouteMiddleware(async (to, from) => {
    const currentRoute = to.fullPath;

    const tokenCookie = useCookie('tokenCookie');
    const refreshTokenCookie = useCookie('refreshTokenCookie');
    const userProfileCookie = useCookie('userProfileCookie');

    if(!userProfileCookie.value) {
        const user = useUserStore();
        user.logout();
        return navigateTo('/login');
    }

    const body = { 
        route: currentRoute,
        token: tokenCookie.value,
    };

    const { data } = await useFetch('/api/auth/route', {
        method: 'POST',  
        body: body,
    });

    if(!data.value){
        return navigateTo('/error/500');
    }
    
    const status = data?.value.status;
    if (status >= 200 && status < 300) {
        const resource = data?.value.data;
        if(resource) {
            if(!resource.isAuthorized && userProfileCookie.value.isAuthenticated) {
                return navigateTo('/error/forbidden');
            }

            if(!userProfileCookie.value.isAuthenticated) {
                console.log('User cookie is invalid')
                return navigateTo('/login');
            }

            if (currentRoute.startsWith('/admin')) {
                if(!userProfileCookie.value.isAdmin) {
                    return navigateTo('/error/forbidden');
                }
            }

            if(resource.actions){
                const userPermissions = userPermissionsStore();
                userPermissions.setPermissions(resource.actions);
            }

            return;
        } 
        
    }

    // User masih authinticated. Refresh token
    if(userProfileCookie.value.isAuthenticated) {
        const refreshBody = { 
            refresh_token: refreshTokenCookie.value,
        };
        
        const response = await $fetch('/api/auth/refresh_token', { 
            method: 'POST',  
            body: refreshBody,
        });

        if (response && response.data) {

            if(response.data.token){
                initializeUserStore();
                
                const newToken = response.data.token;
                const user = useUserStore();
                user.updateToken(newToken);
                console.log('Token refreshed, user session updated');
                return; 
            }
            console.log('Token not found.')
        } else {
            console.log('Error: Token refresh failed, redirecting to login');
            return navigateTo('/login');
        }
    }

    console.log(`An error occurred while processing the request (${status})`,data?.value.message)
    return navigateTo('/error/500');
});
