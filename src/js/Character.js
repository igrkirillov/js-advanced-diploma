import nextId from "./ids.js";

/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */
export default class Character {
  constructor(level, type = 'generic') {
    this.id = nextId();
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    this.stepDistance = 0;
    this.attackDistance = 0;
    if (new.target === Character) {
      throw "new Character() is forbidden";
    }
    // TODO: выбросите исключение, если кто-то использует "new Character()"
  }

  applyDamage(damage) {
    this.health -= damage;
  }

  incrementLevel() {
    const newHealth = +Math.min(100, this.health + 80).toFixed();
    const newAttack = +Math.max(this.attack, this.attack * (80 + this.health) / 100).toFixed();
    this.health = newHealth;
    this.attack = newAttack;
    this.level += 1;
  }
}
