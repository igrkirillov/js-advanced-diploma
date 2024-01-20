import GameController from "../../js/GameController.js";
import GamePlay from "../../js/GamePlay.js";
import GameStateService from "../../js/GameStateService.js";
jest.mock("../../js/GamePlay.js");
jest.mock("../../js/GameStateService.js");

beforeEach(() => {
  GamePlay.mockClear();
  GameStateService.mockClear();
})

describe('GameController module', () => {
  test ('loadGame call load of stateService anf drawUi of gamePlay and redrawPositions of gamePlay', () => {
    const gamePlay = GamePlay.mock.instances[0];
    const stateService = GameStateService.mock.instances[0];
    const controller = new GameController(gamePlay, stateService);
    controller.loadGame();
    expect(stateService.load).toHaveBeenCalled();
    expect(gamePlay.drawUi).toHaveBeenCalled();
    expect(gamePlay.redrawPositions).toHaveBeenCalled();
  });
});
