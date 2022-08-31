import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyA_zlu8mk7oIDv5Vt7QFNyrhv0FSxCuaZM',
    libraries: 'places',
  },
  installComponents: true,
})
