import Vampire from "../../js/characters/Vampire.js";

describe('Vampire module', () => {
  test ('characteristics of Vampire', () => {
    expect(new Vampire(1)).toMatchObject({
      level: 1,
      attack: 25,
      defence: 25,
      stepDistance: 2,
      attackDistance: 2
    });
  });
});
