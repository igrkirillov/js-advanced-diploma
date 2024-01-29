import GameController from "../../js/GameController.js";
import GamePlay from "../../js/GamePlay.js";
import GameStateService from "../../js/GameStateService.js";
import GameState from "../../js/GameState.js";
import themes from "../../js/themes";
jest.mock("../../js/GamePlay.js");
jest.mock("../../js/GameStateService.js");
jest.mock("../../js/GameState.js");


beforeEach(() => {
  GamePlay.mockClear();
  GameStateService.mockClear();
  GameState.mockClear();
})

describe("GameController module", () => {
  test ("load объекта stateService выполнен успешно и возвращает новый GameState", () => {
    const currentThemeOfGameState = themes.mountain;
    GameState.mockImplementation(() => {
      return {
        currentTheme: currentThemeOfGameState,
      };
    });
    GameStateService.mockImplementation(() => {
      return {
        load: () => {
          return new GameState();
        },
      };
    });

    const controller = new GameController(new GamePlay(), new GameStateService());
    const mockGamePlay = GamePlay.mock.instances[0];

    // главный вызов
    controller.loadGame();

    expect(mockGamePlay.drawUi).toHaveBeenCalledWith(currentThemeOfGameState);
    expect(mockGamePlay.redrawPositions).toHaveBeenCalled();
  });
  test ("load объекта stateService выбрасывает исключение", () => {
    const errorMessage = "Error loading new state";
    GameStateService.mockImplementation(() => {
      return {
        load: () => {
          throw new Error(errorMessage);
        },
      };
    });

    const controller = new GameController(new GamePlay(), new GameStateService());

    // главный вызов
    controller.loadGame();

    expect(GamePlay.showError).toHaveBeenCalledWith(
      `Упс! Не удалось загрузить игру из памяти! Причина: ${errorMessage}`);
  });
});
