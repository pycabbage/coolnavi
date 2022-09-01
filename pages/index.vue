<template>
  <div style="width: 100vw; height: 100%">
    <gmap-map
      ref="mapRef"
      :center="{ lat: curLoc.lat, lng: curLoc.lng }"
      :zoom="15"
      map-type-id="terrain"
      style="width: 100vw; height: 100%"
      :options="{ streetViewControl: false }"
    >
      <gmap-marker
        key="curLoc"
        ref="myCurMarker"
        :position="curLoc"
        color="#0000AA"
      />
      <gmap-marker
        v-for="(m, index) in spots"
        ref="myMarker"
        :key="index"
        :position="m.position"
        :clickable="true"
        @click="toggleInfoWindow(m, index)"
      />

      <gmap-info-window
        key="m.text"
        :options="infoOptions"
        :position="infoWindowPos"
        :opened="infoWinOpen"
        @closeclick="infoWinOpen = false"
      >
        <h3>{{ infoWinText }}</h3>
      </gmap-info-window>
    </gmap-map>
    <v-dialog v-model="showDialog" width="100%">
      <v-toolbar dark>
        <v-btn icon dark @click="showDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ '図書館の詳細' }}</v-toolbar-title>
      </v-toolbar>
      <v-card>
        <v-card-title class="text-h5">
          {{ infoWinText }}
        </v-card-title>
        <v-card-subtitle>{{ infoWinTextDistance }}</v-card-subtitle>
        <v-card-actions>
          <v-btn text @click.stop="goto()"> Go here </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// @ts-ignore
import { gmapApi } from 'vue2-google-maps'
import tosyo from './output.json'

// eslint-disable-next-line require-await
const sleep = async function (/** @type {number} */ msec) {
  return new Promise((resolve, reject) => setTimeout(resolve, msec))
}

// @ts-ignore
export default {
  name: 'IndexPage',
  /**
   * @return {{
   *  going: boolean,
   *  showDialog: boolean,
   *  curLoc: {
   *    lat: number,
   *    lng: number,
   *  },
   *  nearDistance: number,
   *  infoOptions: any,
   *  infoWindowPos: any,
   *  infoWinOpen: boolean,
   *  infoWinText: string,
   *  infoWinTextDistance: string,
   *  spots: {
   *   position: {
   *     lat: number,
   *     lng: number,
   *   },
   *   text: string,
   *  }[]
   * }}
   */
  data() {
    return {
      going: false,
      showDialog: false,
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35,
        },
      },
      infoWindowPos: null,
      infoWinOpen: false,
      infoWinText: 'LIBRARY',
      infoWinTextDistance: '100km',
      nearDistance: 3,
      curLoc: {
        lat: 0,
        lng: 0,
      },
      spots: [],
    }
  },
  computed: {
    google: gmapApi,
  },
  async mounted() {
    /**
     * 現在位置
     * @type {{
     *   lat: number,
     *   lng: number,
     * }}
     */
    console.log('getting current location')
    this.curLoc = await this.getCurrentLocation()
    let map
    while (true) {
      await sleep(300)
      // @ts-ignore
      if (this.$refs.mapRef) map = await this.$refs.mapRef.$mapPromise
      if (map) break
      console.log('waiting map')
    }
    console.log('this.$refs.mapRef : ', map)
    await map.panTo({ lat: this.curLoc.lat, lng: this.curLoc.lng })
    const fTosho = this.getNearLib(this.curLoc)
    this.spots = fTosho.map((d) => {
      return {
        icon: 'mdi-domain',
        text: d.tosho['施設名'],
        distance: d.distanceText,
        link: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          d.tosho['施設名']
        )}`,
        position: {
          lat: parseFloat(d.tosho['緯度']),
          lng: parseFloat(d.tosho['経度']),
        },
        lat: parseFloat(d.tosho['緯度']),
        lng: parseFloat(d.tosho['経度']),
      }
    })
    console.log('this.spots', this.spots)
  },
  methods: {
    goto() {
      this.showDialog = false
      console.log('GO!')
    },
    toggleInfoWindow(marker, index) {
      console.log('toggleInfoWindow', marker, index)
      this.infoWindowPos = marker.position
      // this.infoWinOpen = true
      this.showDialog = true
      this.infoWinText = `${marker.text}`
      this.infoWinTextDistance = `${marker.distance}`
    },
    /**
     * 緯度経度から距離を算出
     * @param {number} lat1 緯度1
     * @param {number} lng1 経度1
     * @param {number} lat2 緯度2
     * @param {number} lng2 経度2
     * @return {number} 直線距離[km]
     * @link {https://keisan.casio.jp/exec/system/1257670779}
     */
    getDistanceByLatLong(lat1, lng1, lat2, lng2) {
      /**
       * 地球の赤道半径 [km]
       */
      const r = 6378.137
      lat1 *= Math.PI / 180
      lng1 *= Math.PI / 180
      lat2 *= Math.PI / 180
      lng2 *= Math.PI / 180
      const d =
        r *
        Math.acos(
          Math.sin(lat1) * Math.sin(lat2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1)
        )
      return d
    },

    /**
     * 現在地を取得
     * @return {Promise<{
     *   lat: number,
     *   lng: number,
     * }>}
     */
    getCurrentLocation() {
      const options = {
        enableHightAccuracy: false,
        timeOut: 5000,
        maximumAge: 0,
      }
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })
          },
          reject,
          options
        )
      })
    },

    /**
     * 近くの図書館を取得
     * @param {{ lat: number; lng: number; }} curLoc
     */
    getNearLib(curLoc) {
      const fTosho = tosyo
        // eslint-disable-next-line array-callback-return
        .map((d) => {
          const dis = this.getDistanceByLatLong(
            curLoc.lat,
            curLoc.lng,
            parseFloat(d['緯度']),
            parseFloat(d['経度'])
          )
          if (dis <= this.nearDistance) {
            return {
              tosho: d,
              distance: dis,
              distanceText: `${dis.toFixed(2)}km`,
            }
          }
        })
        .filter((v) => v)
      return fTosho
    },
  },
}
</script>
