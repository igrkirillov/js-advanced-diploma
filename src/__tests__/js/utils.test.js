import {calcTileType, isCharacterOneOfType, tooltip} from '../../js/utils.js';
import Bowman from "../../js/characters/Bowman.js";
import Swordsman from "../../js/characters/Swordsman.js";
import Magician from "../../js/characters/Magician.js";
import Daemon from "../../js/characters/Daemon.js";
import Undead from "../../js/characters/Undead.js";
import Vampire from "../../js/characters/Vampire.js";

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
  test ('tooltip', () => {
    expect(tooltip`${1} ${25} ${25} ${50}`)
      .toBe("\u{1F396}1 \u{2694}25 \u{1F6E1}25 \u{2764}50");
  });
  test ('isCharacterOneOfType true', () => {
    const bowman = new Bowman(1);
    const player1Types = [Bowman, Swordsman, Magician];
    expect(isCharacterOneOfType(bowman, player1Types)).toBe(true);
  });
  test ('isCharacterOneOfType false', () => {
    const bowman = new Bowman(1);
    const player2Types = [Daemon, Undead, Vampire];
    expect(isCharacterOneOfType(bowman, player2Types)).toBe(false);
  });
});
