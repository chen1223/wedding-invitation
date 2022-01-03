const BUMPED_FORCE = 500;
export function loadEvilMushroom(): void {
  loadSpriteAtlas('/assets/img/enemy-sprite.png', {
    'evil-mushroom': {
      x: 0,
      y: 0,
      sliceX: 21,
      sliceY: 1,
      width: 672,
      height: 32,
      anims: {
        walk: {
          from: 0,
          to: 1,
          speed: 4
        },
        smash: {
          from: 2,
          to: 2
        }
      }
    }
  });
}

export function evilShroom() {
  return {
    id: "evilShroom",
    require: ["pos", "area", "sprite", "shroomWalk"],
    isAlive: true,
    update() {
      const currAnim = (this as any).curAnim();
      if (currAnim !== 'walk' && this.isAlive) {
        (this as any).play('walk');
      }
    },
    smash() {
      (this as any).isAlive = false;
      (this as any).unuse("shroomWalk");
      (this as any).stop();
      (this as any).frame = 2;
      (this as any).area.width = 16;
      (this as any).area.height = 8;
      (this as any).use(lifespan(0.5, { fade: 0.1 }));
    },
    bumped() {
      (this as any).isAlive = false;
      (this as any).unuse("shroomWalk");
      (this as any).stop();
      (this as any).jump(BUMPED_FORCE);
      (this as any).use(lifespan(0.5, { fade: 0.1 }));
    }
  }
}

export function shroomWalk(distance = 100, speed = 50, dir = -1) {

  return {
    id: "shroomWalk",
    require: ["pos", "area",],
    startingPos: vec2(0, 0),
    add() {
      this.startingPos = (this as any).pos;
      // Turn to the opposite direction on collide
      (this as any).on("collide", (obj: any, side: any) => {
        if (side.isLeft() || side.isRight()) {
          dir = -dir;
        }
      });
    },
    update() {
      (this as any).move(speed * dir, 0);
    },
  };
}
