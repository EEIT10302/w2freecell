<template>
  <div>
    <div class="free-cells row justify-content-between mb-4">
      <div class="col-xl-6 col-lg-6 row justify-content-center">
        <div class="free-cell ml-xl-2 ml-lg-1" idx="8"></div>
        <div class="free-cell ml-xl-2 ml-lg-1" idx="9"></div>
        <div class="free-cell ml-xl-2 ml-lg-1" idx="10"></div>
        <div class="free-cell ml-xl-2 ml-lg-1" idx="11"></div>
      </div>
      <div class="col-xl-6 col-lg-6 row justify-content-center">
        <div class="foundation ml-xl-2 ml-lg-1" idx="12"></div>
        <div class="foundation ml-xl-2 ml-lg-1" idx="13"></div>
        <div class="foundation ml-xl-2 ml-lg-1" idx="14"></div>
        <div class="foundation ml-xl-2 ml-lg-1" idx="15"></div>
      </div>
    </div>
    <div class="cards-container row justify-content-center">
      <div class="pile" idx="0"></div>
      <div class="pile" idx="1"></div>
      <div class="pile" idx="2"></div>
      <div class="pile" idx="3"></div>
      <div class="pile" idx="4"></div>
      <div class="pile" idx="5"></div>
      <div class="pile" idx="6"></div>
      <div class="pile" idx="7"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit } from "vue-property-decorator";
import "bootstrap/scss/bootstrap.scss";
import "bootstrap";
import Card from "../service/Card.js";
import Deck from "../service/Deck.js";
import Board from "../service/Board.js";
@Component
export default class HelloWorld extends Vue {
  a: Card = new Card("queen", 1);
  deck: Deck = new Deck();
  board: Board = new Board();
  score: number = 0;
  // @Emit('score') send(score: number){console.log('emit: '+score)};
  private mounted(): void {
    this.board.render();
    this.getScore(this);
  }

  private getScore(_this: Vue){
    setInterval(() => {
      console.log('calling send function');
     // _this.send(_this.board.score);
    }, 1000);
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@mixin cardTypeDef() {
  height: 169px;
  width: 116px;
  box-sizing: border-box;
  border-radius: 5px;
  background-color: rgba(207, 115, 90, 0.5);
}

.free-cells {
  .free-cell {
    @include cardTypeDef();
  }
  .foundation {
    @include cardTypeDef();
  }
}

.cards-container {
  .pile {
    min-height: 500px;
    width: 116px;
    box-sizing: border-box;
    margin-right: 20px;
    position: relative;
  }
}

.card {
  height: 169px;
  // background: url("../assets/cards.png") 10%;
  width: 116px;
  position: absolute;
  canvas{
    box-shadow: 4px 3px 5px rgba(234, 210, 210, 0.77);
  }
}

.is-dragging {
  z-index: 300;
}

.clubs {
  background-position-y: 0px;
}
.diamonds {
  background-position-y: -167px;
}
.hearts {
  background-position-y: -334px;
}
.spades {
  background-position-y: -487px;
}

div[val="2"] {
  background-position-x: -167px;
}
div[val="3"] {
  background-position-x: -230px;
}
div[val="4"] {
  background-position-x: -345px;
}
div[val="5"] {
  background-position-x: -460px;
}
div[val="6"] {
  background-position-x: -575px;
}
div[val="7"] {
  background-position-x: -690px;
}
div[val="8"] {
  background-position-x: -805px;
}
div[val="9"] {
  background-position-x: -922px;
}
div[val="10"] {
  background-position-x: -1037px;
}
div[val="11"] {
  background-position-x: -1152px;
}
div[val="12"] {
  background-position-x: -1267px;
}
div[val="13"] {
  background-position-x: -1382px;
}
</style>
