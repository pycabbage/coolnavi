<template>
  <div>
    <v-card class="d-flex flex-column pa-6 ma-2" flat>
      <p class="mx-lg-auto mb-auto text-h6">今月削減した電力消費量は、</p>
      <p class="mx-lg-auto mb-auto text-h4">{{ elect.elect }} kWh</p>
      <p class="mx-lg-auto mb-auto text-h6">累計クールシェア時間は、</p>
      <p class="mx-lg-auto mb-auto text-h4">
        {{ (elect.time / 60).toFixed(2) }} 時間
      </p>
      <p class="mx-lg-auto mb-auto text-h6">節約した電気代は、</p>
      <p class="mx-lg-auto mb-auto text-h4">{{ elect.money.toFixed() }} 円</p>
      <p class="mx-lg-auto mb-auto text-h6">です。</p>
      <elect-graphic class="mx-lg-auto mb-auto" :elect="electG" />
    </v-card>
  </div>
</template>

<script>
import ElectGraphic from '~/components/ElectGraphic.vue'

export default {
  name: 'ElectPage',
  components: {
    ElectGraphic,
  },
  data() {
    return {
      electG: 0.6,
      elect: {
        time: 37264, // 単位:分
        elect: 0,
        money: 0,
      },
    }
  },
  // eslint-disable-next-line require-await
  async mounted() {
    this.updateByTime()
    this.electG = this.elect.elect / 100000
  },
  methods: {
    updateByTime() {
      const { elect, money } = this.getElectBillSaved(this.elect.time)
      this.elect.elect = elect
      this.elect.money = money
    },
    /**
     * @param {string} e
     */
    handleChange(e) {
      const savedAmount = this.getElectBillSaved(parseInt(e))
      this.elect.elect = savedAmount.elect
      this.elect.money = savedAmount.money
    },
    /**
     * 節約した電力使用量と電気代を計算する
     * @param {number} goTime 外出時間 単位:分
     * @return {{elect:number,money:number}} 節約した電力使用量[kWh]と電気代
     */
    getElectBillSaved(goTime) {
      /**
       * 起動時の電力消費量[W]
       * @type {number}
       */
      // eslint-disable-next-line no-unused-vars
      const generalStartupPower = 425
      /**
       * 通常運転時の電力消費量[W]
       * @type {number}
       */
      const generalNormalPower = 105
      /**
       * 電気代[円/kW]
       */
      const mpkw = 27

      // 行かなかった場合の電力量[kWh]
      const noGoOutEnergy = (goTime * generalNormalPower) / 1000
      // TODO: 行った場合の電力量を計算する
      // 部屋全体が冷えるまで20分とする

      const money = noGoOutEnergy * mpkw
      return {
        elect: noGoOutEnergy,
        money,
      }
    },
  },
}
</script>
