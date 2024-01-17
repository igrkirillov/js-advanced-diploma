import Character from "../Character.js";

export default class Bowman extends Character {
  constructor(level) {
    super(1, "bowman");
    this.attack = 25;
    this.defence = 25;
    this.stepDistance = 4;
    for (let i = 1; i < level; ++i) {
      this.incrementLevel();
    }
  }
}
