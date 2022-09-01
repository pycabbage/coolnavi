<template>
  <div style="margin-top: 50px">
    <div style="text-align: center; margin-left: auto; margin-right: auto">
      <h4>今月削減した電力消費量は、</h4>
      <h3>{{ elect.elect }} kWh</h3>
    </div>
    <div style="text-align: center; margin-left: auto; margin-right: auto">
      <h4>累計クールシェア時間は、</h4>
      <h3>{{ elect.time / 60 }} 時間</h3>
    </div>
    <div style="text-align: center; margin-left: auto; margin-right: auto">
      <h4>節約した電気代は、</h4>
      <h3>{{ elect.money }} 円</h3>
    </div>
    <div style="text-align: center; margin-left: auto; margin-right: auto">
      <h4>です。</h4>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ElectPage',
  data() {
    return {
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
