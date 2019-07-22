<template>
  <div class="row col-12 awe">
    <div class="col-xl-2 col-lg-3 col-md-3">
      <font-awesome-icon icon="clock" />
      Time: {{countDown}}
    </div>
    <div class="col-xl-2 col-lg-3 col-md-3">
      <font-awesome-icon icon="chess-queen" />score: {{score}}
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Footer extends Vue {
  @Prop({
    type: Number, // 父组件传递给子组件的数据类型
    required: false, // 是否必填
    default: 0 // 默认值， 如果传入的是 Object，则要 default: ()=>({}) 参数为函数
  })
  score!: number;
  private m: number = 0;
  private mt: string = "00";
  private s: number = 0;
  private st: string = "00";
  private countDown: string = "00:00";
  private timerContrl: number = 0;

  public timer() {
    this.s++;
    if (this.s == 60) {
      this.s = 0;
      this.m++;
      this.mt = this.m.toString();
      this.st = this.s.toString();
    } else {
      this.st = this.s.toString();
    }
    if (this.mt.length < 2) {
      this.mt = "0" + this.mt;
    }
    if (this.st.length < 2) {
      this.st = "0" + this.st;
    }
    this.countDown = this.mt + ":" + this.st;
  }

  public stopTimer() {
    clearInterval(this.timerContrl);
  }

  private created(): void {
    this.timer();
    this.timerContrl = setInterval(this.timer, 1000);
  }
}
</script>
<style lang="scss">
.awe {
  div {
    display: inline-block;
    padding-right: 10px;
    color: #746062;
    font-weight: 600;
    font-size: 1.3em;
    font-family: "Abel", sans-serif;
  }
}
</style>