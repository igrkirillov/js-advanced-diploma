import {indexToXY} from "./utils.js";

export default class Step {
  constructor(positionedCharacter, position) {
    this.positionedCharacter = positionedCharacter;
    this.position = position;
  }

  toString() {
    const p1 = indexToXY(this.positionedCharacter.position);
    const p2 = indexToXY(this.position);
    return `Step: ${this.positionedCharacter.character.constructor.name} with position ${p1.x}:${p1.y} to position ${p2.x}:${p2.y}`;
  }
}
