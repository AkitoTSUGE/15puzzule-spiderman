'use strict';

(() => {

  // class DialogRender {
  //   constructor() {
  //     this.dialog = document.getElementById('dialog');
  //     this.yes = document.getElementById('yes');
  //     this.no = document.getElementById('no');
  //     this.cancel = document.getElementById('cancel');
      // this.picture = this.target();
    // }
      
    // target() {
    //   yes.addEventListener('click', () => {
    //     this.displaynone();
    //     return 'img/spiderman.jpeg';
        
    //   })
    //   no.addEventListener('click', () => {
    //     this.displaynone();
    //     return 2;
    //   })
    //   cancel.addEventListener('click', () => {
    //     this.displaynone();
    //     return 3;
    //   })
    // }
      
    
    // pic() {
    //   if (this.picture === 1) {
    //     return 'img/spiderman.jpeg'
    //   } else if (this.picture === 2) {
    //     return 'img/back.jpeg'
    //   } else if (this.picture=== 3){
    //     return 'img/lionking.jpeg'
    //   }
    // }
    
  //   displaynone() {
  //     this.dialog.classList.add('displaynone')
  //   }    
  // }
    

  class PuzzleRenderer {
    constructor(puzzle, canvas) {
      this.puzzle = puzzle;
      this.canvas = canvas;
      // this.dialog = dialog
      this.ctx = this.canvas.getContext('2d');
      this.TILE_SIZE = 70;
      this.img = document.createElement('img')
      this.img.src = 'img/spiderman.jpeg';
      this.img.classList.add('main');
      // this.img.src = dialog.target();
      // console.log(dialog.target());


      this.img.addEventListener('load', () => {
      this.render();
      });
      this.canvas.addEventListener('click', e => {
        // if (this.puzzule.isCompleted === true) {
        if (this.puzzle.getCompledStatus()) {
          return;
        }

        const rect = this.canvas.getBoundingClientRect();//キャンバスx,yのどこをクリックしたか
        // console.log(e.clientX - rect.left, e.clientY - rect.top);
        const col = Math.floor((e.clientX - rect.left) / this.TILE_SIZE);
        const row = Math.floor((e.clientY - rect.top) / this.TILE_SIZE);
        // console.log(col,row)
        this.puzzle.swapTiles(col, row);
        this.render();

        if (this.puzzle.isComplete()) {
          // this.isCompleted = true;
          this.puzzle.setCompletedStatus(true);
          this.renderGameClear();
        }
      });
    }

    // pic() {
    //   const yes = document.getElementById('yes');
    //   const no = document.getElementById('no');
    //   const cancel = document.getElementById('cancel');
      
    //   yes.addEventListener('click', () => {
    //     this.displaynone();
    //     this.some(1)
    //     this.render();
    //   })
    //   no.addEventListener('click', () => {
    //     this.displaynone();
    //     picture = 2
    //   })
    //   cancel.addEventListener('click', () => {
    //     this.displaynone();
    //     picture = 3;
    //   })
      
    // }
    // some(picture) {

    //     if (picture === 1) {
    //       return 'img/spiderman.jpeg'
    //     } else if (picture === 2) {
    //       return 'img/back.jpeg'
    //     } else if (picture=== 3){
    //       return 'img/lionking.jpeg'
    //     }
        
    //   }
      

      
    // displaynone() {
    //   const dialog = document.getElementById('dialog');
    //   dialog.classList.add('displaynone')
    // }    

    renderGameClear() {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.font = '28px Arial';
      this.ctx.fillStyle = '#fff';
      this.ctx.fillText('GAME CLEAR!!' , 40, 150);
        }

    render() {
      for (let row = 0; row < this.puzzle.getBoardSize(); row++) {
        for (let col = 0; col < this.puzzle.getBoardSize(); col++) {
          // this.renderTile(this.tiles[row][col], col, row);
          this.renderTile(this.puzzle.getTile(row, col), col, row);
        }
      }
    }

    renderTile(n, col, row) {
      if (n === this.puzzle.getBlankIndex()) {
        this.ctx.fillStyle = '#eeeeee';
        this.ctx.fillRect(
          col * this.TILE_SIZE,
           row * this.TILE_SIZE,
           this.TILE_SIZE,
           this.TILE_SIZE
           )
      } else {
        this.ctx.drawImage(//canvasの一部を切り出す
          this.img,
          (n % this.puzzle.getBoardSize()) * this.TILE_SIZE,
           Math.floor(n / this.puzzle.getBoardSize()) * this.TILE_SIZE,
           this.TILE_SIZE,
           this.TILE_SIZE,//切り出す座標x,yと領域x,y。％はあまりを返す
          col * this.TILE_SIZE,
          row * this.TILE_SIZE, 
          this.TILE_SIZE,
          this.TILE_SIZE,//描画する座標と大きさ
        );
      }
    }
  }

  class Puzzle {
    constructor(level) {
      this.level = level;
      this.tiles = [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15],
      ];
      this.UDLR = [
        [0, -1], // up
        [0, 1], // down
        [-1, 0], // left
        [1, 0], // right
      ];
      this.isCompleted = false;
      this.BOARD_SIZE = this.tiles.length;
      this.BLANK_INDEX = this.BOARD_SIZE ** 2 - 1;
      do {
        this.shuffle(this.level);
      } while (this.isComplete());//シャッフルした時に最初の状態に戻っていたら、もう一度シャッフル
    }

    getBoardSize() {
      return this.BOARD_SIZE;
    }

    getBlankIndex() {
      return this.BLANK_INDEX;
    }

    getCompledStatus() {
      return this.isCompleted;
    }

    setCompletedStatus(value) {
      this.isCompleted = value;
    }

    getTile(row, col) {
      return this.tiles[row][col];
    }

    shuffle(n) {
      let blankCol = this.BOARD_SIZE - 1;
      let blankRow = this.BOARD_SIZE - 1;

      for (let i = 0; i < n; i++) {
        let destCol;
        let destRow;

        do {
          const dir = Math.floor(Math.random() * this.UDLR.length);

          destCol = blankCol + this.UDLR[dir][0];
          destRow = blankRow + this.UDLR[dir][1];

          // switch (dir) {
          //   case 0:// up
          //   destCol = blankCol + UDLR[0, 0];
          //   destRow = blankRow + UDLR[0, 1];
          //     break;
          //   case 1:// down
          //   destCol = blankCol + UDLR[1, 0];
          //   destRow = blankRow + UDLR[1, 1]
          //     break;
          //   case 2: // left
          //   destCol = blankCol + UDLR[2, 0];
          //   destRow = blankRow + UDLR[2, 1];
          //     break;
          //   case 3: // right
          //   destCol = blankCol + UDLR[3, 0];
          //   destRow = blankRow + UDLR[3, 1];
          //     break;
          // }

        } while (this.isOutside(destCol,destRow));

        [
          this.tiles[blankRow][blankCol],
          this.tiles[destRow][destCol],
        ] = [
          this.tiles[destRow][destCol],
          this.tiles[blankRow][blankCol],
        ];

        [blankCol, blankRow] = [destCol, destRow];
     }
    }
    
    swapTiles(col, row) {
      if (this.tiles[row][col] === this.BLANK_INDEX) {//空白だったら
        return;
      }

      for (let i = 0; i < this.UDLR.length; i++) {
        const destCol = col + this.UDLR[i][0];
        const destRow = row + this.UDLR[i][1];

        // switch (i) {
        //   case 0:// up
        //   destCol = col;
        //   destRow = row - 1
        //     break;
        //   case 1:// down
        //   destCol = col;
        //   destRow = row + 1
        //     break;
        //   case 2: //left
        //   destCol = col - 1;
        //   destRow = row;
        //     break;
        //   case 3: //right
        //   destCol = col + 1;
        //   destRow = row;
        //     break;
        // }

        if (this.isOutside(destCol,destRow)) {
          continue;
        }//これ以降の処理は実行しない

        if (this.tiles[destRow][destCol] === this.BLANK_INDEX) {//４つのケースの内行き先(destRow,destCol)が空白(15)だったら
          [
            this.tiles[row][col],
            this.tiles[destRow][destCol],
          ] = [
            this.tiles[destRow][destCol],
            this.tiles[row][col],
          ];
          break;
        }//行き先にあるタイル(15)とクリックしたタイルを入れ替える
      }
    }

    isOutside(destCol,destRow) {
      return (
        destCol < 0 || destCol > this.BOARD_SIZE - 1 ||
        destRow < 0 || destRow > this.BOARD_SIZE - 1
      );
    }

    isComplete() {
      let i = 0;
      for (let row = 0; row < this.BOARD_SIZE ; row++) {
        for (let col = 0; col < this.BOARD_SIZE ; col++) {
          if (this.tiles[row][col] !== i++) {//0~15まで順番通りに並んでいなかったら
            return false;
          }
        }
      }
      return true;
    }
  }

  const canvas = document.querySelector('canvas');
  if (typeof canvas.getContext ==='undefined') {
    return;
  }


  new PuzzleRenderer(new Puzzle(60), canvas);
})();

