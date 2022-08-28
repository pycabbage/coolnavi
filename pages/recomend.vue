<template>
  <!-- <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="logo py-4 d-flex justify-center"> aaaaa</v-card>
    </v-col>
  </v-row>
  -->
  <v-card class="mx-auto" max-width="300" tile>
    <v-list dense>
      <v-subheader>{{ this.nearDistance }}km圏内の図書館</v-subheader>
      <v-list-item-group color="primary">
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :href="item.link"
          target="_blank"
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.text"></v-list-item-title>
            <v-list-item-content v-text="item.distance"></v-list-item-content>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script>
import tosyo from './output.json'

export default {
  mounted: async function () {
    // @ts-ignore
    const fTosho = await this.getNearLib()
    this.items = fTosho.map((d) => {
      return {
        icon: 'mdi-domain',
        text: d.tosho['施設名'],
        distance: d.distanceText,
        link: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          d.tosho['施設名']
        )}`,
      }
    })
  },
  data() {
    return {
      items: [
        // { icon: 'mdi-domain', text: '○○図書館' },
        // { icon: 'mdi-domain', text: '××美術館' },
        // { icon: 'mdi-domain', text: '△△図書館' },
      ],
      nearDistance: 2,
    }
  },
  methods: {
    /**
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

    async getNearLib() {
      const curLoc = await this.getCurrentLocation()
      const fTosho = tosyo
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
          } else {
            return
          }
        })
        .filter((v) => v)
      return fTosho
    },
  },
}
</script>