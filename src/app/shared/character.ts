declare const origin: any;
import { Subject } from 'rxjs';
import { SurveyAnser } from '../game-board/game-board.component';
import { addKey, loadArrowSprites } from './arrow';

const JUMP_FORCE = 600;
const BIG_JUMP_FORCE = 700;
let CURRENT_JUMP_FORCE = JUMP_FORCE;
const FALL_DEATH = 900;

function healthStatus() {
  return {
    id: 'healthStatus',
    require: ["pos", "area", "sprite"],
    isHealthy: true,
    lastCollide: null,
    update() {},
    sick() {
      this.isHealthy = false;
      // (this as any).spriteID = 'sick-mario';
      (this as any).use(sprite('sick-mario'))
    },
    healthy() {
      this.isHealthy = true;
      (this as any).use(sprite('mario'));
    }
  }
}

export function loadCharacter(): void {
  loadSpriteAtlas('/assets/img/mario-sprite.png', {
    'mario': {
      x: 0,
      y: 0,
      sliceX: 26,
      sliceY: 1,
      width: 832,
      height: 32,
      anims: {
        'idle--sm': {
          from: 0,
          to: 0
        },
        'idle--lg': {
          from: 8,
          to: 8
        },
        'run--sm': {
          from: 1,
          to: 3
        },
        'run--lg': {
          from: 9,
          to: 11
        },
        'jump--sm': {
          from: 5,
          to: 5
        },
        'jump--lg': {
          from: 13,
          to: 13
        },
        'get-down': {
          from: 14,
          to: 14
        }
      }
    }
  });
  loadSpriteAtlas('/assets/img/sick-mario-sprite.png', {
    'sick-mario': {
      x: 0,
      y: 0,
      sliceX: 26,
      sliceY: 1,
      width: 832,
      height: 32,
      anims: {
        'idle--sm': {
          from: 0,
          to: 0
        },
        'idle--lg': {
          from: 8,
          to: 8
        },
        'run--sm': {
          from: 1,
          to: 3
        },
        'run--lg': {
          from: 9,
          to: 11
        },
        'jump--sm': {
          from: 5,
          to: 5
        },
        'jump--lg': {
          from: 13,
          to: 13
        },
        'get-down': {
          from: 14,
          to: 14
        }
      }
    }
  });
  if (isTouch()) {
    loadArrowSprites();
  }
}

function determineKey(touchEvent: any, arrowUp: any, arrowDown: any, arrowRight: any, arrowLeft: any): string | null {
  const touchX = touchEvent.clientX;
  const touchY = touchEvent.clientY;
  // Determine if the Up key is clicked
  const upXStart = arrowUp.pos.x;
  const upXEnd = arrowUp.pos.x + arrowUp.width;
  const upYStart = arrowUp.pos.y;
  const upYEnd = arrowUp.pos.y + arrowUp.height;
  if (touchX >= upXStart && touchX <= upXEnd && touchY >= upYStart && touchY <= upYEnd ) {
    return 'up';
  }

  // Determine if the Down key is clicked
  const downXStart = arrowDown.pos.x;
  const downXEnd = arrowDown.pos.x + arrowDown.width;
  const downYStart = arrowDown.pos.y;
  const downYEnd = arrowDown.pos.y + arrowDown.height;
  if (touchX >= downXStart && touchX <= downXEnd && touchY >= downYStart && touchY <= downYEnd ) {
    return 'down';
  }

  // Determine if the Right key is clicked
  const rightXStart = arrowRight.pos.x;
  const rightXEnd = arrowRight.pos.x + arrowRight.width;
  const rightYStart = arrowRight.pos.y;
  const rightYEnd = arrowRight.pos.y + arrowRight.height;
  if (touchX >= rightXStart && touchX <= rightXEnd && touchY >= rightYStart && touchY <= rightYEnd ) {
    return 'right';
  }

  // Determine if the Left key is clicked
  const leftXStart = arrowLeft.pos.x;
  const lefttXEnd = arrowLeft.pos.x + arrowLeft.width;
  const leftYStart = arrowLeft.pos.y;
  const leftYEnd = arrowLeft.pos.y + arrowLeft.height;
  if (touchX >= leftXStart && touchX <= lefttXEnd && touchY >= leftYStart && touchY <= leftYEnd ) {
    return 'left';
  }
  return null;
}

export function addCharacter(endGameSignal$: Subject<void>, currentLevel: string, initBig: boolean, initX: number, initY: number, gameBoard: any, scoreLabel: any, surveyAnswer: SurveyAnser, labelOptions?: any) {
  const SPEED = 360;
  let isBig = initBig;
  let canSmash = true;

  let arrowUp: any;
  let arrowDown: any;
  let arrowRight: any;
  let arrowLeft: any;

  const onMobileLandscape = window.matchMedia('(orientation: landscape)').matches && window.innerHeight < 750;

  if (isTouch()) {
    arrowUp = addKey('arrow-up', width() - 70, height() - 100);
    arrowDown = addKey('arrow-down', 95, height() - 70);
    arrowRight = addKey('arrow-right', 145, height() - 100);
    arrowLeft = addKey('arrow-left', 20, height() - 100);
    document.addEventListener('touchstart', (event) => {
      for (let i = 0; i < event.touches.length; i++) {
        const touchEvent = event.touches[i];
        const keyTouched = determineKey(touchEvent, arrowUp, arrowDown, arrowRight, arrowLeft);
        switch (keyTouched) {
          case 'up':
            arrowUp.isPressed = true;
            break;
          case 'down':
            arrowDown.isPressed = true;
            break;
          case 'right':
            arrowRight.isPressed = true;
            break;
          case 'left':
            arrowLeft.isPressed = true;
            break;
        }
      }
    });

    document.addEventListener('touchend', event => {
      console.log('touchend', event);
      for (let i = 0; i < event.changedTouches.length; i++) {
        const touchEvent = event.changedTouches[i];
        const keyRelease = determineKey(touchEvent, arrowUp, arrowDown, arrowRight, arrowLeft);
        switch (keyRelease) {
          case 'up':
            arrowUp.isPressed = false;
            break;
          case 'down':
            arrowDown.isPressed = false;
            break;
          case 'right':
            arrowRight.isPressed = false;
            break;
          case 'left':
            arrowLeft.isPressed = false;
            break;
        }
      }
    });
  }

  const mario = add([
    pos(initX, initY),
    sprite('mario'),
    body(),
    area({ width: 16, height: 16 }),
    scale(2),
    origin('bot'),
    healthStatus(),
    'mario'
  ]);
  // Initial animation
  mario.play('idle--sm');
  mario.action(() => {
    camPos(mario.pos);
    const left = isTouch() ? keyIsDown('left') || arrowLeft.isPressed : keyIsDown('left');
    const right = isTouch() ? keyIsDown('right') || arrowRight.isPressed : keyIsDown('right');
    const up = isTouch() ? keyIsDown('up') || arrowUp.isPressed : keyIsDown('up');
    const down = isTouch() ? keyIsDown('down') || arrowDown.isPressed : keyIsDown('down');
    const currAnim = mario.curAnim();

    if (mario.grounded()) {
      canSmash = false;
    }

    // Detect fall
    if (mario.pos.y >= FALL_DEATH) {
      go('game', { level: 'q1', score: 0, isBig: false });
    }

    // Define sprite size
    if (isBig && !keyIsDown('down')) {
      mario.use(area({ width: 16, height: 32 }));
    } else {
      mario.use(area({ width: 16, height: 16 }));
    }

    // Is the Right key pressed
    if (right) {
      if (isBig) {
        if (currAnim !== 'run--lg' && mario.grounded()) {
          mario.play('run--lg');
        }
      } else {
        if (currAnim !== 'run--sm' && mario.grounded()) {
          mario.play('run--sm');
        }
      }
      mario.flipX(false);
      mario.move(SPEED, 0);
      if (!mario.grounded() && down && isBig) {
        mario.play('get-down');
      }
    } else if (left) {
      // Is the Left key pressed
      if (isBig) {
        if (currAnim !== 'run--lg' && mario.grounded()) {
          mario.play('run--lg');
        }
      } else {
        if (currAnim !== 'run--sm' && mario.grounded()) {
          mario.play('run--sm');
        }
      }
      if (!mario.grounded() && down && isBig) {
        mario.play('get-down');
      }
      mario.flipX(true);
      mario.move(-SPEED, 0);
    } else if (down && isBig) {
      // Is the Down key pressed
      if (currAnim !== 'get-down') {
        mario.play('get-down');
      }
    }
    // Is the Up key pressed
    if (up) {
      if (isBig) {
        if (currAnim !== 'jump--lg') {
          mario.play('jump--lg');
        }
        CURRENT_JUMP_FORCE = BIG_JUMP_FORCE;
      } else {
        if (currAnim !== 'jump--sm') {
          mario.play('jump--sm');
        }
        CURRENT_JUMP_FORCE = JUMP_FORCE;
      }
      if (mario.grounded()) {
        mario.jump(CURRENT_JUMP_FORCE);
        canSmash = true;
      }
    }
    // If None of the arrow key is pressed
    if (!right && !left && !up && !down) {
      // Idle
      if (isBig) {
        mario.play('idle--lg');
      } else {
        mario.play('idle--sm');
      }
    }

  });

  // Headbump
  mario.on('headbutt', (obj: any) => {
    // coin
    if (obj.is('coin-gift')) {
      // Spawn a coin to the right of the object position
      gameBoard.spawn('$', obj.gridPos.sub(0, 1));
      // Destroy the coin-gift object
      destroy(obj);
      // Spawn an unboxed sprite at the original position
      const coin = gameBoard.spawn('u', obj.gridPos.sub(0, 0));
    } else if (obj.is('mushroom-gift')) {
      // Spawn a mushroom to the right of the object position
      gameBoard.spawn('^', obj.gridPos.sub(0, 1));
      // Destroy the mushroom-gift object
      destroy(obj);
      // Spawn an unboxed sprite at the original position
      gameBoard.spawn('u', obj.gridPos.sub(0, 0));
    } else if (obj.is('add-attendee')) {
      // Increase attendee by 1
      surveyAnswer.q4.a1 = surveyAnswer.q4.a1 < 5 ? surveyAnswer.q4.a1 += 1 : surveyAnswer.q4.a1;
      labelOptions.attendeeLabel.text = `${surveyAnswer.q4.a1}`;
    } else if (obj.is('minus-attendee')) {
      // Decrease attendee by 1
      surveyAnswer.q4.a1 = surveyAnswer.q4.a1 > 0 ?  surveyAnswer.q4.a1 -= 1 : 0;
      labelOptions.attendeeLabel.text = `${surveyAnswer.q4.a1}`;
    } else if (obj.is('add-vegan')) {
      // Increase vegan by 1
      surveyAnswer.q4.a2 = surveyAnswer.q4.a2 < surveyAnswer.q4.a1 ? surveyAnswer.q4.a2 += 1 : surveyAnswer.q4.a2;
      labelOptions.vegeLabel.text = `${surveyAnswer.q4.a2}`;
    } else if (obj.is('minus-vegan')) {
      // Decrease vegan by 1
      surveyAnswer.q4.a2 = surveyAnswer.q4.a2 > 0 ?  surveyAnswer.q4.a2 -= 1 : 0;
      labelOptions.vegeLabel.text = `${surveyAnswer.q4.a2}`;
    } else if (obj.is('add-chair')) {
      // Increase children chair by 1
      surveyAnswer.q4.a3 = surveyAnswer.q4.a3 < (surveyAnswer.q4.a1 - 1) ? surveyAnswer.q4.a3 += 1 : surveyAnswer.q4.a3;
      labelOptions.chairLabel.text = `${surveyAnswer.q4.a3}`;
    } else if (obj.is('minus-chair')) {
      // Decrease children chair by 1
      surveyAnswer.q4.a3 = surveyAnswer.q4.a3 > 0 ?  surveyAnswer.q4.a3 -= 1 : 0;
      labelOptions.chairLabel.text = `${surveyAnswer.q4.a3}`;
    }
  });

  // Collide with Coin
  mario.onCollide('coin', (c: any) => {
    destroy(c);
    // Get only one point if mario is sick
    if (!mario.isHealthy) {
      scoreLabel.value++;
    } else {
      scoreLabel.value += 2;
    }
    scoreLabel.text = String(scoreLabel.value).padStart(3, '0');
  });

  // Collide with Mushroom
  mario.onCollide('mushroom', (m: any) => {
    destroy(m);
    if (!isBig) {
      if (mario.isHealthy) {
        isBig = true;
        scoreLabel.value += 10;
      } else {
        mario.healthy();
        scoreLabel.value += 5;
      }
    }
    scoreLabel.text = String(scoreLabel.value).padStart(3, '0');
  });

  // Collide with Evil Shrrom
  mario.onCollide('evil-mushroom', (e: any) => {
    if (!e.isAlive) {
      return;
    }
    const currentTime = time();
    if ((mario.lastCollide + 2) >= currentTime && mario.lastCollide !== null) {
      return;
    }
    if (canSmash) {
      e.smash();
      scoreLabel.value += 20;
      scoreLabel.text = String(scoreLabel.value).padStart(3, '0');
    } else {
      // Become small
      if (isBig) {
        isBig = false;
      } else {
        // Get sick
        mario.sick();
      }
      mario.lastCollide = currentTime;
    }
  });

  // Collide with Turtle
  mario.onCollide('turtle', (t: any, side: any) => {
    if (!side) {
      return;
    }
    const currentTime = time();
    if ((mario.lastCollide + 2) >= currentTime && mario.lastCollide !== null) {
      return;
    }
    if (canSmash) {
      // Walking
      if (!t.isShell) {
        t.smash();
        scoreLabel.value += 20;
        scoreLabel.text = String(scoreLabel.value).padStart(3, '0');
      }
    } else {
      // The turtle is toxic if touched from side and is not shell
      if (!side.isBottom() && !t.isShell) {
        // Become small
        if (isBig) {
          isBig = false;
        } else {
          // Get sick
          mario.sick();
        }
      }  else if ((side.isLeft() || side.isRight()) && t.isShell) {
        // Pump into shell from left or right
        t.slide(mario.pos.x < t.pos.x ? 1 : -1);
      }
    }
  });

  // Go into Pipe
  mario.onCollide('pipe', (pipe: any) => {
    keyPress('down', () => {
      switch (currentLevel) {
        case 'q1': {
          // Option A
          if (pipe.is('pipe-a')) {
            surveyAnswer.q1 = 'A';
          } else {
            // Option B
            surveyAnswer.q1 = 'B';
          }
          console.log('survey answers:', surveyAnswer);
          go('game', { level: 'q2', score: scoreLabel.value, isBig });
          break;
        }
        case 'q2': {
          // Option A
          if (pipe.is('pipe-a')) {
            surveyAnswer.q2 = 'A';
          } else if (pipe.is('pipe-b')) {
            // Option B
            surveyAnswer.q2 = 'B';
          } else if (pipe.is('pipe-c')) {
            // Option C
            surveyAnswer.q2 = 'C';
          } else {
            // Option D
            surveyAnswer.q2 = 'D';
          }
          console.log('survey answers:', surveyAnswer);
          go('game', { level: 'q3', score: scoreLabel.value, isBig });
          break;
        }
        case 'q3': {
          // Option A
          if (pipe.is('pipe-a')) {
            surveyAnswer.q3 = 'A';
          } else {
            // Option B
            surveyAnswer.q3 = 'B';
          }
          console.log('survey answers:', surveyAnswer);
          endGameSignal$.next();
          break;
        }
        case 'q4': {
          console.log('survey answers:', surveyAnswer);
          go('game', { level: 'q5', score: scoreLabel.value, isBig });
          break;
        }
        case 'q5': {
          // Option A
          if (pipe.is('pipe-a')) {
            surveyAnswer.q5 = 'A';
          } else if (pipe.is('pipe-b')) {
            // Option B
            surveyAnswer.q5 = 'B';
          } else if (pipe.is('pipe-c')) {
            // Option C
            surveyAnswer.q5  = 'C';
          }
          console.log('survey answers:', surveyAnswer);
          endGameSignal$.next();
        }
      }
    });
    const listener = document.addEventListener('touchstart', () => {
      setTimeout(() => {
        if (arrowDown.isPressed) {
          go('game', { level: 'level2', score: scoreLabel.value, isBig });
          document.removeEventListener('touchstart', () => {});
        }
      }, 50);
    });
  });
  return mario;
}
