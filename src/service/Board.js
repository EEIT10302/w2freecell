import Deck from './Deck.js';
import Card from './Card.js';

export default class Board {
  constructor() {
    this.score = 0;
    this._tableau = [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
      // free cells begins here
    ];

    this._freeCells = [
      [],
      [],
      [],
      []
    ];

    this._foundations = [
      [],
      [],
      [],
      []
    ]

    this.populate();

    // Dom Elements
    this._pileName = ".pile";

    // used when a card is over a container
    this.overContainer = null;
  };

  populate() {// 發牌
    let deck = new Deck();
    deck = deck.shuffle();
    while (deck.size() > 0) {
      let i = 0;
      while (i < 8) {
        let drawn_card = deck.draw();
        if (drawn_card) {
          this._tableau[i].push(drawn_card)
        }
        i++;
      }
    }
  };

  render() {
    debugger;
    this._tableau.forEach((pile, idx) => {
      // grab the pile container element at idx 
      let $pile = $(this._pileName).eq(idx);
      // remove all children dom elements
      $pile.empty();

      let self = this;

      $pile.droppable({
        drop: function (event, ui) {
          let _from = ui.helper[0].parentElement.getAttribute("idx")// 從第幾排
          let to = event.target.attributes.idx.value// 到第幾排
          self.handleMove(_from, to);
        }
      });

      // add a new element for each card in pile
      pile.forEach(card => {
        const { suit, value } = card;
        $pile.append(`<div val='${value}' suit='${suit}' class='card ${suit} ${value.toString()}'><canvas width="116" height="169"></canvas></div>`);
      })

      // spread the cards out nice and even
      // 調整位置
      $pile.children('.card').each((i, cardDiv) => {
        $(cardDiv).css('top', (i * 40).toString() + 'px');
      });

      // make the last card draggable
      let $lastCardElement = $pile.children('.card').last().draggable({
        drag: function (event, ui) {
          $(ui.helper[0]).addClass("is-dragging");
        },
        stop: function (event, ui) {
          $(ui.helper[0]).removeClass("is-dragging");
        },
        revert: true
      });

      let lastCardElement = $lastCardElement[0];
    });

    this._foundations.forEach((foundation, idx) => {
      const self = this;

      // get cell dom element
      let $foundationDom = $('.foundation').eq(idx);
      $foundationDom.empty();

      // attach event handlers for free cell drops
      $(".foundation").droppable({
        drop: function (event, ui) {
          let _from = ui.helper[0].parentElement.getAttribute("idx")
          let to = event.target.attributes.idx.value
          self.handleMove(_from, to);
        }
      });

      for (let j = 0; j < this._foundations[idx].length; j++) {
        const { suit, value } = this._foundations[idx][j];
        $foundationDom.append(`<div val='${value}' suit='${suit}' class='card ${suit} ${value.toString()}'><canvas width="116" height="169"></canvas></div>`);
        $($foundationDom[0]).children().draggable({
          drag: function (event, ui) {
            $(ui.helper[0]).addClass("is-dragging");
          },
          stop: function (event, ui) {
            $(ui.helper[0]).removeClass("is-dragging");
          },
          revert: true
        })
      }
    });

    this._freeCells.forEach((freeCell, idx) => {
      const self = this;

      // get cell dom element
      let $freeCellDom = $('.free-cell').eq(idx);
      $freeCellDom.empty();

      // attach event handlers for free cell drops
      $(".free-cell").droppable({
        drop: function (event, ui) {
          let _from = ui.helper[0].parentElement.getAttribute("idx")
          let to = event.target.attributes.idx.value
          self.handleMove(_from, to);
        }
      });

      for (let j = 0; j < this._freeCells[idx].length; j++) {
        const { suit, value } = this._freeCells[idx][j];
        $freeCellDom.append(`<div val='${value}' suit='${suit}' class='card ${suit} ${value.toString()}'><canvas width="116" height="169"></canvas></div>`);
        $($freeCellDom[0]).children().draggable({
          drag: function (event, ui) {
            $(ui.helper[0]).addClass("is-dragging");
          },
          stop: function (event, ui) {
            $(ui.helper[0]).removeClass("is-dragging");
          },
          revert: true
        })
      }
    });
    this.drawCanvas();
  };

  handleMove(_from, to, numberOfCards) {//_from 從第幾排, to 到第幾排
    if (this.isValidMove(_from, to)) {// 可以移動
      // if from tableau
      if (_from < 8) {// 接龍區
        var poppedCard = this._tableau[_from].pop();
      } else if (_from > 7 && _from < 12) {// 上方區域
        var poppedCard = this._freeCells[_from - 8].pop();
      } else {
        var poppedCard = this._foundations[_from - 12].pop();
      }

      if (to > 7 && to < 12) { // moving to a free cell
        this._freeCells[to - 8].push(poppedCard)
      } else if (to <= 7) { // moving to a tableau
        this._tableau[to].push(poppedCard)
      } else { // moving to a foundation
        this._foundations[to - 12].push(poppedCard)
      }
      this.render();
    }// 不能移動
  };

  isValidMove(_from, to) {//_from 從第幾排, to 到第幾排
    debugger;
    if (to < 8) { // 移動到牌區
      let foundations = this._translateIndexToStack(to);
      let foundationStack = foundations[to];
      let lastCardInFoundationStack = new Card('', 0);// 目的地牌群最後一張資訊
      if (foundationStack.length !== 0) {
        lastCardInFoundationStack = foundationStack[foundationStack.length - 1];
      }
      let fromMinus;
      if (_from <= 7) {
        fromMinus = 0;
      } else if (_from < 12) {
        fromMinus = 8;
      } else {
        fromMinus = 12;
      }
      let fromStack = this._translateIndexToStack(_from)[_from - fromMinus];
      let lastCardInFromStack = fromStack[fromStack.length - 1];
      let fromColor = this.getColor(lastCardInFromStack.suit);
      let toColor = this.getColor(lastCardInFoundationStack.suit);

      if (fromColor != toColor && lastCardInFoundationStack.value - 1 == lastCardInFromStack.value) {
        return true;
      } else {
        return false;
      }
    } else if (to >= 12) { // 移動到堆疊取分區
      let foundations = this._translateIndexToStack(to);
      let foundationStack = foundations[to - 12];
      let lastCardInFoundationStack = new Card('', 0);// 目的地牌群最後一張資訊
      if (foundationStack.length !== 0) {
        lastCardInFoundationStack = foundationStack[foundationStack.length - 1];
      }

      let fromMinus;
      if (_from <= 7) {
        fromMinus = 0;
      } else if (_from < 12) {
        fromMinus = 8;
      } else {
        fromMinus = 12;
      }
      let fromStack = this._translateIndexToStack(_from)[_from - fromMinus];
      let lastCardInFromStack = fromStack[fromStack.length - 1];
      if (lastCardInFromStack.value == 1 || (lastCardInFoundationStack.value + 1 == lastCardInFromStack.value && lastCardInFoundationStack.suit === lastCardInFromStack.suit)) {
        this.score = Number(this.score) + 50;
        return true;
      } else { return false; }
    } else if (to > 7 && to < 12) {// 移動到暫放區
      if (this._freeCells[to - 8].length === 0) {
        return true;
      } else {
        return false;
      }
    }
  };

  _translateIndexToStack(idx) {
    if (idx <= 7) {
      return this._tableau
    } else if (idx < 12) {
      return this._freeCells
    } else {
      return this._foundations
    }
  }

  drawCanvas() {
    debugger;
    const cardArray = document.getElementsByClassName('card');
    for (let i = 0; i < cardArray.length; i++) {
      const element = cardArray[i].children[0];
      const ctx = element.getContext('2d');
      const classes = cardArray[i].classList;
      this.drawCanvasMain(ctx, classes[1]);
      this.drawCanvasNum(ctx, classes[2]);
    }
  }

  drawCanvasMain(ctx, suit) {// 畫顏色
    if (suit === 'clubs') {// 梅花black
      ctx.fillStyle = '#A4B5D1';
      ctx.beginPath(); // 三個圓
      ctx.arc(58, 64, 10, 0, Math.PI * 2, true);// 最上面的圈圈
      ctx.arc(43, 84, 10, 0, Math.PI * 2, true);// 左下的圈圈
      ctx.fill();
      ctx.beginPath();
      ctx.arc(73, 84, 10, 0, Math.PI * 2, true);// 左下的圈圈
      ctx.fill();
      ctx.beginPath(); //  最上面的圈圈的填滿
      ctx.moveTo(48, 66);
      ctx.lineTo(68, 66);
      ctx.lineTo(58, 84);
      ctx.fill();
      ctx.beginPath(); //  左下的圈圈的填滿
      ctx.moveTo(45, 74);
      ctx.lineTo(45, 94);
      ctx.lineTo(58, 84);
      ctx.fill();
      ctx.beginPath(); //  右下的圈圈的填滿
      ctx.moveTo(70, 74);
      ctx.lineTo(70, 94);
      ctx.lineTo(58, 84);
      ctx.fill();
      ctx.beginPath(); // 梅花的三角腳
      ctx.moveTo(58, 84);
      ctx.lineTo(53, 109);
      ctx.lineTo(63, 109);
      ctx.fill();
    } else if (suit === 'diamonds') {// 方塊red
      ctx.fillStyle = '#DC5454';
      ctx.beginPath();
      ctx.moveTo(58, 56);// 頂
      ctx.lineTo(76, 84);// 右
      ctx.lineTo(58, 112);//底
      ctx.lineTo(40, 84);//左
      ctx.fill();
    } else if (suit === 'spades') {//黑陶black
      ctx.fillStyle = '#A4B5D1';
      ctx.beginPath(); // 兩個圓
      ctx.arc(48, 84, 10, 0, Math.PI * 2, true);
      ctx.arc(68, 84, 10, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.beginPath(); // 中間填滿
      ctx.moveTo(58, 74);
      ctx.lineTo(48, 84);
      ctx.lineTo(68, 84);
      ctx.fill();
      ctx.beginPath(); // 黑陶的三角頭
      ctx.moveTo(40, 78);
      ctx.lineTo(76, 78);
      ctx.lineTo(58, 57);
      ctx.fill();
      ctx.beginPath(); // 黑陶的三角腳
      ctx.moveTo(58, 84);
      ctx.lineTo(53, 104);
      ctx.lineTo(63, 104);
      ctx.fill();
    } else if (suit === 'hearts') {// 愛心red
      ctx.fillStyle = '#DC5454';
      ctx.beginPath(); // 兩個圓
      ctx.arc(48, 74, 10, 0, Math.PI * 2, true);
      ctx.arc(68, 74, 10, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.beginPath(); // 愛心的倒三角
      ctx.moveTo(40, 80);
      ctx.lineTo(76, 80);
      ctx.lineTo(58, 100);
      ctx.fill();
      ctx.beginPath(); // 中間填滿
      ctx.moveTo(58, 74);
      ctx.lineTo(48, 84);
      ctx.lineTo(68, 84);
      ctx.fill();
    }
  }

  drawCanvasNum(ctx, val) {// 畫數字
    ctx.font = '18px Darker Grotesque';
    ctx.fillText(val, 10, 20);
    ctx.fillText(val, 90, 153);
  }

  getColor(suit) {
    switch (suit) {
      case 'clubs':
        return 'black';
      case 'diamonds':
        return 'red';
      case 'spades':
        return 'black';
      case 'hearts':
        return 'red';
      default:
        console.log('judge color error!');
        return '';
    }
  }
};