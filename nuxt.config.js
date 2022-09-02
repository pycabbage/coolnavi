import colors from 'vuetify/es5/util/colors'

// const domain = 'http://localhost:3000/'
const domain = 'https://coolnavi.vercel.app/'

/** @type { import("@nuxt/types").NuxtConfig } */
const config = {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'server',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - クールナビ',
    title: 'クールナビ',
    htmlAttrs: {
      lang: 'ja',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'クールシェアスポットを探し、削減できた消費電力量を可視化します。',
      },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [{ src: 'plugins/vue2-google-maps.js' }],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Change default nuxt ssr value: https://nuxtjs.org/docs/configuration-glossary/configuration-ssr
  ssr: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // // https://go.nuxtjs.dev/eslint
    // '@nuxtjs/eslint-module',
    // https://sitemap.nuxtjs.org/
    '@nuxtjs/sitemap',
    // https://github.com/nuxt-community/robots-module
    '@nuxtjs/robots',
    // https://pwa.nuxtjs.org/
    '@nuxtjs/pwa',
    // https://github.com/nuxt-community/amp-module
    '@nuxtjs/amp',
    // https://github.com/nuxt-community/onesignal-module
    '@nuxtjs/onesignal',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  sitemap: {
    hostname: domain,
    gzip: true,
  },

  amp: {
    origin: domain,
  },

  robots: {},

  pwa: {
    icon: {},
    meta: {
      name: 'クールナビ',
      lang: 'ja',
      theme_color: '#bad6c9',
      twitterCard: 'summary_large_image',
      ogHost: domain,
    },
    manifest: {
      name: 'クールナビ',
      short_name: 'クールナビ',
      lang: 'ja',
      useWebmanifestExtension: true,
    },
  },

  oneSignal: {
    cdn: true,
    init: {
      appId: '924b626d-12b1-4199-ad0a-03ad20929d65',
      allowLocalhostAsSecureOrigin: true,
      welcomeNotification: {
        disable: false,
      },
    },
  },

  render: {
    // csp: {
    //   hashAlgorithm: 'sha256',
    //   addMeta: true,
    // },
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // // https://go.nuxtjs.dev/axios
    // '@nuxtjs/axios',
    // https://color-mode.nuxtjs.org/
    '@nuxtjs/color-mode',
  ],

  // // Axios module configuration: https://go.nuxtjs.dev/config-axios
  // axios: {
  //   // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
  //   baseURL: '/',
  // },

  // https://color-mode.nuxtjs.org/
  colorMode: {
    preference: 'system', // default value of $colorMode.preference
    fallback: 'dark', // fallback value if not system preference found
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '-mode',
    storageKey: 'nuxt-color-mode',
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
        light: {
          primary: colors.blue.lighten2,
          accent: colors.grey.lighten3,
          secondary: colors.amber.lighten3,
          error: colors.red.accent3,
          info: colors.teal.darken1,
          warning: colors.amber.base,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^vue2-google-maps($|\/)/],
    extend(config, ctx) {
      config.devtool = 'source-map'
    },
  },
  serverMiddleware: ['~~/api/'],
}

export default config;
