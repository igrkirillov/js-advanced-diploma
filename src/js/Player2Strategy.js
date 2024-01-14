import {isCharacterOneOfType} from "./utils.js";

export default class Player2Strategy {
  constructor(player2Types) {
    this.player2Types = player2Types;
  }

  getStep(positionedCharacters) {
    // по умолчанию ничего не делает, просто возвращает свой же номер позиции - никуда не ходит
    const firstPositionedCharacter = positionedCharacters.filter(el => isCharacterOneOfType(el.character, this.player2Types))[0];
    return {
      positionedCharacter: firstPositionedCharacter,
      index: firstPositionedCharacter.position
    };
  }
}
