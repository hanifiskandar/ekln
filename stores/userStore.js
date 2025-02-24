import { defineStore } from 'pinia';

const parseUserData = (data) => {
  data.isAuthenticated = true;
  return {
    userProfile: data,
    isAuthenticated: true,
    isAdmin: data.isAdmin || false,
    token: data.token || null,
    refresh_token: data.refresh_token || null,
  };
};

export const useUserStore = defineStore("userStore", {
  state: () => ({
    userProfile: null,
    isAuthenticated: false,
    isAdmin: false,
    token: null,
    refresh_token: null,
    sessionTimeout: null,
    loading: true,
  }),
  actions: {
    setUser(userData) {
      const parsedData = parseUserData(userData);
      Object.assign(this, parsedData);
      this.token = parsedData.token;
      this.refresh_token = parsedData.refresh_token;
      this.isAdmin = parsedData.isAdmin;
      this.isAuthenticated = parsedData.isAuthenticated;
      this.startSessionTimeout();

      if (process.client) {
        localStorage.setItem("userProfile", JSON.stringify(userData));
      }

      this.loading = false;
    },
    async updateToken(newToken) {
      if (process.client) {
        const userData = localStorage.getItem("userProfile");
        // console.log('This', userData.token)
        userData.token = newToken;
        userData.userProfile.token = newToken;
      }

      const tokenCookie = useCookie('tokenCookie');
      tokenCookie.value = newToken;
      tokenCookie.maxAge = 60 * 60 * 24; 

      // const refreshTokenCookie = useCookie('refreshTokenCookie');
      // refreshTokenCookie.value = this.refresh_token;  // Assuming refresh_token is already set
      // refreshTokenCookie.maxAge = 60 * 60 * 24;  // Set the cookie to last for 1 day

      const userProfileCookie = useCookie('userProfileCookie');
      userProfileCookie.value = this.userProfile;

      if (process.client) {
        localStorage.setItem("userProfile", JSON.stringify(this.userProfile));
      }

      // console.log('Token updated in userProfile and cookies:', newToken);
    },
    async checkAuth() {
      if (process.client) {
        const userData = localStorage.getItem("userProfile");
        if (userData) { 
          const parsedData = JSON.parse(userData); 
          this.setUser(parsedData); 
        } else { 
          this.loading = false;
        }
      }
    },
    logout() {
      this.userProfile = null;
      this.isAuthenticated = false;
      this.isAdmin = false;
      this.token = null,
      this.refresh_token = null,
      this.clearSessionTimeout();

      const tokenCookie = useCookie('tokenCookie');
      tokenCookie.value = null;
      tokenCookie.maxAge = 0;

      const refreshTokenCookie = useCookie('refreshTokenCookie');
      refreshTokenCookie.value = null;
      refreshTokenCookie.maxAge = 0;

      const userProfileCookie = useCookie('userProfileCookie');
      userProfileCookie.value = null;
      userProfileCookie.maxAge = 0;

      const isAuthenticatedState = useState('isAuthenticated', () => null);
      isAuthenticatedState.value = null;

      if (process.client) {
        localStorage.removeItem("userProfile");
      }
    },
    startSessionTimeout() {
      this.clearSessionTimeout();

      this.sessionTimeout = setTimeout(() => {
        this.logout();
      }, 30 * 60 * 1000); // 30 minutes
    },
    clearSessionTimeout() {
      if (this.sessionTimeout) {
        clearTimeout(this.sessionTimeout);
        this.sessionTimeout = null;
      }
    },
  },
  getters: {
    isAuthenticatedGetter(state) {
      const isAuthenticatedState = useState('isAuthenticated');
      return isAuthenticatedState.value;
    },
  },
});

export function initializeUserStore() {
  const user = useUserStore();
  user.checkAuth();
}
