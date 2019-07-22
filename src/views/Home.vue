<template>
  <div>
    <HelloWorld @getScore="getScore"/>
    <Footer :score="score"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import Footer from '@/components/Footer.vue'; // @ is an alias to /src

@Component({
  components: {
    HelloWorld,
    Footer,
  },
})
export default class Home extends Vue {
  score: number = 0;
  getScore(score: number){
    this.score = score;
    console.log('output score:' + score);
  }
}
</script>
