import Bowman from "../../js/characters/Bowman.js";

describe('Bowman module', () => {
  test ('characteristics of Bowman', () => {
    expect(new Bowman(1)).toMatchObject({
      level: 1,
      attack: 25,
      defence: 25,
      stepDistance: 2,
      attackDistance: 2
    });
  });
});
