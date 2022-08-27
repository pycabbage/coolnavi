import { UserConfig } from 'vite'
import vuePlugin from '@vitejs/plugin-vue2'
import { createVuePlugin } from 'vite-plugin-vue2'

/** @type {UserConfig} */
export default {
  plugins: [createVuePlugin()]
}
