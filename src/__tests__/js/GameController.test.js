import {jest} from '@jest/globals';
import GameController from "../../js/GameController.js";
import GamePlay from "../../js/GamePlay.js";
import GameStateService from "../../js/GameStateService.js";
jest.mock("../../js/GamePlay.js");
jest.mock("../../js/GameStateService.js");

beforeEach(() => {
  jest.resetAllMocks();
})

describe("GameController module", () => {
  test ("loadGame вызывает load объекта stateService " +
    "И drawUi объекта gamePlay " +
    "И redrawPositions объекта gamePlay", () => {
    const gamePlay = new GamePlay();
    const stateService = new GameStateService();
    const controller = new GameController(gamePlay, stateService);

    // главный вызов
    controller.loadGame();

    expect(stateService.load).toHaveBeenCalled();
    expect(gamePlay.drawUi).toHaveBeenCalled();
    expect(gamePlay.redrawPositions).toHaveBeenCalled();
  });
});
