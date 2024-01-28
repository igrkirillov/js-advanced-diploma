import Bowman from "./Bowman.js";
import Daemon from "./Daemon.js";
import Magician from "./Magician.js";
import Swordsman from "./Swordsman.js";
import Undead from "./Undead.js";
import Vampire from "./Vampire.js";

const classes = [Bowman, Daemon, Magician, Swordsman, Undead, Vampire];

export default classes;

export function findByName(name) {
  const array = classes.filter(el => el.name === name);
  return array.length > 0 ? array[0] : null;
}
