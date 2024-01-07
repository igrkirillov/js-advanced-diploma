import { calcTileType } from '../../js/utils.js';

describe('utils module', () => {
  test ('calcTileType top-left', () => {
    expect(calcTileType(0, 3)).toBe("top-left");
  });
  test ('calcTileType top-right', () => {
    expect(calcTileType(2, 3)).toBe("top-right");
  });
  test ('calcTileType bottom-left', () => {
    expect(calcTileType(6, 3)).toBe("bottom-left");
  });
  test ('calcTileType bottom-right', () => {
    expect(calcTileType(8, 3)).toBe("bottom-right");
  });
  test ('calcTileType bottom', () => {
    expect(calcTileType(7, 3)).toBe("bottom");
  });
  test ('calcTileType right', () => {
    expect(calcTileType(5, 3)).toBe("right");
  });
  test ('calcTileType left', () => {
    expect(calcTileType(3, 3)).toBe("left");
  });
  test ('calcTileType center', () => {
    expect(calcTileType(4, 3)).toBe("center");
  });
});
