import themes from "./themes.js";
import {generateTeam} from "./generators.js";
import PositionedCharacter from "./PositionedCharacter.js";
import {
  canAttack,
  canStep,
  createResultGameText, indexToXY,
  isCharacterOneOfType,
  isLastTheme,
  nextTheme,
  tooltip
} from "./utils.js";
import GameState from "./GameState.js";
import GamePlay from "./GamePlay.js";
import cursors from "./cursors.js";
import FindingAndKillingWeakerPlayer2StrategyImpl from "./FindingAndKillingWeakerPlayer2StrategyImpl.js";
import StepResult from "./StepResult.js";
import players from "./players.js";
import Step from "./Step.js";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = new GameState();
    this.player2Strategy = new FindingAndKillingWeakerPlayer2StrategyImpl(this.gameState.player2Types, this.gameState.player1Types);
  }

  init() {
    this.gamePlay.addCellEnterListener(index => this.onCellEnter(index));
    this.gamePlay.addCellLeaveListener(index => this.onCellLeave(index));
    this.gamePlay.addCellClickListener(index => this.onCellClick(index));
    this.gamePlay.addNewGameListener(() => this.resetGame());
    this.gamePlay.addSaveGameListener(() => this.saveGame());
    this.gamePlay.addLoadGameListener(() => this.loadGame());

    this.resetGame();
  }

  resetGame() {
    this.gameState.gameFinishedFlag = false;
    this.gameState.player1Score = 0;
    this.gameState.player2Score = 0;
    this.resetTheme()
    this.resetPlayersCharacters();
    this.redrawPlayingField();
  }

  saveGame() {
    try {
      this.stateService.save(this.gameState);
    } catch (e) {
      GamePlay.showError(`Упс! Не удалось сохранить игру в память! Причина: ${e.message}`);
      return;
    }
    GamePlay.showMessage("Успех! Игра сохранена в память!");
  }

  loadGame() {
    try {
      this.gameState = this.stateService.load();
    } catch (e) {
      GamePlay.showError(`Упс! Не удалось загрузить игру из памяти! Причина: ${e.message}`);
      return;
    }
    this.redrawPlayingField();
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
    if (this.gameState.gameFinishedFlag) {
      // не реагировать на событие, так как игра окончена
      return;
    }
    let stepResult = null;
    const target = this.findCharacter(index);
    if (target && isCharacterOneOfType(target, this.gameState.player1Types)) {
      if (this.gameState.selectedPositionedCharacter) {
        this.gamePlay.deselectCell(this.gameState.selectedPositionedCharacter.position)
      }
      this.gamePlay.selectCell(index);
      this.gameState.selectedPositionedCharacter = new PositionedCharacter(target, index);
    } else if (target && isCharacterOneOfType(target, this.gameState.player2Types)) {
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
    if (stepResult.roundFinishedFlag && isLastTheme(this.gameState.currentTheme)) {
      // игра окончена
      this.gameState.gameFinishedFlag = true;
      GamePlay.showMessage("Игра окончена! " + createResultGameText(this.gameState.player1Score, this.gameState.player2Score))
    } else if (stepResult.roundFinishedFlag && stepResult.winnerName === players.player1) {
      this.gameState.positionedCharacters.forEach(el => {
        el.character.incrementLevel();
      });
      this.gameState.currentTheme = nextTheme(this.gameState.currentTheme);
      this.gamePlay.drawUi(this.gameState.currentTheme);
      this.addNewPlayer2Characters();
      this.gamePlay.redrawPositions(this.gameState.positionedCharacters);
    } else if (stepResult.roundFinishedFlag && stepResult.winnerName === players.player2) {
      GamePlay.showMessage("Game over!!!");
      this.resetGame();
    } else {
      if (stepResult.playerName === players.player1) {
        const stepResult2 = await this.doPlayer2Step();
        if (stepResult2 && stepResult2.stepDoneFlag) {
          await this.processStepResult(stepResult2);
        }
      }
    }
  }

  redrawPlayingField() {
    this.gamePlay.drawUi(this.gameState.currentTheme);
    this.gamePlay.redrawPositions(this.gameState.positionedCharacters);
  }

  resetTheme() {
    this.gameState.currentTheme = themes.prairie;
  }

  resetPlayersCharacters() {
    this.gameState.positionedCharacters = [];
    this.addNewPlayer1Characters();
    this.addNewPlayer2Characters();
  }

  addNewPlayer1Characters() {
    const team1 = generateTeam(this.gameState.player1Types, 3, 4);
    this.gameState.positionedCharacters = [
      ...this.gameState.positionedCharacters,
      ...this.locateTeamPlayers(team1, this.getNextPlayer1Position)];
  }

  addNewPlayer2Characters() {
    const team2 = generateTeam(this.gameState.player2Types, 3, this.gameState.player2CharactersQuantity);
    this.gameState.positionedCharacters = [
      ...this.gameState.positionedCharacters,
      ...this.locateTeamPlayers(team2, this.getNextPlayer2Position)];
  }

  async doStep(playerName, step) {
    let stepResult;
    const target = this.findCharacter(step.position);
    if (target && canAttack(step)) {
      const attacker = step.positionedCharacter.character;
      if (attacker !== target) {
        const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
        target.applyDamage(damage);
        await this.gamePlay.showDamage(step.position, damage);
        this.findAndDeleteZeroHealthyCharacters();
        if (this.isPlayer1HaveEmptyCharacters()) {
          stepResult = new StepResult(playerName, true, true, players.player2);
          this.gameState.player2Score += 1;
        } else if (this.isPlayer2HaveEmptyCharacters()) {
          stepResult = new StepResult(playerName, true, true, players.player1);
          this.gameState.player1Score += 1;
        } else {
          stepResult = new StepResult(playerName, true, false);
        }
        this.gamePlay.redrawPositions(this.gameState.positionedCharacters)
      } else {
        stepResult = new StepResult(playerName, true);
      }
    } else if (!target && canStep(step)) {
      this.gameState.positionedCharacters.filter(element =>
        element.position === step.positionedCharacter.position
        && element.character === step.positionedCharacter.character)
        .forEach(element => element.position = step.position);
      this.gamePlay.redrawPositions(this.gameState.positionedCharacters);
      this.gamePlay.deselectCell(step.positionedCharacter.position);
      stepResult = new StepResult(playerName, true);
    } else {
      GamePlay.showError(`${playerName}, нельзя ходить ${step.positionedCharacter.character.constructor.name} на ячейку ${indexToXY(step.position).toDebugText()}!`);
      stepResult = new StepResult(playerName, false);
    }
    return stepResult;
  }

  async doPlayer2Step() {
    const step = this.player2Strategy.getStep(this.gameState.positionedCharacters);
    return await this.doStep(players.player2, step);
  }

  findAndDeleteZeroHealthyCharacters() {
    const zeroHealthyPositionedCharacters = this.gameState.positionedCharacters.filter(el => el.character.health <= 0);
    zeroHealthyPositionedCharacters.forEach(el => {
      const index =  this.gameState.positionedCharacters.indexOf(el);
      this.gameState.positionedCharacters.splice(index, 1);
    });
  }

  isPlayer2HaveEmptyCharacters() {
    return this.gameState.positionedCharacters.filter(el => isCharacterOneOfType(el.character, this.gameState.player2Types)).length === 0;
  }

  isPlayer1HaveEmptyCharacters() {
    return this.gameState.positionedCharacters.filter(el => isCharacterOneOfType(el.character, this.gameState.player1Types)).length === 0;
  }

  onCellEnter(index) {
    if (this.gameState.gameFinishedFlag) {
      // не реагировать на событие, так как игра окончена
      return;
    }
    const character = this.findCharacter(index);
    if (character) {
      const message = tooltip`${character.level} ${character.attack} ${character.defence} ${character.health}`;
      this.gamePlay.showCellTooltip(message, index);
    }
    this.updateCursor(index);
  }

  onCellLeave(index) {
    if (this.gameState.gameFinishedFlag) {
      // не реагировать на событие, так как игра окончена
      return;
    }
    if (this.findCharacter(index)) {
      this.gamePlay.hideCellTooltip(index);
    }
    if (this.gameState.highlightedPosition
      && this.gameState.highlightedPosition === index) {
      this.gamePlay.deselectCell(this.gameState.highlightedPosition);
      this.gameState.highlightedPosition = null;
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
      if (isCharacterOneOfType(character, this.gameState.player1Types)) {
        // если наведён на свой персонаж
        this.gamePlay.setCursor(cursors.pointer);
      } else if (canAttack(new Step(selectedPositionedCharacter, index))){
        // если наведён на персонаж противника и его можно атаковать
        this.gamePlay.setCursor(cursors.crosshair);
        this.gamePlay.selectCell(index, "red")
        this.gameState.highlightedPosition = index;
      } else {
        // если наведён на персонаж противника и его нельзя атаковать
        this.gamePlay.setCursor(cursors.notallowed);
      }
    } else {
      if (canStep(new Step(selectedPositionedCharacter, index))) {
        this.gamePlay.setCursor(cursors.pointer);
        this.gamePlay.selectCell(index, "green")
        this.gameState.highlightedPosition = index;
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    }
  }

  updateCursorByNotSelectedCharacterStrategy(index) {
    const character = this.findCharacter(index);
    if (character && isCharacterOneOfType(character, this.gameState.player1Types)) {
      // если наведён на свой персонаж
      this.gamePlay.setCursor(cursors.pointer);
    } else {
      this.gamePlay.setCursor(cursors.notallowed);
    }
  }

  findCharacter(index) {
    const positionCharacter = this.gameState.positionedCharacters.find(posCharacter => posCharacter.position === index);
    return positionCharacter ? positionCharacter.character : undefined;
  }
}
