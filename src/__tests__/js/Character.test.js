import Character from '../../js/Character.js';
import Bowman from "../../js/characters/Bowman.js";

describe('Character module', () => {
  test ('new Character() operation is forbidden', () => {
    expect(() => new Character(1, "bowman")).toThrow("new Character() is forbidden");
  });
  test ('new any child class of Character operation is allowed', () => {
    expect(() => new Bowman(1)).not.toThrow(Error);
  });
});
