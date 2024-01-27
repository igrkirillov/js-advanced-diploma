import Character from "../Character.js";

export default class Daemon extends Character {
  constructor(level) {
    super(1, "daemon");
    this.attack = 10;
    this.defence = 10;
    this.stepDistance = 1;
    this.attackDistance = 4;
    for (let i = 1; i < level; ++i) {
      this.incrementLevel();
    }
  }
}
