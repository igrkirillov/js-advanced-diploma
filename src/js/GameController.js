import themes from "./themes.js";
import {generateTeam} from "./generators.js";
import Undead from "./characters/Undead.js";
import Vampire from "./characters/Vampire.js";
import Bowman from "./characters/Bowman.js";
import Swordsman from "./characters/Swordsman.js";
import Magician from "./characters/Magician.js";
import Daemon from "./characters/Daemon.js";
import PositionedCharacter from "./PositionedCharacter.js";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);

    const player1Types = [Bowman, Swordsman, Magician];
    const team1 = generateTeam(player1Types, 3, 4);
    const player2Types = [Daemon, Undead, Vampire];
    const team2 = generateTeam(player2Types, 3, 4);

    this.gamePlay.redrawPositions([
      ...this.locateTeamPlayers(team1, this.getNextPlayer1Position),
      ...this.locateTeamPlayers(team2, this.getNextPlayer2Position)]);

    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  locateTeamPlayers(team, positionsGetter) {
    const positionedCharacters = [];
    const positions = [];
    for (const character of team.characters) {
      let position = positionsGetter(positions);
      positionedCharacters.push(new PositionedCharacter(character, position));
      positions.push(position);
    }
    return positionedCharacters;
  }

  getNextPlayer1Position(positions) {
    let position = null;
    while (position === null || positions.includes(position)) {
      position = Math.floor(Math.random() * 9) % 2 + 8 * Math.floor(Math.random() * 7);
    }
    return position;
  }

  getNextPlayer2Position(positions) {
    let position = null;
    while (position === null || positions.includes(position)) {
      position = (7 - Math.floor(Math.random() * 9) % 2) + 8 * Math.floor(Math.random() * 7);
    }
    return position;
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
