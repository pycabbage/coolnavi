<template>
  <gmap-map
    ref="mapRef"
    :center="{ lat: curLoc.lat, lng: curLoc.long }"
    :zoom="15"
    map-type-id="terrain"
    style="width: 100%; height: 100%"
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
      :key="index"
      ref="myMarker"
      :position="m.position"
      :clickable="true"
      @click="toggleInfoWindow(m)"
      @closeclick="infoWinOpen = false"
    />
    <gmap-info-window
      v-for="(m, _index) in spots"
      :key="m.text"
      :options="infoOptions"
      :position="infoWindowPos"
      :opened="infoWinOpen"
      @click="toggleInfoWindow(m)"
    >
      <h3>
        {{ m.text }}
      </h3>
    </gmap-info-window>
  </gmap-map>
</template>

<script>
// @ts-ignore
import { gmapApi } from 'vue2-google-maps'
import tosyo from './output.json'

export default {
  name: 'MapPage',
  /**
   * @return {{
   *  curLoc: {
   *    lat: number,
   *    long: number,
   *  },
   *  nearDistance: number,
   *  infoOptions: any,
   *  infoWindowPos: any,
   *  infoWinOpen: boolean,
   *  spots: {
   *   position: {
   *     lat: number,
   *     long: number,
   *   },
   *   text: string,
   *  }[]
   * }}
   */
  data() {
    return {
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35,
        },
      },
      infoWindowPos: null,
      infoWinOpen: false,
      nearDistance: 3,
      curLoc: {
        lat: 0,
        long: 0,
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
     *   long: number,
     * }}
     */
    console.log('getting current location')
    this.curLoc = await this.getCurrentLocation()
    console.log('preparing map')
    // @ts-ignore
    const map = await this.$refs.mapRef.$mapPromise
    console.log('panning map')
    await map.panTo({ lat: this.curLoc.lat, lng: this.curLoc.long })
    // @ts-ignore
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
        long: parseFloat(d.tosho['経度']),
      }
    })
    console.log('this.spots', this.spots)
    },
  methods: {
    /**
     * @param {{ position: {lat:number,lng:number}; }} marker
     */
    toggleInfoWindow(marker) {
      console.log('toggleInfoWindow', marker.position)
      this.infoWindowPos = marker.position
      this.infoWinOpen = !this.infoWinOpen
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
     *   long: number,
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
              long: position.coords.longitude,
            })
          },
          reject,
          options
        )
      })
    },

    /**
     * 近くの図書館を取得
     * @param {{ lat: number; long: number; }} curLoc
     */
    getNearLib(curLoc) {
      const fTosho = tosyo
        // eslint-disable-next-line array-callback-return
        .map((d) => {
          const dis = this.getDistanceByLatLong(
            curLoc.lat,
            curLoc.long,
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
