import themes from "./themes.js";
import {generateTeam} from "./generators.js";
import Undead from "./characters/Undead.js";
import Vampire from "./characters/Vampire.js";
import Bowman from "./characters/Bowman.js";
import Swordsman from "./characters/Swordsman.js";
import Magician from "./characters/Magician.js";
import Daemon from "./characters/Daemon.js";
import PositionedCharacter from "./PositionedCharacter.js";
import {canStep, isCharacterOneOfType, nextTheme, tooltip} from "./utils.js";
import GameState from "./GameState.js";
import GamePlay from "./GamePlay.js";
import cursors from "./cursors.js";
import FindAndKillWeakerPlayer2StrategyImpl from "./FindAndKillWeakerPlayer2StrategyImpl.js";
import StepResult from "./StepResult.js";
import players from "./players.js";
import Step from "./Step.js";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.positionedCharacters = [];
    this.player1Types = [Bowman, Swordsman, Magician];
    this.player2Types = [Daemon, Undead, Vampire];
    this.gameState = new GameState();
    this.player2Strategy = new FindAndKillWeakerPlayer2StrategyImpl(this.player2Types, this.player1Types);
  }

  init() {
    this.resetPlayersCharacters();
    this.resetPlayingField();

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

  async onCellClick(index) {
    let stepResult = null;
    const target = this.findCharacter(index);
    if (target && isCharacterOneOfType(target, this.player1Types)) {
      if (this.gameState.selectedPositionedCharacter) {
        this.gamePlay.deselectCell(this.gameState.selectedPositionedCharacter.position)
      }
      this.gamePlay.selectCell(index);
      this.gameState.selectedPositionedCharacter = new PositionedCharacter(target, index);
    } else if (target && isCharacterOneOfType(target, this.player2Types)) {
      if (this.gameState.selectedPositionedCharacter) {
        stepResult = await this.doStep(players.player1, new Step(this.gameState.selectedPositionedCharacter, index));
      } else {
        GamePlay.showError("Не выбран персонаж!");
      }
    } else if (!target
      && this.gameState.selectedPositionedCharacter) {
      stepResult = await this.doStep(players.player1, new Step(this.gameState.selectedPositionedCharacter, index))
      if (stepResult && stepResult.stepDoneFlag) {
        this.gameState.selectedPositionedCharacter = null;
      }
    } else {
      GamePlay.showError("Действие не определено!");
    }

    if (stepResult && stepResult.stepDoneFlag) {
      await this.processStepResult(stepResult);
    }
  }

  async processStepResult(stepResult) {
    if (stepResult.roundFinishedFlag && stepResult.winnerName === players.player1) {
      this.positionedCharacters.forEach(el => {
        el.character.incrementLevel();
      });
      this.gameState.currentTheme = nextTheme(this.gameState.currentTheme);
      this.gamePlay.drawUi(this.gameState.currentTheme);
      this.addNewPlayer2Characters();
      this.gamePlay.redrawPositions(this.positionedCharacters);
    } else if (stepResult.roundFinishedFlag && stepResult.winnerName === players.player2) {
      GamePlay.showMessage("Game over!!!");
      this.resetPlayersCharacters();
      this.resetPlayingField();
    } else {
      if (stepResult.playerName === players.player1) {
        const stepResult2 = await this.doPlayer2Step();
        if (stepResult2 && stepResult2.stepDoneFlag) {
          await this.processStepResult(stepResult2);
        }
      }
    }
  }

  resetPlayingField() {
    this.gameState.currentTheme = themes.prairie;
    this.gamePlay.drawUi(this.gameState.currentTheme);
    this.gamePlay.redrawPositions(this.positionedCharacters);
  }

  resetPlayersCharacters() {
    this.positionedCharacters = [];
    this.addNewPlayer1Characters();
    this.addNewPlayer2Characters();
  }

  addNewPlayer1Characters() {
    const team1 = generateTeam(this.player1Types, 3, 4);
    this.positionedCharacters = [
      ...this.positionedCharacters,
      ...this.locateTeamPlayers(team1, this.getNextPlayer1Position)];
  }

  addNewPlayer2Characters() {
    const team2 = generateTeam(this.player2Types, 3, 1);
    this.positionedCharacters = [
      ...this.positionedCharacters,
      ...this.locateTeamPlayers(team2, this.getNextPlayer2Position)];
  }

  async doStep(playerName, step) {
    let stepResult;
    const target = this.findCharacter(step.position);
    if (target && canStep(step)) {
      const attacker = step.positionedCharacter.character;
      if (attacker !== target) {
        const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
        target.applyDamage(damage);
        await this.gamePlay.showDamage(step.position, damage);
        this.findAndDeleteZeroHealthyCharacters();
        if (this.isPlayer1HaveEmptyCharacters()) {
          stepResult = new StepResult(playerName, true, true, players.player2);
        } else if (this.isPlayer2HaveEmptyCharacters()) {
          stepResult = new StepResult(playerName, true, true, players.player1);
        } else {
          stepResult = new StepResult(playerName, true, false);
        }
        this.gamePlay.redrawPositions(this.positionedCharacters)
      } else {
        stepResult = new StepResult(playerName, true);
      }
    } else if (!target && canStep(step)) {
      this.positionedCharacters.filter(element =>
        element.position === step.positionedCharacter.position
        && element.character === step.positionedCharacter.character)
        .forEach(element => element.position = step.position);
      this.gamePlay.redrawPositions(this.positionedCharacters);
      this.gamePlay.deselectCell(step.positionedCharacter.position);
      stepResult = new StepResult(playerName, true);
    } else {
      GamePlay.showError(`${playerName}, нельзя ходить ${step.positionedCharacter.character.constructor.name} на ячейку ${step.position}!`);
      stepResult = new StepResult(playerName, false);
    }
    return stepResult;
  }

  async doPlayer2Step() {
    const step = this.player2Strategy.getStep(this.positionedCharacters);
    return await this.doStep(players.player2, step);
  }

  findAndDeleteZeroHealthyCharacters() {
    const zeroHealthyPositionedCharacters = this.positionedCharacters.filter(el => el.character.health <= 0);
    zeroHealthyPositionedCharacters.forEach(el => {
      const index =  this.positionedCharacters.indexOf(el);
      this.positionedCharacters.splice(index, 1);
    });
  }

  isPlayer2HaveEmptyCharacters() {
    return this.positionedCharacters.filter(el => isCharacterOneOfType(el.character, this.player2Types)).length === 0;
  }

  isPlayer1HaveEmptyCharacters() {
    return this.positionedCharacters.filter(el => isCharacterOneOfType(el.character, this.player1Types)).length === 0;
  }

  onCellEnter(index) {
    const character = this.findCharacter(index);
    if (character) {
      const message = tooltip`${character.level} ${character.attack} ${character.defence} ${character.health}`;
      this.gamePlay.showCellTooltip(message, index);
    }
    this.updateCursor(index);
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    if (this.findCharacter(index)) {
      this.gamePlay.hideCellTooltip(index);
    }
    if (this.gameState.underAttackPositionedCharacter
      && this.gameState.underAttackPositionedCharacter.position === index) {
      this.gamePlay.deselectCell(this.gameState.underAttackPositionedCharacter.position);
      this.gameState.underAttackPositionedCharacter = null;
    }
  }

  updateCursor(index) {
    if (this.gameState.selectedPositionedCharacter) {
      this.updateCursorBySelectedCharacterStrategy(index, this.gameState.selectedPositionedCharacter);
    } else {
      this.updateCursorByNotSelectedCharacterStrategy(index);
    }
  }

  updateCursorBySelectedCharacterStrategy(index, selectedPositionedCharacter) {
    const character = this.findCharacter(index);
    if (character) {
      if (isCharacterOneOfType(character, this.player1Types)) {
        // если наведён на свой персонаж
        this.gamePlay.setCursor(cursors.pointer);
      } else if (canStep(new Step(selectedPositionedCharacter, index))){
        // если наведён на персонаж противника и его можно атаковать
        this.gamePlay.setCursor(cursors.crosshair);
        this.gamePlay.selectCell(index, "red")
        this.gameState.underAttackPositionedCharacter = new PositionedCharacter(character, index);
      } else {
        // если наведён на персонаж противника и его нельзя атаковать
        this.gamePlay.setCursor(cursors.notallowed);
      }
    } else {
      if (canStep(new Step(selectedPositionedCharacter, index))) {
        this.gamePlay.setCursor(cursors.pointer);
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    }
  }

  updateCursorByNotSelectedCharacterStrategy(index) {
    const character = this.findCharacter(index);
    if (character && isCharacterOneOfType(character, this.player1Types)) {
      // если наведён на свой персонаж
      this.gamePlay.setCursor(cursors.pointer);
    } else {
      this.gamePlay.setCursor(cursors.notallowed);
    }
  }

  findCharacter(index) {
    const positionCharacter = this.positionedCharacters.find(posCharacter => posCharacter.position === index);
    return positionCharacter ? positionCharacter.character : undefined;
  }
}
