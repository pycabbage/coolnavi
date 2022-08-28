<template>
  <div>
    <h2>声で質問する</h2>
    <v-btn @click="gen">
      <v-icon>mdi-account-circle</v-icon>
    </v-btn>
    <h2>現在地を取得</h2>
    <v-btn @click="getCurrentLocation">GET</v-btn>
    <h2>気温を取得</h2>
    <v-btn @click="temp">GET</v-btn>
  </div>
</template>

<script>
import Kuroshiro from 'kuroshiro'

export default {
  name: 'IndexPage',
  methods: {
    gen() {
      console.log('ok')
      const analyzer = new KuromojiAnalyzer()
      const kuroshiro = new Kuroshiro(analyzer)
      const recognition = new webkitSpeechRecognition()
      recognition.onresult = async (event) => {
        /** @type {string} */
        const recText = event.results[0][0].transcript
        await kuroshiro.convert(recText)
      }
      recognition.start()
    },
    getCurrentLocation() {
      const options = {
        enableHightAccuracy: false,
        timeOut: 5000,
        maximumAge: 0,
      }

      navigator.geolocation.getCurrentPosition(
        this.success,
        this.error,
        options
      )
    },
    success(position) {
      const pos = {
        lat: position.coords.latitude,
        long: position.coords.longitude,
      }

      console.log(pos)
    },
    error(error) {
      console.log(`ERROR(${error.code}):${error.message}`)
    },
    getLocationFromBuildingName(BuildingName) {},
    temp() {
      const latitude = 35.4648142
      const longitude = 139.5585634
      const API_KEY = "dc31582af77b77e4e9bea929b3c6b8bf"
      const url =
        'https://api.openweathermap.org/data/2.5/forecast?lat=' +
        latitude +
        '&lon=' +
        longitude +
        '&units=metric&appid=' +
        API_KEY

      fetch(url)
        .then((data) => {
          return data.json()
        })
        .then((json) => {
          console.log(json.list[0])
        })
        .catch((error) => {
          console.error(error)
        })
    },
    getRequiredTime() {
      const lat = 35.4648142;
      const lng = 139.5585634;
      const API_KEY = "AIzaSyA_zlu8mk7oIDv5Vt7QFNyrhv0FSxCuaZM";
      const options = {
        lat:
      }
      const distanceMatrixService = new google.maps.DistanceMatrixService();

      distanceMatrixService.getDistanceMatrix()
    }
  },
}
</script>
