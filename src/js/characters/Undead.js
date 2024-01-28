import Character from "../Character.js";
import types from "./types.js";

// скелет
export default class Undead extends Character {
  constructor(level) {
    super(1, types.undead);
    this.attack = 40;
    this.defence = 10;
    this.stepDistance = 4;
    this.attackDistance = 1;
    for (let i = 1; i < level; ++i) {
      this.incrementLevel();
    }
  }
}
