import GameController from "../../js/GameController.js";
import GamePlay from "../../js/GamePlay.js";
import GameStateService from "../../js/GameStateService.js";
jest.mock("../../js/GamePlay.js");
jest.mock("../../js/GameStateService.js");


beforeEach(() => {
  GamePlay.mockClear();
  GameStateService.mockClear();
})

describe("GameController module", () => {
  test ("loadGame вызывает load объекта stateService " +
    "и drawUi объекта gamePlay " +
    "и redrawPositions объекта gamePlay", () => {

    const controller = new GameController(new GamePlay(), new GameStateService());

    // главный вызов
    controller.loadGame();

    const mockGamePlay = GamePlay.mock.instances[0];
    const mockStateService = GameStateService.mock.instances[0];

    expect(mockStateService.load).toHaveBeenCalled();
    expect(mockGamePlay.drawUi).toHaveBeenCalled();
    expect(mockGamePlay.redrawPositions).toHaveBeenCalled();
  });
});
