export default class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toDebugText() {
    return `x: ${this.x} y: ${this.y}`;
  }
}
