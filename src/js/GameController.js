import themes from "./themes.js";
import {generateTeam} from "./generators.js";
import Undead from "./characters/Undead.js";
import Vampire from "./characters/Vampire.js";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);

    const playerTypes1 = [Bowman, Swordsman, Magician]; // доступные классы игрока
    const team1 = generateTeam(playerTypes1, 3, 4); // массив из 4 случайных персонажей playerTypes с уровнем 1, 2 или 3
    const playerTypes2 = [Daemon, Undead, Vampire]; // доступные классы игрока
    const team2 = generateTeam(playerTypes2, 3, 4); // массив из 4 случайных персонажей playerTypes с уровнем 1, 2 или 3

    this.gamePlay.redrawPositions([...this.distributeTeam(team1, 0), ...this.distributeTeam(team2, 8)]);
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  distributeTeam(team, shift) {
    return team.characters.map((ch, index) => new PositionedCharacter(ch, index + shift));
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
