declare const origin: any;
export function loadArrowSprites(): void {
  loadSprite('arrow-up', '/assets/img/arrow-up.png');
  loadSprite('arrow-down', '/assets/img/arrow-down.png');
  loadSprite('arrow-right', '/assets/img/arrow-right.png');
  loadSprite('arrow-left', '/assets/img/arrow-left.png');
}

export function arrow() {
  return {
    id: 'arrow',
    isPressed: false,
    update() {
      if (this.isPressed) {
        (this as any).use(opacity(1));
      } else {
        (this as any).use(opacity(0.5));
      }
    }
  }
}
export function addKey(spriteName: string, x: number, y: number) {
  const arrowObj = add([
    pos(x, y),
    sprite(spriteName),
    fixed(),
    opacity(0.5),
    scale(1),
    arrow(),
    // body(),
    // origin('bot'),
    // area({ width: 32 }),
    spriteName
  ]);
  return arrowObj;
}
