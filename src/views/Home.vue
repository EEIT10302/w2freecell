<template>
  <div>
    <HelloWorld/>
    <Footer :score="scoreEmit"/>
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
  propScore(score:number){
    this.score = score;
  }
  scoreEmit(val: number){
    console.log('child Emit score value: '+val);
    this.score = val;
  }
}
</script>
