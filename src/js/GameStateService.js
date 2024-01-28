import {findByName} from "./characters/classes.js";
import Bowman from "./characters/Bowman.js";
import Vampire from "./characters/Vampire.js";
import Magician from "./characters/Magician.js";
import Daemon from "./characters/Daemon.js";
import Swordsman from "./characters/Swordsman.js";
import Undead from "./characters/Undead.js";
import types from "./characters/types.js";
import PositionedCharacter from "./PositionedCharacter.js";

export default class GameStateService {
  constructor(storage) {
    this.storage = storage;
  }

  save(state) {
    this.storage.setItem('state', JSON.stringify(state, (key, val) => {
      if (key === "player1Types" || key === "player2Types") {
        return val.map(el => el.name);
      }
      return val;
    }));
  }

  load() {
    try {
      return JSON.parse(this.storage.getItem('state'), (key, val) => {
        if (key === "player1Types" || key === "player2Types") {
          return val.map(findByName);
        } else if (key === "positionedCharacters") {
          return val.map(this.mapSerializedPositionCharacterToPositionCharacter);
        } else if (key === "selectedPositionedCharacter") {
          return this.mapSerializedPositionCharacterToPositionCharacter(val);
        }
        return val;
      });
    } catch (e) {
      throw new Error('Invalid state');
    }
  }

  mapSerializedPositionCharacterToPositionCharacter(serializedPositionCharacter) {
    const sourceCharacter = serializedPositionCharacter.character;
    let targetCharacter;
    switch (sourceCharacter.type) {
      case types.bowman: {
        targetCharacter = new Bowman(sourceCharacter.level);
        break;
      }
      case types.daemon: {
        targetCharacter = new Daemon(sourceCharacter.level);
        break;
      }
      case types.magician: {
        targetCharacter = new Magician(sourceCharacter.level);
        break;
      }
      case types.swordsman: {
        targetCharacter = new Swordsman(sourceCharacter.level);
        break;
      }
      case types.undead: {
        targetCharacter = new Undead(sourceCharacter.level);
        break;
      }
      case types.vampire: {
        targetCharacter = new Vampire(sourceCharacter.level);
        break;
      }
    }
    targetCharacter.id = sourceCharacter.id;
    targetCharacter.level = sourceCharacter.level;
    targetCharacter.attack = sourceCharacter.attack;
    targetCharacter.defence = sourceCharacter.defence;
    targetCharacter.health = sourceCharacter.health;
    targetCharacter.type = sourceCharacter.type;
    targetCharacter.stepDistance = sourceCharacter.stepDistance;
    targetCharacter.attackDistance = sourceCharacter.attackDistance;
    return new PositionedCharacter(targetCharacter, serializedPositionCharacter.position);
  }
}
