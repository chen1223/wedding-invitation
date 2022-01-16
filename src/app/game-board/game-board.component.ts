import { Component, OnDestroy, OnInit } from '@angular/core';
import { getSpriteConfig } from '../shared/sprite-mapping';
import { maps } from '../shared/map';
import { loadSprites } from './../shared/sprite-mapping';
import { addCharacter, loadCharacter } from '../shared/character';
import { loadEvilMushroom } from './../shared/evil-shroom';
import { loadTurtle } from './../shared/turtle';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { R3TargetBinder } from '@angular/compiler';

declare const origin: any;

const BASE_SCALE = 2;
const MUSHROOM_SPEED = 50;

export interface GameOption {
  level: string;
  score: number;
  isBig: boolean;
}

export interface SurveyAnser {
  q1: 'A' | 'B' | null,
  q2: 'A' | 'B' | 'C' | 'D' | null,
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

  gameBoard: any;
  score = 0;
  scoreLabel: any;

  surveyAnsers: SurveyAnser = {
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

  endGameSignal$ = new Subject<void>();
  onDestroy$ = new Subject<void>();

  q4Status$ = new Subject<string>();

  q4Trigger = {
    q41: false,
    q42: false,
    q43: false
  };

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.init();
    this.loadFont();
    loadEvilMushroom();
    loadTurtle();
    loadCharacter();
    loadSprites();
    this.addGameScene();
    this.addStartScene();
    this.regEndGame();
  }

  // Init game board
  init(): void {
    kaboom({
      width: window.innerWidth,
      height: window.innerHeight,
      background: [0, 0, 0, 1]
    });
  }

  loadFont(): void {
    loadFont('test', '/assets/fonts/noto.png', 64, 64);
  }

  // Start Scene
  addStartScene(): void {
    scene('start', () => {
      add([
        text('Welcome to Aileen and Bill\'s Wedding Invitation Game\n\nClick on Start to begin', {
          size: 32,
          width: Math.floor(width() * .9)
        }),
        pos(vec2(width() / 2, height() / 2)),
        origin('center'),
        area(),
        color(255, 255, 255),
      ]);
      add([
        text('Start', { size: 48, font: 'apl386o' }),
        pos(vec2(width() / 2, height() / 2 + 150)),
        origin('center'),
        area(),
        color(255, 255, 255),
        'start-title'
      ]);
      onClick('start-title', () => {
        go('game', { level: 'q1', score: 0, isBig: false });
      });
    });
    go('start');
  }

  addGameScene(): void {
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
      const scoreXPos = width() - this.scoreLabel.width - 10;
      const scoreYPos = 10;
      this.scoreLabel.moveTo(scoreXPos, scoreYPos);
      const config = getSpriteConfig(BASE_SCALE, this.scoreLabel);
      const map = maps[gameConfig.level];
      this.gameBoard = addLevel(map, config);
      const player = addCharacter(gameConfig.level, gameConfig.isBig, 80, 0, this.gameBoard, this.scoreLabel, this.surveyAnsers, this.q4Status$, this.endGameSignal$);

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
        if (gameConfig.level === 'q4') {
          if (this.q4Trigger.q41) {
            drawSprite({
              sprite: 'q4-1',
              pos: vec2(1800, 100),
              width: 150
            });
            drawText({
              text: this.surveyAnsers.q4.a1.toString(),
              size: 48,
              pos: vec2(2000, 100)
            });
          }
          if (this.q4Trigger.q42) {
            drawSprite({
              sprite: 'q4-2',
              pos: vec2(3600, 100),
              width: 150
            });
            drawText({
              text: this.surveyAnsers.q4.a2.toString(),
              size: 48,
              pos: vec2(3800, 100)
            });
          }
          if (this.q4Trigger.q43) {
            drawSprite({
              sprite: 'q4-3',
              pos: vec2(4800, 600),
              width: 150
            });
            drawText({
              text: this.surveyAnsers.q4.a3.toString(),
              size: 48,
              pos: vec2(5000, 600)
            });
          }
        }
      });
    });
  }

  addLayer(): void {
    return layers(['bg', 'obj', 'ui'], 'obj');
  }

  regEndGame(): void {
    this.endGameSignal$.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      localStorage.setItem('gameAnswer', JSON.stringify(this.surveyAnsers));
      this.router.navigateByUrl('confirm');
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    const canvasEl = document.querySelector('canvas');
    canvasEl?.remove();
  }
}