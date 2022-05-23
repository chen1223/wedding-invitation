declare const origin: any;
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MoveDir, SurveyAnswer } from '../game-board/game-board.component';
import { addKey, loadArrowSprites } from './arrow';

const JUMP_FORCE = 620;
const BIG_JUMP_FORCE = 700;
let CURRENT_JUMP_FORCE = JUMP_FORCE;
const FALL_DEATH = 1500;

function healthStatus() {
  return {
    id: 'healthStatus',
    require: ["pos", "area", "sprite"],
    isHealthy: true,
    lastCollide: null,
    update() {},
    sick() {
      this.isHealthy = false;
      (this as any).use(sprite('sick-bill'))
    },
    healthy() {
      this.isHealthy = true;
      (this as any).use(sprite('mario'));
    }
  }
}

export function loadCharacter(): void {
  loadSpriteAtlas('/assets/img/bill-sprite.png', {
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
  loadSpriteAtlas('/assets/img/sick-bill-sprite.png', {
    'sick-bill': {
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

let arrowUp: any;
let arrowDown: any;
let arrowRight: any;
let arrowLeft: any;

const switchLevel$ = new Subject<void>();
const downTouch$ = new Subject<void>();

const touchDirection: { [key: string]: boolean } = {
  up: false,
  down: false,
  left: false,
  right: false
};

// Hold a list of touch points
let touchPoints: Array<Touch> = [];

function determineKey(touchEvent: Touch): string | null {
  if (!arrowUp || !arrowDown || !arrowRight || !arrowLeft) {
    return null;
  }
  const upXStart = arrowUp.pos.x;
  const upXEnd = arrowUp.pos.x + arrowUp.width;
  const upYStart = arrowUp.pos.y;
  const upYEnd = arrowUp.pos.y + arrowUp.height;

  // Determine if the Down key is clicked
  const downXStart = arrowDown.pos.x;
  const downXEnd = arrowDown.pos.x + arrowDown.width;
  const downYStart = arrowDown.pos.y;
  const downYEnd = arrowDown.pos.y + arrowDown.height;


  // Determine if the Right key is clicked
  const rightXStart = arrowRight.pos.x;
  const rightXEnd = arrowRight.pos.x + arrowRight.width;
  const rightYStart = arrowRight.pos.y;
  const rightYEnd = arrowRight.pos.y + arrowRight.height;

  // Determine if the Left key is clicked
  const leftXStart = arrowLeft.pos.x;
  const lefttXEnd = arrowLeft.pos.x + arrowLeft.width;
  const leftYStart = arrowLeft.pos.y;
  const leftYEnd = arrowLeft.pos.y + arrowLeft.height;

  const touchX = touchEvent.pageX;
  const touchY = touchEvent.pageY;
  // Determine if the Up key is clicked
  if (touchX >= upXStart && touchX <= upXEnd && touchY >= upYStart && touchY <= upYEnd ) {
    return 'up';
  }

  // Determine if the Down key is clicked
  if (touchX >= downXStart && touchX <= downXEnd && touchY >= downYStart && touchY <= downYEnd ) {
    return 'down';
  }

  // Determine if the Right key is clicked
  if (touchX >= rightXStart && touchX <= rightXEnd && touchY >= rightYStart && touchY <= rightYEnd ) {
    return 'right';
  }

  // Determine if the Left key is clicked
  if (touchX >= leftXStart && touchX <= lefttXEnd && touchY >= leftYStart && touchY <= leftYEnd ) {
    return 'left';
  }
  return null;
}

function checkAllKeys(): void {
  let leftTouched = false;
  let rightTouched = false;
  let upTouched = false;
  let downTouched = false;
  touchPoints.forEach(touch => {
    const key = determineKey(touch);
    switch (key) {
      case 'left': {
        leftTouched = true;
        break;
      }
      case 'right': {
        rightTouched = true;
        break;
      }
      case 'up': {
        upTouched = true;
        break;
      }
      case 'down': {
        downTouched = true;
        break;
      }
    }
  });
  touchDirection.left = leftTouched;
  touchDirection.right = rightTouched;
  touchDirection.up = upTouched;
  touchDirection.down = downTouched;
}

function handleTouch(event: TouchEvent) {
  const changedTouch = event.changedTouches;
  const index = touchPoints.map(record => record.identifier).indexOf(changedTouch.length === 1 ? changedTouch[0].identifier : changedTouch[changedTouch.length - 1].identifier);
  const key = determineKey(changedTouch[0]);
  switch (event.type) {
    case 'touchstart': {
      touchPoints.push(changedTouch[0]);
      if (key) {
      }
      if (key === 'down') {
        downTouch$.next();
      }
      break;
    }
    case 'touchend': {
      if (index > -1) {
        touchPoints.splice(index, 1);
      }
      break;
    }
    case 'touchcancel': {
      if (index > -1) {
        touchPoints.splice(index, 1);
      }
      break;
    }
  }
}

export function registerTouchEvent(): void {
  if (!isTouch()) {
    return;
  }
  document.addEventListener('touchstart', handleTouch, false);
  document.addEventListener('touchend', handleTouch, false);
  document.addEventListener('touchcancel', handleTouch, false);
}

export function addCharacter(currentLevel: string, initBig: boolean, initX: number, initY: number, gameBoard: any, scoreLabel: any, move: MoveDir, surveyAnswer: SurveyAnswer, q4Status$: Subject<string>, endGameSignal$: Subject<number>) {
  const SPEED = 360;
  let isBig = initBig;
  let canSmash = true;
  const onMobileLandscape = window.matchMedia('(orientation: landscape)').matches && window.innerHeight < 750;

  switchLevel$.pipe(take(1)).subscribe(() => {
    touchDirection.top = false;
    touchDirection.down = false;
    touchDirection.right = false;
    touchDirection.left = false;
  });

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
    let maxPosX = width();
    switch (currentLevel) {
      case 'q1':
        maxPosX = 2000;
        break;
      case 'q2':
        maxPosX = 5000;
        break;
      case 'q3':
        maxPosX = 4500;
        break;
      case 'q41':
        maxPosX = 4200;
        break;
      case 'q43':
        maxPosX = 3800;
        break;
      case 'q5':
        maxPosX = 2800;
        break;
      default:
        maxPosX = 3000;
        break;
    }
    if (mario.pos.x > maxPosX) {
      mario.pos.x = maxPosX;
    } else if (mario.pos.x < 1000) {
      mario.pos.x = 1000;
    }
    const floor = get('floor')[0];
    const ground = height() / 2 - (height() - floor.pos.y) + floor.height;
    if (isTouch()) {
      if (currentLevel === 'q5') {
        camPos(mario.pos.x, mario.pos.y > ground ? mario.pos.y : Math.min(ground, mario.pos.y));
      } else {
        camPos(mario.pos.x, Math.min(ground, mario.pos.y));
      }
    } else {
      if (currentLevel === 'q5') {
        camPos(mario.pos.x, mario.pos.y > ground ? mario.pos.y : Math.min(ground, mario.pos.y));
      } else {
        camPos(mario.pos.x, height() / 2 - (height() - floor.pos.y) + floor.height);
      }
    }
    const left = keyIsDown('left') || move.left || touchDirection.left;
    const right = keyIsDown('right') || move.right || touchDirection.right;
    const up = keyIsDown('up') || move.up || touchDirection.up;
    const down = keyIsDown('down') || move.down || touchDirection.down;
    const currAnim = mario.curAnim();
    if (move.down) {
      downTouch$.next();
    }
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
    } else if (obj.is('minus-attendee')) {
      // Decrease attendee by 1
      surveyAnswer.q4.a1 = surveyAnswer.q4.a1 > 0 ?  surveyAnswer.q4.a1 -= 1 : 0;
    } else if (obj.is('add-vegan')) {
      // Increase vegan by 1
      surveyAnswer.q4.a2 = surveyAnswer.q4.a2 < surveyAnswer.q4.a1 ? surveyAnswer.q4.a2 += 1 : surveyAnswer.q4.a2;
    } else if (obj.is('minus-vegan')) {
      // Decrease vegan by 1
      surveyAnswer.q4.a2 = surveyAnswer.q4.a2 > 0 ?  surveyAnswer.q4.a2 -= 1 : 0;
    } else if (obj.is('add-chair')) {
      // Increase children chair by 1
      surveyAnswer.q4.a3 = surveyAnswer.q4.a3 < (surveyAnswer.q4.a1 - 1) ? surveyAnswer.q4.a3 += 1 : surveyAnswer.q4.a3;
    } else if (obj.is('minus-chair')) {
      // Decrease children chair by 1
      surveyAnswer.q4.a3 = surveyAnswer.q4.a3 > 0 ?  surveyAnswer.q4.a3 -= 1 : 0;
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
  mario.onCollide('evil-mushroom', (e: any, side: any) => {
    if (!e.isAlive) {
      return;
    }
    const currentTime = time();
    if ((mario.lastCollide + 2) >= currentTime && mario.lastCollide !== null) {
      return;
    }
    if (side.isBottom()) {
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
    if (side.isBottom()) {
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

  const collidePipe$ = new Subject<void>();

  // Go into Pipe
  mario.onCollide('pipe', (pipe: any) => {
    collidePipe$.next();
    function enterPipe(currentLevel: string, score: any, isBig: boolean, surveyAnswer: SurveyAnswer): void {
      switch (currentLevel) {
        case 'q1': {
          // Option A
          if (pipe.is('pipe-a')) {
            surveyAnswer.q1 = 'A';
          } else {
            // Option B
            surveyAnswer.q1 = 'B';
          }
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
          } else if (pipe.is('pipe-d')) {
            // Option D
            surveyAnswer.q2 = 'D';
          } else {
            // Option E
            surveyAnswer.q2 = 'E';
          }
          go('game', { level: 'q3', score: scoreLabel.value, isBig });
          break;
        }
        case 'q3': {
          // Option A
          if (pipe.is('pipe-a')) {
            surveyAnswer.q3 = 'A';
            go('game', { level: 'q41', score: scoreLabel.value, isBig });
          } else {
            // Option B
            surveyAnswer.q3 = 'B';
            go('game', { level: 'q41', score: scoreLabel.value, isBig });
          }
          break;
        }
        case 'q41': {
          go('game', { level: 'q42', score: scoreLabel.value, isBig });
          break;
        }
        case 'q42': {
          go('game', { level: 'q43', score: scoreLabel.value, isBig });
          break;
        }
        case 'q43': {
          // go('game', { level: 'q5', score: scoreLabel.value, isBig });
          endGameSignal$.next(scoreLabel.value);
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
          endGameSignal$.next(scoreLabel.value);
        }
      }
    }
    keyPress('down', () => {
      switchLevel$.next();
      enterPipe(currentLevel, scoreLabel.value, isBig, surveyAnswer);
    });
    downTouch$.pipe(take(1), takeUntil(collidePipe$), takeUntil(switchLevel$)).subscribe(() => {
      switchLevel$.next();
      enterPipe(currentLevel, scoreLabel.value, isBig, surveyAnswer);
    })
  });

  /***
   * Add Q4 triggers
   **/
  // Add Q4-1 title
  mario.onCollide('q4-1-start', () => {
    q4Status$.next('q4-1-start');
  });
  mario.onCollide('q4-1-end', () => {
    q4Status$.next('q4-1-end');
  });
  // Add Q4-2 title
  mario.onCollide('q4-2-start', () => {
    q4Status$.next('q4-2-start');
  });
  mario.onCollide('q4-2-end', () => {
    q4Status$.next('q4-2-end');
  });
  // Add Q4-3 title
  mario.onCollide('q4-3-start', () => {
    q4Status$.next('q4-3-start');
  });
  mario.onCollide('q4-3-end', () => {
    q4Status$.next('q4-3-end');
  });
  return mario;
}
