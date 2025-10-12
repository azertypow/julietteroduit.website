// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  runtimeConfig: {
    secret_API_AUTH_EMAIL: process.env.API_AUTH_EMAIL,
    secret_API_AUTH_PASSWORD: process.env.API_AUTH_PASSWORD,
    public: {
      apiUrl: process.env.NUXT_API_URL,
    }
  },
  css: ['~/assets/style/_main.scss'],
  devtools: { enabled: true }
})
