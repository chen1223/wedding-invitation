import { evilShroom, shroomWalk } from '../shared/evil-shroom';
import { turtle, turtleWalk } from './turtle';

declare const origin: any;
export function loadSprites(): void {
  // loadSound('bg', '/assets/music/bg.mp3');
  loadSprite('floor', '/assets/img/floor.png');
  loadSprite('house', '/assets/img/house.png');
  loadSpriteAtlas('/assets/img/items.png', {
    'coin': {
      x: 0,
      y: 16,
      sliceX: 4,
      sliceY: 3,
      width: 80,
      height: 48
    }
  });
  loadSpriteAtlas('/assets/img/world.png', {
    'brick': {
      x: 48,
      y: 0,
      sliceX: 8,
      sliceY: 8,
      width: 128,
      height: 128
    }
  });
  loadSpriteAtlas('/assets/img/world.png', {
    'block': {
      x: 32,
      y: 0,
      sliceX: 8,
      sliceY: 8,
      width: 128,
      height: 128
    }
  });
  loadSpriteAtlas('/assets/img/world.png', {
    'unboxed': {
      x: 32,
      y: 0,
      sliceX: 8,
      sliceY: 8,
      width: 128,
      height: 128
    }
  });
  loadSpriteAtlas('/assets/img/world.png', {
    'question': {
      x: 64,
      y: 0,
      sliceX: 8,
      sliceY: 8,
      width: 128,
      height: 128
    }
  });
  loadSpriteAtlas('/assets/img/world.png', {
    'pipe-tl': {
      x: 96,
      y: 0,
      sliceX: 8,
      sliceY: 8,
      width: 128,
      height: 128
    }
  });
  loadSpriteAtlas('/assets/img/world.png', {
    'pipe-tr': {
      x: 112,
      y: 0,
      sliceX: 8,
      sliceY: 8,
      width: 128,
      height: 128
    }
  });
  loadSpriteAtlas('/assets/img/world.png', {
    'pipe-bl': {
      x: 96,
      y: 16,
      sliceX: 8,
      sliceY: 8,
      width: 128,
      height: 128
    }
  });
  loadSpriteAtlas('/assets/img/world.png', {
    'pipe-br': {
      x: 112,
      y: 16,
      sliceX: 8,
      sliceY: 8,
      width: 128,
      height: 128
    }
  });
  loadSprite('mushroom', '/assets/img/mushroom.png');
  loadSprite('mountain', '/assets/img/mountain.png');
  /*** Welcome Page Sprites ***/
  loadSprite('couple', '/assets/img/welcome/couple.png');
  loadSprite('start', '/assets/img/welcome/start.png');
  loadSprite('survey', '/assets/img/welcome/survey.png');
  loadSprite('start--mobile', '/assets/img/welcome/start--mobile.png');
  loadSprite('survey--mobile', '/assets/img/welcome/survey--mobile.png');
  loadSprite('welcome', '/assets/img/welcome/welcome.png');
  loadSprite('welcome-msg', '/assets/img/welcome/welcome-msg.png');
  loadSprite('welcome-msg--mobile', '/assets/img/welcome/welcome-msg--mobile.png');
  loadSprite('cloud', '/assets/img/cloud.png');
  loadSprite('cloud--long', '/assets/img/cloud-long.png');
  /*** Location Info Sprites ***/
  loadSprite('date', '/assets/img/info/date.png');
  loadSprite('time', '/assets/img/info/time.png');
  loadSprite('entrance', '/assets/img/info/start.png');
  loadSprite('location', '/assets/img/info/location.png');
  /*** Question 1 Spirtes ***/
  loadSprite('q1', '/assets/img/question/q1.png');
  loadSprite('q1a', '/assets/img/question/q1a.png');
  loadSprite('q1b', '/assets/img/question/q1b.png');
  /*** Question 2 Sprites ***/
  loadSprite('q2', '/assets/img/question/q2.png');
  loadSprite('q2a', '/assets/img/question/q2a.png');
  loadSprite('q2b', '/assets/img/question/q2b.png');
  loadSprite('q2c', '/assets/img/question/q2c.png');
  loadSprite('q2d', '/assets/img/question/q2d.png');
  loadSprite('q2e', '/assets/img/question/q2e.png');
  /*** Question 3 Sprites ***/
  loadSprite('q3', '/assets/img/question/q3.png');
  loadSprite('q3a', '/assets/img/question/q3a.png');
  loadSprite('q3b', '/assets/img/question/q3b.png');
  /*** Question 4 Sprites ***/
  loadSpriteAtlas('/assets/img/world.png', {
    'q4-1-brick': {
      x: 48,
      y: 0,
      sliceX: 8,
      sliceY: 8,
      width: 128,
      height: 128
    }
  });
  loadSprite('q4-1', '/assets/img/question/q4-1.png');
  loadSprite('q4-2', '/assets/img/question/q4-2.png');
  loadSprite('q4-3', '/assets/img/question/q4-3.png');
  loadSprite('q4a', '/assets/img/question/q4a.png');
  loadSprite('q4b', '/assets/img/question/q4b.png');
  /*** Question 5 Sprites ***/
  loadSprite('q5', '/assets/img/question/q5.png');
  loadSprite('q5a', '/assets/img/question/q5a.png');
  loadSprite('q5b', '/assets/img/question/q5b.png');
  loadSprite('q5c', '/assets/img/question/q5c.png');
}

export function getSpriteConfig(BASE_SCALE: number, scoreLabel: any) {

  return {
    width: 32,
    height: 32,
    'K': () => [sprite('cloud'), scale(BASE_SCALE / 3), 'cloud'],
    'q': () => [sprite('cloud--long'), scale(BASE_SCALE / 3), 'cloud'],
    'c': () => [sprite('floor'), solid(), area(), scale(BASE_SCALE / 2), 'floor'],
    '=': () => [sprite('brick'), solid(), area(), scale(BASE_SCALE), 'brick'],
    '*': () => [sprite('block'), solid(), area(), scale(BASE_SCALE)],
    'u': () => [sprite('unboxed'), solid(), area(), scale(BASE_SCALE)],
    '$': () => [sprite('coin'), solid(), area({ width: 16, height: 16 }), scale(BASE_SCALE), 'coin'],
    ':': () => [sprite('question'), solid(), area(), scale(BASE_SCALE), 'coin-gift'],
    ';': () => [sprite('question'), solid(), area(), scale(BASE_SCALE), 'mushroom-gift'],
    '^': () => [sprite('mushroom'), solid(), area(), body(), scale(BASE_SCALE), shroomWalk(100, 50, 1), 'mushroom'],
    'v': () => [
      sprite('evil-mushroom'),
      solid(),
      area({ width: 16, height: 16 }),
      body(),
      scale(BASE_SCALE),
      origin('bot'),
      evilShroom(),
      shroomWalk(),
      'evil-mushroom'
    ],
    't': () => [
      sprite('turtle'),
      solid(),
      area({ width: 16, height: 24, offset: { x: -10, y: 0 } }),
      body(),
      scale(BASE_SCALE),
      origin('bot'),
      turtle(),
      turtleWalk(50, -1, scoreLabel),
      'turtle'
    ],
    '[': () => [sprite('pipe-bl'), solid(), area(), scale(BASE_SCALE)],
    ']': () => [sprite('pipe-br'), solid(), area(), scale(BASE_SCALE)],
    // Cloud
    '': () => [sprite('cloud')],
    // Option a pipe
    '~': () => [sprite('pipe-tl'), solid(), area(), scale(BASE_SCALE), 'pipe', 'pipe-a'],
    '_': () => [sprite('pipe-tr'), solid(), area(), scale(BASE_SCALE), 'pipe', 'pipe-a'],
    // Option b pipe
    '+': () => [sprite('pipe-tl'), solid(), area(), scale(BASE_SCALE), 'pipe', 'pipe-b'],
    '"': () => [sprite('pipe-tr'), solid(), area(), scale(BASE_SCALE), 'pipe', 'pipe-b'],
    // Option c pipe
    '`': () => [sprite('pipe-tl'), solid(), area(), scale(BASE_SCALE), 'pipe', 'pipe-c'],
    '0': () => [sprite('pipe-tr'), solid(), area(), scale(BASE_SCALE), 'pipe', 'pipe-c'],
    // Option d pipe
    '{': () => [sprite('pipe-tl'), solid(), area(), scale(BASE_SCALE), 'pipe', 'pipe-d'],
    '}': () => [sprite('pipe-tr'), solid(), area(), scale(BASE_SCALE), 'pipe', 'pipe-d'],
    // Option e pipe
    'm': () => [sprite('pipe-tl'), solid(), area(), scale(BASE_SCALE), 'pipe', 'pipe-d'],
    'b': () => [sprite('pipe-tr'), solid(), area(), scale(BASE_SCALE), 'pipe', 'pipe-d'],
    /*** Location Info Resources ***/
    'd': () => [sprite('date'), scale(BASE_SCALE / 4)],
    'o': () => [sprite('time'), scale(BASE_SCALE / 4)],
    'e': () => [sprite('entrance'), scale(BASE_SCALE / 4)],
    'l': () => [sprite('location'), scale(BASE_SCALE / 4)],

    /*** Question 1 Resources ***/
    '-': () => [sprite('q1'), scale(BASE_SCALE / 4)],
    '1': () => [sprite('q1a'), scale(BASE_SCALE / 4)],
    '2': () => [sprite('q1b'), scale(BASE_SCALE / 4)],

    /*** Question 2 Resources ***/
    '@': () => [sprite('q2'), scale(BASE_SCALE / 4)],
    '/': () => [sprite('q2a'), scale(BASE_SCALE / 4)],
    '\\': () => [sprite('q2b'), scale(BASE_SCALE / 4)],
    '|': () => [sprite('q2c'), scale(BASE_SCALE / 4)],
    '!': () => [sprite('q2d'), scale(BASE_SCALE / 4)],
    ')': () => [sprite('q2e'), scale(BASE_SCALE / 4)],

    /*** Question 3 Resources ***/
    '#': () => [sprite('q3'), scale(BASE_SCALE / 4)],
    'a': () => [sprite('q3a'), scale(BASE_SCALE / 4)],
    'w': () => [sprite('q3b'), scale(BASE_SCALE / 4)],

    /*** Question 4 Resources ***/
    // Q4 1 Triggers
    '3': () => [sprite('floor'), scale(BASE_SCALE / 2), solid(), area(), 'q4-1-start'],
    '4': () => [sprite('brick'), scale(BASE_SCALE), solid(), area(), 'q4-1-start'],
    '8': () => [sprite('floor'), scale(BASE_SCALE / 2), solid(), area(), 'q4-1-start'],
    'j': () => [sprite('floor'), scale(BASE_SCALE / 2), solid(), area(), 'q4-1-end'],
    // Q4 2 Triggers
    'k': () => [sprite('brick'), scale(BASE_SCALE), solid(), area(), 'q4-2-start'],
    'n': () => [sprite('brick'), scale(BASE_SCALE), solid(), area(), 'q4-2-end'],
    // Q4 3 Triggers
    'p': () => [sprite('brick'), scale(BASE_SCALE), solid(), area(), 'q4-3-start'],
    '7': () => [sprite('floor'), scale(BASE_SCALE / 2), solid(), area(), 'q4-3-start'],
    'z': () => [sprite('brick'), scale(BASE_SCALE), solid(), area(), 'q4-3-end'],

    '%': () => [sprite('q4-1'), scale(BASE_SCALE)],
    'I': () => [sprite('q4-2'), scale(BASE_SCALE)],
    'O': () => [sprite('q4-3'), scale(BASE_SCALE / 4)],
    'y': () => [sprite('q4a'), scale(BASE_SCALE / 4)],
    'x': () => [sprite('q4b'), scale(BASE_SCALE / 4)],
    '>': () => [sprite('question'), solid(), area(), scale(BASE_SCALE), 'add-attendee'],
    '<': () => [sprite('question'), solid(), area(), scale(BASE_SCALE), 'minus-attendee'],
    'g': () => [sprite('question'), solid(), area(), scale(BASE_SCALE), 'add-vegan'],
    'h': () => [sprite('question'), solid(), area(), scale(BASE_SCALE), 'minus-vegan'],
    '5': () => [sprite('question'), solid(), area(), scale(BASE_SCALE), 'add-chair'],
    '6': () => [sprite('question'), solid(), area(), scale(BASE_SCALE), 'minus-chair'],

    /*** Question 5 Resources **/
    '&': () => [sprite('q5'), scale(BASE_SCALE / 4)],
    'r': () => [sprite('q5a'), scale(BASE_SCALE / 4)],
    'f': () => [sprite('q5b'), scale(BASE_SCALE / 4)],
    's': () => [sprite('q5c'), scale(BASE_SCALE / 4)],
  };
};
