<template>
  <div justify="center">
    <v-row align-content="center">
      <v-col align="center" >
        <h2 class="mt-10" >声で質問する</h2>
        <v-btn x-large class="mx-2 my-5" fab color="blue" @click="gen">
          <v-icon>mdi-account-circle</v-icon>
        </v-btn>
        <h2>{{ msg }}</h2>
        <v-btn @click="move">近くのクールシェアスポットを探す</v-btn>
      </v-col>
    </v-row>
    <!-- <Recomend></Recomend> -->
  </div>
</template>

<script>
import kuromoji from 'kuromoji'
import tosyo from './output.json'
// @ts-ignore
import Recomend from './recomend.vue'

/**
 * @typedef {{
 *  "区市町村名": string,
 *  "施設区分": string,
 *  "施設名"
 *  "所在地": string,
 *  "緯度": string,
 *  "経度": string,
 *  "座標系": string,
 *  "電話番号": string,
 *  "備考": string,
 * }} ToshokanDict
 */

/**
 * @typedef {{
 *   dt: number,
 *   main: {
 *     temp: number,
 *     feels_like: number,
 *     temp_min: number,
 *     temp_max: number,
 *     pressure: number,
 *     sea_level: number,
 *     grnd_level: number,
 *     humidity: number,
 *     temp_kf: number,
 *   },
 *   weather: any
 * }} TempReturn
 */

export default {
  name: 'IndexPage',
  components: { Recomend },
  data() {
    return {
      msg: '',
    }
  },
  methods: {
    move() {
      // @ts-ignore
      this.$router.push('/recomend')
    },
    gen() {
      // const DICT_PATH = "./dict";
      console.log('ok')
      // @ts-ignore
      const recognition = new webkitSpeechRecognition()
      recognition.onresult = (event) => {
        console.log('ninshiki')
        /** @type {string} */
        const recText = event.results[0][0].transcript
        // const recText = '目黒図書館で3時間本を読みます。'
        kuromoji
          .builder({
            dicPath: './dict',
          })
          .build(async (__err, tokenizer) => {
            const token = tokenizer.tokenize(recText.trim())
            console.table(token)
            // 所要時間を取得
            const jMap = token.map((t) =>
              [t.pos_detail_1, t.pos_detail_2, t.pos_detail_3].includes(
                '助数詞'
              )
            )
            const nMap = token
              .slice(jMap.indexOf(true) - 1, jMap.indexOf(true) + 1)
              .map((d) => d.surface_form)
            console.log('所要時間:', nMap)
            let byou = parseInt(nMap[0])
            if (nMap[1].startsWith('分')) byou *= 60
            if (nMap[1].startsWith('時間')) byou *= 60 * 60
            if (nMap[1].startsWith('日')) byou *= 60 * 60 * 24
            console.log('秒数:', byou)
            // 図書館名を取得
            const fToken = token.filter((t) => t.pos === '名詞')
            const matchArray = ['図書館', '美術館']
            const indexOfMatched = fToken
              .map((d) => matchArray.includes(d.surface_form))
              .indexOf(true)
            const matchedArray = fToken.slice(
              indexOfMatched - 1,
              indexOfMatched + 1
            )
            /**
             * 施設名
             */
            const matched = matchedArray.map((d) => d.surface_form).join('')
            console.log(matched)
            const toshoPos = this.getTosyoLocation(matched)
            /**
             * 現在地
             */
            const curLoc = await this.getCurrentLocation()
            /**
             * 目的地までの所要時間
             */
            const reqTime = await this.getRequiredTime(
              curLoc.lat,
              curLoc.long,
              // toshoPos.lat,
              // toshoPos.lon,
              toshoPos.lat,
              toshoPos.lon
            )
            /**
             * 現在地の気温
             */
            const curTemp = (await this.temp(curLoc.lat, curLoc.long)).main.temp
            /**
             * 外出時間
             */
            const shoyou = reqTime.value * 2 + byou
            console.log('片道', reqTime.value, '秒')
            console.log('所要時間:', shoyou, '秒')
            console.log('現在地の気温:', curTemp)

            // エアコンの判定
            let hantei = ''
            if (curTemp <= 35 && shoyou >= 1800) {
              hantei = '消したほうが良いかもしれません'
            } else {
              hantei = 'つけたほうが良いかもしれません'
            }
            this.msg = hantei
            // document.body.innerText
          })
      }
      recognition.start()
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
    success(position) {
      const pos = {
        lat: position.coords.latitude,
        long: position.coords.longitude,
      }
      console.log(pos)
      return pos
    },
    error(error) {
      console.log(`ERROR(${error.code}):${error.message}`)
    },
    _temp() {
      this.temp()
    },
    /**
     * 気温を取得
     * @param {number} latitude
     * @param {number} longitude
     * @return {Promise<TempReturn>}
     */
    temp(latitude = 35.4648142, longitude = 139.5585634) {
      // const _latitude = 35.4648142
      // const _longitude = 139.5585634
      const API_KEY = 'dc31582af77b77e4e9bea929b3c6b8bf'
      const url =
        'https://api.openweathermap.org/data/2.5/forecast?lat=' +
        latitude +
        '&lon=' +
        longitude +
        '&units=metric&appid=' +
        API_KEY
      console.log(url)
      return fetch(url)
        .then((data) => {
          return data.json()
        })
        .then((json) => {
          console.log(json.list[0])
          // @ts-ignore
          window.temp = JSON.stringify(json)
          return json.list[0]
        })
        .catch((error) => {
          console.error(error)
        })
    },
    /**
     * @param {string|number} lat
     * @param {string|number} lng
     * @param {string|number} lat2
     * @param {string|number} lng2
     * @return {Promise<{
     *   value: number,
     *   text: string
     * }>}
     */
    getRequiredTime(lat, lng, lat2, lng2) {
      // const lat = 35.4648142
      // const lng = 139.5585634
      // const lat2 = 35.5648142
      // const lng2 = 139.5585634
      const API_KEY = 'AIzaSyA_zlu8mk7oIDv5Vt7QFNyrhv0FSxCuaZM'
      const url = `/api?lat1=${lat}&lng1=${lng}&lat2=${lat2}&lng2=${lng2}`
      return fetch(url)
        .then((data) => {
          return data.json()
        })
        .then((json) => {
          console.log(json[0].duration.text)
          console.log('value:', json[0].duration.value)
          return {
            value: json[0].duration.value,
            text: json[0].duration.text,
          }
        })
      // .catch((error) => {
      //   console.error(error)
      // })
    },
    /**
     * @param {string} name
     * @return {{
     *   lat: string,
     *   lon: string
     * }}
     */
    getTosyoLocation(name) {
      // const name = '昌平まちかど図書館'
      const newTosyo = tosyo.find((t) => {
        return t.施設名 === name
      })
      const lat = newTosyo.緯度
      const lon = newTosyo.経度
      console.log('図書館名', newTosyo)
      console.log('緯度', lat)
      console.log('経度', lon)
      return {
        lat,
        lon,
      }
    },
  },
}
</script>
