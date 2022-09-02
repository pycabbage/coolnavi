<template>
  <v-card style="left: -100px">
    <v-icon size="200px" style="position: absolute; opacity: 0.5">{{
      icon
    }}</v-icon>
    <v-icon
      size="200px"
      style="position: absolute; opacity: 0.5"
      :style="styleObject"
    >
      {{ icon }}
    </v-icon>
  </v-card>
</template>

<script>
import { mdiLightningBolt } from '@mdi/js'

export default {
  name: 'ElectGraphic',
  props: {
    elect: {
      type: Number,
      required: true,
      /**
       * @param {number} value
       */
      validator: (value) => value >= 0 && value <= 1,
    },
  },
  data() {
    return {
      icon: mdiLightningBolt,
      styleObject: {
        clipPath: '',
      },
    }
  },
  mounted() {
    this.styleObject.clipPath = this.draw(this.elect)
  },
  methods: {
    /**
     * @param {number} n
     */
    draw(n) {
      return `polygon(0 100%, 0 ${100 * (1 - n)}%, 100% ${
        100 * (1 - n)
      }%, 100% 100%)`
    },
  },
}
</script>
