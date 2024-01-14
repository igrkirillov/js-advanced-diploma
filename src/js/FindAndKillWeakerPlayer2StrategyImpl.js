import Player2Strategy from "./Player2Strategy.js";
import {indexToXY, isCharacterOneOfType, xyToIndex} from "./utils.js";

export default class FindAndKillWeakerPlayer2StrategyImpl extends Player2Strategy {
  constructor(player2Types, player1Types) {
    super(player2Types);
    this.player1Types = player1Types;
  }

  getStep(positionedCharacters) {
    const positionedCharacters2 = positionedCharacters.filter(el => isCharacterOneOfType(el.character, this.player2Types));
    const weakerPositionedCharacter1 = positionedCharacters
      .filter(el => isCharacterOneOfType(el.character, this.player1Types))
      .sort((el1, el2) => el1.character.health - el2.character.health)[0];
    const closestPositionedCharacter2 = this.findClosestPositionedCharacter(weakerPositionedCharacter1, positionedCharacters2);
    const closestStepPosition = this.findClosestStepIndex(weakerPositionedCharacter1, closestPositionedCharacter2);
    return {
      positionedCharacter: closestPositionedCharacter2,
      position: closestStepPosition
    };
  }

  findClosestPositionedCharacter(targetPositionedCharacter, positionedCharacters) {
    return positionedCharacters.sort((el1, el2) => {
      const p1 = indexToXY(el1.position);
      const p2 = indexToXY(el2.position);
      const pt = indexToXY(targetPositionedCharacter.position);
      const d1 = this.calcClosestDistance(p1, pt);
      const d2 = this.calcClosestDistance(p2, pt);
      const countSteps1 = Math.ceil(d1 / el1.character.stepDistance);
      const countSteps2 = Math.ceil(d2 / el2.character.stepDistance);
      return countSteps1 - countSteps2;
    })[0];
  }

  calcClosestDistance(point1, point2) {
    return Math.sqrt(Math.pow(Math.abs(point1.x - point2.x), 2) + Math.pow(Math.abs(point1.y - point2.y), 2));
  }

  findClosestStepIndex(targetPositionedCharacter, closestPositionedCharacter) {
    const pt = indexToXY(targetPositionedCharacter.position);
    let closestPoint = null;
    let lastDistance = 1000;
    for (let step = 1; step <= closestPositionedCharacter.character.stepDistance; ++step) {
      for (const dx of [-1,0,1]) {
        for (const dy of [-1,0,1]) {
          const p = indexToXY(closestPositionedCharacter.position);
          const newp = {x: p.x + step * dx, y: p.y + step * dy};
          const distance = this.calcClosestDistance(pt, newp);
          if (distance < lastDistance) {
            lastDistance = distance;
            closestPoint = newp;
          }
        }
      }
    }
    return xyToIndex(closestPoint);
  }
}
