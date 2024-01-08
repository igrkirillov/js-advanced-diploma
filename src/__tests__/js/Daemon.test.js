import Daemon from "../../js/characters/Daemon.js";

describe('Daemon module', () => {
  test ('characteristics of Daemon', () => {
    expect(new Daemon(1)).toMatchObject({
      level: 1,
      attack: 10,
      defence: 10,
      stepDistance: 1
    });
  });
});
