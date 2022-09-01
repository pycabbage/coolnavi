<template>
  <div>
    <v-btn>帰ってきた</v-btn>
  </div>
</template>

<script>
export default {
  name: 'ElectPage',
  data() {
    return {
      elect: {
        time: 0,
        elect: 0,
        money: 0,
      },
    }
  },
  async mounted() {},
  methods: {
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
