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

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.init();
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

  // Start Scene
  addStartScene(): void {
    scene('start', () => {
      add([
        text('Welcome to Ailen and Bill\'s Wedding Invitation Game\n\nClick on Start to begin', {
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
      // Add attendee label for Q4 only
      let labelOptions;
      if (gameConfig.level === 'q4') {
        labelOptions = {
          attendeeLabel: null,
          vegeLabel: null,
          chairLabel: null
        };
        labelOptions.attendeeLabel = add([
          text(`${this.surveyAnsers.q4.a1}`, { size: labelFontSize }),
          scale(BASE_SCALE / 2),
          area(),
          pos(0, 0),
          fixed(),
          layer('ui')
        ]);
        if (labelOptions.attendeeLabel) {
          const attendeeXPos = 10 + (labelOptions.attendeeLabel as any).width / 2;
          const attendeeYPos = this.scoreLabel.pos.y;
          (labelOptions.attendeeLabel as any).moveTo(attendeeXPos, attendeeYPos);
        }
        labelOptions.vegeLabel = add([
          text(`${this.surveyAnsers.q4.a2}`, { size: labelFontSize }),
          scale(BASE_SCALE / 2),
          fixed(),
          pos(0, 0),
          fixed(),
          area(),
          layer('ui')
        ]);
        if (labelOptions.vegeLabel) {
          const vegeXPos = (labelOptions.attendeeLabel as any).pos.x;
          const vegeYPos = (labelOptions.attendeeLabel as any).pos.y + (labelOptions.attendeeLabel as any).height;
          (labelOptions.vegeLabel as any).moveTo(vegeXPos, vegeYPos);
        }
        labelOptions.chairLabel = add([
          text(`${this.surveyAnsers.q4.a3}`, { size: labelFontSize }),
          scale(BASE_SCALE / 2),
          fixed(),
          pos(850, 150),
          area(),
          layer('ui')
        ]);
        if (labelOptions.chairLabel) {
          const chairXPos = (labelOptions.vegeLabel as any).pos.x;
          const chairYPos = (labelOptions.vegeLabel as any).pos.y + (labelOptions.vegeLabel as any).height;
          (labelOptions.chairLabel as any).moveTo(chairXPos, chairYPos);
        }
      }
      const config = getSpriteConfig(BASE_SCALE, this.scoreLabel);
      const map = maps[gameConfig.level];
      this.gameBoard = addLevel(map, config);
      const player = addCharacter(this.endGameSignal$, gameConfig.level, gameConfig.isBig, 80, 0, this.gameBoard, this.scoreLabel, this.surveyAnsers, labelOptions);
      this.mushroomWalk();
    });
  }

  addLayer(): void {
    return layers(['bg', 'obj', 'ui'], 'obj');
  }

  mushroomWalk(): void {
    // action('mushroom', (m: any) => {
    //   m.move(MUSHROOM_SPEED, 0);
    // });
  }

  regEndGame(): void {
    this.endGameSignal$.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      localStorage.setItem('gameAnswer', JSON.stringify(this.surveyAnsers));
      this.router.navigateByUrl('final');
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    const canvasEl = document.querySelector('canvas');
    canvasEl?.remove();
  }
}
