import { jest } from '@jest/globals';
import GameController from "../../js/GameController.js";
import GamePlay from "../../js/GamePlay.js";
import GameStateService from "../../js/GameStateService.js";
jest.mock("../../js/GamePlay.js");
jest.mock("../../js/GameStateService.js");

beforeEach(() => {
  jest.resetAllMocks();
})

describe('GameController module', () => {
  test ('loadGame call load of stateService anf drawUi of gamePlay and redrawPositions of gamePlay', () => {

    const gamePlay = new GamePlay();
    const stateService = new GameStateService();
    const controller = new GameController(gamePlay, stateService);
    controller.loadGame();
    expect(stateService.load).toHaveBeenCalled();
    expect(gamePlay.drawUi).toHaveBeenCalled();
    expect(gamePlay.redrawPositions).toHaveBeenCalled();
  });
});
