import Swordsman from "../../js/characters/Swordsman.js";

describe('Swordsman module', () => {
  test ('characteristics of Swordsman', () => {
    expect(new Swordsman(1)).toMatchObject({
      level: 1,
      attack: 40,
      defence: 10,
      stepDistance: 4,
      attackDistance: 1
    });
  });
});
