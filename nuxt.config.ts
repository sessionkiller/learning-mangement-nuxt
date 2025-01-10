import Aura from '@primevue/themes/aura';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  ssr: false,
  
  app: {
    head: {
      title: "Learn.io",
      meta: [
        { name: 'description', content: "A learning platform" }
      ],
      bodyAttrs: {
        class: 'dmSans-font'
      }
    },
  },

  modules: [
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
    'nuxt-lucide-icons'
  ],

  runtimeConfig:{
    clerkSecretKey: '',
    public: {
      apiBaseUrl : '',
      clerkPublishableKey: ''
    }
  },

  css: ['~/assets/globals.css'],

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  primevue: {
    options: {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: ".app-dark",
        }
      }
    },
    components: {
      prefix: "P",
    }
  },

  lucide: {
    namePrefix: 'Icon'
  }
})