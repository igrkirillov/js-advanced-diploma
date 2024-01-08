import Magician from "../../js/characters/Magician.js";

describe('Magician module', () => {
  test ('characteristics of Magician', () => {
    expect(new Magician(1)).toMatchObject({
      level: 1,
      attack: 10,
      defence: 40
    });
  });
});
