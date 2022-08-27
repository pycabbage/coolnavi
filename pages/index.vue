<template>
  <div>
    <h2>声で質問する</h2>
    <v-btn @click="gen">
      <v-icon>mdi-account-circle</v-icon>
    </v-btn>
  </div>
</template>

<script>// @ts-nocheck

// // @ts-ignore
// import Kuroshiro from 'kuroshiro'
// // @ts-ignore
// import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";
import kuromoji from 'kuromoji'

export default {
  name: 'IndexPage',
  methods: {
    gen() {
      // const DICT_PATH = "./dict";
      console.log('ok')
      const recognition = new webkitSpeechRecognition()
      recognition.onresult = (event) => {
        console.log("ninshiki")
        /** @type {string} */
        const recText = event.results[0][0].transcript
        kuromoji.builder({
          dicPath: "./dict"
        }).build((__err, tokenizer) => {
          const token = tokenizer.tokenize(recText.trim());
          console.log(token);
        })
      }
      recognition.start()
    },
  },
}
</script>
