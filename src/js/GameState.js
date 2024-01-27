import Bowman from "./characters/Bowman.js";
import Swordsman from "./characters/Swordsman.js";
import Magician from "./characters/Magician.js";
import Daemon from "./characters/Daemon.js";
import Undead from "./characters/Undead.js";
import Vampire from "./characters/Vampire.js";

export default class GameState {
  constructor() {
    // данные, меняющиеся runtime
    this.positionedCharacters = [];
    this.selectedPositionedCharacter = null;
    this.highlightedPosition = null;
    this.currentTheme = null;
    this.gameFinishedFlag = false;

    // данные, об очках игроков
    this.player1Score = 0;
    this.player2Score = 0;

    // данные статичные, не меняющиеся во время игры
    this.player1Types = [Bowman, Swordsman, Magician];
    this.player2Types = [Daemon, Undead, Vampire];
    this.player2CharactersQuantity = 1; // кол-во персонажей у 2-го игрока
  }
  static from(object) {
    // TODO: create object
    return null;
  }
}
