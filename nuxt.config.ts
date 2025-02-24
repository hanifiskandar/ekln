// https://nuxt.com/docs/api/configuration/nuxt-config
import dotenv from 'dotenv'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import type { NuxtPage } from 'nuxt/schema'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

export default defineNuxtConfig({
  devtools: { enabled: true },
  hooks: {
    'pages:extend' (pages) {
      function setMiddleware (pages: NuxtPage[]) {
        for (const page of pages) {
          if (page.path.startsWith('/admin') || page.path.startsWith('/auth')) {
            page.meta ||= {}
            // Note: This will override any middleware set in `definePageMeta` in the page
            page.meta.middleware = ['check-auth'] // middleware/checkAuth.js
          }
          if (page.children) {
            setMiddleware(page.children)
          }
        }
      }
      setMiddleware(pages)
    }
  },
  css: [
    "@/assets/css/main.css",
    '@fortawesome/fontawesome-free/css/all.css',
  ],
  
  plugins: [
    '~/plugins/toastify.ts',
  ],

  alias: {
    '@': __dirname,
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: [
    'nuxt-icon',
    '@pinia/nuxt',
    '@nuxt/ui',
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
  ],

  runtimeConfig: {
    public: {
      systemIdentifier: process.env.NUXT_PUBLIC_SYSTEM_IDENTIFIER,
      // systemIdentifier: process.env.NUXT_PUBLIC_SYSTEM_IDENTIFIER || 'internship_hash',
      // systemIdentifier: process.env.NODE_ENV === 'production' ? process.env.SYSTEM_IDENTIFIER : 'internship_hash',
    },
    private: {
      userAuthApiUrl: process.env.NUXT_PUBLIC_SYSTEM_IDENTIFIER,
      userProfileApiUrl: process.env.NUXT_PRIVATE_USER_PROFILE_API_URL,
      refGenericApiUrl: process.env.NUXT_PRIVATE_REF_GENERIC_API_URL,
      refHrApiUrl: process.env.NUXT_PRIVATE_REF_HR_API_URL,
      internshipApiUrl: process.env.NUXT_PRIVATE_INTERNSHIP_API_URL,
      // userAuthApiUrl: process.env.USER_AUTH_API_URL || '10.9.206.193:5003',
      // userProfileApiUrl: process.env.USER_PROFILE_API_URL || '10.9.206.193:5004',
      // refGenericApiUrl: process.env.REF_GENERIC_API_URL || '10.9.206.193:5008',
      // refHrApiUrl: process.env.REF_HR_API_URL || '10.9.206.193:5011',
      // internshipApiUrl: process.env.INTERNSHIP_API_URL || '10.9.206.193:5006',
      // userAuthApiUrl: process.env.NODE_ENV === 'production' ? process.env.USER_AUTH_API_URL : '10.9.206.193:5003',
      // userProfileApiUrl: process.env.NODE_ENV === 'production' ? process.env.USER_PROFILE_API_URL : '10.9.206.193:5004',
      // refGenericApiUrl: process.env.NODE_ENV === 'production' ? process.env.REF_GENERIC_API_URL : '10.9.206.193:5008',
      // refHrApiUrl: process.env.NODE_ENV === 'production' ? process.env.REF_HR_API_URL : '10.9.206.193:5011',
      // internshipApiUrl: process.env.NODE_ENV === 'production' ? process.env.INTERNSHIP_API_URL : '10.9.206.193:5006',
    }
  },

  compatibilityDate: '2024-11-10'
});