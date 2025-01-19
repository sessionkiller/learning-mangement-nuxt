import Aura from "@primevue/themes/aura";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  ssr: false,

  app: {
    head: {
      title: "Learn.io",
      meta: [{ name: "description", content: "A learning platform" }],
      bodyAttrs: {
        class: "dmSans-font",
      },
    },
  },

  modules: [
    "@clerk/nuxt",
    "@vee-validate/nuxt",
    "@nuxt/image",
    "@nuxtjs/tailwindcss",
    "@primevue/nuxt-module",
    "nuxt-lucide-icons",
    "@vueuse/motion/nuxt",
    "@pinia/nuxt",
  ],

  runtimeConfig: {
    clerkSecretKey: "",
    public: {
      apiBaseUrl: "",
      localUrl: "",
      vercelUrl: "",
      clerkPublishableKey: "",
      stripePublicKey: "",
    },
  },

  css: ["~/assets/globals.css"],

  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],

  veeValidate: {
    // disable or enable auto imports
    autoImports: true,
    // Use different names for components
    componentNames: {
      Form: "VeeForm",
      Field: "VeeField",
      FieldArray: "VeeFieldArray",
      ErrorMessage: "VeeErrorMessage",
    },
  },

  primevue: {
    options: {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: ".app-dark",
        },
      },
    },
    components: {
      prefix: "P",
    },
  },

  lucide: {
    namePrefix: "Icon",
  },
});
