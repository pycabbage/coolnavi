<template>
  <v-card style="left: -100px">
    <v-icon size="200px" style="position: absolute">{{ icon }}</v-icon>
    <v-icon size="200px" style="position: absolute" :style="styleObject" dark>
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
      validator: (value) => value >= 0 && value <= 1,
    },
  },
  data() {
    return {
      icon: mdiLightningBolt,
      styleObject: {
        opacity: '0.5',
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
      return `polygon(0 0, 0 ${100 * (1 - n)}%, 100% ${100 * (1 - n)}%, 100% 0)`
    },
  },
}
</script>
