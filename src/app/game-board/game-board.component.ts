import { Component, OnDestroy, OnInit } from '@angular/core';
import { getSpriteConfig } from '../shared/sprite-mapping';
import { maps } from '../shared/map';
import { loadSprites } from './../shared/sprite-mapping';
import { addCharacter, loadCharacter, registerTouchEvent } from '../shared/character';
import { loadEvilMushroom } from './../shared/evil-shroom';
import { loadTurtle } from './../shared/turtle';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { R3TargetBinder } from '@angular/compiler';
import * as moment from 'moment';

declare const origin: any;

const BASE_SCALE = 2;
const MUSHROOM_SPEED = 50;

export interface MoveDir {
  left: boolean;
  right: boolean;
  down: boolean;
  up: boolean;
}

export interface SurveyResult {
  guestName: string;
  guestFrom: string;
  relation: string;
  attend: string;
  attendNo: string;
  childNo: string;
  vegeNo: string;
  childSeatNo: string;
  invitationType: string;
  address: string;
  phone: string;
  email: string;
  note: string;
  score: string;
  timeFinish: string;
}

export interface GameOption {
  level: string;
  score: number;
  isBig: boolean;
}

export interface SurveyAnswer {
  q1: 'A' | 'B' | null,
  q2: 'A' | 'B' | 'C' | 'D' | 'E' | null,
  q3: 'A' | 'B' | null,
  q4: {
    a1: number,
    a2: number,
    a3: number
  },
  q5: 'A' | 'B' | 'C' | null
}
@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit, OnDestroy {

  isTouch = false;
  music: HTMLAudioElement | null = null;
  muted = true;
  fullscreen = false;

  gameBoard: any;
  score = 0;
  scoreLabel: any;

  SurveyAnswers: SurveyAnswer = {
    q1: null,
    q2: null,
    q3: null,
    q4: {
      a1: 0,
      a2: 0,
      a3: 0
    },
    q5: null
  };

  endGameSignal$ = new Subject<number>();
  onDestroy$ = new Subject<void>();

  q4Status$ = new Subject<string>();

  q4Trigger = {
    q41: false,
    q42: false,
    q43: false
  };

  startTime: moment.Moment | null = null;

  moveDir: MoveDir = {
    right: false,
    left: false,
    up: false,
    down: false,
  };

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.init();
    this.startTime = moment();
    registerTouchEvent();
    loadEvilMushroom();
    loadTurtle();
    loadCharacter();
    loadSprites();
    this.music = new Audio('/assets/music/bg.mp3');
    this.music.loop = true;
    this.music.volume = 0.6;
    this.music.pause();
    // this.music = play('bg', { volume: 0.6, loop: true });
    // (this.music as any)?.pause();
    this.addGameScene();

    go('game', { level: 'q1', score: 0, isBig: false });
    document.querySelector('canvas')?.focus();
    this.regEndGame();
  }

  // Init game board
  init(): void {
    if (window.matchMedia("(pointer: coarse)").matches) {
      this.isTouch = true;
      if (window.matchMedia("(orientation: landscape)").matches) {
        kaboom({
          width: window.innerWidth,
          height: window.innerHeight,
          background: [255, 246, 193, 1],
        });
      } else {
        kaboom({
          width: window.innerWidth,
          height: window.innerHeight * 0.75,
          background: [255, 246, 193, 1],
        });
      }
    } else {
      kaboom({
        width: Math.max(window.innerWidth * 0.8, 1025),
        height: window.innerHeight,
        background: [255, 246, 193, 1],
      });
    }
  }

  addLayer(): void {
    return layers(['bg', 'obj', 'ui'], 'obj');
  }

  addGameBg(level: string): void {
    const floor = get('floor')[0].pos.y + 8;
    switch (level) {
      case 'q1': {
        add([
          sprite('mountain'),
          layer('bg'),
          pos(vec2(500, floor)),
          origin('botleft'),
          scale(BASE_SCALE / 3)
        ]);

        add([
          sprite('mountain'),
          layer('bg'),
          pos(vec2(1600, floor)),
          origin('botleft'),
          scale(BASE_SCALE / 3)
        ]);
        break;
      }
      case 'q2': {
        add([
          sprite('house'),
          layer('bg'),
          pos(vec2(400, floor)),
          origin('botleft'),
          scale(BASE_SCALE * 0.8)
        ]);

        add([
          sprite('mountain'),
          layer('bg'),
          pos(vec2(2000, floor)),
          origin('botleft'),
          scale(BASE_SCALE / 3 * 0.8)
        ]);
        break;
      }
      case 'q3': {
        add([
          sprite('mountain'),
          layer('bg'),
          pos(vec2(200, floor)),
          origin('botleft'),
          scale(BASE_SCALE / 3)
        ]);

        add([
          sprite('mountain'),
          layer('bg'),
          pos(vec2(2400, floor)),
          origin('botleft'),
          scale(BASE_SCALE / 3)
        ]);
        break;
      }
      case 'q41': {
        add([
          sprite('house'),
          layer('bg'),
          pos(vec2(600, floor)),
          origin('botleft'),
          scale(BASE_SCALE * 0.8)
        ]);
        add([
          sprite('mountain'),
          layer('bg'),
          pos(vec2(3000, floor)),
          origin('botleft'),
          scale(BASE_SCALE / 3)
        ]);

        break;
      }
      case 'q43': {
        add([
          sprite('mountain'),
          layer('bg'),
          pos(vec2(1100, floor)),
          origin('botleft'),
          scale(BASE_SCALE / 3)
        ]);

        add([
          sprite('mountain'),
          layer('bg'),
          pos(vec2(2700, floor)),
          origin('botleft'),
          scale(BASE_SCALE / 3 * 0.8)
        ]);

        break;
      }
    }
  }

  addGameScene(): void {
    if (window.matchMedia("(orientation: landscape) and (max-height: 767.5px)").matches) {
      document.documentElement.requestFullscreen();
    }
    scene('game', (gameConfig: GameOption) => {
      const labelFontSize = window.innerWidth < 750 ? 48 : 70;
      this.addLayer();
      this.scoreLabel = add([
        text(String(gameConfig.score).padStart(3, '0'), { size: labelFontSize }),
        scale(BASE_SCALE / 2),
        area(),
        pos(850, 150),
        fixed(),
        layer('ui'),
        {
          value: gameConfig.score
        }
      ]);
      this.score = gameConfig.score;
      const scoreXPos = width() - this.scoreLabel.width - 10;
      const scoreYPos = 10;
      this.scoreLabel.moveTo(scoreXPos, scoreYPos);
      const config = getSpriteConfig(BASE_SCALE, this.scoreLabel);
      const map = maps[gameConfig.level];
      this.gameBoard = addLevel(map, config);
      this.addGameBg(gameConfig.level);
      const player = addCharacter(gameConfig.level, gameConfig.isBig, 1000, 0, this.gameBoard, this.scoreLabel, this.moveDir, this.SurveyAnswers, this.q4Status$, this.endGameSignal$);

      this.q4Status$.pipe(takeUntil(this.onDestroy$)).subscribe(state => {
        switch (state) {
          case 'q4-1-start': {
            this.q4Trigger.q41 = true;
            break;
          }
          case 'q4-1-end': {
            this.q4Trigger.q41 = false;
            break;
          }
          case 'q4-2-start': {
            this.q4Trigger.q42 = true;
            break;
          }
          case 'q4-2-end': {
            this.q4Trigger.q42 = false;
            break;
          }
          case 'q4-3-start': {
            this.q4Trigger.q43 = true;
            break;
          }
          case 'q4-3-end': {
            this.q4Trigger.q43 = false;
            break;
          }
        }
      });
      onDraw(() => {
        if (gameConfig.level === 'q41' && this.q4Trigger.q41) {
          drawSprite({
            sprite: 'q4-1',
            pos: vec2(2480, 270),
            width: 150
          });
          drawText({
            text: this.SurveyAnswers.q4.a1.toString(),
            size: 48,
            pos: vec2(2680, 270)
          });
        } else if (gameConfig.level === 'q42' && this.q4Trigger.q42) {
          drawSprite({
            sprite: 'q4-2',
            pos: vec2(1900, 280),
            width: 150
          });
          drawText({
            text: this.SurveyAnswers.q4.a2.toString(),
            size: 48,
            pos: vec2(2100, 280)
          });
        } else if (gameConfig.level === 'q43' && this.q4Trigger.q43) {
          drawSprite({
            sprite: 'q4-3',
            pos: vec2(2100, 300),
            width: 150
          });
          drawText({
            text: this.SurveyAnswers.q4.a3.toString(),
            size: 48,
            pos: vec2(2300, 300)
          });
        }
      });
    });
  }

  regEndGame(): void {
    this.endGameSignal$.pipe(takeUntil(this.onDestroy$)).subscribe((finalScore) => {
      const finishTime = moment();
      const duration = moment.duration(finishTime.diff(this.startTime));
      sessionStorage.setItem('duration', Math.floor(duration.asSeconds()).toString());

      this.score = finalScore;

      // Add time bonus score
      const timeBonus = Math.floor(100 * (120 / Math.floor(duration.asSeconds())));
      this.score += timeBonus;

      // localStorage.setItem('gameAnswer', JSON.stringify(this.SurveyAnswers));
      // // Update highest score
      // const lastScore = localStorage.getItem('maxScore') || 0;
      // if (this.score > +lastScore) {
      //   localStorage.setItem('maxScore', this.score.toString());
      // }
      this.router.navigateByUrl('thankyou');
      this.music?.pause();
    });
  }

  // On user clicks on the arrow
  keyDown(direction: string) {
    switch (direction) {
      case 'left': {
        this.moveDir.left = true;
        break;
      }
      case 'right': {
        this.moveDir.right = true;
        break;
      }
      case 'up': {
        this.moveDir.up = true;
        break;
      }
      case 'down': {
        this.moveDir.down = true;
        break;
      }
    }
  }

  keyUp(direction: string): void {
    switch (direction) {
      case 'left': {
        this.moveDir.left = false;
        break;
      }
      case 'right': {
        this.moveDir.right = false;
        break;
      }
      case 'up': {
        this.moveDir.up = false;
        break;
      }
      case 'down': {
        this.moveDir.down = false;
        break;
      }
    }
  }

  toggleMusic(): void {
    if (!this.music) {
      return;
    }
    this.muted = !this.muted;
    if (this.muted) {
      this.music.pause();
    } else {
      this.music.play();
    }
  }

  enterFullscreen(): void {
    if (!this.fullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    this.fullscreen = !this.fullscreen;
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    const canvasEl = document.querySelector('canvas');
    canvasEl?.remove();
  }
}
