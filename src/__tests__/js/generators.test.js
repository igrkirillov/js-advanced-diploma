import { characterGenerator } from '../../js/generators.js';
import Bowman from "../../js/characters/Bowman.js";
import Swordsman from "../../js/characters/Swordsman.js";
import Magician from "../../js/characters/Magician.js";

expect.extend({
  toAssertOneOfAndLevel,
});
describe('generators module', () => {
  test ('characterGenerator top-left', () => {
    const playerTypes = [Bowman, Swordsman, Magician];
    const maxLevel = 2;
    expect(characterGenerator(playerTypes, maxLevel).next().value).toAssertOneOfAndLevel(playerTypes, maxLevel);
  });
});

function toAssertOneOfAndLevel(actual, allowedTypes, maxLevel) {
  if (!allowedTypes.includes(actual.constructor)) {
    return {
      message: () => `${actual.constructor.name} is not any of ${allowedTypes}`,
      pass: false
    };
  }
  if (actual.level > maxLevel) {
    return {
      message: () => `${actual.level} is grater ${maxLevel}`,
      pass: false
    };
  }
  return {
    message: () => `${actual.constructor.name} is one of ${allowedTypes} and \`${actual.level} is equal or less ${maxLevel}`,
    pass: true
  };
}
