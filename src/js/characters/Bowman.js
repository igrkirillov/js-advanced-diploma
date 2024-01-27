import Character from "../Character.js";

// лучник
export default class Bowman extends Character {
  constructor(level) {
    super(1, "bowman");
    this.attack = 25;
    this.defence = 25;
    this.stepDistance = 2;
    this.attackDistance = 2;
    for (let i = 1; i < level; ++i) {
      this.incrementLevel();
    }
  }
}
