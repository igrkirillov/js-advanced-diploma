import Character from "../Character.js";

export default class Vampire extends Character {
  constructor(level) {
    super(1, "vampire");
    this.attack = 25;
    this.defence = 25;
    this.stepDistance = 2;
    this.attackDistance = 2;
    for (let i = 1; i < level; ++i) {
      this.incrementLevel();
    }
  }
}
