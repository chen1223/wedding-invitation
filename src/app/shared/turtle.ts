const SLIDE_SPEED = 1000;
const BUMPED_FORCE = 500;

export function loadTurtle(): void {
  loadSpriteAtlas('/assets/img/enemy-sprite.png', {
    'turtle': {
      x: 3,
      y: 0,
      sliceX: 21,
      sliceY: 1,
      width: 672,
      height: 32,
      anims: {
        'idle': {
          from: 3,
          to: 3
        },
        'walk': {
          from: 3,
          to: 4,
          speed: 4
        },
        'shell': {
          from: 5,
          to: 5
        }
      }
    }
  });
}
export function turtle() {
  return {
    id: "enemy-turtle",
    require: ["pos", "area", "sprite", "turtleWalk"],
    isShell: false,
    isSliding: false,
    slidingDir: 1,
    dir: -1,
    goLeft: true,
    update() {
      const currAnim = (this as any).curAnim();
      if (currAnim !== 'walk' && !this.isShell) {
        (this as any).play('walk');
      } else if (this.isSliding) {
        (this as any).move(SLIDE_SPEED * this.slidingDir, 0);
      }
    },
    smash() {
      (this as any).unuse("turtleWalk");
      (this as any).stop();
      (this as any).frame = 2;
      (this as any).area.width = 20;
      (this as any).area.height = 16;
      // (this as any).area.offset.x = -6 * this.dir;
      (this as any).area.offset.x = 6 * this.dir;
      this.isShell = true;
      (this as any).play('shell');
      // (this as any).use(lifespan(0.5, { fade: 0.1 }));
    },
    slide(dir: 1 | -1) {
      this.isSliding = true;
      this.slidingDir = dir;
    }
  }
}
export function turtleWalk(speed = 50, dir = -1, scoreLabel: any) {

  return {
    id: "turtleWalk",
    require: ["pos", "area",],
    startingPos: vec2(0, 0),
    add() {
      this.startingPos = (this as any).pos;
      // Turn to the opposite direction on collide
      (this as any).on("collide", (obj: any, side: any) => {
        // Steady shell
        if ((this as any).isShell && !(this as any).isSliding) {
          return;
        }
        // Sliding
        if ((this as any).isSliding) {
          if (side.isLeft() || side.isRight()) {
            (this as any).slidingDir *= -1;
          }
          // Bump into evil-mushroom
          if (obj.is('evil-mushroom')) {
            (obj as any).bumped();
            scoreLabel.value += 100;
            scoreLabel.text = String(scoreLabel.value).padStart(3, '0');
          } else if (obj.is('coin')) {
            destroy(obj);
            // Bump into coin
            scoreLabel.value += 2;
            scoreLabel.text = String(scoreLabel.value).padStart(3, '0');
          } else if (obj.is('mushroom')) {
            (obj as any).jump(BUMPED_FORCE);
            (obj as any).use(lifespan(0.5, { fade: 0.1 }));
            // Bump into mushroom
            scoreLabel.value += 5;
            scoreLabel.text = String(scoreLabel.value).padStart(3, '0');
          }
        } else {
          // Walking
          if (side.isLeft() || side.isRight()) {
            (this as any).flipX(dir === -1);
            dir = -dir;
            (this as any).dir *= -1;
            (this as any).use(area({ width: 16, height: 24, offset: { x: 10 * dir, y: 0 } }));
          }
        }
      });
    },
    update() {
      if ((this as any).isShell) {
        return;
      }
      (this as any).move(speed * dir, 0);
    },
  };
}

