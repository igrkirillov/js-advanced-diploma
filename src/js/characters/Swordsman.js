import Character from "../Character.js";

export default class Swordsman extends Character {
  constructor(level) {
    super(1, "swordsman");
    this.attack = 40;
    this.defence = 10;
    this.stepDistance = 2;
    for (let i = 1; i < level; ++i) {
      this.incrementLevel();
    }
  }
}
