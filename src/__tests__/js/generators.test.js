import { characterGenerator } from '../../js/generators.js';
import Bowman from "../../js/characters/Bowman.js";
import Swordsman from "../../js/characters/Swordsman.js";
import Magician from "../../js/characters/Magician.js";
import { generateTeam } from '../../js/generators.js';

expect.extend({
  toAssertCharacterOneOfAndLevel, toAssertTeamOneOfAndLevelAndCount
});

describe('generators module', () => {
  test ('characterGenerator top-left', () => {
    const playerTypes = [Bowman, Swordsman, Magician];
    const maxLevel = 2;
    const playerGenerator = characterGenerator(playerTypes, maxLevel);
    expect(playerGenerator.next().value).toAssertCharacterOneOfAndLevel(playerTypes, maxLevel);
    expect(playerGenerator.next().value).toAssertCharacterOneOfAndLevel(playerTypes, maxLevel);
    expect(playerGenerator.next().value).toAssertCharacterOneOfAndLevel(playerTypes, maxLevel);
    expect(playerGenerator.next().value).toAssertCharacterOneOfAndLevel(playerTypes, maxLevel);
  });
  test ('generate team', () => {
    const playerTypes = [Bowman, Swordsman, Magician];
    const maxLevel = 2;
    const charactersCount = 4;

    expect(generateTeam(playerTypes, maxLevel, charactersCount))
      .toAssertTeamOneOfAndLevelAndCount(playerTypes, maxLevel, charactersCount);
  });
});

function toAssertCharacterOneOfAndLevel(actual, allowedTypes, maxLevel) {
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

function toAssertTeamOneOfAndLevelAndCount(actual, allowedTypes, maxLevel, count) {
  const characters = actual.characters;
  if (characters.length !== count) {
    return {
      message: () => `count of characters is not ${count}`,
      pass: false
    };
  }
  for (const character of characters) {
    const result = toAssertCharacterOneOfAndLevel(character, allowedTypes, maxLevel);
    if (!result.pass) {
      return result;
    }
  }
  return {
    message: () => `team characters is one of ${allowedTypes} and level of each character is equal or less ${maxLevel} and count of characters is ${count}`,
    pass: true
  };
}
