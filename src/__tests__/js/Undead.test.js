import Undead from "../../js/characters/Undead.js";

describe('Undead module', () => {
  test ('characteristics of Undead', () => {
    expect(new Undead(1)).toMatchObject({
      level: 1,
      attack: 40,
      defence: 10,
      stepDistance: 4
    });
  });
});
