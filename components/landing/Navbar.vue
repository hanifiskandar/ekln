<template>
  <LandingContainer>
    <header v-if="isHydrated" class="flex flex-col lg:flex-row justify-between items-center my-5">
      <div class="flex w-full lg:w-auto items-center justify-between">
        <NuxtLink to="/" class="flex items-center">
          <img src="@/assets/img/logo.png" alt="Logo" class="h-16 mr-1" />
          <div class="border-l border-gray-300 h-12 mr-3"></div>
          <div class="flex flex-col">
            <span class="font-bold text-lg letter-spacing">INTERNSHIP</span>
            <span class="text-sm mt-1" style="margin-top: -7px"
              >Kementerian Kerja Raya</span
            >
          </div>
        </NuxtLink>
        <div class="block lg:hidden">
          <button @click="open = !open" class="text-gray-800">
            <svg
              fill="currentColor"
              class="w-4 h-4"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path
                v-show="open"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M18.278 16.864a1 1 0 01-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 01-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 011.414-1.414l4.829 4.828 4.828-4.828a1 1 0 111.414 1.414l-4.828 4.829 4.828 4.828z"
              ></path>
              <path
                v-show="!open"
                fill-rule="evenodd"
                d="M4 5h16a1 1 0 010 2H4a1 1 0 110-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <nav class="w-full lg:w-auto mt-2 lg:flex lg:mt-0" :class="{ block: open, hidden: !open }" >
        <ul class="flex flex-col lg:flex-row lg:gap-3">
          <li v-for="item of filteredMenu" :key="item.title">
            <a :href="item.path" class="flex lg:px-3 py-2 text-gray-600 hover:text-gray-900">
              {{ item.title }}
            </a>
          </li>
          <li v-if="isAdmin" class="relative" @click="toggleAdminMenu">
            <button class="flex lg:px-3 py-2 text-gray-600 hover:text-gray-900">
              Admin Menu
              <svg
                :class="{'rotate-180': adminMenuOpen, 'rotate-0': !adminMenuOpen}"
                class="ml-2 transition-transform duration-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>

            <!-- Admin Submenu -->
            <ul v-if="adminMenuOpen" class="absolute bg-white shadow-lg rounded-lg left-0 z-10 mt-2 py-2 px-4 w-48">
              <li v-for="item in adminMenu" :key="item.title">
                <a :href="item.path" class="block px-4 py-2 text-gray-600 hover:bg-gray-200">
                  {{ item.title }}
                </a>
              </li>
            </ul>
          </li>
        </ul>
        <div class="lg:hidden flex items-center mt-3 gap-4">
          <div v-if="isLoading"></div>
          <div v-else>
            <LandingLink href="/login" size="md" block>Warga KKR</LandingLink>
          </div>
        </div>
      </nav>
      <div>
        <div class="hidden lg:flex items-center gap-4">
            <LandingLink v-if="!isAuthenticated" href="/login" size="md">Warga KKR</LandingLink>
            <div v-else class="relative flex items-center" @click="toggleDropdown">
              <img src="@/assets/img/avatar.png" alt="Profile Picture" class="w-10 h-10 rounded-full cursor-pointer" />
              <div v-if="dropdownOpen" class="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-lg z-10">
                <ul class="p-2">
                  <li class="py-1 px-4 hover:bg-gray-200 cursor-pointer">
                    {{ userProfile.roles[0] }}
                  </li>
                  <li class="py-1 px-4 hover:bg-gray-200 cursor-pointer">
                    {{ userProfile.email_rasmi }}
                  </li>
                  <li
                    class="py-1 px-4 hover:bg-gray-200 cursor-pointer"
                    @click="logout"
                  >
                    Logout
                  </li>
                </ul>
              </div>
            </div>
        </div>
      </div>
    </header>
  </LandingContainer>
</template>

<script setup>
import { useUserStore } from "@/stores/userStore.js";
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const user = useUserStore();
const userProfile = computed(() => user.userProfile);
const isAuthenticated = computed(() => user.isAuthenticated);
const isAdmin = computed(() => user.isAdmin); 

const isHydrated = ref(false);
const isLoading = ref(true);
const dropdownOpen = ref(false);
const adminMenuOpen = ref(false);
const open = ref(false);

// Route utk user yg logged in set attribute authRequired: true
const menuitems = ref([
  { title: "Features", path: "#" },
  { title: "Sertai kami", path: "/register" },
  { title: "Permohonan (auth)", path: "/auth/application" },
  { title: "Permohonan (admin)", path: "/admin/application" },
  { title: "Mengenai kami", path: "/auth/about" },
  { title: "Hubungi kami", path: "/contact" }

]);

// Untuk admin masukkan dalam menu ni
const adminMenu = [
  { title: "User List", path: "/admin/user/list" },
  { title: "Permissions", path: "/admin/resources/permissions" }
];

const filteredMenu = computed(() => {
  return menuitems.value.filter(item => {
    if (item.path.startsWith('/admin')) {
      return isAuthenticated.value && isAdmin.value; 
    }
    if (item.path.startsWith('/auth')) {
      return isAuthenticated.value; 
    }
    
    return true; 
  });
});

function logout() {
  user.logout();
  router.push("/login");
}

function toggleAdminMenu(event) {
  event.stopPropagation();
  adminMenuOpen.value = !adminMenuOpen.value;
}

function toggleDropdown(event) {
  event.stopPropagation();
  dropdownOpen.value = !dropdownOpen.value;
}

function handleClickOutside(event) {
  const profileDropdown = document.querySelector(".relative .absolute");

  if (profileDropdown && !profileDropdown.contains(event.target)) {
    dropdownOpen.value = false;
  }
}

onMounted(() => {
  user.checkAuth();
  isLoading.value = false;
  isHydrated.value = true;
  document.addEventListener("click", handleClickOutside);
  const userProfileCookie = useCookie('userProfileCookie');
  if(!userProfileCookie.value){
    console.log('Logging out. Cookie expired.')
    user.logout();
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

</script>
