import themes from "./themes.js";
import {generateTeam} from "./generators.js";
import Undead from "./characters/Undead.js";
import Vampire from "./characters/Vampire.js";
import Bowman from "./characters/Bowman.js";
import Swordsman from "./characters/Swordsman.js";
import Magician from "./characters/Magician.js";
import Daemon from "./characters/Daemon.js";
import PositionedCharacter from "./PositionedCharacter.js";
import {isCharacterOneOfType, tooltip} from "./utils.js";
import GameState from "./GameState.js";
import GamePlay from "./GamePlay.js";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.positionedCharacters = [];
    this.player1Types = [Bowman, Swordsman, Magician];
    this.player2Types = [Daemon, Undead, Vampire];
    this.gameState = new GameState();
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);

    const team1 = generateTeam(this.player1Types, 3, 4);
    const team2 = generateTeam(this.player2Types, 3, 4);

    this.positionedCharacters = [
      ...this.locateTeamPlayers(team1, this.getNextPlayer1Position),
      ...this.locateTeamPlayers(team2, this.getNextPlayer2Position)];
    this.gamePlay.redrawPositions(this.positionedCharacters);

    this.gamePlay.addCellEnterListener(index => this.onCellEnter(index));
    this.gamePlay.addCellLeaveListener(index => this.onCellLeave(index));
    this.gamePlay.addCellClickListener(index => this.onCellClick(index));
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
    const character = this.findCharacter(index);
    if (character && isCharacterOneOfType(character, this.player1Types)) {
      if (this.gameState.selectedPosition) {
        this.gamePlay.deselectCell(this.gameState.selectedPosition)
      }
      this.gamePlay.selectCell(index);
      this.gameState.selectedPosition = index;
    } else {
      GamePlay.showError("Здесь нет своего героя!");
    }
  }

  onCellEnter(index) {
    const character = this.findCharacter(index);
    if (character) {
      const message = tooltip`${character.level} ${character.attack} ${character.defence} ${character.health}`;
      this.gamePlay.showCellTooltip(message, index);
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    if (this.findCharacter(index)) {
      this.gamePlay.hideCellTooltip(index);
    }
  }

  findCharacter(index) {
    const positionCharacter = this.positionedCharacters.find(posCharacter => posCharacter.position === index);
    return positionCharacter ? positionCharacter.character : undefined;
  }
}
