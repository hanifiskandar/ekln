import { useUserStore } from '~/stores/userStore.js';
import { useRouter } from 'vue-router';

export function useAuthCheck() {
  const userStore = useUserStore();
  const router = useRouter();

  const authRequired = ref(false);
  const adminRequired = ref(false);

  const checkAuth = async () => {
    await userStore.checkAuth();
    console.log('User Profile:', userStore.userProfile);

    const isAuthenticated = userStore.isAuthenticated;
    const isAdmin = userStore.isAdmin;

    if (authRequired.value && !isAuthenticated) {
      await router.push('/login');
    }

    if (adminRequired.value && !isAdmin) {
      await router.push('/forbidden');
    }
  };

  return { authRequired, adminRequired, checkAuth };
}
