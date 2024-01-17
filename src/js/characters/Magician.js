import Character from "../Character.js";

export default class Magician extends Character {
  constructor(level) {
    super(1, "magician");
    this.attack = 10;
    this.defence = 40;
    this.stepDistance = 1;
    for (let i = 1; i < level; ++i) {
      this.incrementLevel();
    }
  }
}
